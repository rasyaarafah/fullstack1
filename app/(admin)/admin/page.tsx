"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

// Interfaces
interface PendingLetter {
  id: string;
  title: string;
  createdAt: string;
  status: string;
  author?: {
    name?: string;
    username?: string;
    email?: string;
  };
}

interface AdminStats {
  pendingCount: number;
  approvedCount: number;
  myLettersCount: number;
}

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
  id,
  username,
  title,
  date,
  status,
  onStatusChange,
}: {
  id: string;
  username: string;
  title: string;
  date: string;
  status: string;
  onStatusChange: (id: string, newStatus: string) => void;
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleAction = (actionStatus: string) => {
    setIsActionsOpen(false);
    onStatusChange(id, actionStatus);
  };

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-stone-100 last:border-none text-base relative">
      <p className="text-stone-900">
        <span className="font-sans text-stone-700">@{username}</span>,{" "}
        <span className="font-serif font-bold">{title}</span>,{" "}
        <span className="font-serif font-bold">{date}</span>,{" "}
        <span className="font-serif text-stone-500">({status.toLowerCase()})</span>
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
              onClick={() => handleAction("APPROVED")}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("REVISION")}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Revise
            </button>
            <button
              onClick={() => handleAction("REJECTED")}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900 border-b border-stone-100"
            >
              Reject
            </button>
            <Link
              href={`/admin/letters/${id}`}
              className="block w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-900"
            >
              View
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminOverviewPage() {
  const [currentUser, setCurrentUser] = useState({ name: "Admin", email: "", image: "" });
  const [stats, setStats] = useState<AdminStats>({
    pendingCount: 0,
    approvedCount: 0,
    myLettersCount: 0,
  });
  const [pendingItems, setPendingItems] = useState<PendingLetter[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch Stats and Pending Data
  const loadDashboardData = async (userEmail?: string) => {
    try {
      setLoading(true);

      const [statsRes, pendingRes] = await Promise.all([
        fetch(`/api/stats${userEmail ? `?email=${userEmail}` : ""}`),
        fetch("/api/letters?status=PENDING"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          pendingCount: statsData.pendingCount || 0,
          approvedCount: statsData.approvedCount || 0,
          myLettersCount: statsData.myLettersCount || 0,
        });
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingItems(pendingData);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setCurrentUser({ 
            name: user.name || "Admin", 
            email: user.email, 
            image: user.image || user.avatarUrl || "" 
          });
          await loadDashboardData(user.email);
        } else {
          await loadDashboardData();
        }
      } catch (err) {
        console.error("Session error:", err);
        await loadDashboardData();
      }
    }

    initSession();
  }, []);

  // Handler for Actions (Approve, Revise, Reject)
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Remove item from pending list immediately
        setPendingItems((prev) => prev.filter((item) => item.id !== id));

        // Adjust local counters
        setStats((prev) => ({
          ...prev,
          pendingCount: Math.max(0, prev.pendingCount - 1),
          approvedCount: newStatus === "APPROVED" ? prev.approvedCount + 1 : prev.approvedCount,
        }));
      } else {
        alert("Gagal memperbarui status surat.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-normal text-stone-900">
            Welcome, <span className="italic">{currentUser.name}</span>
          </h1>
          <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 overflow-hidden flex items-center justify-center shrink-0">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-6 h-6 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
        </div>

        {/* Top 4-card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard count={loading ? "..." : stats.pendingCount} label="Pending approval" />
          <AdminStatCard count={loading ? "..." : stats.approvedCount} label="Total letters approved" />
          <AdminStatCard count={loading ? "..." : stats.myLettersCount} label="Your letters" />
          <QuickCreateDropdown />
        </div>

        {/* Pending Queue List Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-normal text-stone-900 mb-2">
            Pending Queue ({pendingItems.length})
          </h2>

          {loading ? (
            <div className="py-8 text-center text-stone-400 font-serif text-base">Loading data...</div>
          ) : pendingItems.length === 0 ? (
            <div className="py-8 text-center text-stone-400 font-serif text-base">
              Tidak ada antrean pending saat ini.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {pendingItems.map((item) => {
                const username =
                  item.author?.username ||
                  item.author?.name ||
                  (item.author?.email ? item.author.email.split("@")[0] : "useruseruser");

                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "07/20/2026";

                return (
                  <PendingQueueRow
                    key={item.id}
                    id={item.id}
                    username={username}
                    title={item.title}
                    date={formattedDate}
                    status={item.status === "PENDING" ? "waiting" : item.status}
                    onStatusChange={handleStatusUpdate}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}