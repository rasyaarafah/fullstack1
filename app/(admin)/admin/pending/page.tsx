"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface PendingLetter {
  id: number;
  username: string;
  title: string;
  date: string;
}

const PendingLetterRow = ({
  item,
  onActionSelect,
}: {
  item: PendingLetter;
  onActionSelect: (action: string, id: number) => void;
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 font-serif text-base">
      {/* Left: Item Info */}
      <div className="flex items-center gap-1 text-stone-900">
        <span className="font-sans font-normal text-stone-900">
          @{item.username},
        </span>{" "}
        <span className="font-serif font-semibold text-stone-900">
          {item.title},
        </span>{" "}
        <span className="font-serif font-semibold text-stone-900">
          {item.date}
        </span>
      </div>

      {/* Right: Orange Dot + Buttons */}
      <div className="flex items-center gap-3 mt-2 sm:mt-0 self-end sm:self-center">
        {/* Status Dot */}
        <span className="w-3.5 h-3.5 rounded-full bg-orange-500 shrink-0" />

        {/* See Button */}
        <button
          onClick={() => onActionSelect("View", item.id)}
          className="px-3 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 font-serif text-base transition-colors"
        >
          See
        </button>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 font-serif text-base transition-colors"
          >
            <span>Actions</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${
                isActionsOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Popup Menu */}
          {isActionsOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-stone-800 rounded-2xl shadow-lg z-30 font-serif py-1 overflow-hidden">
              {["Approve", "Revise", "Reject", "View"].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setIsActionsOpen(false);
                    onActionSelect(action, item.id);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 text-stone-900 font-serif text-lg transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PendingApprovalsPage() {
  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending", isActive: true },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new" }, // FIXED ROUTE HERE
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const initialPendingList: PendingLetter[] = [
    { id: 1, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 2, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 3, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 4, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 5, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 6, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 7, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 8, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
    { id: 9, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026" },
  ];

  const handleActionSelect = (action: string, id: number) => {
    console.log(`Action triggered: ${action} for letter ID: ${id}`);
  };

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-normal text-stone-900">
            Welcome, <span className="italic">Admin</span>
          </h1>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-300 text-stone-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-sans text-stone-900">
            <span className="font-bold">{initialPendingList.length}</span> Letters waiting to be approved
          </h2>
        </div>

        {/* Letters List */}
        <div className="flex flex-col">
          {initialPendingList.map((item) => (
            <PendingLetterRow
              key={item.id}
              item={item}
              onActionSelect={handleActionSelect}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}