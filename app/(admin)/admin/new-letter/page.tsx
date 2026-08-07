"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";

function AdminNewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const [letterData, setLetterData] = useState({
    institutionName: "",
    letterNumber: "",
    recipient: "",
    subject: "",
    date: new Date().toISOString().split("T")[0],
    body: "",
  });

  // Admin Navigation Items
  const navItems = [
    { label: "Overview", href: "/admin", isActive: false },
    { label: "Pending Approval", href: "/admin/pending", isActive: false },
    { label: "Archive", href: "/admin/history", isActive: false },
    { label: "User Management", href: "/admin/users", isActive: false },
    { label: "New letter", href: "/admin/new-letter", isActive: true },
  ];

  // Admin Tools Navigation Section
  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: false },
    { label: "Add template", href: "/admin/templates/new", isActive: false },
    { label: "Broadcast notice", href: "/admin/notice", isActive: false },
  ];

  const mockUser = {
    name: "Admin",
    username: "admin_dev",
    avatarUrl: "",
    role: "admin",
  };

  const templates = [
    { id: "1", title: "Surat undangan" },
    { id: "2", title: "Surat tugas" },
    { id: "3", title: "Surat keterangan" },
    { id: "4", title: "Surat keputusan" },
    { id: "5", title: "Surat pemberitahuan" },
  ];

  // Auto-select template if passed via URL
  useEffect(() => {
    if (templateQuery) {
      const matched = templates.find(
        (t) => t.title.toLowerCase() === templateQuery.toLowerCase()
      );
      if (matched) {
        setSelectedTemplate(matched);
      } else {
        setSelectedTemplate({ id: "custom", title: templateQuery });
      }
    }
  }, [templateQuery]);

  const handleSubmitForApproval = () => {
    alert("Surat berhasil dibuat dan diterbitkan!");
    router.push("/admin/history");
  };

  return (
    <DashboardLayout
      navItems={navItems}
      adminTools={adminTools}
      currentUser={mockUser}
    >
      <div className="flex flex-col gap-6">
        {!selectedTemplate ? (
          /* Template Selection View */
          <>
            <h1 className="text-3xl font-serif text-stone-900">
              Welcome, <span className="italic">{mockUser.name}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="group flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-1"
                >
                  <div className="w-full aspect-3/4 bg-stone-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-stone-900 shadow-md relative">
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs p-4">
                      <span>Template Preview</span>
                    </div>
                  </div>
                  <span className="font-serif text-base text-stone-900 font-medium">
                    {template.title}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Form Editor View */
          <div className="flex flex-col gap-6">
            {/* Top Bar with Back Button */}
            <div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                ← Change Template
              </button>
            </div>

            {/* Form Header */}
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
                Pembuatan Surat Admin
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {selectedTemplate.title}
              </h1>
            </div>

            {/* Side-by-Side Form + Live Kop Surat Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Column: Form Editor */}
              <LetterFormEditor
                formData={letterData}
                onChange={(updatedData) =>
                  setLetterData((prev) => ({ ...prev, ...updatedData }))
                }
                onSubmitForApproval={handleSubmitForApproval}
                onSaveDraft={() => alert("Draf surat berhasil disimpan!")}
              />

              {/* Right Column: Live A4 Kop Surat Preview */}
              <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[11px] leading-relaxed">
                <div>
                  {/* Status Banner inside Preview */}
                  <div className="mb-4 flex justify-between items-center border-b pb-2 border-dashed border-stone-300 font-sans">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      STATUS: Pembuatan Surat Admin
                    </span>
                    <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      Pratinjau Draf
                    </span>
                  </div>

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
                    <div className="px-10">
                      <h4 className="font-bold text-[10px] tracking-tight uppercase leading-tight">
                        YAYASAN LEO SUTRISNO
                      </h4>
                      <h3 className="font-bold text-[12px] tracking-wide uppercase leading-tight">
                        SMK LETRIS INDONESIA 2
                      </h3>
                      <p className="text-[8px] font-sans text-stone-700 mt-0.5 leading-tight">
                        NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                      </p>
                      <p className="text-[8px] font-sans font-semibold text-stone-800 leading-tight">
                        ( AKREDITASI " A " )
                      </p>
                      <p className="text-[7px] font-sans text-stone-600 leading-tight mt-0.5">
                        Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                      </p>
                      <p className="text-[7px] font-sans text-stone-600 leading-tight">
                        Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                      </p>
                      <span className="text-[7px] text-blue-700 underline font-sans">
                        www.smkletrisdua.sch.id
                      </span>
                    </div>
                  </div>

                  {/* Letter Meta */}
                  <div className="flex justify-between text-[10px] mb-4 font-sans">
                    <div className="space-y-0.5">
                      <p>
                        <span className="font-semibold">Nomor:</span>{" "}
                        {letterData.letterNumber || "[Diisi oleh Admin]"}
                      </p>
                      <p>
                        <span className="font-semibold">Hal:</span>{" "}
                        {selectedTemplate?.title || "Surat"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Tangerang Selatan, {letterData.date || "2026-08-07"}</p>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="mb-4 font-sans text-[10px] space-y-0.5">
                    <p className="font-semibold">Kepada Yth.</p>
                    <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                    <p className="text-stone-500">Di Tempat</p>
                  </div>

                  {/* Sender Subhead if typed */}
                  {letterData.institutionName && (
                    <p className="text-[10px] font-semibold text-stone-700 mb-2 font-sans">
                      Pengirim: {letterData.institutionName}
                    </p>
                  )}

                  {/* Body Preview */}
                  <div className="leading-relaxed whitespace-pre-wrap text-[10px] text-stone-800 font-sans min-h-25">
                    {letterData.body || (
                      <span className="italic text-stone-400">
                        Isi surat akan langsung muncul di sini saat Anda mengetik di formulir...
                      </span>
                    )}
                  </div>
                </div>

                {/* Signature Placeholder */}
                <div className="flex justify-end pt-6 font-sans text-[9px]">
                  <div className="text-center w-40 border border-dashed border-stone-300 p-2 rounded bg-stone-50/50">
                    <p className="text-stone-500">Mengetahui,</p>
                    <p className="font-semibold text-stone-800">
                      Kepala Sekolah / Admin
                    </p>
                    <div className="h-10 flex items-center justify-center italic text-stone-400 text-[8px]">
                      [Belum Ditandatangani]
                    </div>
                    <p className="font-bold underline text-stone-700">
                      NIP. ....................
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminNewLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 font-sans">Loading...</div>}>
      <AdminNewLetterContent />
    </Suspense>
  );
}