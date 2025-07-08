import React, { useState } from "react";
import { MessageSquare, Upload, Send, Trash2 } from "lucide-react";
import onlineLLM from "../onlineLLM.js";
const Button = ({
  children,
  className = "",
  // onClick,
  disabled = false,
  variant = "default",
  size = "default",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-800 text-white hover:bg-blue-900",
    outline: "border border-blue-200 text-blue-800 hover:bg-blue-100",
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
  };
  return (
    <button
      onClick={""}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-md border border-blue-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 ${className}`}
    {...props}
  />
);

const SummarySection = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  console.log(chatHistory);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showjsonImportModal, setjsonShowImportModal] = useState(false);
  const [showhierImportModal, sethierShowImportModal] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [filedata, setfiledata] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [promptResponse, setPromptResponse] = useState("");
  console.log(promptResponse);
  const handlePromptAnalysis = async () => {
    if (!userPrompt.trim() || !filedata.trim()) return;

    try {
      setIsAnalyzing(true);
      const responseText = await onlineLLM(filedata, userPrompt);
      console.log(responseText  )
      setPromptResponse(responseText);
      setIsAnalyzing(false);
    } catch (err) {
      console.error("Error calling LLM:", err);
      setPromptResponse("❌ Error analyzing with LLM.");
      setIsAnalyzing(false);
    }
  };

  // const [summary, setSummary] = useState("");
  // const [reportingListFile, setReportingListFile] = useState(null);
  // const [reportingList, setReportingList] = useState([]);
  // const [membersList, setMembersList] = useState([]);
  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    setIsAnalyzing(true);
    setChatHistory([]); // Clear previous chat when new analysis starts

    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        type: "ai",
        content: generateChatAnalysis(chatInput),
        timestamp: new Date().toLocaleString(),
      };
      setChatHistory([aiResponse]);
      setIsAnalyzing(false);
      setChatInput("");
    }, 2000);
  };

  const generateChatAnalysis = () => {
    // const wordCount = text.split(" ").length;
    // const lineCount = text.split("\n").length;
    // return `**Chat Analysis**\n\n📊 **Stats:**\n- Words: ${wordCount}\n- Lines: ${lineCount}\n\n🎯 **Insights:**\n- Active discussion\n- Key topics: patrol, coordination\n\n⚠️ **Alerts:**\n- Task updates\n- Location reports\n\n📋 **Summary:**\nProfessional and operational communication detected.`;
    return "";
  };
  const handleJsonFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const content = evt.target.result;
        setjsonShowImportModal(false);
        const jsonData = JSON.parse(content);
        // setMembersList(jsonData)
        console.log(jsonData);
        const response = await fetch(
          "http://localhost:5000/api/membersInsert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload members to backend");
        }
        // setReportingList(jsonData);
        // setReportingListFile(file);
        console.log("Members uploaded successfully");
        // Create role mapping
        setFileUploaded(true);
      } catch (err) {
        console.error("❌ Failed to read JSON file:", err.message);
      }
    };

    reader.readAsText(file);
  };
  const handleHierFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const content = evt.target.result;
        sethierShowImportModal(false);
        const jsonData = JSON.parse(content);
        console.log(jsonData);
        // setReportingList(jsonData);

        console.log("Members uploaded successfully");
        // console.log(membersList)
        setFileUploaded(true);
      } catch (err) {
        console.error("❌ Failed to read JSON file:", err.message);
      }
    };

    reader.readAsText(file);
  };
  // const formatSummaryChunks = (chunks) => {
  // return `📋 **Summary**\n\n📝 **Assigned Tasks**: ${chunks.assigned_tasks.length}\n✅ **Completed Tasks**: ${chunks.completed_tasks.length}\n❌ **Incomplete Tasks**: ${chunks.incomplete_tasks.length}`;
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // const reportingFile = reportingListFile;
    const formData = new FormData();

    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setChatInput(evt.target.result);
        setfiledata(evt.target.result);
        setFileUploaded(true);
      };
      reader.readAsText(file);
      // setfiledata(file)
      console.log(filedata);
      formData.append("file", file);
      try {
        const response = await fetch("http://localhost:8000/summarize", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        // setSummary(data)
        // setChatHistory(data)
        setChatHistory(data.summary_chunks);
        // console.log(chatHistory.map((ind) => console.log(chatHistory[ind])));
        console.log("Summary response:", data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImportSubmit = () => {
    if (chatInput.trim()) {
      handleChatSubmit();
      setShowImportModal(false);
    }
  };

  // const nameToMember = {};
  // membersList.forEach(member => {
  //   nameToMember[member.Officer_Name] = member;
  // });

  // const hierarchyTree = {};
  // reportingList.forEach(entry => {
  //   const manager = entry.Reports_to;
  //   const member = entry.mem_id;

  //   if (manager && manager !== member) {
  //     if (!hierarchyTree[manager]) {
  //       hierarchyTree[manager] = [];
  //     }
  //     hierarchyTree[manager].push(member);
  //   }
  // });

  // function getAllSubordinates(memId, tree) {
  //   const result = [];
  //   const stack = [memId];

  //   while (stack.length > 0) {
  //     const current = stack.pop();
  //     const subs = tree[current] || [];
  //     result.push(...subs);
  //     stack.push(...subs);
  //   }

  //   return result;
  // }

  // // === Step 5: Assign task function ===
  // function assignTask(assignerName, assigneeName, taskDescription) {
  //   const assigner = nameToMember[assignerName];
  //   const assignee = nameToMember[assigneeName];

  //   if (!assigner || !assignee) {
  //     console.warn("Assigner or Assignee not found");
  //     return null;
  //   }

  //   const assignerId = assigner.mem_id;
  //   const assigneeId = assignee.mem_id;

  //   const assignerSubtree = getAllSubordinates(assignerId, hierarchyTree);
  //   const isValidAssignment = assignerSubtree.includes(assigneeId);

  //   if (!isValidAssignment) {
  //     console.warn("Invalid assignment: Assignee is not under Assigner");
  //     return null;
  //   }

  //   const fullResponsible = [assigneeId, ...getAllSubordinates(assigneeId, hierarchyTree)];

  //   return {
  //     task_id: `TASK_${Date.now()}`,
  //     description: taskDescription,
  //     assigned_by: assignerId,
  //     assigned_to: assigneeId,
  //     responsible_officers: fullResponsible,
  //     status: "assigned",
  //     timestamp: new Date().toISOString()
  //   };
  // }

  // // === Step 6: Example usage ===
  // const task = assignTask("Pravallika", "Yeshwanth", "Conduct CM visit checks at Kurmannapalem Junction");
  // console.log("Assigned Task:\n", task);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-blue-800">
            WhatsApp Chat Dashboard
          </h1>
          <p className="text-blue-600 mt-1">
            AI-powered summary & insights of police communication
          </p>
        </div>
        <Button onClick={() => setjsonShowImportModal(true)}>
          <Upload className="h-4 w-4 mr-2" /> Import Json
        </Button>
        <Button onClick={() => setShowImportModal(true)}>
          <Upload className="h-4 w-4 mr-2" /> Import Chat
        </Button>
        <Button onClick={() => sethierShowImportModal(true)}>
          <Upload className="h-4 w-4 mr-2" /> Import Hierachy
        </Button>
      </div>

      <div className="border border-blue-200 rounded-xl shadow p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-800 p-2 rounded-full">
              <MessageSquare className="text-white h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-blue-800">
              Chat Summary
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatHistory([])}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
          {promptResponse && (
            <div className="mt-4 bg-gray-100 p-4 rounded-md border border-blue-200">
              <h4 className="text-blue-800 font-semibold mb-1">
                LLM Response:
              </h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {promptResponse}
              </pre>
            </div>
          )}
        </div>
        {
          <div className="mt-6">
            <h3 className="text-blue-800 font-semibold mb-2">Custom Prompt</h3>
            <Textarea
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your custom prompt here..."
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handlePromptAnalysis}
                disabled={!userPrompt.trim()}
              >
                <Send className="h-4 w-4 mr-1" /> Analyze
              </Button>
            </div>
          </div>
        }

        <div className="mt-4">
          {/* <Textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Paste WhatsApp chat here..."
            onKeyDown={(e) =>
              e.ctrlKey && e.key === "Enter" && handleChatSubmit()
            }
            rows={5}
          /> */}
          {/* <div className="flex justify-between mt-2 text-sm text-blue-500">
            <span>Ctrl + Enter to summarize</span>
            <span>{chatInput.length} characters</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim() || isAnalyzing}
            >
              <Send className="h-4 w-4 mr-1" /> Summarize
            </Button> */}
        </div>
        {/* </div> */}
      </div>

      {/* --------------------------- */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Import Data
            </h2>
            <p className="text-sm text-blue-600 mb-4">Upload your file</p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="mb-4 w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportSubmit}
                disabled={!fileUploaded || isAnalyzing}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      {showjsonImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Import Data
            </h2>
            <p className="text-sm text-blue-600 mb-4">Upload your file</p>
            <input
              type="file"
              accept=".json"
              onChange={handleJsonFileUpload}
              className="mb-4 w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setjsonShowImportModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportSubmit}
                disabled={!fileUploaded || isAnalyzing}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      {showhierImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Import Data
            </h2>
            <p className="text-sm text-blue-600 mb-4">Upload your file</p>
            <input
              type="file"
              accept=".json"
              onChange={handleHierFileUpload}
              className="mb-4 w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => sethierShowImportModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportSubmit}
                disabled={!fileUploaded || isAnalyzing}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
