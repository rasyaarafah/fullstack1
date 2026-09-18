"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminLetterPreview } from "@/components/organisms/AdminLetterPreview";
import {
  LEFT_LOGO_OPTIONS,
  RIGHT_LOGO_OPTIONS,
  DEFAULT_LEFT_LOGO,
  DEFAULT_RIGHT_LOGO,
} from "@/lib/logoOptions";

interface DynamicTemplate {
  id?: string;
  title: string;
  category?: string;
  description?: string;
  signerName?: string;
  signerRole?: string;
}

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[\{\}]/g, "").trim());
  return Array.from(new Set(keys));
}

function TeacherEditLetterContent() {
  const router = useRouter();
  const params = useParams();
  const letterId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    name: "Teacher",
    username: "teacher",
    email: "teacher@smkletris2.sch.id",
    image: "",
    role: "teacher",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<DynamicTemplate | null>(null);

  const [title, setTitle] = useState("SURAT KETERANGAN AKTIF SISWA");
  const [letterNumber, setLetterNumber] = useState("");
  const [date, setDate] = useState("07 Agustus 2026");
  const [recipient, setRecipient] = useState("");
  const [rawBodyTemplate, setRawBodyTemplate] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  const [leftLogo, setLeftLogo] = useState<string>(DEFAULT_LEFT_LOGO);
  const [rightLogo, setRightLogo] = useState<string>(DEFAULT_RIGHT_LOGO);

  // Load User Session
  useEffect(() => {
    async function loadUserSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          if (user && user.email) {
            setCurrentUser({
              name: user.name || "Teacher",
              username: user.email ? user.email.split("@")[0] : "teacher",
              email: user.email,
              image: user.image || user.avatarUrl || "",
              role: user.role ? user.role.toLowerCase() : "teacher",
            });
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load active session:", error);
      }
    }
    loadUserSession();
  }, []);

  // Fetch Existing Letter Data
  useEffect(() => {
    async function fetchLetterData() {
      if (!letterId) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/letters/${letterId}`);
        if (res.ok) {
          const data = await res.json();

          setTitle(data.title || data.subject || "SURAT KETERANGAN AKTIF SISWA");
          setLetterNumber(data.letterNumber || "");
          setRecipient(data.recipient || "");
          setRawBodyTemplate(data.body || "");
          if (data.attachmentUrl) setAttachmentUrl(data.attachmentUrl);
          if (data.leftLogo) setLeftLogo(data.leftLogo);
          if (data.rightLogo) setRightLogo(data.rightLogo);

          setSelectedTemplate({
            id: data.templateId || "custom",
            title: data.title || "SURAT KETERANGAN AKTIF SISWA",
            category: data.type || "Surat Keterangan",
            signerName: data.signerName,
            signerRole: data.signerRole,
          });

          // Extract variables / placeholders
          const detectedKeys = extractPlaceholders(data.body || "");
          const vars =
            typeof data.variables === "string"
              ? JSON.parse(data.variables)
              : data.variables || {};

          const extractedValues: Record<string, string> = {};
          detectedKeys.forEach((key) => {
            extractedValues[key] = vars[key] || "";
          });
          setPlaceholderValues(extractedValues);
        } else {
          alert("Gagal memuat data surat.");
        }
      } catch (err) {
        console.error("Failed to fetch letter:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLetterData();
  }, [letterId]);

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleUpdateLetter = async (status: "PENDING" | "DRAFT") => {
    const finalTitle = title || "SURAT KETERANGAN AKTIF SISWA";
    const finalRecipient =
      recipient.trim() || placeholderValues["nama"] || "Siswa Terlampir";
    const finalBody = getRenderedBody();
    const finalNumber = letterNumber.trim();

    const payload = {
      title: finalTitle,
      letterNumber: finalNumber,
      recipient: finalRecipient,
      subject: finalTitle,
      body: finalBody,
      attachmentUrl: attachmentUrl || null,
      leftLogo,
      rightLogo,
      variables: placeholderValues,
      status,
      type: selectedTemplate?.category || "Surat Keterangan",
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/letters/${letterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok) {
        if (status === "PENDING") {
          alert("Perubahan surat berhasil dikirim ke Admin!");
          router.push("/teacher/pending");
        } else {
          alert("Perubahan draf surat berhasil disimpan!");
          router.push("/teacher/history");
        }
      } else {
        alert(
          `Gagal memperbarui surat: ${
            responseData.error || responseData.message || "Internal Server Error"
          }`
        );
      }
    } catch (err) {
      console.error("Error updating letter:", err);
      alert("Terjadi kesalahan koneksi saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: false },
    { label: "History", href: "/teacher/history", isActive: true },
    { label: "Pending", href: "/teacher/pending", isActive: false },
  ];

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems} currentUser={currentUser}>
        <div className="p-8 font-sans text-stone-500">Memuat data surat...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} currentUser={currentUser}>
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

        <div className="flex flex-col gap-6">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              ← Batal
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
              EDIT PENGAJUAN SURAT
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
              {title}
            </h1>
          </div>

          {/* Form on Left, Preview on Right Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 items-start">
            {/* Form Side */}
            <div className="bg-stone-50/50 p-6 rounded-2xl border border-stone-200 space-y-5">
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                  disabled={isSubmitting}
                  onClick={() => handleUpdateLetter("PENDING")}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Kirim ke Admin →"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateLetter("DRAFT")}
                  className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 disabled:opacity-50 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Simpan Sebagai Draf
                </button>
              </div>
            </div>

            {/* Live Preview Side */}
            <AdminLetterPreview
              letterData={{
                institutionName: "",
                letterNumber,
                date,
                recipient,
                subject: title,
                body: getRenderedBody(),
                attachmentUrl,
                leftLogo,
                rightLogo,
                signerName: selectedTemplate?.signerName,
                signerRole: selectedTemplate?.signerRole,
              }}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EditLetterPage() {
  return (
    <Suspense
      fallback={<div className="p-8 font-sans text-stone-600">Loading...</div>}
    >
      <TeacherEditLetterContent />
    </Suspense>
  );
}