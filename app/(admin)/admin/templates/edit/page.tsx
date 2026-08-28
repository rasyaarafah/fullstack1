"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
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

  const templates: TemplateItem[] = [
    {
      id: "surat-tugas",
      title: "Surat Tugas",
      category: "Formal",
      description: "Official assignment letter for staff or teachers traveling on duty.",
      lastUpdated: "2 days ago",
    },
    {
      id: "surat-keputusan",
      title: "Surat Keputusan (SK)",
      category: "Keputusan",
      description: "Formal decree document for organizational policy or role assignments.",
      lastUpdated: "1 week ago",
    },
    {
      id: "surat-undangan",
      title: "Surat Undangan",
      category: "Acara",
      description: "Invitation template for official school meetings and parents gathering.",
      lastUpdated: "3 days ago",
    },
    {
      id: "surat-keterangan",
      title: "Surat Keterangan Active",
      category: "Formal",
      description: "Statement letter certifying active student or employee status.",
      lastUpdated: "01/01/2026",
    },
  ];

  const categories = ["Semua", "Formal", "Keputusan", "Acara"];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || tpl.category === selectedCategory;
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
              Pilih template untuk mulai modifikasi
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          {/* Category Tabs */}
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

          {/* Search Box */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 bg-white border border-stone-800 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs px-2.5 py-0.5 rounded-full border border-stone-400 text-stone-700 bg-stone-50">
                    {template.category}
                  </span>
                  <span className="font-serif text-xs text-stone-500">
                    Updated {template.lastUpdated}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-stone-900 font-bold">
                  {template.title}
                </h3>
                <p className="font-serif text-sm text-stone-600 line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200 flex justify-end">
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
      </div>
    </DashboardLayout>
  );
}