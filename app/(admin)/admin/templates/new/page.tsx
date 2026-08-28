"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

interface PlaceholderItem {
  label: string;
  key: string;
}

export default function AddTemplatePage() {
  const [templateName, setTemplateName] = useState("");
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

  const mockUser = {
    name: "Admin",
    username: "admin_dev",
    avatarUrl: "",
    role: "admin",
  };

  const handleAddPlaceholder = () => {
    if (!fieldLabel.trim()) return;
    const key = fieldLabel
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "_");

    // Prevent duplicate keys
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

  return (
    <DashboardLayout
      navItems={navItems}
      adminTools={adminTools}
      currentUser={mockUser}
    >
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
              className="px-5 py-2 rounded-2xl border border-stone-400 bg-white text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded-2xl bg-[#0A4D3C] text-white text-xs font-semibold hover:bg-[#07382c] transition-colors shadow-sm cursor-pointer"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Form + Live Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. Template Details */}
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
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                  >
                    <option value="Surat Keterangan">Surat Keterangan</option>
                    <option value="Surat Undangan">Surat Undangan</option>
                    <option value="Surat Tugas">Surat Tugas</option>
                    <option value="Surat Keputusan">Surat Keputusan</option>
                    <option value="Surat Pemberitahuan">Surat Pemberitahuan</option>
                  </select>
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

            {/* 2. Custom Placeholders */}
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
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPlaceholder())}
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

              {/* Placeholder Badges */}
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

            {/* 3. Document Body Content */}
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

          {/* Right Column: Live SMK Letris 2 Kop Surat Document Preview */}
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
                {/* SMK Letris Indonesia 2 Kop Surat Header */}
                <div className="relative border-b-4 border-double border-stone-900 pb-2 mb-4 text-center">
                  {/* Left Logo Slot */}
                  <div className="absolute left-0 top-0 w-10 h-10 border border-dashed border-blue-400 rounded-full flex items-center justify-center text-[7px] text-blue-600 font-sans font-bold text-center leading-tight">
                    LOGO LETRIS 2
                  </div>

                  {/* Right Logo Slot */}
                  <div className="absolute right-0 top-0 w-10 h-10 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[7px] text-emerald-700 font-sans font-bold text-center leading-tight">
                    LOGO BANTEN
                  </div>

                  {/* School Header Text */}
                  <div className="px-8">
                    <h4 className="font-bold text-[9px] tracking-tight uppercase leading-tight">
                      YAYASAN LEO SUTRISNO
                    </h4>
                    <h3 className="font-bold text-[11px] tracking-wide uppercase leading-tight">
                      SMK LETRIS INDONESIA 2
                    </h3>
                    <p className="text-[7.5px] font-sans text-stone-700 leading-tight">
                      NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                    </p>
                    <p className="text-[7.5px] font-sans font-semibold text-stone-800 leading-tight">
                      ( AKREDITASI " A " )
                    </p>
                    <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                      Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                    </p>
                    <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                      Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                    </p>
                    <span className="text-[6.5px] text-blue-700 underline font-sans">
                      www.smkletrisdua.sch.id
                    </span>
                  </div>
                </div>

                {/* Document Title & Number */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-xs uppercase underline tracking-wider">
                    {templateName || "NAMA TEMPLATE SURAT"}
                  </h3>
                  <p className="text-[9px] font-sans text-stone-600 mt-0.5">
                    Nomor: 420 / XXX / LET2KOP / 2026
                  </p>
                </div>

                {/* Body Content Live Sync Preview */}
                <div className="leading-relaxed whitespace-pre-wrap text-[10px] text-stone-800 font-sans min-h-40">
                  {bodyContent || (
                    <span className="italic text-stone-400">
                      Substansi draf surat akan diperbarui di sini secara real-time...
                    </span>
                  )}
                </div>
              </div>

              {/* Signature Block */}
              <div className="flex justify-end pt-4 font-sans text-[9px]">
                <div className="text-center w-36">
                  <p>Tangerang Selatan, {new Date().toLocaleDateString("id-ID")}</p>
                  <p className="font-semibold mt-1">Kepala Sekolah</p>
                  <div className="h-10 flex items-center justify-center italic text-stone-400 text-[8px]">
                    [Tanda Tangan & Stempel]
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