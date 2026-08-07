"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

type UserOption = {
  id: string;
  name: string;
  username: string;
  role: "teacher" | "admin";
};

type BroadcastHistoryItem = {
  id: string;
  message: string;
  audienceType: "all" | "teachers" | "admins" | "custom";
  targetUsers: string[];
  createdAt: string;
  isActive: boolean;
  readStatus: {
    username: string;
    hasRead: boolean;
  }[];
};

export default function AdminNoticePage() {
  const pathname = usePathname();

  // Standardized Admin Navigation
  const navItems = [
    { label: "Overview", href: "/admin", isActive: pathname === "/admin" },
    { label: "Pending Approval", href: "/admin/pending", isActive: pathname === "/admin/pending" },
    { label: "Archive", href: "/admin/history", isActive: pathname === "/admin/history" },
    { label: "User Management", href: "/admin/users", isActive: pathname === "/admin/users" },
    { label: "New letter", href: "/admin/new-letter", isActive: pathname === "/admin/new-letter" },
  ];

  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: pathname === "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new", isActive: pathname === "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice", isActive: pathname === "/admin/notice" },
  ];

  const mockUsers: UserOption[] = [
    { id: "1", name: "Ahmad Suherman", username: "teacher_dev", role: "teacher" },
    { id: "2", name: "Siti Rahma", username: "siti_teacher", role: "teacher" },
    { id: "3", name: "Budi Santoso", username: "budi_admin", role: "admin" },
    { id: "4", name: "Dewi Lestari", username: "dewi_teacher", role: "teacher" },
  ];

  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState<"all" | "teachers" | "admins" | "custom">("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeNotice, setActiveNotice] = useState<string | null>(
    "Scheduled maintenance will take place this Saturday at 22:00 WIB."
  );

  const [history, setHistory] = useState<BroadcastHistoryItem[]>([
    {
      id: "h-1",
      message: "Scheduled maintenance will take place this Saturday at 22:00 WIB.",
      audienceType: "teachers",
      targetUsers: ["teacher_dev", "siti_teacher", "dewi_teacher"],
      createdAt: "2026-08-06 09:00",
      isActive: true,
      readStatus: [
        { username: "teacher_dev", hasRead: true },
        { username: "siti_teacher", hasRead: false },
        { username: "dewi_teacher", hasRead: true },
      ],
    },
    {
      id: "h-2",
      message: "Please complete your pending letter reviews before Friday.",
      audienceType: "custom",
      targetUsers: ["teacher_dev"],
      createdAt: "2026-08-01 14:20",
      isActive: false,
      readStatus: [{ username: "teacher_dev", hasRead: true }],
    },
  ]);

  const adminUser = {
    name: "Admin User",
    username: "admin_main",
    avatarUrl: "",
    role: "admin",
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let targets: string[] = [];
    if (audienceType === "all") targets = mockUsers.map((u) => u.username);
    else if (audienceType === "teachers")
      targets = mockUsers.filter((u) => u.role === "teacher").map((u) => u.username);
    else if (audienceType === "admins")
      targets = mockUsers.filter((u) => u.role === "admin").map((u) => u.username);
    else
      targets = mockUsers
        .filter((u) => selectedUserIds.includes(u.id))
        .map((u) => u.username);

    const newBroadcast: BroadcastHistoryItem = {
      id: `h-${Date.now()}`,
      message,
      audienceType,
      targetUsers: targets,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      isActive: true,
      readStatus: targets.map((username) => ({ username, hasRead: false })),
    };

    setActiveNotice(message);
    setHistory([newBroadcast, ...history]);
    setMessage("");
  };

  const handleStopNotice = () => {
    setActiveNotice(null);
    setHistory((prev) =>
      prev.map((item) => (item.isActive ? { ...item, isActive: false } : item))
    );
  };

  return (
    <DashboardLayout navItems={navItems} adminTools={adminTools} currentUser={adminUser}>
      <div className="flex flex-col gap-8 pb-16 font-sans">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Broadcast Notice</h1>
          <p className="text-stone-500 text-sm mt-1">
            Send real-time banner announcements and track recipient engagement.
          </p>
        </div>

        {/* Active Notice Alert Banner */}
        {activeNotice && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-sm text-stone-800">
                <span className="font-bold text-amber-900 mr-2">Active Broadcast:</span>
                "{activeNotice}"
              </div>
            </div>
            <button
              onClick={handleStopNotice}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-full transition-all cursor-pointer shrink-0"
            >
              Stop Notice
            </button>
          </div>
        )}

        {/* Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handlePublish}
            className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6"
          >
            <h2 className="text-xl font-serif font-semibold text-stone-900">
              Create Announcement
            </h2>

            {/* Target Audience */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Users" },
                  { id: "teachers", label: "Teachers Only" },
                  { id: "admins", label: "Admins Only" },
                  { id: "custom", label: "Specific Users..." },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setAudienceType(aud.id as any)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      audienceType === aud.id
                        ? "bg-[#0A4D3C] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiselect */}
            {audienceType === "custom" && (
              <div className="flex flex-col gap-2 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                <span className="text-xs font-semibold text-stone-600">
                  Select Specific Recipients:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mockUsers.map((user) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className={`text-[10px] ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                            @{user.username} • {user.role}
                          </p>
                        </div>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your notice here..."
                className="w-full p-4 rounded-2xl border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] transition-all"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#0A4D3C] text-white font-medium text-sm hover:bg-[#07382c] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Broadcast Now →
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h2 className="text-xl font-serif font-semibold text-stone-900">
              User Banner Preview
            </h2>
            <p className="text-xs text-stone-400">
              How this will appear on recipient overview screens:
            </p>

            <div className="bg-white border border-stone-300 rounded-2xl p-4 shadow-xs flex items-center gap-3 mt-2">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                !
              </div>
              <div className="text-xs font-sans text-stone-800 leading-relaxed">
                <span className="font-bold text-stone-900 mr-1">Admin:</span>
                {message || "Your broadcast text preview will render right here..."}
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <h2 className="text-xl font-serif font-semibold text-stone-900">
            Broadcast History & Read Receipts
          </h2>

          <div className="flex flex-col gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-stone-200 rounded-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Archived"}
                    </span>
                    <span className="text-xs text-stone-400">{item.createdAt}</span>
                  </div>

                  <span className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1 rounded-full w-fit">
                    Audience: {item.audienceType} ({item.targetUsers.length} users)
                  </span>
                </div>

                <p className="text-sm text-stone-800 font-medium">"{item.message}"</p>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Recipient Status:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.readStatus.map((st, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                          st.hasRead
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            st.hasRead ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        @{st.username}: {st.hasRead ? "Read" : "Unread"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}