"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { SearchBar } from "@/components/molecules/SearchBar";
import { LetterRowItem } from "@/components/molecules/LetterRowItem";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { label: "Overview", href: "/", isActive: false },
    { label: "New letter", href: "/new-letter", isActive: false },
    { label: "History", href: "/history", isActive: true },
    { label: "Pending", href: "/pending", isActive: false },
  ];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
  };

  // List matching your exact component props!
  const allLetters = [
    {
      id: "1",
      username: "useruser",
      title: "surat 1",
      date: "07/20/2026",
      status: "rejected" as const,
    },
    {
      id: "2",
      username: "useruser",
      title: "surat 2",
      date: "07/20/2026",
      status: "pending" as const,
    },
    {
      id: "3",
      username: "useruser",
      title: "surat 3",
      date: "07/20/2026",
      status: "approved" as const,
    },
    {
      id: "4",
      username: "useruser",
      title: "surat 10",
      date: "07/20/2026",
      status: "approved" as const,
    },
    {
      id: "5",
      username: "useruser",
      title: "surat 100",
      date: "07/20/2026",
      status: "approved" as const,
    },
  ];

  const filteredLetters = allLetters.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="w-full">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {/* Letter List */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
          {filteredLetters.length > 0 ? (
            filteredLetters.map((item) => (
              <LetterRowItem
                key={item.id}
                title={item.title}
                username={item.username}
                date={item.date}
                status={item.status}
                onSee={() => console.log("See", item.id)}
                onEdit={item.status === "pending" || item.status === "rejected" ? () => console.log("Edit", item.id) : undefined}
                onCancel={item.status === "pending" || item.status === "rejected" ? () => console.log("Cancel", item.id) : undefined}
              />
            ))
          ) : (
            <div className="text-center py-8 text-stone-400 font-sans text-sm">
              No letters found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}