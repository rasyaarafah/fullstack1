"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Letterhead } from "@/components/molecules/Letterhead";

interface PlaceholderItem {
  label: string;
  key: string;
}

const DEFAULT_CATEGORIES = [
  "Surat Keterangan",
  "Surat Undangan",
  "Surat Tugas",
  "Surat Keputusan",
  "Surat Pemberitahuan",
];

export default function AddTemplatePage() {
  const router = useRouter();

  const [templateName, setTemplateName] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >(DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c })));
  const [category, setCategory] = useState("Surat Keterangan");
  const [description, setDescription] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("Text");
  const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([
    { label: "Nama Penerima", key: "nama_penerima" },
    { label: "Jabatan", key: "jabatan" },
  ]);
  const [bodyContent, setBodyContent] = useState(
    "Dengan ini menerangkan bahwa:\n\nNama: {{nama_penerima}}\nJabatan: {{jabatan}}\n\nTelah melaksanakan tugas dengan baik dan benar."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch unique categories from existing database templates on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) return;
        const templates = await res.json();

        if (Array.isArray(templates)) {
          const fetchedCategories = templates
            .map((t: any) => t.category)
            .filter((c: string): c is string => Boolean(c));

          // Combine default categories with database categories dynamically
          const combined = Array.from(
            new Set([...DEFAULT_CATEGORIES, ...fetchedCategories])
          );

          setCategoryOptions(
            combined.map((cat) => ({ value: cat, label: cat }))
          );
        }
      } catch (error) {
        console.error("Failed to load saved categories:", error);
      }
    }

    loadCategories();
  }, []);

  const handleCreateCategory = (inputValue: string) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newOption = { value: trimmed, label: trimmed };
    setCategoryOptions((prev) => {
      if (prev.some((opt) => opt.value === trimmed)) return prev;
      return [...prev, newOption];
    });
    setCategory(trimmed);
  };

  const handleAddPlaceholder = () => {
    if (!fieldLabel.trim()) return;
    const key = fieldLabel
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "_");

    if (placeholders.some((p) => p.key === key)) {
      setFieldLabel("");
      return;
    }

    setPlaceholders((prev) => [...prev, { label: fieldLabel, key }]);
    setFieldLabel("");
  };

  const handleRemovePlaceholder = (keyToRemove: string) => {
    setPlaceholders((prev) => prev.filter((p) => p.key !== keyToRemove));
  };

  const insertVariableToBody = (key: string) => {
    setBodyContent((prev) => `${prev} {{${key}}}`);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: templateName,
          category,
          description,
          placeholders,
          bodyContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to save template");

      router.push("/admin/templates/edit");
    } catch (err) {
      console.error(err);
      alert("Error saving template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin", isActive: false },
    { label: "Pending Approval", href: "/admin/pending", isActive: false },
    { label: "Archive", href: "/admin/history", isActive: false },
    { label: "User Management", href: "/admin/users", isActive: false },
    { label: "New letter", href: "/admin/new-letter", isActive: false },
  ];

  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: false },
    { label: "Add template", href: "/admin/templates/new", isActive: true },
    { label: "Broadcast notice", href: "/admin/notice", isActive: false },
  ];

  return (
    <DashboardLayout navItems={navItems} adminTools={adminTools}>
      <div className="flex flex-col gap-6">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Add New Template
            </h1>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Design a custom letter template and configure placeholders for user inputs.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-2xl border border-stone-400 bg-white text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-2xl bg-[#0A4D3C] text-white text-xs font-semibold hover:bg-[#07382c] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Template"}
            </button>
          </div>
        </div>

        {/* Form + Live Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Template Details */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <h2 className="font-serif font-bold text-stone-900 text-lg">
                Template Details
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  TEMPLATE NAME
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Surat Keterangan Active"
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    CATEGORY
                  </label>
                  <CreatableSelect
                    isClearable
                    options={categoryOptions}
                    value={
                      category
                        ? { value: category, label: category }
                        : null
                    }
                    onChange={(val) => setCategory(val ? val.value : "")}
                    onCreateOption={handleCreateCategory}
                    placeholder="Select or type new..."
                    className="text-xs"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "1rem",
                        borderColor: "#d6d3d1",
                        backgroundColor: "rgba(245, 245, 244, 0.5)",
                        padding: "2px",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#1c1917",
                        },
                      }),
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Custom Placeholders */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <div>
                <h2 className="font-serif font-bold text-stone-900 text-lg">
                  Custom Placeholders
                </h2>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                  Add dynamic fields that teachers or users will fill in. Click a variable tag to append it into your template body.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  placeholder="Field label (e.g. Tanggal Mulai)"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddPlaceholder())
                  }
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                />
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl border border-stone-300 text-xs bg-stone-50/50"
                >
                  <option value="Text">Text</option>
                  <option value="Date">Date</option>
                  <option value="Number">Number</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddPlaceholder}
                  className="px-4 py-2.5 rounded-2xl bg-black text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {placeholders.map((item) => (
                  <div
                    key={item.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-[11px] font-sans"
                  >
                    <button
                      type="button"
                      onClick={() => insertVariableToBody(item.key)}
                      className="flex items-center gap-1.5 hover:text-stone-900 text-stone-800 font-medium cursor-pointer"
                      title="Click to insert into body"
                    >
                      <span>{item.label}</span>
                      <span className="text-stone-500 text-[10px]">
                        {`{{${item.key}}}`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePlaceholder(item.key)}
                      className="text-stone-400 hover:text-red-500 ml-1 font-bold text-xs cursor-pointer"
                      title="Remove placeholder"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Body Content */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-3">
              <h2 className="font-serif font-bold text-stone-900 text-lg">
                Document Body Content
              </h2>
              <textarea
                rows={8}
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50 resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Live SMK Letris 2 Preview */}
          <div className="lg:col-span-5 bg-stone-100/70 p-6 rounded-3xl border border-stone-200 flex flex-col gap-3 sticky top-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-sans">
                LIVE DOCUMENT PREVIEW
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full font-sans">
                A4 Paper View
              </span>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[11px] min-h-125">
              <div>
                <Letterhead />

                <div className="text-center mb-4">
                  <h3 className="font-bold text-xs uppercase underline tracking-wider">
                    {templateName || "NAMA TEMPLATE SURAT"}
                  </h3>
                  <p className="text-[9px] font-sans text-stone-600 mt-0.5">
                    Nomor: 420 / XXX / LET2KOP / 2026
                  </p>
                </div>

                <div className="leading-relaxed whitespace-pre-wrap text-[10px] text-stone-800 font-sans min-h-40">
                  {bodyContent || (
                    <span className="italic text-stone-400">
                      Substansi draf surat akan diperbarui di sini secara real-time...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 font-sans text-[9px]">
                <div className="text-center w-36">
                  <p>Tangerang Selatan, 1/9/2026</p>
                  <p className="font-semibold mt-1">Kepala Sekolah</p>
                  <div className="h-10 flex items-center justify-center italic text-stone-400 text-[8px]">
                    (Tanda Tangan & Stempel)
                  </div>
                  <p className="font-bold underline text-stone-800">
                    Admin Let2Kop
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}