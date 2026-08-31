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

  const [currentUser, setCurrentUser] = useState({ name: "Admin", email: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [letters, setLetters] = useState<ArchiveLetter[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [itemToDelete, setItemToDelete] = useState<ArchiveLetter | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Fetch session & archive letters
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setCurrentUser({
            name: user.name || "Admin",
            email: user.email || "",
            image: user.image || user.avatarUrl || "",
          });
        }
      } catch (err) {
        console.error("Session error:", err);
      }
    }

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

    initSession();
    fetchAdminLetters();
  }, []);

  // Delete individual letter
  const confirmSingleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/letters/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLetters((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      } else {
        console.error("Failed to delete letter from backend");
      }
    } catch (err) {
      console.error("Error deleting letter:", err);
    } finally {
      setItemToDelete(null);
    }
  };

  // Bulk delete / Clear history
  const confirmClearHistory = async () => {
    try {
      const idsToDelete = filteredLetters.map((item) => item.id);

      // Perform deletion calls for displayed letters
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/letters/${id}`, { method: "DELETE" })
        )
      );

      setLetters((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    } catch (err) {
      console.error("Error clearing history:", err);
    } finally {
      setShowClearModal(false);
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
      <div className="space-y-6 max-w-5xl mx-auto font-serif">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-normal text-stone-900">
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

        {/* Search Input, Filter, & Clear History Action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-2/3 py-3 px-6 bg-white border border-stone-800 rounded-full text-center sm:text-left text-stone-600 placeholder-stone-400 font-sans text-base focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-stone-800 rounded-full text-base text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="revise">Revise</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {filteredLetters.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="w-full sm:w-auto px-5 py-3 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 text-base transition-colors shrink-0"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Archive List */}
        <div className="flex flex-col">
          {loading ? (
            <div className="text-center py-12 text-stone-500 text-lg">
              Loading archived letters...
            </div>
          ) : filteredLetters.length > 0 ? (
            filteredLetters.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 text-base"
              >
                {/* Item Details */}
                <div className="flex items-center gap-1 text-stone-900 flex-wrap">
                  <span className="font-sans font-normal text-stone-900">
                    @{item.username},
                  </span>{" "}
                  <span className="font-semibold text-stone-900">
                    {item.title},
                  </span>{" "}
                  <span className="font-semibold text-stone-900">
                    {item.date}
                  </span>
                </div>

                {/* Action Buttons & Dynamic Status Dot */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0 self-end sm:self-center">
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 ${getStatusColor(
                      item.status
                    )}`}
                    title={`Status: ${item.status}`}
                  />

                  <button
                    onClick={() =>
                      router.push(`/admin/templates/preview/${item.id}`)
                    }
                    className="px-4 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 text-base transition-colors cursor-pointer"
                  >
                    See
                  </button>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="px-3 py-1 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 text-base transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-500 text-lg border border-stone-800 bg-white">
              No archived letters found.
            </div>
          )}
        </div>
      </div>

      {/* Single Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-800 p-6 max-w-md w-full flex flex-col gap-4 font-serif">
            <div>
              <h3 className="text-xl text-stone-900">Confirm Deletion</h3>
              <p className="text-stone-600 text-sm mt-2 font-sans">
                Are you sure you want to delete the letter entry for{" "}
                <span className="font-semibold text-stone-900">
                  @{itemToDelete.username} ({itemToDelete.title})
                </span>
                ? This operation cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-1.5 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSingleDelete}
                className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-800 p-6 max-w-md w-full flex flex-col gap-4 font-serif">
            <div>
              <h3 className="text-xl text-stone-900">Clear History</h3>
              <p className="text-stone-600 text-sm mt-2 font-sans">
                Are you sure you want to remove all{" "}
                <span className="font-semibold text-stone-900">
                  {filteredLetters.length}
                </span>{" "}
                currently displayed records from the history?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-1.5 bg-white border border-stone-800 text-stone-900 hover:bg-stone-100 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearHistory}
                className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 text-sm transition-colors"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}