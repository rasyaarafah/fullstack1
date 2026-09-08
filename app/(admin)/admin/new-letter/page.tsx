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
  placeholders?: string;
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
    title: "SURAT KETERANGAN AKTIF SISWA",
    category: "Surat Keterangan",
    defaultNumber: "135/SKet/421.5/SMK.LI2/VIII/2026",
    defaultRecipient: "Siswa / Siswi Terlampir",
    defaultBody:
      "Yang bertanda tangan di bawah ini kepala Sekolah SMK Letris Indonesia 2 Pamulang Kota Tangerang Selatan - Prov. Banten menerangkan bahwa:\n\nNama : {{nama}}\nTempat Tanggal Lahir : {{tempat_tanggal_lahir}}\nJenis kelamin : {{jenis_kelamin}}\nNISN : {{nisn}}\nNPSN : 69894185\nKelas : {{kelas}}\nKompetensi Keahlian : {{kompetensi_keahlian}}\n\nBenar nama yang tersebut di atas terdaftar sebagai peserta didik kelas {{kelas}} di SMK Letris Indonesia 2 Tahun Ajaran 2026/2027. Demikian surat keterangan ini kami berikan untuk digunakan sebagaimana mestinya.",
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

function renderFormattedBody(text: string) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-justify font-serif text-[10.5px] leading-relaxed text-stone-900">
      {lines.map((line, idx) => {
        const colonPos = line.indexOf(":");
        if (colonPos !== -1 && !line.trim().startsWith("http") && colonPos < 35) {
          const key = line.slice(0, colonPos).trim();
          const val = line.slice(colonPos + 1).trim();
          return (
            <div key={idx} className="flex text-[10.5px] leading-tight my-0.5">
              <span className="w-36 shrink-0">{key}</span>
              <span className="mr-3">:</span>
              <span className="flex-1 font-medium">{val}</span>
            </div>
          );
        }
        return (
          <p key={idx} className={line.trim() === "" ? "h-2" : "min-h-4"}>
            {line}
          </p>
        );
      })}
    </div>
  );
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
          <div className="relative border-b-2 border-solid border-stone-900 pb-2 mb-3 text-center flex items-center justify-between">
            <img
              src={DEFAULT_LEFT_LOGO}
              alt="Logo Left"
              className="w-8 h-8 object-contain"
            />
            <div className="px-2">
              <p className="font-bold text-[8px] uppercase tracking-tighter">
                YAYASAN LEO SUTRISNO
              </p>
              <p className="font-bold text-[10px] uppercase">
                SMK LETRIS INDONESIA 2
              </p>
              <p className="text-[6px] font-sans text-stone-600">
                NPSN: 69894185 | NSS: 402286303080
              </p>
            </div>
            <img
              src={DEFAULT_RIGHT_LOGO}
              alt="Logo Right"
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className="text-center mb-3">
            <p className="font-bold underline uppercase text-[9px]">
              {template.title}
            </p>
            <p className="text-[7.5px] font-sans">
              Nomor : {template.defaultNumber || "[Auto]"}
            </p>
          </div>

          <div className="text-[7.5px] font-sans text-stone-700 leading-normal line-clamp-6 whitespace-pre-wrap">
            {bodyPreview}
          </div>
        </div>

        <div className="flex justify-end pt-2 font-serif text-[7.5px]">
          <div className="text-center w-32">
            <p>Tangerang Selatan, {currentDate || "..."}</p>
            <p className="font-semibold">Kepala SMK Letris Indonesia 2</p>
            <div className="h-6"></div>
            <p className="font-bold underline">Juaman, S.Kom</p>
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
          if (key === "nama") initialValues[key] = "Gilby Maleeq Jibrani";
          else if (key === "tempat_tanggal_lahir")
            initialValues[key] = "Jakarta, 17 Mei 2009";
          else if (key === "jenis_kelamin") initialValues[key] = "Laki-laki";
          else if (key === "nisn") initialValues[key] = "0092877072";
          else if (key === "kelas") initialValues[key] = "XII DKVB 4";
          else if (key === "kompetensi_keahlian")
            initialValues[key] = "Desain Komunikasi Visual";
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
                      <select className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs">
                        <option>SMK Letris Indonesia 2</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">
                        Logo Kanan
                      </span>
                      <select className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs">
                        <option>Provinsi Banten</option>
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

              {/* Live Preview Side */}
              <div className="sticky top-6 w-full max-w-md mx-auto">
                <div className="mb-2 flex items-center justify-between bg-stone-900 text-white px-3 py-2 rounded-xl">
                  <span className="text-xs font-medium">
                    A4 Live Document Export
                  </span>
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

                <div
                  id="printable-letter-document"
                  className="w-full min-h-145 bg-white rounded-xl shadow-2xl border border-stone-300 p-8 flex flex-col justify-between text-stone-900 font-serif text-[10.5px] leading-relaxed"
                >
                  <div className="flex flex-col flex-1 min-h-0">
                    <div className="relative border-b-2 border-solid border-stone-900 pb-2 mb-4 flex items-center justify-between shrink-0">
                      <img
                        src={DEFAULT_LEFT_LOGO}
                        alt="Logo Kiri"
                        className="w-12 h-12 object-contain"
                      />
                      <div className="px-2 text-center flex-1">
                        <h4 className="font-serif text-[10px] tracking-wide uppercase leading-tight text-stone-800">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-serif font-bold text-[13px] tracking-wide uppercase leading-tight text-stone-900">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[7.5px] font-sans text-stone-700 leading-tight">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[7.5px] font-sans font-bold text-stone-900 leading-tight">
                          ( AKREDITASI &quot; A &quot; )
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Kompetensi Keahlian : Desain Komunikasi Visual (DKV) ,
                          Teknik Jaringan Komputer dan Telekomunikasi (TJKT) ,
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen
                          Perkantoran dan Layanan Bisnis (MPLB) ,
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Pemasaran (PM) , Akuntansi Keuangan Lembaga ,
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp.
                          021-29446273 Kota Tangerang Selatan Provinsi Banten
                        </p>
                        <a
                          href="https://www.smkletris2pamulang.sch.id"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[6.5px] text-blue-700 underline font-sans block"
                        >
                          www.smkletris2pamulang.sch.id
                        </a>
                      </div>
                      <img
                        src={DEFAULT_RIGHT_LOGO}
                        alt="Logo Kanan"
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    <div className="text-center my-3 shrink-0 space-y-0.5">
                      <h2 className="font-serif font-bold uppercase text-[11px] underline tracking-wider">
                        {selectedTemplate?.title || "SURAT KETERANGAN"}
                      </h2>
                      <p className="font-serif text-[10px]">
                        Nomor : {letterNumber || "[Diisi oleh Admin]"}
                      </p>
                    </div>

                    <div className="my-2">
                      {renderFormattedBody(getRenderedBody())}
                    </div>

                    {attachmentUrl && (
                      <div className="mt-4 border-t border-stone-200 pt-2">
                        <img
                          src={attachmentUrl}
                          alt="Attachment"
                          className="max-h-28 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-6 mt-6 font-serif text-[10px] shrink-0">
                    <div className="text-center w-52 space-y-1">
                      <p>
                        Tangerang Selatan,{" "}
                        {date || "07 Agustus 2026"}
                      </p>
                      <p className="font-medium">Kepala SMK Letris Indonesia 2</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline text-stone-900">
                        Juaman, S.Kom
                      </p>
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
    <Suspense
      fallback={<div className="p-8 font-sans text-stone-600">Loading...</div>}
    >
      <AdminNewLetterContent />
    </Suspense>
  );
}