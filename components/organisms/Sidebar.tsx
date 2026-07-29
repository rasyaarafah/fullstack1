import React from "react";
import { Avatar } from "../atoms/Avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  currentUser?: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  onNavigate?: (href: string) => void;
}

export const Sidebar = ({
  navItems,
  currentUser,
  onNavigate,
}: SidebarProps) => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-black/10 flex flex-col justify-between p-4 sticky top-0">
      {/* Brand & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg">
            2K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-black tracking-tight">
              Let2Kop
            </span>
            <span className="text-[10px] text-gray-400 -mt-1 font-medium">
              Generator Kop Surat
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all w-full text-left cursor-pointer ${
                item.isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer & User Profile */}
      {currentUser && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-black/10 bg-gray-50">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-black truncate">
              {currentUser.name}
            </span>
            <span className="text-xs text-gray-400 truncate">
              @{currentUser.username}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};