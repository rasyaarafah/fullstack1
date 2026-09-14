"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface PopularTemplate {
  id: string;
  title: string;
  usageCount: number;
}

interface SidebarProps {
  navItems?: NavItem[];
  adminTools?: NavItem[];
  currentUser?: {
    name: string;
    username: string;
    image?: string; // Updated from avatarUrl to image
  };
  onProfileClick?: () => void;
  onLogout?: () => void;
  onItemClick?: () => void;
}

export const Sidebar = ({
  navItems = [],
  adminTools = [],
  currentUser,
  onProfileClick,
  onLogout,
  onItemClick,
}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  const basePath = isAdminRoute ? "/admin/new-letter" : "/teacher/new-letter";

  const [quickCreateItems, setQuickCreateItems] = useState<PopularTemplate[]>([]);
  const [isLoadingQuickCreate, setIsLoadingQuickCreate] = useState(true);

  useEffect(() => {
    async function fetchPopularTemplates() {
      try {
        const res = await fetch("/api/templates/popular?limit=5");
        if (res.ok) {
          const data: PopularTemplate[] = await res.json();
          setQuickCreateItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch popular templates for sidebar:", err);
      } finally {
        setIsLoadingQuickCreate(false);
      }
    }
    fetchPopularTemplates();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      if (onLogout) {
        onLogout();
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkIsActive = (item: NavItem) => {
    if (typeof item.isActive === "boolean") return item.isActive;
    if (!pathname) return false;
    return item.href === "/admin" || item.href === "/"
      ? pathname === item.href
      : pathname.startsWith(item.href);
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200 h-full overflow-y-auto flex flex-col justify-between p-6 shrink-0 font-sans">
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Top Right Avatar */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Let2Kop
          </div>
          <button
            onClick={onProfileClick}
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
            title="Edit Profile"
          >
            {/* Updated src prop to use currentUser.image */}
            <Avatar src={currentUser?.image} size="md" />
          </button>
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

        {/* Quick Create Section — real, usage-ranked templates */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Quick create
          </span>
          <div className="flex flex-col gap-1 pl-3">
            {isLoadingQuickCreate ? (
              <span className="text-base text-stone-300">Loading...</span>
            ) : quickCreateItems.length === 0 ? (
              <span className="text-base text-stone-300">No templates yet</span>
            ) : (
              quickCreateItems.map((item) => {
                const href = `${basePath}?template=${encodeURIComponent(
                  item.title
                )}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={onItemClick}
                    className="text-left text-base text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    {item.title}
                  </Link>
                );
              })
            )}
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