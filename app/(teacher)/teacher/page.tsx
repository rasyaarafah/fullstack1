"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import {
  RecentLetterList,
  LetterItemData,
} from "@/components/organisms/RecentLetterList";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";

type UserProfile = {
  id?: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
  role: string;
};

export default function OverviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentLetters, setRecentLetters] = useState<LetterItemData[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "",
    name: "",
    username: "",
    avatarUrl: "",
    role: "teacher",
  });

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: true },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: false },
    { label: "Pending", href: "/teacher/pending", isActive: false },
  ];

  useEffect(() => {
    async function fetchOverviewData() {
      try {
        setLoading(true);

        // Append timestamp to bust cache for both session user and letters
        const [userRes, lettersRes] = await Promise.all([
          fetch(`/api/me?t=${Date.now()}`, { cache: "no-store" }),
          fetch(`/api/letters?t=${Date.now()}`, { cache: "no-store" }),
        ]);

        let activeUserName = "Teacher";

        if (userRes.ok) {
          const userData = await userRes.json();
          const userObj = userData?.user || userData;

          activeUserName =
            userObj?.name ||
            userObj?.username ||
            userObj?.email?.split("@")[0] ||
            "Teacher";

          // Fall back across common profile picture property keys
          const profilePic =
            userObj?.avatarUrl ||
            userObj?.image ||
            userObj?.profilePicture ||
            userObj?.picture ||
            "";

          setCurrentUser({
            id: userObj?.id || "",
            name: activeUserName,
            username: userObj?.username || userObj?.email || activeUserName,
            avatarUrl: profilePic,
            role: userObj?.role || "teacher",
          });
        }

        if (lettersRes.ok) {
          const rawData = await lettersRes.json();

          const formattedData: LetterItemData[] = rawData.map((item: any) => {
            const rawStatus = (item.status || "").toLowerCase();
            let validStatus: "approved" | "pending" | "rejected" = "pending";
            if (rawStatus === "approved") validStatus = "approved";
            if (rawStatus === "rejected") validStatus = "rejected";

            return {
              id: item.id,
              title: item.title,
              date: new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              }),
              status: validStatus,
              authorUsername:
                item.author?.name || item.creatorName || activeUserName,
            };
          });

          const pending = rawData.filter(
            (l: any) => l.status?.toLowerCase() === "pending"
          ).length;

          setPendingCount(pending);
          setTotalCount(formattedData.length);
          setRecentLetters(formattedData.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOverviewData();
  }, []);

  const handleViewLetter = (id: string) => {
    router.push(`/teacher/preview/${id}`);
  };

  const handleEditLetter = (id: string) => {
    router.push(`/teacher/edit/${id}`);
  };

  const handleCancelLetter = async (id: string) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan surat ini?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/letters/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecentLetters((prev) => prev.filter((letter) => letter.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        alert("Gagal membatalkan surat.");
      }
    } catch (err) {
      console.error("Error cancelling letter:", err);
    }
  };

  const filteredLetters = recentLetters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} currentUser={currentUser}>
      <div className="flex flex-col gap-8">
        <NoticeBanner currentUser={currentUser} />

        <div>
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome back, <span className="italic">{currentUser.name || "..."}</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1 font-sans">
            Here is a summary of your letter activities today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-stone-400 font-sans tracking-wider">
                QUICK ACTION
              </span>
              <h3 className="text-2xl font-serif font-semibold text-stone-900 mt-1">
                Create New Letter
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Select a template and generate formal Kop Surat instantly.
              </p>
            </div>
            <Link
              href="/teacher/new-letter"
              className="w-full text-center py-2.5 px-4 rounded-2xl bg-[#0A4D3C] text-white font-medium text-sm hover:bg-[#07382c] active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              Start Creating →
            </Link>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-stone-400 font-sans tracking-wider">
                PENDING APPROVALS
              </span>
              <div className="text-3xl font-bold text-stone-900 mt-1 font-sans">
                {loading ? "..." : pendingCount}
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Letters waiting for signature or review.
              </p>
            </div>
            <Link
              href="/teacher/pending"
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              View Pending
            </Link>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-stone-400 font-sans tracking-wider">
                TOTAL GENERATED
              </span>
              <div className="text-3xl font-bold text-stone-900 mt-1 font-sans">
                {loading ? "..." : totalCount}
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Completed and saved letters in your archive.
              </p>
            </div>
            <Link
              href="/teacher/history"
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              Open History
            </Link>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-serif font-semibold text-stone-900">
              Recent Letters
            </h2>
            <div className="w-full md:w-72">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search letter title..."
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-stone-400 font-sans text-sm">
              Loading recent letters...
            </div>
          ) : (
            <RecentLetterList
              letters={filteredLetters}
              onViewLetter={handleViewLetter}
              onEditLetter={handleEditLetter}
              onCancelLetter={handleCancelLetter}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}