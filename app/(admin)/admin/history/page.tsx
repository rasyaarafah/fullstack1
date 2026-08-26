"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface ArchiveLetter {
  id: string;
  username: string;
  title: string;
  date: string;
  status: "approved" | "pending" | "rejected" | "revise";
}

export default function ArchivePage() {
  const router = useRouter();

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
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [letters, setLetters] = useState<ArchiveLetter[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch letters and exclude "DRAFT" from Admin view
  useEffect(() => {
    async function fetchAdminLetters() {
      try {
        const res = await fetch("/api/letters", {
          cache: "no-store",
        });
        if (res.ok) {
          const rawData = await res.json();
          const formatted: ArchiveLetter[] = rawData
            .filter((item: any) => item.status.toLowerCase() !== "draft")
            .map((item: any) => {
              const authorName =
                item.author?.name ||
                item.author?.username ||
                (item.author?.email ? item.author.email.split("@")[0] : "admin");

              const formattedStatus = item.status.toLowerCase() as ArchiveLetter["status"];

              return {
                id: item.id,
                username: authorName,
                title: item.title,
                status: formattedStatus,
                date: new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }),
              };
            });
          setLetters(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch archive letters:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminLetters();
  }, []);

  // Delete letter from database
  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this archived letter?")) return;

    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLetters((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete letter from backend");
      }
    } catch (err) {
      console.error("Error deleting letter:", err);
    }
  };

  // Status Dot Color Helper
  const getStatusColor = (status: ArchiveLetter["status"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-rose-500";
      case "revise":
        return "bg-orange-400";
      default:
        return "bg-stone-300";
    }
  };

  // Filter Logic by Search & Status Dropdown
  const filteredLetters = letters.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

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

        {/* Search Input & Status Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-6 bg-white border border-stone-800 rounded-full text-center sm:text-left text-stone-600 placeholder-stone-400 font-sans text-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 bg-white border border-stone-800 rounded-full font-serif text-base text-stone-900 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="revise">Revise</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Archive List */}
        <div className="flex flex-col">
          {loading ? (
            <div className="text-center py-12 text-stone-500 font-serif text-lg">
              Loading archived letters...
            </div>
          ) : filteredLetters.length > 0 ? (
            filteredLetters.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 font-serif text-base"
              >
                {/* Item Details */}
                <div className="flex items-center gap-1 text-stone-900 flex-wrap">
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

                {/* Action Buttons & Dynamic Status Dot */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0 self-end sm:self-center">
                  {/* Dynamic Color Status Dot */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 ${getStatusColor(
                      item.status
                    )}`}
                    title={`Status: ${item.status}`}
                  />

                  {/* See Button */}
                  <button
                    onClick={() =>
                      router.push(`/admin/templates/preview/${item.id}`)
                    }
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
            ))
          ) : (
            <div className="text-center py-12 text-stone-500 font-serif text-lg">
              No archived letters found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}