"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Avatar } from "@/components/atoms/Avatar";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "ADMIN" | string;
  image?: string | null;
  createdAt?: string;
}

export default function UserManagementPage() {
  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users", isActive: true },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ADMIN" | "TEACHER">("ALL");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Add User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newRole, setNewRole] = useState<"TEACHER" | "ADMIN">("TEACHER");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch users from API on mount
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Modal Submit (Create User)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
          image: newImageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Failed to create user");
        setSubmitting(false);
        return;
      }

      // Reset form & close modal
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewImageUrl("");
      setNewRole("TEACHER");
      setIsModalOpen(false);

      // Refresh table
      fetchUsers();
    } catch (err) {
      setModalError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Checkbox handlers
  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete User Handlers
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setSelectedUserIds((prev) => prev.filter((itemId) => itemId !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Delete ${selectedUserIds.length} selected users?`)) return;

    for (const id of selectedUserIds) {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    }
    fetchUsers();
    setSelectedUserIds([]);
  };

  // Role Change Handler
  const handleRoleChange = async (userId: string, newRole: "TEACHER" | "ADMIN") => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
        );
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
    setEditingRoleId(null);
  };

  // Filter users by both Role Tabs (ALL / ADMIN / TEACHER) and Search Query
  const filteredUsers = users.filter((u) => {
    const matchesTab =
      activeTab === "ALL" || u.role.toUpperCase() === activeTab;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-5xl mx-auto w-full overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-normal text-stone-900">
            Welcome, <span className="italic">Admin</span>
          </h1>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-300 text-stone-700 shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* Role Navigation Tabs */}
        <div className="flex border-b border-stone-800 gap-8">
          {(["ALL", "ADMIN", "TEACHER"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-serif text-2xl transition-colors relative cursor-pointer ${
                activeTab === tab
                  ? "text-stone-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-stone-900"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              {tab === "ALL" ? "All Users" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white border border-stone-800 rounded-lg text-stone-900 font-serif text-base hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Add New User
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedUserIds.length === 0}
            className="px-4 py-2 bg-white border border-stone-800 rounded-lg text-stone-900 font-serif text-base hover:bg-stone-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Delete Selected
          </button>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto py-2 pl-4 pr-9 bg-white border border-stone-800 rounded-lg font-serif text-base text-stone-800 placeholder-stone-400 focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-stone-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Horizontal Scroll Area for Table Content */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-150 flex flex-col">
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-stone-100 border border-stone-300 rounded-full font-serif text-stone-900 text-lg mb-2">
              <div className="col-span-6 pl-12">User</div>
              <div className="col-span-3 text-center flex items-center justify-center gap-1">
                Role <span className="text-xs">⌄</span>
              </div>
              <div className="col-span-3 text-center flex items-center justify-center gap-1">
                Created At <span className="text-xs">⌄</span>
              </div>
            </div>

            {/* User Rows */}
            <div className="flex flex-col">
              {loading ? (
                <div className="text-center py-12 text-stone-500 font-serif text-lg border border-stone-800">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-stone-500 font-serif text-lg border border-stone-800">
                  No users found in database.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 items-center p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 font-serif text-base relative"
                  >
                    {/* User Checkbox, Avatar, Name & Email */}
                    <div className="col-span-6 flex items-center gap-4 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-5 h-5 border-stone-800 rounded cursor-pointer accent-stone-800 shrink-0"
                      />
                      <div className="shrink-0">
                        <Avatar src={user.image || undefined} alt={user.name} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 truncate">
                        <span className="font-serif font-bold text-stone-900 leading-tight truncate">
                          {user.name}
                        </span>
                        <span className="font-serif text-xs text-stone-600 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Role Display */}
                    <div className="col-span-3 text-center font-serif text-stone-900 truncate px-1 capitalize">
                      {user.role.toLowerCase()}
                    </div>

                    {/* Created Date & Action Icons */}
                    <div className="col-span-3 flex items-center justify-between pl-4 relative shrink-0">
                      <span className="font-serif text-stone-900 text-sm whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>

                      <div className="flex items-center gap-2 pr-2 relative shrink-0">
                        {/* Edit Role Pencil Icon */}
                        <button
                          onClick={() =>
                            setEditingRoleId(editingRoleId === user.id ? null : user.id)
                          }
                          className="p-1 hover:text-stone-600 transition-colors cursor-pointer"
                          title="Change Role"
                        >
                          <svg
                            className="w-5 h-5 text-stone-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        {/* Role Selector Popover */}
                        {editingRoleId === user.id && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-stone-800 rounded-lg shadow-lg z-30 overflow-hidden font-serif text-sm flex flex-col w-28">
                            <button
                              onClick={() => handleRoleChange(user.id, "TEACHER")}
                              className={`px-3 py-1.5 text-left hover:bg-stone-100 transition-colors border-b border-stone-100 ${
                                user.role === "TEACHER"
                                  ? "font-bold text-stone-900"
                                  : "text-stone-600"
                              }`}
                            >
                              Teacher
                            </button>
                            <button
                              onClick={() => handleRoleChange(user.id, "ADMIN")}
                              className={`px-3 py-1.5 text-left hover:bg-stone-100 transition-colors ${
                                user.role === "ADMIN"
                                  ? "font-bold text-stone-900"
                                  : "text-stone-600"
                              }`}
                            >
                              Admin
                            </button>
                          </div>
                        )}

                        {/* Delete Trash Icon */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <svg
                            className="w-5 h-5 text-stone-900 hover:text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination Bottom */}
        <div className="flex justify-center items-center gap-2 pt-4">
          {["01", "02", "03"].map((pageNum, idx) => {
            const pageInt = idx + 1;
            const isActive = currentPage === pageInt;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageInt)}
                className={`px-3 py-1 font-serif text-lg border ${
                  isActive
                    ? "border-stone-900 text-stone-900 font-bold bg-stone-100"
                    : "border-stone-300 text-stone-400 hover:text-stone-900"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- ADD NEW USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-stone-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 font-serif">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-bold text-stone-900">Add New User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-500 hover:text-stone-800 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. teacher@school.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Profile Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "TEACHER" | "ADMIN")}
                  className="w-full px-3 py-2 border border-stone-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 border border-stone-400 rounded-lg hover:bg-stone-100 font-serif cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2 bg-black text-white rounded-lg hover:bg-stone-800 font-serif disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Creating..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}