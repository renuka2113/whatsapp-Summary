from fastapi import FastAPI, UploadFile, File, Form
from typing import List
import os
import time
import json
import re
from typing import List, Dict
import logging
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.chat_loaders.whatsapp import WhatsAppChatLoader
from langchain_community.chat_loaders.utils import (
    map_ai_messages,
    map_group_messages,
    merge_chat_runs,
)
from langchain_core.chat_sessions import ChatSession
from langchain_core.messages import SystemMessage

from openai import AzureOpenAI

app = FastAPI()

user_roles = {}

# Logging Setup
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Azure OpenAI setup
endpoint = os.getenv("ENDPOINT_URL", "https://summarizer-ai.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-4.1")
subscription_key = os.getenv(
    "AZURE_OPENAI_API_KEY",
    "paste_your_azure_openai_key",
)

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)

# Roles
# user_roles = {
#     "Chetan (Work)": "Backend Developer",
#     "Ashok (S) Work": "FrontEnd",
#     "Praveen Sir (Work)": "Tech Lead",
#     "HARI VINAYAK": "Intern",
#     "KRISHNAPRASAD (S) Work": "FrontEnd",
# }

role_instruction = "\n".join(f"- {name}: {role}" for name, role in user_roles.items())

system_msg = SystemMessage(
    content=f"""You are summarizing a group chat. 
Participants and their roles are:
{role_instruction}
Can you just mention tasks assigned by whom to whom***
"""
)

formal_sysmsg = f"""
You are an assistant designed to extract and organize tasks from group chat conversations.

Participants and their roles:
{role_instruction}

Your job is to:
1. Identify all tasks mentioned in the conversation.
2. Determine:
   - Who assigned each task.
   - To whom the task was assigned.
   - The task content.
3. Check whether each task is completed or not.
4. If a task is marked complete, identify:
   - Who completed it.
   - The time or message when it was marked complete (if available).
5. Also previous summary will be given consider That to identify the task marked completed in the current chat
Present the output in the following **strict format**:

---

### Assigned Tasks

- **Task:** [Task description]  
  **Assigned By:** [Name or Role]  
  **Assigned To:** [Name or Role]  
  **Time:** [Message time or approximate reference]

### Completed Tasks

- **Task:** [Task description]  
  **Completed By:** [Name or Role]  
  **Completion Time:** [Message time or approximate reference] 

### Incomplete Tasks

- **Task:** [Task description]  
  **Assigned To:** [Name or Role]  
  **Status:** Not marked as complete

---

Additional Notes:
- Be concise and clear.
- Maintain the exact formatting for consistency.
- Ignore unrelated messages.
"""


def format_messages_for_llm(messages: list) -> list:
    formatted = []
    for msg in messages:
        sender = msg.additional_kwargs.get("sender", "Unknown")
        role = msg.additional_kwargs.get("mapped_role", "Unknown")
        timestamp = msg.additional_kwargs.get("events", [{}])[0].get(
            "message_time", "Unknown"
        )
        content = f"[{sender} - {role} at {timestamp}]: {msg.content}"
        formatted.append(content)
    return formatted


def chunk_messages(messages, chunk_size=20):
    for i in range(0, len(messages), chunk_size):
        yield messages[i : i + chunk_size]


def parse_tasks(llm_output: str) -> Dict[str, List[Dict]]:
    task_data = {
        "assigned_tasks": [],
        "completed_tasks": [],
        "incomplete_tasks": [],
    }

    # Patterns for each section
    section_patterns = {
        "assigned_tasks": r"### Assigned Tasks(.*?)###",
        "completed_tasks": r"### Completed Tasks(.*?)###",
        "incomplete_tasks": r"### Incomplete Tasks(.*?)(---|$)",
    }

    for section, pattern in section_patterns.items():
        match = re.search(pattern, llm_output, re.DOTALL)
        if match:
            section_text = match.group(1).strip()
            tasks = section_text.split("- **Task:**")
            for t in tasks[1:]:  # skip first empty string before first task
                task_info = {"task": ""}
                lines = t.strip().split("\n")
                task_info["task"] = lines[0].strip()
                for line in lines[1:]:
                    if "**Assigned By:**" in line:
                        task_info["assigned_by"] = line.split("**Assigned By:**")[
                            1
                        ].strip()
                    elif "**Assigned To:**" in line:
                        task_info["assigned_to"] = line.split("**Assigned To:**")[
                            1
                        ].strip()
                    elif "**Time:**" in line:
                        task_info["time"] = line.split("**Time:**")[1].strip()
                    elif "**Completed By:**" in line:
                        task_info["completed_by"] = line.split("**Completed By:**")[
                            1
                        ].strip()
                    elif "**Completion Time:**" in line:
                        task_info["completion_time"] = line.split(
                            "**Completion Time:**"
                        )[1].strip()
                    elif "**Status:**" in line:
                        task_info["status"] = line.split("**Status:**")[1].strip()
                task_data[section].append(task_info)

    return task_data


def parse_all_summaries(summaries: List[str]) -> Dict[str, List[Dict]]:
    final_tasks = {
        "assigned_tasks": [],
        "completed_tasks": [],
        "incomplete_tasks": [],
    }
    print(len(summaries))

    for summary in summaries:
        print(summary)
        parsed = parse_tasks(summary)

        final_tasks["assigned_tasks"].extend(parsed["assigned_tasks"])
        final_tasks["completed_tasks"].extend(parsed["completed_tasks"])
        final_tasks["incomplete_tasks"].extend(parsed["incomplete_tasks"])

    return final_tasks


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/summarize")
async def summarize_chat(
    file: UploadFile = File(...), role_mapping: UploadFile = File(...)
):
    global user_roles
    # Convert JSON strings into Python objects
    # try:
    #     preferences_list = json.loads(preferences)
    #     # user_roles = json.loads(role_mapping)  # 🔁 This replaces the global variable
    # except Exception as e:
    #     return {"error": f"Invalid JSON data: {str(e)}"}
    try:
        contents = await role_mapping.read()
        officers_list = json.loads(contents.decode("utf-8"))

        user_roles = {
            officer["Officer_Name"]: {
                "Rank": officer["Rank"],
                "Mobile": f"+91 {officer['Mobile_no']}",
            }
            for officer in officers_list
        }
    except Exception as e:
        return {"error": f"Invalid role_mapping file structure: {str(e)}"}

    print("✅ Parsed user_roles:", user_roles)
    # print(preferences_list)
    filepath = f"./uploaded_{file.filename}"
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Load and parse messages
    loader = WhatsAppChatLoader(path=filepath)
    raw_messages = list(loader.lazy_load())
    merged_messages = merge_chat_runs(raw_messages)
    sessions: List[ChatSession] = list(
        map_group_messages(merged_messages, userRoles=user_roles)
    )

    all_summaries = []

    for chunk in chunk_messages(sessions[0]["messages"], chunk_size=20):
        chunk_text = format_messages_for_llm(chunk)

        chat_prompt = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": formal_sysmsg,
                    }
                ],
            },
            {"role": "user", "content": [{"type": "text", "text": str(chunk_text)}]},
        ]

        completion = client.chat.completions.create(
            model=deployment,
            messages=chat_prompt,
            max_tokens=800,
            temperature=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None,
            stream=False,
        )

        summary = completion.choices[0].message.content
        all_summaries.append(summary)
        time.sleep(10)
    all_tasks = parse_all_summaries(all_summaries)
    return {"summary_chunks": all_tasks}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("getNsummarize:app", host="127.0.0.1", port=8000, reload=True)
