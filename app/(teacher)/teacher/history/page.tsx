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
        // Fetch all letters for the teacher's history view
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

  const filteredLetters = letters.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
          {loading ? (
            <div className="text-center py-8 text-stone-400 font-sans text-sm">
              Loading letters...
            </div>
          ) : filteredLetters.length > 0 ? (
            filteredLetters.map((item) => {
              const formattedStatus = item.status.toLowerCase() as
                | "pending"
                | "rejected"
                | "approved";

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
                  onEdit={
                    formattedStatus === "pending" ||
                    formattedStatus === "rejected"
                      ? () => console.log("Edit", item.id)
                      : undefined
                  }
                  onCancel={
                    formattedStatus === "pending" ||
                    formattedStatus === "rejected"
                      ? () => console.log("Cancel", item.id)
                      : undefined
                  }
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