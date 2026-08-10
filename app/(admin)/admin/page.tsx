"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

// Custom Admin Stat Card
const AdminStatCard = ({ count, label }: { count: number | string; label: string }) => (
  <div className="flex flex-col justify-between h-36 bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
    <span className="font-serif text-5xl font-light text-stone-900">{count}</span>
    <span className="font-serif text-sm text-stone-600 font-light">{label}</span>
  </div>
);

// Quick Create Dropdown Card
const QuickCreateDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    "Surat undangan",
    "Surat tugas",
    "Surat keterangan",
    "Surat keputusan",
    "Surat pemberitahuan",
  ];

  return (
    <div className="relative h-36">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between bg-white border border-stone-200 rounded-3xl p-5 shadow-sm cursor-pointer hover:bg-stone-50 transition-colors"
      >
        <span className="font-serif text-2xl font-light text-stone-900">Quick create</span>
        <svg
          className={`w-5 h-5 text-stone-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-full bg-white border border-stone-300 rounded-2xl shadow-lg z-20 overflow-hidden font-serif">
          <div
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between p-4 border-b border-stone-200 cursor-pointer text-xl"
          >
            <span>Quick create</span>
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="divide-y divide-stone-200 text-lg">
            {templates.map((title) => (
              <Link
                key={title}
                href={`/admin/new-letter?template=${encodeURIComponent(title)}`}
                className="block p-3 hover:bg-stone-50 text-stone-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Pending Queue Row with Actions Dropdown
const PendingQueueRow = ({
  username,
  title,
  date,
  status,
}: {
  username: string;
  title: string;
  date: string;
  status: string;
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-stone-100 last:border-none text-base relative">
      <p className="text-stone-900">
        <span className="font-sans text-stone-700">@{username}</span>,{" "}
        <span className="font-serif font-bold">{title}</span>,{" "}
        <span className="font-serif font-bold">{date}</span>,{" "}
        <span className="font-serif text-stone-500">({status})</span>
      </p>

      {/* Actions Button & Menu */}
      <div className="relative">
        <button
          onClick={() => setIsActionsOpen(!isActionsOpen)}
          className="flex items-center gap-1 font-serif text-lg text-stone-800 hover:text-black transition-colors"
        >
          Actions
          <svg
            className={`w-4 h-4 text-stone-600 transition-transform ${isActionsOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isActionsOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-stone-300 rounded-xl shadow-md z-30 font-serif text-base overflow-hidden">
            <button
              onClick={() => setIsActionsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Approve
            </button>
            <button
              onClick={() => setIsActionsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Revise
            </button>
            <button
              onClick={() => setIsActionsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Reject
            </button>
            <button
              onClick={() => setIsActionsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900"
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminOverviewPage() {
  const adminNavItems = [
    { label: "Overview", href: "/admin", isActive: true },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const pendingItems = [
    { id: 1, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 2, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 3, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 4, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 5, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 6, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 7, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
    { id: 8, username: "useruseruser", title: "surat izin kegiatan", date: "07/20/2026", status: "waiting" },
  ];

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-normal text-stone-900">
            Welcome, <span className="italic">Admin</span>
          </h1>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-300 text-stone-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* Top 4-card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard count={15} label="Pending approval" />
          <AdminStatCard count={420} label="Total letters approved" />
          <AdminStatCard count={21} label="Your letters" />
          <QuickCreateDropdown />
        </div>

        {/* Pending Queue List Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-normal text-stone-900 mb-2">
            Pending Queue (15)
          </h2>

          <div className="divide-y divide-stone-100">
            {pendingItems.map((item) => (
              <PendingQueueRow
                key={item.id}
                username={item.username}
                title={item.title}
                date={item.date}
                status={item.status}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}