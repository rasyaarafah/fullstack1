"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface PendingLetter {
  id: string; // Database IDs are string UUIDs
  username: string;
  title: string;
  date: string;
}

const PendingLetterRow = ({
  item,
  onActionSelect,
}: {
  item: PendingLetter;
  onActionSelect: (action: string, id: string) => void;
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

      {/* Right: Status Dot + Buttons */}
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
  const [letters, setLetters] = useState<PendingLetter[]>([]);
  const [loading, setLoading] = useState(true);

  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending", isActive: true },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  // Fetch pending letters from MySQL API
// Replace lines 83–102 with this updated fetch block:
const fetchPendingLetters = async () => {
  try {
    // 1. Added cache: "no-store" and timestamp cache-buster to enforce fresh server requests
    const res = await fetch(`/api/letters?status=PENDING&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const formatted = data.map((item: any) => ({
        id: item.id,
        // 2. Updated fallback hierarchy for username
        username: item.author?.email?.split("@")[0] || item.author?.name || "Teacher",
        title: item.title,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
      }));
      setLetters(formatted);
    } else {
      console.error("Failed to load pending letters");
    }
  } catch (err) {
    console.error("Failed to load pending letters", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPendingLetters();
  }, []);

  // Handle dropdown actions
  // Handle dropdown actions
  const handleActionSelect = async (action: string, id: string) => {
    console.log("--> DROPLET CLICKED:", action, "ID:", id);

    if (action === "View") {
      window.location.href = `/admin/templates/preview/${id}`;
      return;
    }

    let targetStatus = "";
    if (action === "Approve") targetStatus = "APPROVED";
    if (action === "Reject") targetStatus = "REJECTED";
    if (action === "Revise") targetStatus = "REVISE"; // or "REVISED" depending on your Prisma schema

    console.log("--> Target Status Determined:", targetStatus);

    if (!targetStatus) {
      console.error("--> Error: No target status found for action:", action);
      return;
    }

    try {
      console.log("--> Sending PATCH request to:", `/api/letters/${id}`);
      const res = await fetch(`/api/letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      console.log("--> PATCH RESPONSE STATUS:", res.status);

      if (res.ok) {
        fetchPendingLetters();
      } else {
        const errData = await res.json();
        console.error("--> Failed payload error:", errData);
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Action error:", err);
    }
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
            <span className="font-bold">{letters.length}</span> Letters waiting
            to be approved
          </h2>
        </div>

        {/* Letters List */}
        <div className="flex flex-col">
          {loading ? (
            <p className="py-8 text-center text-stone-400 font-serif">
              Loading pending letters...
            </p>
          ) : letters.length > 0 ? (
            letters.map((item) => (
              <PendingLetterRow
                key={item.id}
                item={item}
                onActionSelect={handleActionSelect}
              />
            ))
          ) : (
            <p className="py-8 text-center text-stone-500 font-serif border border-stone-800">
              No letters currently waiting for approval.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
