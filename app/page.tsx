"use client";

import React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
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
  };

  const sampleLetters = [
    {
      id: "1",
      title: "Surat Izin kegiatan 07/20/2026",
      username: "@UserUserUser",
      statusText: "Pending (Need revision)",
      statusColor: "bg-red-500",
      type: "pending-revision",
    },
    {
      id: "2",
      title: "Surat Izin kegiatan 07/20/2026",
      username: "@UserUserUser",
      statusText: "Pending (Waiting approval)",
      statusColor: "bg-orange-500",
      type: "pending-approval",
    },
    {
      id: "3",
      title: "Surat Izin kegiatan 07/20/2026",
      username: "@UserUserUser",
      statusText: "(Approved)",
      statusColor: "bg-green-500",
      type: "approved",
    },
    {
      id: "4",
      title: "Surat Izin kegiatan 07/20/2026",
      username: "@UserUserUser",
      statusText: "(Approved)",
      statusColor: "bg-green-500",
      type: "approved",
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      currentUser={mockUser}
      title="Welcome, Teacher"
    >
      <div className="flex flex-col gap-6">
        {/* Top 3 Stat Cards + Pill Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full bg-white border border-stone-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="font-serif text-6xl text-stone-900">243</span>
              <span className="font-serif text-lg text-stone-700 mt-2">
                Letters made
              </span>
            </div>
            <button className="w-full max-w-50px py-2 px-4 rounded-full border border-stone-800 text-sm font-medium hover:bg-stone-100 transition-colors">
              Create new letter
            </button>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full bg-white border border-stone-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="font-serif text-6xl text-stone-900">241</span>
              <span className="font-serif text-lg text-stone-700 mt-2">
                Letters Approved
              </span>
            </div>
            <button className="w-full max-w-50px py-2 px-4 rounded-full border border-stone-800 text-sm font-medium hover:bg-stone-100 transition-colors">
              See history
            </button>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full bg-white border border-stone-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="font-serif text-6xl text-stone-900">2</span>
              <span className="font-serif text-lg text-stone-700 mt-2">
                Letters Pending
              </span>
            </div>
            <button className="w-full max-w-50px py-2 px-4 rounded-full border border-stone-800 text-sm font-medium hover:bg-stone-100 transition-colors">
              See status
            </button>
          </div>
        </div>

        {/* Recent Letters Section */}
        <div className="bg-white border border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-serif text-xl text-stone-800">Recent letters</h2>
          
          <div className="flex flex-col divide-y divide-stone-200">
            {sampleLetters.map((letter) => (
              <div
                key={letter.id}
                className="py-3 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <span className="font-serif text-base text-stone-900">
                    {letter.title}
                  </span>
                  <span className="text-sm text-stone-500">
                    {letter.username}, {letter.statusText}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Indicator Dot */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${letter.statusColor}`}
                  />

                  {/* Action Button Group */}
                  <div className="inline-flex rounded-md shadow-sm border border-stone-800 divide-x divide-stone-800 overflow-hidden text-xs">
                    <button className="px-3 py-1.5 hover:bg-stone-100 font-medium">
                      See
                    </button>
                    {letter.type === "approved" ? (
                      <button className="px-3 py-1.5 hover:bg-stone-100 font-medium">
                        Download PDF/DOCX
                      </button>
                    ) : (
                      <>
                        <button className="px-3 py-1.5 hover:bg-stone-100 font-medium">
                          Edit
                        </button>
                        <button className="px-3 py-1.5 hover:bg-stone-100 font-medium">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Notification Banner */}
        <div className="bg-white border border-stone-300 rounded-3xl p-4 shadow-sm flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-stone-800">
            <span className="font-bold">Admin:</span> Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}