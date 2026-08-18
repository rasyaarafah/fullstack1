"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
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

export default function PendingPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchPendingLetters() {
      try {
        // Fetch both PENDING and REJECTED status letters
        const res = await fetch("/api/letters?status=PENDING,REJECTED");
        if (res.ok) {
          const data = await res.json();
          setLetters(data);
        }
      } catch (err) {
        console.error("Failed to fetch pending letters", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPendingLetters();
  }, []);

  // Stat computations
  const totalCount = letters.length;
  const waitingCount = letters.filter((l) => l.status.toUpperCase() === "PENDING").length;
  const rejectedCount = letters.filter((l) => l.status.toUpperCase() === "REJECTED").length;

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              {totalCount}
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Total Pending
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              {waitingCount}
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Waiting
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold text-stone-900 font-sans">
              {rejectedCount}
            </div>
            <div className="text-2xl font-serif text-stone-800 mt-1">
              Rejected
            </div>
          </div>
        </div>

        {/* Letters List */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-3 min-h-87.5">
          {loading ? (
            <div className="text-center py-12 text-stone-400 font-sans text-sm">
              Loading letters...
            </div>
          ) : letters.length > 0 ? (
            letters.map((item) => (
              <LetterRowItem
                key={item.id}
                title={item.title}
                username={item.author?.name || "user"}
                date={new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                status={item.status.toLowerCase() as "pending" | "rejected"}
                onSee={() => console.log("See", item.id)}
                onEdit={() => console.log("Edit", item.id)}
                onCancel={() => console.log("Cancel", item.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-stone-400 font-sans text-sm">
              No pending letters found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}