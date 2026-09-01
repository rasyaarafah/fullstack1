"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Avatar } from "@/components/atoms/Avatar";

interface DynamicTemplate {
  id: string;
  title: string;
  category?: string;
  description?: string;
  placeholders?: string; // e.g. "nama_penerima,jabatan" or JSON
  bodyContent?: string;
  defaultNumber?: string;
  defaultRecipient?: string;
  defaultBody?: string;
}

const DEFAULT_LEFT_LOGO = "/logo_letris.png";
const DEFAULT_RIGHT_LOGO = "/logo_banten.png";

const FALLBACK_TEMPLATES: DynamicTemplate[] = [
  {
    id: "1",
    title: "Surat undangan",
    defaultNumber: "001/UND/SMK-2/2026",
    defaultRecipient: "Orang Tua / Wali Murid Kelas X",
    defaultBody:
      "Dengan hormat,\n\nSehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:\n\nHari/Tanggal : Sabtu, 22 Agustus 2026\nWaktu : 09.00 WIB - Selesai\nTempat : Aula Utama SMK Letris Indonesia 2\n\nDemikian surat undangan ini kami sampaikan.",
  },
  {
    id: "2",
    title: "Surat tugas",
    defaultNumber: "002/ST/SMK-2/2026",
    defaultRecipient: "Bapak/Ibu Guru Pendamping",
    defaultBody:
      "Yang bertanda tangan di bawah ini Kepala SMK Letris Indonesia 2 memberikan tugas kepada nama terlampir untuk melaksanakan pendampingan kegiatan Lomba Keterampilan Siswa (LKS) Tingkat Kota Tangsel.",
  },
  {
    id: "3",
    title: "Surat keterangan",
    defaultNumber: "003/SK/SMK-2/2026",
    defaultRecipient: "Siswa / Siswi Terlampir",
    defaultBody:
      "Dengan ini menerangkan bahwa:\n\nNama: {{nama_penerima}}\nJabatan: {{jabatan}}\n\nTelah melaksanakan tugas dengan baik dan benar.",
  },
];

// Helper to extract {{variable}} names from template body or placeholders property
function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[\{\}]/g, "").trim());
  return Array.from(new Set(keys));
}

function MiniPaperThumbnail({ template }: { template: DynamicTemplate }) {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  const bodyPreview = template.bodyContent || template.defaultBody || "";

  return (
    <div className="w-full aspect-3/4 bg-stone-200/60 rounded-2xl border border-stone-300 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all flex items-center justify-center p-2 select-none">
      <div className="w-[190%] h-[190%] scale-[0.52] shrink-0 pointer-events-none bg-white p-6 shadow-md border border-stone-200 text-[10px] font-serif leading-tight text-stone-900 flex flex-col justify-between origin-center">
        <div>
          <div className="relative border-b-2 border-double border-stone-900 pb-2 mb-3 text-center flex items-center justify-between">
            <img src={DEFAULT_LEFT_LOGO} alt="Logo Left" className="w-8 h-8 object-contain" />
            <div className="px-2">
              <p className="font-bold text-[8px] uppercase tracking-tighter">YAYASAN LEO SUTRISNO</p>
              <p className="font-bold text-[10px] uppercase">SMK LETRIS INDONESIA 2</p>
              <p className="text-[6px] font-sans text-stone-600">NPSN: 69894185 | NSS: 402286303080</p>
            </div>
            <img src={DEFAULT_RIGHT_LOGO} alt="Logo Right" className="w-8 h-8 object-contain" />
          </div>

          <div className="flex justify-between text-[8px] font-sans mb-3">
            <div>
              <p><span className="font-semibold">Nomor:</span> {template.defaultNumber || "[Auto]"}</p>
              <p><span className="font-semibold">Hal:</span> {template.title}</p>
            </div>
            <div className="text-right">
              <p>Tangsel, {currentDate || "..."}</p>
            </div>
          </div>

          <div className="text-[7.5px] font-sans text-stone-700 leading-normal line-clamp-6 whitespace-pre-wrap">
            {bodyPreview}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-100 font-sans text-[7px]">
          <div className="text-center w-28 border border-dashed border-stone-300 p-1 rounded">
            <p className="text-stone-500">Mengetahui,</p>
            <p className="font-semibold">Kepala Sekolah / Admin</p>
            <div className="h-6"></div>
            <p className="font-bold underline">NIP. ....................</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminNewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [templatesList, setTemplatesList] = useState<DynamicTemplate[]>(FALLBACK_TEMPLATES);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const [currentUser, setCurrentUser] = useState({
    name: "Rasya",
    username: "rasya",
    email: "",
    image: "",
    role: "admin",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<DynamicTemplate | null>(null);

  // Form Fields State
  const [institutionName, setInstitutionName] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [date, setDate] = useState("");
  const [recipient, setRecipient] = useState("");
  const [rawBodyTemplate, setRawBodyTemplate] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatabaseTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const dbTemplates: DynamicTemplate[] = await res.json();
          if (dbTemplates.length > 0) {
            setTemplatesList(dbTemplates);
          }
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setIsLoadingTemplates(false);
      }
    }
    fetchDatabaseTemplates();
  }, []);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setCurrentUser({
            name: user.name || "Rasya",
            username: user.email ? user.email.split("@")[0] : "rasya",
            email: user.email || "",
            image: user.image || user.avatarUrl || "",
            role: user.role ? user.role.toLowerCase() : "admin",
          });
        }
      } catch (error) {
        console.error("Failed to load active session:", error);
      }
    }
    loadUserSession();
  }, []);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleSelectTemplate = useCallback((templateObj: DynamicTemplate | null) => {
    setSelectedTemplate(templateObj);
    if (templateObj) {
      const templateText = templateObj.bodyContent || templateObj.defaultBody || "";
      setRawBodyTemplate(templateText);
      setLetterNumber(templateObj.defaultNumber || "");
      setRecipient(templateObj.defaultRecipient || "");

      // Initialize dynamic placeholder fields
      const detectedKeys = extractPlaceholders(templateText);
      const initialValues: Record<string, string> = {};
      detectedKeys.forEach((key) => {
        initialValues[key] = "";
      });
      setPlaceholderValues(initialValues);
    }
  }, []);

  useEffect(() => {
    if (!templateQuery || isLoadingTemplates) return;

    const matched = templatesList.find(
      (t) => t.title.toLowerCase() === templateQuery.toLowerCase()
    );

    if (matched) {
      handleSelectTemplate(matched);
    } else {
      setSelectedTemplate({ id: "custom", title: templateQuery });
    }
  }, [templateQuery, templatesList, isLoadingTemplates, handleSelectTemplate]);

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues((prev) => ({ ...prev, [key]: value }));
  };

  // Compute final live letter body by replacing placeholders
  const getRenderedBody = () => {
    let rendered = rawBodyTemplate;
    Object.keys(placeholderValues).forEach((key) => {
      const val = placeholderValues[key];
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      rendered = rendered.replace(regex, val || `{{${key}}}`);
    });
    return rendered;
  };

  const detectedPlaceholders = extractPlaceholders(rawBodyTemplate);

  const handlePublish = async () => {
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedTemplate?.title || "Surat Baru",
          letterNumber,
          recipient,
          subject: selectedTemplate?.title || "Surat",
          body: getRenderedBody(),
          attachmentUrl,
          userEmail: currentUser.email,
          createdByRole: "ADMIN",
          status: "APPROVED",
        }),
      });

      if (res.ok) {
        alert("Surat berhasil diterbitkan!");
        router.push("/admin/history");
      } else {
        const errorData = await res.json();
        alert(`Gagal membuat surat: ${errorData.error || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      console.error("Error publishing letter:", err);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin", isActive: false },
    { label: "Pending Approval", href: "/admin/pending", isActive: false },
    { label: "Archive", href: "/admin/history", isActive: false },
    { label: "User Management", href: "/admin/users", isActive: false },
    { label: "New letter", href: "/admin/new-letter", isActive: true },
  ];

  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: false },
    { label: "Add template", href: "/admin/templates/new", isActive: false },
    { label: "Broadcast notice", href: "/admin/notice", isActive: false },
  ];

  return (
    <DashboardLayout navItems={navItems} adminTools={adminTools} currentUser={currentUser}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome, <span className="italic">{currentUser.name}</span>
          </h1>
          <div className="w-10 h-10 rounded-full border border-stone-300 overflow-hidden flex items-center justify-center shrink-0 bg-stone-200">
            {currentUser.image ? (
              <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <Avatar src={undefined} alt={currentUser.name} />
            )}
          </div>
        </div>

        {!selectedTemplate ? (
          <div>
            {isLoadingTemplates ? (
              <div className="p-8 text-stone-500 font-sans text-sm">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {templatesList.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="group flex flex-col items-center gap-3 text-center transition-transform hover:-translate-y-1 cursor-pointer"
                  >
                    <MiniPaperThumbnail template={template} />
                    <span className="font-serif text-base text-stone-900 font-medium group-hover:underline">
                      {template.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                ← Change Template
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
                PEMBUATAN SURAT ADMIN
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {selectedTemplate.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Form Side */}
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-stone-200 space-y-5">
                {/* Fast Preset Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Ganti Template Cepat (Isi Otomatis)</label>
                  <select
                    value={selectedTemplate.id}
                    onChange={(e) => {
                      const found = templatesList.find((t) => t.id === e.target.value);
                      if (found) handleSelectTemplate(found);
                    }}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                  >
                    {templatesList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Logo Pickers */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Pilih Logo Kop Surat</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Logo Kiri</span>
                      <select className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs">
                        <option>SMK Letris Indonesia 2</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Logo Kanan</span>
                      <select className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs">
                        <option>Provinsi Banten</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main Metadata Inputs */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-stone-700">Data Pengirim / Unit Kerja</label>
                      <span className="text-[10px] text-stone-400">Wajib diisi</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Guru Mata Pelajaran Matematika"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-stone-700">Usulan Nomor Surat</label>
                      <span className="text-[10px] text-stone-400">Wajib diisi</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 001/UND/SMK-2/2026"
                      value={letterNumber}
                      onChange={(e) => setLetterNumber(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Tanggal Surat</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Data Penerima</label>
                    <input
                      type="text"
                      placeholder="e.g. Orang Tua / Wali Murid Kelas X"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Placeholder Inputs Section */}
                {detectedPlaceholders.length > 0 && (
                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Variabel Placeholder Template
                    </h4>
                    {detectedPlaceholders.map((key) => (
                      <div key={key} className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </label>
                        <input
                          type="text"
                          placeholder={`Isi {{${key}}}`}
                          value={placeholderValues[key] || ""}
                          onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Body Editor */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Isi Surat (Template)</label>
                  <textarea
                    rows={6}
                    value={rawBodyTemplate}
                    onChange={(e) => setRawBodyTemplate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-3 text-xs font-mono focus:outline-none"
                  />
                </div>

                {/* Attachment Upload */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Upload Lampiran / Stempel / Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAttachmentUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-stone-600 cursor-pointer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Terbitkan Surat →
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Draf surat disimpan!")}
                    className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Simpan Sebagai Draf
                  </button>
                </div>
              </div>

              {/* Live Preview Side */}
              <div className="sticky top-6 w-full max-w-md mx-auto">
                <div className="mb-2 flex items-center justify-between bg-stone-900 text-white px-3 py-2 rounded-xl">
                  <span className="text-xs font-medium">A4 Live Document Export</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-medium cursor-pointer"
                    >
                      🖨 Print / PDF
                    </button>
                  </div>
                </div>

                <div className="w-full min-h-145 bg-white rounded-xl shadow-2xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[10.5px] leading-relaxed">
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Header Kop */}
                    <div className="relative border-b-2 border-solid border-stone-900 pb-2 mb-4 flex items-center justify-between shrink-0">
                      <img src={DEFAULT_LEFT_LOGO} alt="Logo" className="w-10 h-10 object-contain" />
                      <div className="px-4 text-center flex-1">
                        <h4 className="font-bold text-[10px] tracking-tight uppercase leading-tight">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-bold text-[12px] tracking-wide uppercase leading-tight">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[8px] font-sans text-stone-700 leading-tight">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[8px] font-sans font-semibold text-stone-800 leading-tight">
                          ( AKREDITASI " A " )
                        </p>
                      </div>
                      <img src={DEFAULT_RIGHT_LOGO} alt="Logo" className="w-10 h-10 object-contain" />
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between text-[10px] mb-4 font-sans shrink-0">
                      <div>
                        <p><span className="font-semibold">Nomor:</span> {letterNumber || "[Disi oleh Admin]"}</p>
                        <p><span className="font-semibold">Hal:</span> {selectedTemplate?.title}</p>
                      </div>
                      <div className="text-right">
                        <p>Tangerang Selatan, {date}</p>
                      </div>
                    </div>

                    <div className="mb-4 font-sans text-[10px] space-y-0.5 shrink-0">
                      <p className="font-semibold">Kepada Yth.</p>
                      <p>{recipient || "Bapak/Ibu Penerima"}</p>
                      <p className="text-stone-500">Di Tempat</p>
                    </div>

                    {/* Rendered Live Body */}
                    <div className="my-1 font-sans text-[10px] whitespace-pre-wrap leading-relaxed text-stone-800">
                      {getRenderedBody()}
                    </div>

                    {attachmentUrl && (
                      <div className="mt-4 border-t border-stone-200 pt-2">
                        <img src={attachmentUrl} alt="Attachment" className="max-h-28 object-contain rounded" />
                      </div>
                    )}
                  </div>

                  {/* Signature */}
                  <div className="flex justify-end pt-4 mt-6 border-t border-stone-100 font-sans text-[9px] shrink-0">
                    <div className="text-center w-40 border border-dashed border-stone-200 p-2 rounded bg-stone-50/50">
                      <p className="text-stone-500">Mengetahui,</p>
                      <p className="font-semibold text-stone-800">Kepala Sekolah / Admin</p>
                      <div className="h-12 flex items-center justify-center italic text-stone-400 text-[8px]">
                        [Belum Ditandatangani]
                      </div>
                      <p className="font-bold underline text-stone-700">NIP. ....................</p>
                    </div>
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
    <Suspense fallback={<div className="p-8 font-sans text-stone-600">Loading...</div>}>
      <AdminNewLetterContent />
    </Suspense>
  );
}