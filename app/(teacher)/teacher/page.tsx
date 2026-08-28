"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { RecentLetterList } from "@/components/organisms/RecentLetterList";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";

type LetterItem = {
  id: string;
  title: string;
  recipient: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  authorUsername: string;
};

type UserProfile = {
  id?: string | number;
  name: string;
  username: string;
  avatarUrl?: string;
  role: string;
};

export default function OverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentLetters, setRecentLetters] = useState<LetterItem[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Dynamic user state with fallback during initial load
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

        // Fetch session user and letters concurrently
        const [userRes, lettersRes] = await Promise.all([
          fetch("/api/me"),
          fetch("/api/letters"),
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

          setCurrentUser({
            id: userObj?.id || "",
            name: activeUserName,
            username: userObj?.username || userObj?.email || activeUserName,
            avatarUrl: userObj?.image || userObj?.avatarUrl || "",
            role: userObj?.role || "teacher",
          });
        } else {
          setCurrentUser((prev) => ({ ...prev, name: "Teacher" }));
        }

        if (lettersRes.ok) {
          const rawData = await lettersRes.json();

          const formattedData: LetterItem[] = rawData.map((item: any) => ({
            id: item.id,
            title: item.title,
            recipient: item.recipient || "",
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
            status: item.status.toLowerCase() as
              | "approved"
              | "pending"
              | "rejected",
            authorUsername:
              item.author?.name || item.creatorName || activeUserName,
          }));

          const pending = formattedData.filter(
            (l) => l.status === "pending"
          ).length;

          setPendingCount(pending);
          setTotalCount(formattedData.length);

          setRecentLetters(formattedData.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
        setCurrentUser((prev) => ({ ...prev, name: "Teacher" }));
      }  finally {
        setLoading(false);
      }
    }

    fetchOverviewData();
  }, []);

  const filteredLetters = recentLetters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} currentUser={currentUser}>
      <div className="flex flex-col gap-8">
        {/* Pass currentUser explicitly so audience checks match */}
        <NoticeBanner currentUser={currentUser} />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome back, <span className="italic">{currentUser.name || "..."}</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1 font-sans">
            Here is a summary of your letter activities today.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Create Letter */}
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

          {/* Card 2: Pending Approvals */}
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

          {/* Card 3: Total Generated */}
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

        {/* Recent Letters Section */}
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
            <RecentLetterList letters={filteredLetters} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}