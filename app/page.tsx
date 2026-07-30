"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { RecentLetterList } from "@/components/organisms/RecentLetterList";

// Define the shape locally so we don't need any fragile type imports
type LetterItem = {
  id: string;
  title: string;
  recipient: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  authorUsername: string;
};

export default function OverviewPage() {
  const router = useRouter();

  const navItems = [
    { label: "Overview", href: "/", isActive: true },
    { label: "New letter", href: "/new-letter", isActive: false },
    { label: "History", href: "/history", isActive: false },
    { label: "Pending", href: "/pending", isActive: false },
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

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-8">
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
              href="/new-letter"
              className="w-full text-center py-2.5 px-4 rounded-2xl bg-[#0A4D3C] text-white font-medium text-sm hover:bg-[#07382c] transition-colors font-sans"
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
                3
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Letters waiting for signature or review.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/pending")}
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 transition-colors font-sans"
            >
              View Pending
            </button>
          </div>

          {/* Card 3: Total Generated */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
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

            <button
              type="button"
              onClick={() => router.push("/history")}
              className="w-full text-center py-2.5 px-4 rounded-2xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-50 transition-colors font-sans"
            >
              Open History
            </button>
          </div>
        </div>

        {/* Recent Letters Section */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold text-stone-900">
              Recent Letters
            </h2>
            <Link
              href="/history"
              className="text-xs text-stone-500 hover:text-stone-900 underline font-sans"
            >
              View All
            </Link>
          </div>

          <RecentLetterList letters={recentLetters} />
        </div>
      </div>
    </DashboardLayout>
  );
};