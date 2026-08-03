"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";

function NewLetterContent() {
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

  const navItems = [
    { label: "Overview", href: "/", isActive: false },
    { label: "New letter", href: "/new-letter", isActive: true },
    { label: "History", href: "/history", isActive: false },
    { label: "Pending", href: "/pending", isActive: false },
  ];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
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
    alert("Surat berhasil dikirim ke Admin untuk diperiksa dan ditandatangani!");
    // Redirect teacher to pending list page
    router.push("/pending");
  };

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
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
                Pengajuan Surat Guru
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
              <div className="w-full max-w-md mx-auto aspect-[1/1.414] bg-white rounded-xl shadow-xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-xs">
                <div>
                  {/* Status Banner inside Preview */}
                  <div className="mb-3 flex justify-between items-center border-b pb-2 border-dashed border-stone-300 font-sans">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                      • Status: Menunggu Persetujuan
                    </span>
                    <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      Pratinjau Draf
                    </span>
                  </div>

                  {/* Kop Surat Header */}
                  <div className="border-b-2 border-stone-900 pb-3 mb-4 text-center">
                    <h3 className="font-bold text-sm uppercase tracking-wide">
                      {letterData.institutionName || "SMA NEGERI 1 TANGERANG SELATAN"}
                    </h3>
                    <p className="text-[10px] text-stone-600 font-sans mt-0.5">
                      Jl. Pendidikan No. 123, Tangerang Selatan • Telp: (021) 555-0199
                    </p>
                  </div>

                  {/* Letter Meta */}
                  <div className="flex justify-between text-[11px] mb-4 font-sans">
                    <div>
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
                      <p>{letterData.date || "Tangerang Selatan"}</p>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="mb-4 font-sans text-[11px]">
                    <p className="font-semibold">Kepada Yth.</p>
                    <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                    <p className="text-stone-500">Di Tempat</p>
                  </div>

                  {/* Body Preview */}
                  <div className="leading-relaxed whitespace-pre-wrap text-[11px] text-stone-800 font-sans">
                    {letterData.body || (
                      <span className="italic text-stone-400">
                        Isi surat akan langsung muncul di sini saat Anda mengetik di formulir...
                      </span>
                    )}
                  </div>
                </div>

                {/* Signature Placeholder */}
                <div className="flex justify-end pt-4 font-sans text-[10px]">
                  <div className="text-center w-36 border border-dashed border-stone-300 p-2 rounded">
                    <p className="text-stone-500">Mengetahui,</p>
                    <p className="font-semibold text-stone-700">Kepala Sekolah / Admin</p>
                    <div className="h-8 flex items-center justify-center italic text-stone-400 text-[9px]">
                      [Belum Ditandatangani]
                    </div>
                    <p className="font-bold underline text-stone-600">NIP. ....................</p>
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

export default function NewLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 font-sans">Loading...</div>}>
      <NewLetterContent />
    </Suspense>
  );
}