"use client";

import React, { useState } from "react";
import { UserRowItem } from "../molecules/UserRowItem";
import { SearchBar } from "../molecules/SearchBar";
import { ScrollContainer } from "../atoms/ScrollContainer";

export interface UserData {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: "Admin" | "Pembuat";
  avatarUrl?: string;
}

interface UserListTableProps {
  users: UserData[];
  onChangeRole: (userid: string) => void;
  onRemoveAccess: (userid: string) => void;
}

export const UserlistTable = ({
  users,
  onChangeRole,
  onRemoveAccess,
}: UserListTableProps) => {
  const [searchTerm, setSearchterm] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Header */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchterm(e.target.value)}
          placeholder="Cari user berdasarkan nama atau username..."
        />
      </div>

      {/* User Scrollable List */}
      <ScrollContainer maxHeight="max-h-[calc(100vh-250px)]">
        {/* Horizontal overflow wrapper for small screens */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex flex-col gap-2.5 min-w-125 pr-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRowItem
                  key={user.id}
                  name={user.name}
                  username={user.username}
                  email={user.email}
                  role={user.role}
                  avatarUrl={user.avatarUrl}
                  onChangeRole={() => onChangeRole(user.id)}
                  onRemoveAccess={() => onRemoveAccess(user.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
                User tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </ScrollContainer>
    </div>
  );
};