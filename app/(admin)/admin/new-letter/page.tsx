"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminLetterPreview } from "@/components/organisms/AdminLetterPreview";
import { MiniPaperThumbnail } from "@/components/molecules/MiniPaperThumbnail";
import {
  LEFT_LOGO_OPTIONS,
  RIGHT_LOGO_OPTIONS,
  DEFAULT_LEFT_LOGO,
  DEFAULT_RIGHT_LOGO,
} from "@/lib/logoOptions";

interface DynamicTemplate {
  id: string;
  title: string;
  category?: string;
  description?: string;
  placeholders?: string;
  bodyContent?: string;
  defaultNumber?: string;
  defaultRecipient?: string;
  defaultBody?: string;
}

const FALLBACK_TEMPLATES: DynamicTemplate[] = [
  {
    id: "1",
    title: "SURAT KETERANGAN AKTIF SISWA",
    category: "Surat Keterangan",
    defaultNumber: "135/SKet/421.5/SMK.LI2/VIII/2026",
    defaultRecipient: "Siswa / Siswi Terlampir",
    defaultBody:
      "Yang bertanda tangan di bawah ini kepala Sekolah SMK Letris Indonesia 2 Pamulang Kota Tangerang Selatan - Prov. Banten menerangkan bahwa:\n\n" +
      "Nama | {{nama}}\n" +
      "Tempat Tanggal Lahir | {{tempat_tanggal_lahir}}\n" +
      "Jenis kelamin | {{jenis_kelamin}}\n" +
      "NISN | {{nisn}}\n" +
      "NPSN | 69894185\n" +
      "Kelas | {{kelas}}\n" +
      "Kompetensi Keahlian | {{kompetensi_keahlian}}\n\n" +
      "Benar nama yang tersebut di atas terdaftar sebagai peserta didik kelas {{kelas}} di SMK Letris Indonesia 2 Tahun Ajaran 2026/2027. Demikian surat keterangan ini kami berikan untuk digunakan sebagaimana mestinya.",
  },

  {
    id: "2",
    title: "SURAT UNDANGAN",
    category: "Surat Undangan",
    defaultNumber: "001/UND/SMK-2/2026",
    defaultRecipient: "Orang Tua / Wali Murid",
    defaultBody:
      "Sehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:\n\nHari / Tanggal : Sabtu, 22 Agustus 2026\nWaktu : 09.00 WIB - Selesai\nTempat : Aula Utama SMK Letris Indonesia 2\n\nDemikian surat undangan ini kami sampaikan.",
  },
];

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[\{\}]/g, "").trim());
  return Array.from(new Set(keys));
}

function AdminNewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [templatesList, setTemplatesList] =
    useState<DynamicTemplate[]>(FALLBACK_TEMPLATES);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [currentUser, setCurrentUser] = useState({
    name: "Rasya",
    username: "rasya",
    email: "admin@smkletris2.sch.id",
    image: "",
    role: "admin",
  });

  const [selectedTemplate, setSelectedTemplate] =
    useState<DynamicTemplate | null>(null);

  const [letterNumber, setLetterNumber] = useState("");
  const [date, setDate] = useState("");
  const [recipient, setRecipient] = useState("");
  const [rawBodyTemplate, setRawBodyTemplate] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  // Kop Surat logo selection — shared option lists live in lib/logoOptions
  const [leftLogo, setLeftLogo] = useState<string>(DEFAULT_LEFT_LOGO);
  const [rightLogo, setRightLogo] = useState<string>(DEFAULT_RIGHT_LOGO);

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
          if (user && user.email) {
            setCurrentUser({
              name: user.name || "Rasya",
              username: user.email ? user.email.split("@")[0] : "rasya",
              email: user.email,
              image: user.image || user.avatarUrl || "",
              role: user.role ? user.role.toLowerCase() : "admin",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load active session:", error);
      }
    }
    loadUserSession();
  }, []);

  useEffect(() => {
    setDate("07 Agustus 2026");
  }, []);

  const handleSelectTemplate = useCallback(
    (templateObj: DynamicTemplate | null) => {
      setSelectedTemplate(templateObj);
      if (templateObj) {
        const templateText =
          templateObj.bodyContent || templateObj.defaultBody || "";
        setRawBodyTemplate(templateText);
        setLetterNumber(
          templateObj.defaultNumber || "135/SKet/421.5/SMK.LI2/VIII/2026",
        );
        setRecipient(templateObj.defaultRecipient || "Siswa / Siswi Terlampir");

        const detectedKeys = extractPlaceholders(templateText);
        const initialValues: Record<string, string> = {};
        detectedKeys.forEach((key) => {
          if (key === "nama" || key === "nama_siswa")
            initialValues[key] = "Gilby Maleeq Jibrani";
          else if (key === "tempat_tanggal_lahir" || key === "ttl")
            initialValues[key] = "Jakarta, 17 Mei 2009";
          else if (key === "jenis_kelamin") initialValues[key] = "Laki-laki";
          else if (key === "nisn") initialValues[key] = "0092877072";
          else if (key === "npsn") initialValues[key] = "69894185";
          else if (key === "kelas") initialValues[key] = "XII DKVB 4";
          else if (key === "kompetensi_keahlian")
            initialValues[key] = "Desain Komunikasi Visual";
          else if (key === "tahun_ajaran") initialValues[key] = "2026/2027";
          else initialValues[key] = "";
        });
        setPlaceholderValues(initialValues);
      }
    },
    [],
  );

  useEffect(() => {
    if (!templateQuery || isLoadingTemplates) return;

    const matched = templatesList.find(
      (t) => t.title.toLowerCase() === templateQuery.toLowerCase(),
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

  const categories = [
    "Semua",
    ...Array.from(
      new Set(
        templatesList
          .map((tpl) => tpl.category)
          .filter((cat): cat is string => Boolean(cat)),
      ),
    ),
  ];

  const filteredTemplates = templatesList.filter((tpl) => {
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
    const finalTitle = selectedTemplate?.title || "SURAT KETERANGAN AKTIF SISWA";
    const finalRecipient =
      recipient.trim() || placeholderValues["nama"] || "Siswa Terlampir";
    const finalBody = getRenderedBody();
    const finalNumber = letterNumber.trim() || "135/SKet/421.5/SMK.LI2/VIII/2026";

    const payload = {
      title: finalTitle,
      letterNumber: finalNumber,
      recipient: finalRecipient,
      subject: finalTitle,
      body: finalBody,
      attachmentUrl: attachmentUrl || null,
      leftLogo,
      rightLogo,
      // FALLBACK_TEMPLATES (used if /api/templates couldn't be reached) has
      // ids "1"/"2" that don't exist as real Template rows — the API
      // resolves this defensively, but only send a real-looking id at all.
      templateId:
        selectedTemplate?.id && selectedTemplate.id !== "custom"
          ? selectedTemplate.id
          : null,
      userEmail: currentUser.email || "admin@smkletris2.sch.id",
      createdByRole: "ADMIN",
      status: "APPROVED",
      type: selectedTemplate?.category || "Surat Keterangan",
    };

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Surat berhasil diterbitkan!");
        router.push("/admin/history");
      } else {
        console.error("API 500 Response Data:", responseData);
        alert(
          `Gagal membuat surat: ${
            responseData.error || responseData.message || "Internal Server Error (500)"
          }`
        );
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
    <DashboardLayout
      navItems={navItems}
      adminTools={adminTools}
      currentUser={currentUser}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome, <span className="italic">{currentUser.name}</span>
          </h1>
          <div className="w-10 h-10 rounded-full border border-stone-300 overflow-hidden flex items-center justify-center shrink-0 bg-stone-200">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar src={undefined} alt={currentUser.name} />
            )}
          </div>
        </div>

        {!selectedTemplate ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 font-serif text-xs border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
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
                  placeholder="Cari template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 py-1.5 pl-3 pr-8 bg-white border border-stone-300 rounded-lg font-serif text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
                />
                <svg
                  className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {isLoadingTemplates ? (
              <div className="p-8 text-stone-500 font-sans text-sm">
                Loading templates...
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="col-span-full text-center py-16 text-stone-500 font-serif border border-dashed border-stone-300 rounded-xl">
                Tidak ada template yang cocok dengan kriteria pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Ganti Template Cepat (Isi Otomatis)
                  </label>
                  <select
                    value={selectedTemplate.id}
                    onChange={(e) => {
                      const found = templatesList.find(
                        (t) => t.id === e.target.value,
                      );
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

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Pilih Logo Kop Surat
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">
                        Logo Kiri
                      </span>
                      <select
                        value={leftLogo}
                        onChange={(e) => setLeftLogo(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                      >
                        {LEFT_LOGO_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">
                        Logo Kanan
                      </span>
                      <select
                        value={rightLogo}
                        onChange={(e) => setRightLogo(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                      >
                        {RIGHT_LOGO_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        Judul / Hal Surat
                      </label>
                      <span className="text-[10px] text-stone-400">
                        Wajib diisi
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. SURAT KETERANGAN AKTIF SISWA"
                      value={selectedTemplate.title}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        Usulan Nomor Surat
                      </label>
                      <span className="text-[10px] text-stone-400">
                        Wajib diisi
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 135/SKet/421.5/SMK.LI2/VIII/2026"
                      value={letterNumber}
                      onChange={(e) => setLetterNumber(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Penerima Surat / Tujuan
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Siswa / Siswi Terlampir"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Tanggal Surat
                    </label>
                    <input
                      type="text"
                      value={date}
                      placeholder="e.g. 07 Agustus 2026"
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Placeholder Inputs Section */}
                {detectedPlaceholders.length > 0 && (
                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Variabel Isian Surat
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
                          onChange={(e) =>
                            handlePlaceholderChange(key, e.target.value)
                          }
                          className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Body Editor */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Isi Text Surat
                  </label>
                  <textarea
                    rows={8}
                    value={rawBodyTemplate}
                    onChange={(e) => setRawBodyTemplate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-3 text-xs font-mono focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Attachment Upload */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Upload Lampiran / Stempel / Gambar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setAttachmentUrl(reader.result as string);
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

              {/* Live Preview Side — shared preview component: correct
                  logo handling, print isolation, and DOCX export all
                  come from AdminLetterPreview instead of being
                  duplicated here. */}
              <AdminLetterPreview
                letterData={{
                  institutionName: "",
                  letterNumber,
                  date,
                  recipient,
                  subject: selectedTemplate?.title || "",
                  body: getRenderedBody(),
                  attachmentUrl,
                  leftLogo,
                  rightLogo,
                }}
                selectedTemplate={selectedTemplate}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminNewLetterPage() {
  return (
    <Suspense
      fallback={<div className="p-8 font-sans text-stone-600">Loading...</div>}
    >
      <AdminNewLetterContent />
    </Suspense>
  );
}