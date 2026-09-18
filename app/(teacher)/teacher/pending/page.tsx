"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, UserProfile } from "@/components/templates/DashboardLayout";
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
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>(undefined);

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: false },
    { label: "Pending", href: "/teacher/pending", isActive: true },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [userRes, lettersRes] = await Promise.all([
          fetch(`/api/me?t=${Date.now()}`, { cache: "no-store" }),
          fetch(`/api/letters?status=PENDING,REJECTED&t=${Date.now()}`, {
            cache: "no-store",
          }),
        ]);

        let userEmail = "teacher@gmail.com";

        if (userRes.ok) {
          const userData = await userRes.json();
          const userObj = userData?.user || userData;
          userEmail = userObj.email || userEmail;

          setCurrentUser({
            name: userObj.name || "Teacher",
            username: userEmail,
            image: userObj.image || userObj.avatarUrl || userObj.profilePicture || "",
          });
        }

        if (lettersRes.ok) {
          const data: Letter[] = await lettersRes.json();

          // Filter by active teacher email (or fallback if author relation is null)
          const teacherLetters = data.filter(
            (item) => !item.author?.email || item.author?.email === userEmail
          );

          // Sort newest first
          teacherLetters.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setLetters(teacherLetters);
        } else {
          console.error("Failed to load letters from API");
        }
      } catch (err) {
        console.error("Failed to fetch pending letters", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCancelLetter = async (id: string) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan surat ini?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLetters((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal membatalkan surat.");
      }
    } catch (err) {
      console.error("Error cancelling letter:", err);
    }
  };

  // Stat computations
  const totalCount = letters.length;
  const waitingCount = letters.filter((l) => l.status.toUpperCase() === "PENDING").length;
  const rejectedCount = letters.filter((l) => l.status.toUpperCase() === "REJECTED").length;

  return (
    <DashboardLayout navItems={navItems} currentUser={currentUser}>
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
            letters.map((item) => {
              const formattedStatus = item.status.toLowerCase();
              const validStatus = (formattedStatus === "rejected" ? "rejected" : "pending") as "pending" | "rejected";

              return (
                <LetterRowItem
                  key={item.id}
                  title={item.title}
                  username={currentUser?.name || "Teacher"}
                  date={new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  status={validStatus}
                  onSee={() => router.push(`/teacher/preview/${item.id}`)}
                  onEdit={() => router.push(`/teacher/edit/${item.id}`)}
                  onCancel={() => handleCancelLetter(item.id)}
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-stone-400 font-sans text-sm">
              No pending or rejected letters found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}