"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface ArchiveLetter {
  id: number;
  username: string;
  title: string;
  date: string;
}

export default function ArchivePage() {
  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history", isActive: true },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [letters, setLetters] = useState<ArchiveLetter[]>([
    { id: 1, username: "useruseruser", title: "surat izin kegiatan", date: "07/1/2026" },
    { id: 2, username: "useruseruser", title: "surat izin kegiatan", date: "07/2/2026" },
    { id: 3, username: "useruseruser", title: "surat izin kegiatan", date: "07/3/2026" },
    { id: 4, username: "useruseruser", title: "surat izin kegiatan", date: "07/4/2026" },
    { id: 5, username: "useruseruser", title: "surat izin kegiatan", date: "07/5/2026" },
    { id: 6, username: "useruseruser", title: "surat izin kegiatan", date: "07/6/2026" },
    { id: 7, username: "useruseruser", title: "surat izin kegiatan", date: "07/7/2026" },
    { id: 8, username: "useruseruser", title: "surat izin kegiatan", date: "07/8/2026" },
  ]);

  const handleRemove = (id: number) => {
    setLetters((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredLetters = letters.filter(
    (item) =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery)
  );

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-5xl mx-auto">
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

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-6 bg-white border border-stone-800 rounded-full text-center text-stone-600 placeholder-stone-400 font-sans text-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
          />
        </div>

        {/* Archive List */}
        <div className="flex flex-col">
          {filteredLetters.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 font-serif text-base"
            >
              {/* Item Details */}
              <div className="flex items-center gap-1 text-stone-900">
                <span className="font-sans font-normal text-stone-900">
                  @{item.username},
                </span>{" "}
                <span className="font-serif font-semibold text-stone-900">
                  {item.title},
                </span>{" "}
                <span className="font-serif font-semibold text-stone-900">
                  {item.date}
                </span>
              </div>

              {/* Action Buttons & Status Dot */}
              <div className="flex items-center gap-3 mt-2 sm:mt-0 self-end sm:self-center">
                {/* Green Status Dot */}
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />

                {/* See Button */}
                <button
                  onClick={() => console.log("See letter", item.id)}
                  className="px-4 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 font-serif text-base transition-colors"
                >
                  See
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-3 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 font-serif text-base transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {filteredLetters.length === 0 && (
            <div className="text-center py-12 text-stone-500 font-serif text-lg">
              No archived letters found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}