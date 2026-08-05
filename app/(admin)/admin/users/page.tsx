"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "Teacher" | "Admin";
  lastLogin: string;
  avatarUrl?: string;
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
    { label: "Add template", href: "/admin/templates/add" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "2", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "3", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "4", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "5", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "6", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "7", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "8", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "9", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
    { id: "10", name: "UsernameUsername", username: "UsernameUsername", email: "@EmailEmailEmailEmail", role: "Teacher", lastLogin: "01/01/26" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Checkbox handlers
  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((user) => !selectedUserIds.includes(user.id)));
    setSelectedUserIds([]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setSelectedUserIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleRoleChange = (userId: string, newRole: "Teacher" | "Admin") => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
    setEditingRoleId(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Tab Header */}
        <div className="border-b border-stone-800 pb-2">
          <span className="font-serif text-2xl text-stone-900 border-b-2 border-stone-900 pb-2">
            All Users
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button className="px-4 py-2 bg-white border border-stone-800 rounded-lg text-stone-900 font-serif text-base hover:bg-stone-100 transition-colors cursor-pointer">
            Add New User
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedUserIds.length === 0}
            className="px-4 py-2 bg-white border border-stone-800 rounded-lg text-stone-900 font-serif text-base hover:bg-stone-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Delete Selected
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-4 pr-9 bg-white border border-stone-800 rounded-lg font-serif text-base text-stone-800 placeholder-stone-400 focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-stone-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-stone-100 border border-stone-300 rounded-full font-serif text-stone-900 text-lg">
          <div className="col-span-6 pl-12">User</div>
          <div className="col-span-3 text-center flex items-center justify-center gap-1">
            Role <span className="text-xs">⌄</span>
          </div>
          <div className="col-span-3 text-center flex items-center justify-center gap-1">
            Last login <span className="text-xs">⌄</span>
          </div>
        </div>

        {/* User Rows */}
        <div className="flex flex-col">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 items-center p-3.5 bg-white border border-stone-800 rounded-none -mt-px first:mt-0 font-serif text-base relative"
            >
              {/* User Checkbox, Avatar, Name & Email */}
              <div className="col-span-6 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                  className="w-5 h-5 border-stone-800 rounded cursor-pointer accent-stone-800"
                />
                <div className="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center shrink-0 text-stone-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-stone-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="font-serif text-xs text-stone-600">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Role Display */}
              <div className="col-span-3 text-center font-serif text-stone-900">
                {user.role}
              </div>

              {/* Last Login & Action Icons */}
              <div className="col-span-3 flex items-center justify-between pl-4 relative">
                <span className="font-serif text-stone-900">{user.lastLogin}</span>

                <div className="flex items-center gap-2 pr-2 relative">
                  {/* Edit Role Pencil Icon */}
                  <button
                    onClick={() =>
                      setEditingRoleId(editingRoleId === user.id ? null : user.id)
                    }
                    className="p-1 hover:text-stone-600 transition-colors cursor-pointer"
                    title="Change Role"
                  >
                    <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* Role Selector Popover */}
                  {editingRoleId === user.id && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-stone-800 rounded-lg shadow-lg z-30 overflow-hidden font-serif text-sm flex flex-col w-28">
                      <button
                        onClick={() => handleRoleChange(user.id, "Teacher")}
                        className={`px-3 py-1.5 text-left hover:bg-stone-100 transition-colors border-b border-stone-100 ${
                          user.role === "Teacher" ? "font-bold text-stone-900" : "text-stone-600"
                        }`}
                      >
                        Teacher
                      </button>
                      <button
                        onClick={() => handleRoleChange(user.id, "Admin")}
                        className={`px-3 py-1.5 text-left hover:bg-stone-100 transition-colors ${
                          user.role === "Admin" ? "font-bold text-stone-900" : "text-stone-600"
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
                    <svg className="w-5 h-5 text-stone-900 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-stone-500 font-serif text-lg">
              No users found.
            </div>
          )}
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
    </DashboardLayout>
  );
}