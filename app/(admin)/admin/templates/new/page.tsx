"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

type FieldVariable = {
  id: string;
  label: string;
  key: string;
  type: "text" | "date" | "number" | "textarea";
};

export default function AdminAddTemplatePage() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation matching your project structure
  const navItems = [
    { label: "Overview", href: "/admin", isActive: pathname === "/admin" },
    { label: "Pending Approval", href: "/admin/pending", isActive: pathname === "/admin/pending" },
    { label: "Archive", href: "/admin/history", isActive: pathname === "/admin/history" },
    { label: "User Management", href: "/admin/users", isActive: pathname === "/admin/users" },
    { label: "New letter", href: "/admin/new-letter", isActive: pathname === "/admin/new-letter" },
  ];

  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: pathname?.startsWith("/admin/templates/edit") },
    { label: "Add template", href: "/admin/templates/new", isActive: pathname?.startsWith("/admin/templates/new") },
    { label: "Broadcast notice", href: "/admin/notice", isActive: pathname?.startsWith("/admin/notice") },
  ];

  const adminUser = {
    name: "Admin User",
    username: "admin_main",
    avatarUrl: "",
    role: "admin",
  };

  // Hydration-safe date state
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString("id-ID"));
  }, []);

  // Form States
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("Surat Keterangan");
  const [description, setDescription] = useState("");
  const [bodyContent, setBodyContent] = useState(
    "Dengan ini menerangkan bahwa:\n\nNama: {{nama_penerima}}\nJabatan: {{jabatan}}\n\nTelah melaksanakan tugas dengan baik dan benar."
  );

  // Dynamic variables builder
  const [variables, setVariables] = useState<FieldVariable[]>([
    { id: "v1", label: "Nama Penerima", key: "nama_penerima", type: "text" },
    { id: "v2", label: "Jabatan", key: "jabatan", type: "text" },
  ]);

  const [newVarLabel, setNewVarLabel] = useState("");
  const [newVarType, setNewVarType] = useState<FieldVariable["type"]>("text");

  const handleAddVariable = () => {
    if (!newVarLabel.trim()) return;
    const key = newVarLabel.toLowerCase().trim().replace(/\s+/g, "_");
    setVariables([
      ...variables,
      { id: `v-${Date.now()}`, label: newVarLabel, key, type: newVarType },
    ]);
    setNewVarLabel("");
  };

  const handleInsertPlaceholder = (key: string) => {
    setBodyContent((prev) => `${prev} {{${key}}}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }
    // Perform save API call / state update here
    alert(`Template "${templateName}" created successfully!`);
    router.push("/admin/templates/edit");
  };

  return (
    <DashboardLayout navItems={navItems} adminTools={adminTools} currentUser={adminUser}>
      <div className="flex flex-col gap-8 pb-16 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Add New Template</h1>
            <p className="text-stone-500 text-sm mt-1">
              Design a custom letter template and configure placeholders for user inputs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#0A4D3C] hover:bg-[#07382c] text-white rounded-xl text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Form & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Meta */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <h2 className="text-lg font-serif font-semibold text-stone-900">Template Details</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surat Keterangan Active"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                  >
                    <option value="Surat Undangan">Surat Undangan</option>
                    <option value="Surat Tugas">Surat Tugas</option>
                    <option value="Surat Keterangan">Surat Keterangan</option>
                    <option value="Surat Keputusan">Surat Keputusan</option>
                    <option value="Surat Pemberitahuan">Surat Pemberitahuan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                  />
                </div>
              </div>
            </div>

            {/* Variable Builder */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <h2 className="text-lg font-serif font-semibold text-stone-900">Custom Placeholders</h2>
              <p className="text-xs text-stone-500">
                Add dynamic fields that teachers or users will fill in. Click a variable tag to append it into your template body.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Field label (e.g. Tanggal Mulai)"
                  value={newVarLabel}
                  onChange={(e) => setNewVarLabel(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                />
                <select
                  value={newVarType}
                  onChange={(e) => setNewVarType(e.target.value as any)}
                  className="p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
                >
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                  <option value="textarea">Textarea</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {variables.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleInsertPlaceholder(v.key)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs text-stone-700 transition-all flex items-center gap-2 cursor-pointer group"
                    title="Click to insert placeholder into editor"
                  >
                    <span className="font-medium group-hover:text-emerald-900">{v.label}</span>
                    <code className="text-[10px] bg-stone-200 group-hover:bg-emerald-200 text-stone-800 group-hover:text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                      {`{{${v.key}}}`}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Body Editor */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col gap-3">
              <h2 className="text-lg font-serif font-semibold text-stone-900">Document Body Content</h2>
              <textarea
                rows={10}
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                placeholder="Type template layout here..."
                className="w-full p-4 rounded-2xl border border-stone-300 font-mono text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] leading-relaxed"
              />
            </div>
          </div>

          {/* Right Live Paper Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-stone-100 border border-stone-300 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Live Document Preview
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                  A4 Paper View
                </span>
              </div>

              {/* Paper Simulation */}
              <div className="bg-white border border-stone-200 shadow-md rounded-xl p-8 min-h-115 font-serif text-stone-900 flex flex-col justify-between text-xs leading-relaxed">
                <div>
                  {/* Kop Surat Header */}
                  <div className="text-center border-b-2 border-stone-900 pb-4 mb-4">
                    <h3 className="font-bold text-xs tracking-wide uppercase">PEMERINTAH KOTA TANGERANG SELATAN</h3>
                    <p className="text-[10px] font-sans text-stone-600">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
                    <p className="text-[9px] font-sans text-stone-400 italic">Let2Kop Official System Document</p>
                  </div>

                  {/* Title */}
                  <div className="text-center my-3">
                    <h4 className="font-bold text-xs underline uppercase tracking-wider">
                      {templateName || "NAMA TEMPLATE SURAT"}
                    </h4>
                    <p className="font-sans text-[9px] text-stone-500 mt-0.5">Nomor: 420 / XXX / LET2KOP / 2026</p>
                  </div>

                  {/* Content Preview */}
                  <div className="whitespace-pre-wrap font-serif text-stone-800 text-[10px] leading-relaxed my-4">
                    {bodyContent || "Your template body will render live here..."}
                  </div>
                </div>

                {/* Signature Block */}
                <div className="pt-6 flex justify-end">
                  <div className="text-center font-sans text-[9px]">
                    <p className="text-stone-500">
                      Tangerang Selatan, {formattedDate}
                    </p>
                    <p className="font-bold mt-1">Kepala Instansi</p>
                    <div className="h-10" />
                    <p className="font-bold underline">Admin Let2Kop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}