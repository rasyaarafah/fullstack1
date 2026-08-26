"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { SearchBar } from "@/components/molecules/SearchBar";
import { LetterRowItem } from "@/components/molecules/LetterRowItem";

interface Letter {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  author?: {
    name?: string;
    email?: string;
  };
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: true },
    { label: "Pending", href: "/teacher/pending", isActive: false },
  ];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
  };

  useEffect(() => {
    async function fetchLetters() {
      try {
        const res = await fetch("/api/letters");
        if (res.ok) {
          const data = await res.json();
          setLetters(data);
        }
      } catch (err) {
        console.error("Failed to fetch letters history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLetters();
  }, []);

  // Step 2: Delete / Cancel letter handler
  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this letter?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLetters((prev) => prev.filter((letter) => letter.id !== id));
      } else {
        alert("Failed to cancel the letter.");
      }
    } catch (err) {
      console.error("Error cancelling letter:", err);
    }
  };

  // Step 3: Filter by Search Query & Selected Status
  const filteredLetters = letters.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Search Bar & Status Dropdown Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-stone-200 rounded-xl bg-white text-sm font-sans text-stone-700 focus:outline-none focus:border-emerald-500 shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="revise">Revise</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Letter List */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-8 text-stone-400 font-sans text-sm">
              Loading letters...
            </div>
          ) : filteredLetters.length > 0 ? (
            filteredLetters.map((item) => {
              const formattedStatus = item.status.toLowerCase() as
                | "pending"
                | "rejected"
                | "approved"
                | "revise"
                | "draft";

              const canModify =
                formattedStatus === "pending" ||
                formattedStatus === "draft" ||
                formattedStatus === "rejected" ||
                formattedStatus === "revise";

              return (
                <LetterRowItem
                  key={item.id}
                  title={item.title}
                  username={item.author?.name || "useruser"}
                  date={new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  status={formattedStatus}
                  onSee={() =>
                    (window.location.href = `/admin/templates/preview/${item.id}`)
                  }
                  // Step 1: Navigates to edit page
                  onEdit={
                    canModify
                      ? () =>
                          (window.location.href = `/teacher/templates/edit/${item.id}`)
                      : undefined
                  }
                  // Step 2: Calls delete API
                  onCancel={canModify ? () => handleCancel(item.id) : undefined}
                />
              );
            })
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