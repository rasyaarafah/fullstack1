"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { RecentLetterList } from "@/components/organisms/RecentLetterList";
import { SearchBar } from "@/components/molecules/SearchBar";

type LetterItem = {
  id: string;
  title: string;
  recipient: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  authorUsername: string;
};

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  // Broadcast Notice state
  const [adminNotice] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );

  const navItems = [
  { label: "Overview", href: "/teacher", isActive: true },
  { label: "New letter", href: "/teacher/new-letter", isActive: false },
  { label: "History", href: "/teacher/history", isActive: false },
  { label: "Pending", href: "/teacher/pending", isActive: false },
];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
  };

  const recentLetters: LetterItem[] = [
    {
      id: "1",
      title: "Surat Undangan Rapat Orang Tua",
      recipient: "Wali Murid Kelas X",
      date: "2026-07-28",
      status: "approved",
      authorUsername: "teacher_dev",
    },
    {
      id: "2",
      title: "Surat Tugas Pendampingan Lomba",
      recipient: "Bpk. Ahmad Suherman",
      date: "2026-07-25",
      status: "pending",
      authorUsername: "teacher_dev",
    },
    {
      id: "3",
      title: "Surat Keterangan Aktif Mengajar",
      recipient: "Dinas Pendidikan",
      date: "2026-07-20",
      status: "approved",
      authorUsername: "teacher_dev",
    },
  ];

  const filteredLetters = recentLetters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome back, <span className="italic">{mockUser.name}</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1 font-sans">
            Here is a summary of your letter activities today.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Create Letter */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
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
              href="/new-letter"
              className="w-full text-center py-2.5 px-4 rounded-2xl bg-[#0A4D3C] text-white font-medium text-sm hover:bg-[#07382c] active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              Start Creating →
            </Link>
          </div>

          {/* Card 2: Pending Approvals */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-stone-400 font-sans tracking-wider">
                PENDING APPROVALS
              </span>
              <div className="text-3xl font-bold text-stone-900 mt-1 font-sans">
                3
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Letters waiting for signature or review.
              </p>
            </div>

            <Link
              href="/pending"
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              View Pending
            </Link>
          </div>

          {/* Card 3: Total Generated */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-stone-400 font-sans tracking-wider">
                TOTAL GENERATED
              </span>
              <div className="text-3xl font-bold text-stone-900 mt-1 font-sans">
                24
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Completed and saved letters in your archive.
              </p>
            </div>

            <Link
              href="/history"
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-95 transition-all font-sans cursor-pointer relative z-20 block"
            >
              Open History
            </Link>
          </div>
        </div>

        {/* Recent Letters Section */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-serif font-semibold text-stone-900">
              Recent Letters
            </h2>

            {/* Connected Search Bar */}
            <div className="w-full md:w-72">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search letter title..."
              />
            </div>
          </div>

          <RecentLetterList letters={filteredLetters} />
        </div>

        {/* Admin Broadcast Notice Box */}
        {adminNotice && (
          <div className="bg-white border border-stone-300 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white font-bold text-base shrink-0 shadow-xs">
              !
            </div>
            <div className="text-sm font-sans text-stone-800 leading-relaxed">
              <span className="font-bold text-stone-900 mr-1">Admin:</span>
              {adminNotice}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}