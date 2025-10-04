"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/app/hooks/socket/socket";
import { Button } from "@/components/ui/button";

const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function AdminSupport() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const adminId = user?.role === "admin" ? user.id : null;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function load() {
      const res = await fetch(`${BACKEND}/support/admin/threads`);
      const data = await res.json();
      setThreads(data.threads || []);
    }
    load();

    const socket = initSocket(adminId, true);

    socket.on("new_support_thread", (payload) => {
      setThreads((prev) => {
        if (prev.find((t) => String(t._id) === String(payload._id))) return prev;
        return [payload, ...prev];
      });
    });

    socket.on("thread_updated", (payload) => {
      setThreads((prev) =>
        prev.map((t) =>
          String(t._id) === String(payload._id)
            ? { ...t, status: payload.status, updatedAt: payload.updatedAt }
            : t
        )
      );

      if (activeThread && String(activeThread._id) === String(payload._id)) {
        setActiveThread((prev) => ({ ...prev, status: payload.status }));
      }
    });

    return () => {
      socket.off("new_support_thread");
      socket.off("thread_updated");
    };
  }, [adminId, activeThread]);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages]);

  function openThread(threadId) {
    const t = threads.find((th) => String(th._id) === String(threadId));
    setActiveThread(t);
  }

  async function sendReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const res = await fetch(`${BACKEND}/support/admin/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: String(activeThread._id),
        adminId,
        text: replyText,
      }),
    });

    const data = await res.json();
    setActiveThread(data.thread);
    setReplyText("");
    setThreads((prev) =>
      prev.map((t) => (String(t._id) === String(data.thread._id) ? data.thread : t))
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto flex gap-4">
      <div className="w-1/3 border rounded p-2">
        <h3 className="font-bold mb-2">Inbox</h3>
        <ul>
          {threads.map((t, i) => (
            <li key={i} className="mb-2 cursor-pointer" onClick={() => openThread(t._id)}>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium">User: {t.userId}</div>
                  <div className="text-xs text-gray-500">
                    {t.lastMessage || (t.messages && t.messages.slice(-1)[0]?.text)}
                  </div>
                </div>
                <div className="text-xs">
                  <span
                    className={`px-2 py-1 rounded ${
                      t.status === "waiting" ? "bg-yellow-200" : "bg-green-100"
                    }`}
                  >
                    {t.status || "unknown"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 border rounded p-4">
        {!activeThread && (
          <div className="text-sm text-gray-500">Select a thread to view messages</div>
        )}

        {activeThread && (
          <>
            <h4 className="font-semibold mb-2">Chat with: {activeThread.userId}</h4>
            <div className="h-72 overflow-auto border rounded p-2 mb-3">
              {(activeThread.messages || []).map((m, idx) => (
                <div
                  key={idx}
                  className={`mb-3 ${m.sender === "user" ? "text-left" : "text-right"}`}
                >
                  <div
                    className={`inline-block p-2 rounded ${
                      m.sender === "user" ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    <div className="text-sm">{m.text}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendReply} className="flex gap-2">
              <input
                className="flex-1 border rounded p-2"
                placeholder="Write reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button variant="primary"  className="px-4 py-2 bg-green-600 text-white rounded">Reply</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
