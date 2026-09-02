"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface TemplateItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  lastUpdated?: string;
  updatedAt?: string;
}

export default function TemplateGalleryPage() {
  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: true },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const dbTemplates: TemplateItem[] = await res.json();
          setTemplates(dbTemplates);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic templates:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the template "${title}"?`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete template.");
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      alert("An error occurred while deleting the template.");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = [
    "Semua",
    ...Array.from(
      new Set(
        templates
          .map((tpl) => tpl.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const title = tpl.title || "";
    const description = tpl.description || "";
    const category = tpl.category || "Uncategorized";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <div className="space-y-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal text-stone-900">
              Edit <span className="italic">Templates</span>
            </h1>
            <p className="font-serif text-stone-600 text-sm mt-1">
              Pilih template untuk mulai modifikasi atau hapus
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 font-serif text-sm border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "border-stone-900 bg-stone-900 text-white font-medium"
                    : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 py-1.5 pl-3 pr-8 bg-white border border-stone-800 rounded-lg font-serif text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Template Grid */}
        {isLoading ? (
          <div className="p-8 text-center text-stone-500 font-serif text-sm">
            Loading templates gallery...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-5 bg-white border border-stone-800 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs px-2.5 py-0.5 rounded-full border border-stone-400 text-stone-700 bg-stone-50">
                      {template.category || "Uncategorized"}
                    </span>
                    <span className="font-serif text-xs text-stone-500">
                      {template.lastUpdated
                        ? `Updated ${template.lastUpdated}`
                        : template.updatedAt
                        ? `Updated ${new Date(template.updatedAt).toLocaleDateString()}`
                        : "Recently updated"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 font-bold">
                    {template.title}
                  </h3>
                  <p className="font-serif text-sm text-stone-600 line-clamp-2">
                    {template.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(template.id, template.title)}
                    disabled={deletingId === template.id}
                    className="px-3 py-2 border border-red-200 text-red-700 rounded-lg font-serif text-sm hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deletingId === template.id ? "Deleting..." : "Delete"}
                  </button>

                  <Link
                    href={`/admin/templates/edit/${template.id}`}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg font-serif text-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    Edit Template
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full text-center py-12 text-stone-500 font-serif border border-dashed border-stone-300 rounded-xl">
                No templates found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}