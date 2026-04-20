import React, { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const formatTime = (value) =>
  value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";

export default function ClaimConversation({ claimId, active, viewer, onUpdated }) {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadConversation = async (markRead = false) => {
    if (!claimId || !active) return;

    try {
      setLoading(true);
      const res = await API.get(`/claims/${claimId}/messages`);
      setConversation(res.data);
      onUpdated?.(res.data);

      if (markRead && res.data.unreadCount > 0) {
        await API.put(`/claims/${claimId}/read`);
        const updated = { ...res.data, unreadCount: 0 };
        setConversation(updated);
        onUpdated?.(updated);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active || !claimId) return;

    loadConversation(true);
    const interval = setInterval(() => loadConversation(false), 8000);
    return () => clearInterval(interval);
  }, [claimId, active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      const res = await API.post(`/claims/${claimId}/messages`, { text: message.trim() });
      setConversation(res.data);
      setMessage("");
      onUpdated?.(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!active) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        Select a claim to open its conversation.
      </div>
    );
  }

  if (loading && !conversation) {
    return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600">Loading conversation...</div>;
  }

  const messages = conversation?.messages || [];

  return (
    <div className="flex h-full min-h-[540px] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-xl font-semibold text-slate-900">{conversation?.item?.name || "Claim conversation"}</h3>
        <p className="mt-1 text-sm text-slate-600">
          Claim status: <strong>{conversation?.claimStatus}</strong>
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messages.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            No messages yet. Start the conversation with pickup details or proof questions.
          </div>
        ) : (
          messages.map((entry) => {
            const mine = String(entry.sender?._id) === String(viewer?._id);
            return (
              <div key={entry._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                    mine ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className={`text-xs font-semibold ${mine ? "text-sky-100" : "text-slate-500"}`}>
                    {entry.sender?.name || "Unknown user"}
                    {entry.sender?.role ? ` • ${entry.sender.role}` : ""}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{entry.text}</p>
                  <div className={`mt-2 text-[11px] ${mine ? "text-sky-100/90" : "text-slate-500"}`}>
                    {formatTime(entry.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-200 px-6 py-4">
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message about proof, pickup, or verification details"
            className="min-h-[56px] flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="self-end rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:bg-slate-400"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
