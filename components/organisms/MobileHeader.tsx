"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NavItem } from "./Sidebar";

interface MobileHeaderProps {
  navItems?: NavItem[];
  adminTools?: NavItem[];
}

export function MobileHeader({ navItems = [], adminTools = [] }: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");
  const homeHref = isAdminRoute ? "/admin" : "/";

  // Fallback items if navItems isn't passed
  const defaultTeacherItems: NavItem[] = [
    { label: "Overview", href: "/" },
    { label: "New Letter", href: "/new-letter" },
    { label: "History", href: "/history" },
    { label: "Pending", href: "/pending" },
  ];

  const defaultAdminItems: NavItem[] = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const defaultAdminToolsItems: NavItem[] = [
    { label: "Edit template", href: "/admin/templates/edit" },
    { label: "Add template", href: "/admin/templates/add" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const menuItems =
    navItems.length > 0
      ? navItems
      : isAdminRoute
      ? defaultAdminItems
      : defaultTeacherItems;

  const toolsItems =
    adminTools.length > 0
      ? adminTools
      : isAdminRoute
      ? defaultAdminToolsItems
      : [];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="w-full bg-[#FDF8F5] border-b border-stone-200 px-4 py-3 flex flex-col gap-1 md:hidden sticky top-0 z-100 shrink-0 select-none">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 w-full">
          <h1
            onClick={() => router.push(homeHref)}
            className="text-lg font-serif font-bold text-stone-900 cursor-pointer shrink-0 py-1"
          >
            Let2Kop
          </h1>

          <div className="flex items-center gap-3 shrink-0 flex-nowrap z-100">
            {/* Profile Avatar */}
            <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center border border-stone-400 shrink-0">
              <svg
                className="w-4 h-4 text-stone-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {/* Log Out */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-xs font-serif font-semibold text-stone-900 hover:text-red-600 transition-colors whitespace-nowrap py-1 px-1 cursor-pointer active:opacity-70"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Main Menu Dropdown Trigger */}
        <div className="relative z-100">
          <button
            type="button"
            onClick={handleToggle}
            style={{ touchAction: "manipulation" }}
            className="text-sm font-serif text-stone-800 flex items-center gap-1.5 py-1.5 pr-4 focus:outline-none cursor-pointer active:opacity-70"
          >
            <span>Main menu</span>
            <span
              className={`transition-transform duration-200 text-xs ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>

          {isMenuOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-56 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-101"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Nav Section */}
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-serif transition-colors ${
                      isActive
                        ? "bg-stone-100 font-bold text-stone-900"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Admin Tools Section */}
              {toolsItems.length > 0 && (
                <>
                  <div className="my-1.5 border-t border-stone-200" />
                  <div className="px-4 py-1 text-[11px] font-serif uppercase tracking-wider text-stone-400 font-bold">
                    Admin Tools
                  </div>
                  {toolsItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-serif transition-colors ${
                          isActive
                            ? "bg-stone-100 font-bold text-stone-900"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Outside Tap Area to Close Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-90 bg-transparent md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}