"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  navItems?: NavItem[];
  adminTools?: NavItem[];
  onLogout?: () => void;
  onItemClick?: () => void;
}

export const Sidebar = ({
  navItems = [],
  adminTools = [],
  onLogout,
  onItemClick,
}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  const basePath = isAdminRoute ? "/admin/new-letter" : "/new-letter";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push("/login");
    }
  };

  const quickCreateItems = [
    { label: "Surat undangan", template: "Surat undangan" },
    { label: "Surat tugas", template: "Surat tugas" },
    { label: "Surat keterangan", template: "Surat keterangan" },
    { label: "Surat keputusan", template: "Surat keputusan" },
    { label: "Surat pemberitahuan", template: "Surat pemberitahuan" },
  ];

  const checkIsActive = (item: NavItem) => {
    if (typeof item.isActive === "boolean") return item.isActive;
    if (!pathname) return false;
    return item.href === "/admin" || item.href === "/"
      ? pathname === item.href
      : pathname.startsWith(item.href);
  };

  return (
    // FIXED: Changed `min-h-screen` to `h-full overflow-y-auto`
    <aside className="w-64 bg-white border-r border-stone-200 h-full overflow-y-auto flex flex-col justify-between p-6 shrink-0 font-sans">
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          Let2Kop
        </div>

        {/* Main Menu Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Main menu
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = checkIsActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`px-3 py-1.5 rounded-md text-base transition-colors ${
                    active
                      ? "bg-[#0A4D3C] text-white font-medium"
                      : "text-stone-400 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Create Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Quick create
          </span>
          <div className="flex flex-col gap-1 pl-3">
            {quickCreateItems.map((item) => {
              const href = `${basePath}?template=${encodeURIComponent(
                item.template
              )}`;
              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={onItemClick}
                  className="text-left text-base text-stone-400 hover:text-stone-900 transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin Tools Section */}
        {adminTools.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Admin tools
            </span>
            <nav className="flex flex-col gap-1">
              {adminTools.map((tool) => {
                const active = checkIsActive(tool);
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={onItemClick}
                    className={`px-3 py-1.5 rounded-md text-base transition-colors ${
                      active
                        ? "bg-[#0A4D3C] text-white font-medium"
                        : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    {tool.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="text-left text-base font-bold text-stone-900 hover:text-red-600 transition-colors pt-4 cursor-pointer"
      >
        Log out
      </button>
    </aside>
  );
};