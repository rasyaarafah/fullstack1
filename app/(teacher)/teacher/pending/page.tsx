"use client";

import React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterRowItem } from "@/components/molecules/LetterRowItem";

export default function PendingPage() {
  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: false },
    { label: "Pending", href: "/teacher/pending", isActive: true },
  ];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
  };

  // Letters currently needing action / review
  const pendingLetters = [
    {
      id: "1",
      username: "useruser",
      title: "surat izin kegiatan",
      date: "07/20/2026",
      status: "rejected" as const,
    },
    {
      id: "2",
      username: "useruser",
      title: "surat izin kegiatan",
      date: "07/20/2026",
      status: "pending" as const,
    },
  ];

  // Counts for the summary cards
  const pendingCount = pendingLetters.filter((l) => l.status === "rejected").length;
  const waitingCount = pendingLetters.filter((l) => l.status === "pending").length;
  const rejectedCount = pendingCount; // Or adjust based on your exact status groupings

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Pending */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              2
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Pending
            </div>
          </div>

          {/* Card 2: Waiting */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              1
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Waiting
            </div>
          </div>

          {/* Card 3: Rejected */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              1
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Rejected
            </div>
          </div>
        </div>

        {/* Pending Letters List Container */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-3 min-h-87.5">
          {pendingLetters.length > 0 ? (
            pendingLetters.map((item) => (
              <LetterRowItem
                key={item.id}
                title={item.title}
                username={item.username}
                date={item.date}
                status={item.status}
                onSee={() => console.log("See", item.id)}
                onEdit={() => console.log("Edit", item.id)}
                onCancel={() => console.log("Cancel", item.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-stone-400 font-sans text-sm">
              No pending letters at the moment.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}