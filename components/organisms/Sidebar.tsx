import React from "react";
import Link from "next/link";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  navItems?: NavItem[];
  onLogout?: () => void;
}

export const Sidebar = ({ navItems = [], onLogout }: SidebarProps) => {
  // Quick create links from Figma design
  const quickCreateItems = [
    "Surat undangan",
    "Surat tugas",
    "Surat keterangan",
    "Surat keputusan",
    "Surat pemberitahuan",
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 h-screen flex flex-col justify-between p-6 shrink-0">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          Let2Kop
        </div>

        {/* Main Menu Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Main menu
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive
                    ? "bg-[#0A4D3C] text-white"
                    : "text-stone-400 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Create Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Quick create
          </span>
          <div className="flex flex-col gap-1.5 pl-2">
            {quickCreateItems.map((item, idx) => (
              <button
                key={idx}
                className="text-left text-sm text-stone-400 hover:text-stone-900 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log out at the bottom */}
      <button
        onClick={onLogout}
        className="text-left text-sm font-semibold text-stone-900 hover:text-red-600 transition-colors pt-4 border-t border-stone-100"
      >
        Log out
      </button>
    </aside>
  );
};