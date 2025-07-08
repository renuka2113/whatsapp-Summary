"""Utilities for chat loaders."""
import logging
from copy import deepcopy
from typing import Iterable, Iterator, List

from langchain_core.chat_sessions import ChatSession
from langchain_core.messages import AIMessage, BaseMessage

logger = logging.getLogger(__name__)



def merge_chat_runs_in_session(
    chat_session: ChatSession, delimiter: str = "\n\n"
) -> ChatSession:
    """Merge chat runs together in a chat session.

    A chat run is a sequence of messages from the same sender.

    Args:
        chat_session: A chat session.

    Returns:
        A chat session with merged chat runs.
    """
    messages: List[BaseMessage] = []
    for message in chat_session["messages"]:
        if isinstance(message.content, list):
            text = ""
            for content in message.content:
                if isinstance(content, dict):
                    text += content.get("text", None)
                else:
                    text += content
            message.content = text
        if not isinstance(message.content, str):
            raise ValueError(
                "Chat Loaders only support messages with content type string, "
                f"got {message.content}"
            )
        if not messages:
            messages.append(deepcopy(message))
        elif (
            isinstance(message, type(messages[-1]))
            and messages[-1].additional_kwargs.get("sender") is not None
            and messages[-1].additional_kwargs["sender"]
            == message.additional_kwargs.get("sender")
        ):
            if not isinstance(messages[-1].content, str):
                raise ValueError(
                    "Chat Loaders only support messages with content type string, "
                    f"got {messages[-1].content}"
                )
            messages[-1].content = (
                messages[-1].content + delimiter + message.content
            ).strip()
            messages[-1].additional_kwargs.get("events", []).extend(
                message.additional_kwargs.get("events") or []
            )
        else:
            messages.append(deepcopy(message))
    return ChatSession(messages=messages)


def merge_chat_runs(chat_sessions: Iterable[ChatSession]) -> Iterator[ChatSession]:
    """Merge chat runs together.

    A chat run is a sequence of messages from the same sender.

    Args:
        chat_sessions: A list of chat sessions.

    Returns:
        A list of chat sessions with merged chat runs.
    """
    for chat_session in chat_sessions:
        yield merge_chat_runs_in_session(chat_session)


def map_ai_messages_in_session(chat_sessions: ChatSession, sender: str) -> ChatSession:
    """Convert messages from the specified 'sender' to AI messages.

    This is useful for fine-tuning the AI to adapt to your voice.
    """
    messages = []
    num_converted = 0
    for message in chat_sessions["messages"]:
        if message.additional_kwargs.get("sender") == sender:
            message = AIMessage(
                content=message.content,
                additional_kwargs=message.additional_kwargs.copy(),
                example=getattr(message, "example", None),
            )
            num_converted += 1
        messages.append(message)
    return ChatSession(messages=messages)


def map_ai_messages(
    chat_sessions: Iterable[ChatSession], sender: str
) -> Iterator[ChatSession]:
    """Convert messages from the specified 'sender' to AI messages.

    This is useful for fine-tuning the AI to adapt to your voice.
    """
    for chat_session in chat_sessions:
        yield map_ai_messages_in_session(chat_session, sender)

def map_group_messages_in_session(chat_session: ChatSession, userRoles) -> ChatSession:
    """Convert messages from the group chat to individual role based messages.

        This is useful for assigning and grouping messages to the same sender.
    """
    user_roles  = userRoles
    messages = []

    for message in chat_session["messages"]:
        sender = message.additional_kwargs.get("sender", "Unknown")

        metadata = user_roles.get(sender)

        # If sender is a name and found directly
        if metadata:
            role = metadata["Rank"]
            mobile = metadata["Mobile"]
            name = sender

        else:
            # If sender might be a mobile number, reverse-lookup
            name, role, mobile = sender, "Unknown", sender
            for key, data in user_roles.items():
                if data.get("Mobile") == sender:
                    name = key
                    role = data["Rank"]
                    mobile = sender
                    break
        logger.debug(role)
        # Attach extracted values to the message
        message.role = role
        message.additional_kwargs["mapped_role"] = role
        message.additional_kwargs["mapped_name"] = name
        message.additional_kwargs["mobile"] = mobile

        # Overwrite the sender to the officer's name if mobile was used
        message.additional_kwargs["sender"] = name
        messages.append(message)

    return ChatSession(messages=messages)

def map_group_messages(chat_sessions: Iterable[ChatSession], userRoles : dict) -> Iterator[ChatSession]:
    """Convert messages from the group chat to individual role based messages.
    
        This is useful for assigning and grouping messages to the same sender.
    """
    for chat_session in chat_sessions:
        yield map_group_messages_in_session(chat_session,userRoles)