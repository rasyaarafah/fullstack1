"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

// Interface to keep track of active field focus and selection details
interface ActiveInputState {
  setter: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  selectionStart: number;
  selectionEnd: number;
}

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;

  // Ref mapping for input and textarea controls
  const inputRefs = {
    yayasan: useRef<HTMLInputElement>(null),
    schoolName: useRef<HTMLInputElement>(null),
    npsnNss: useRef<HTMLInputElement>(null),
    akreditasi: useRef<HTMLInputElement>(null),
    jurusan: useRef<HTMLTextAreaElement>(null),
    address: useRef<HTMLTextAreaElement>(null),
    cityDate: useRef<HTMLInputElement>(null),
    nomor: useRef<HTMLInputElement>(null),
    perihal: useRef<HTMLInputElement>(null),
    recipient: useRef<HTMLTextAreaElement>(null),
    openingText: useRef<HTMLTextAreaElement>(null),
    closingText: useRef<HTMLTextAreaElement>(null),
    eventDay: useRef<HTMLInputElement>(null),
    eventTime: useRef<HTMLInputElement>(null),
    eventLocation: useRef<HTMLInputElement>(null),
    signerTitle: useRef<HTMLInputElement>(null),
    signerName: useRef<HTMLInputElement>(null),
  };

  // Track currently active input/textarea for inserting variables accurately
  const [activeInput, setActiveInput] = useState<ActiveInputState | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Active View Tab on Mobile (form vs preview)
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

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

  // Header Details State
  const [yayasan, setYayasan] = useState("YAYASAN LEO SUTRISNO");
  const [schoolName, setSchoolName] = useState("SMK LETRIS INDONESIA 2");
  const [npsnNss, setNpsnNss] = useState("NPSN : 69894185 NSS : 402286303080");
  const [akreditasi, setAkreditasi] = useState('( AKREDITASI " A " )');
  const [jurusan, setJurusan] = useState(
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga"
  );
  const [address, setAddress] = useState(
    "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten"
  );
  const [website, setWebsite] = useState("www.smkletris2pamulang.sch.id");

  // Letter Metadata State
  const [cityDate, setCityDate] = useState("Tangerang Selatan, {tanggal_surat}");
  const [nomor, setNomor] = useState("{nomor_surat}");
  const [perihal, setPerihal] = useState("Undangan Pengambilan Raport");
  const [recipient, setRecipient] = useState(
    "Bapak/Ibu Orang Tua/Wali Siswa\n{nama_siswa}"
  );

  // Body Paragraphs State
  const [openingText, setOpeningText] = useState(
    "Sehubungan dengan telah berakhirnya kegiatan Pembelajaran Semester, maka SMK Letris Indonesia 2 akan mengadakan pembagian raport. Untuk itu, kami mengundang para Bapak/Ibu Orang tua/Wali siswa untuk mengambil raport pada :"
  );
  const [closingText, setClosingText] = useState(
    "Demikian surat undangan ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih."
  );

  // Event Details
  const [eventDay, setEventDay] = useState("{hari_tanggal}");
  const [eventTime, setEventTime] = useState("{waktu}");
  const [eventLocation, setEventLocation] = useState(
    "Aula SMK Letris Indonesia 2"
  );

  // Signer Details
  const [signerTitle, setSignerTitle] = useState(
    "Kepala Sekolah SMK Letris Indonesia 2"
  );
  const [signerName, setSignerName] = useState("{nama_kepala_sekolah}");

  const availableVariables = [
    "{tanggal_surat}",
    "{nomor_surat}",
    "{nama_siswa}",
    "{hari_tanggal}",
    "{waktu}",
    "{nama_kepala_sekolah}",
  ];

  // Fetch initial template data if templateId exists
  useEffect(() => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.yayasan) setYayasan(data.yayasan);
          if (data.schoolName) setSchoolName(data.schoolName);
          if (data.npsnNss) setNpsnNss(data.npsnNss);
          if (data.akreditasi) setAkreditasi(data.akreditasi);
          if (data.jurusan) setJurusan(data.jurusan);
          if (data.address) setAddress(data.address);
          if (data.website) setWebsite(data.website);
          if (data.cityDate) setCityDate(data.cityDate);
          if (data.nomor) setNomor(data.nomor);
          if (data.perihal) setPerihal(data.perihal);
          if (data.recipient) setRecipient(data.recipient);
          if (data.openingText) setOpeningText(data.openingText);
          if (data.closingText) setClosingText(data.closingText);
          if (data.eventDay) setEventDay(data.eventDay);
          if (data.eventTime) setEventTime(data.eventTime);
          if (data.eventLocation) setEventLocation(data.eventLocation);
          if (data.signerTitle) setSignerTitle(data.signerTitle);
          if (data.signerName) setSignerName(data.signerName);
        }
      } catch (err) {
        console.error("Failed to fetch template details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId]);

  // Handle setting focused/selected state on inputs
  const handleInputFocusOrSelect = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  ) => {
    const el = ref.current;
    if (el) {
      setActiveInput({
        setter,
        value,
        ref,
        selectionStart: el.selectionStart ?? value.length,
        selectionEnd: el.selectionEnd ?? value.length,
      });
    }
  };

  // Smart Insert Variable into Active Input at exact cursor position
  const handleInsertVariable = (variableStr: string) => {
    if (!activeInput || !activeInput.ref.current) return;

    const el = activeInput.ref.current;
    const start = activeInput.selectionStart;
    const end = activeInput.selectionEnd;
    const currentValue = activeInput.value;

    const newValue =
      currentValue.substring(0, start) + variableStr + currentValue.substring(end);

    // Update state using the setter
    activeInput.setter(newValue);

    // Calculate new cursor position
    const newCursorPos = start + variableStr.length;

    // Restore focus and cursor position after re-render
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
      setActiveInput({
        ...activeInput,
        value: newValue,
        selectionStart: newCursorPos,
        selectionEnd: newCursorPos,
      });
    }, 0);
  };

  // Save template via PUT/POST API
  const handleSave = async () => {
    setSaving(true);
    const payload = {
      yayasan,
      schoolName,
      npsnNss,
      akreditasi,
      jurusan,
      address,
      website,
      cityDate,
      nomor,
      perihal,
      recipient,
      openingText,
      closingText,
      eventDay,
      eventTime,
      eventLocation,
      signerTitle,
      signerName,
    };

    try {
      const url = templateId
        ? `/api/templates/${templateId}`
        : "/api/templates";
      const method = templateId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Template saved successfully!");
        router.push("/admin/templates/edit");
      } else {
        alert("Failed to save template.");
      }
    } catch (err) {
      console.error("Error saving template:", err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
        <div className="py-20 text-center font-serif text-stone-600">
          Loading template editor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
          }
        }
      `}</style>

      <div className="space-y-4 max-w-[1600px] mx-auto w-full px-2 sm:px-4 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-300 pb-3 no-print">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/templates/edit"
              className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors border border-stone-800 text-stone-800 shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 leading-tight">
                Edit Template:{" "}
                <span className="italic font-normal">{schoolName}</span>
              </h1>
              <p className="font-serif text-xs text-stone-500">
                A4 Document Standard (210mm x 297mm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href={`/admin/templates/preview/${templateId}`}
              target="_blank"
              className="px-3 py-1.5 border border-stone-800 rounded-lg font-serif text-xs sm:text-sm text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Full Preview</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-serif text-xs sm:text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Dynamic Variable Pills (Clickable to append/insert at cursor) */}
        <div className="bg-stone-50 p-2.5 border border-stone-300 rounded-xl flex items-center gap-2 overflow-x-auto no-print">
          <span className="font-serif text-xs font-semibold text-stone-700 whitespace-nowrap">
            Click variable to insert at cursor:
          </span>
          {availableVariables.map((v) => (
            <button
              key={v}
              type="button"
              onMouseDown={(e) => {
                // Prevent focus shift away from input field
                e.preventDefault();
                handleInsertVariable(v);
              }}
              className="px-2 py-0.5 text-xs font-mono bg-white border border-stone-400 rounded text-stone-800 shrink-0 hover:bg-stone-200 active:scale-95 transition-all cursor-pointer"
            >
              {v}
            </button>
          ))}
        </div>

        {/* Mobile Tab Switcher Toggle */}
        <div className="flex xl:hidden border border-stone-800 rounded-lg overflow-hidden bg-stone-100 p-1 no-print">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-2 text-xs font-serif font-bold rounded-md transition-colors ${
              activeTab === "form"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-700 hover:bg-stone-200"
            }`}
          >
            Form Controls
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-xs font-serif font-bold rounded-md transition-colors ${
              activeTab === "preview"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-700 hover:bg-stone-200"
            }`}
          >
            Live Document Preview
          </button>
        </div>

        {/* Editor Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Form Controls Column */}
          <div
            className={`xl:col-span-5 space-y-4 bg-white p-4 sm:p-5 border border-stone-800 rounded-xl xl:max-h-[85vh] xl:overflow-y-auto no-print ${
              activeTab === "form" ? "block" : "hidden xl:block"
            }`}
          >
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b pb-2 border-stone-200">
              Template Controls
            </h2>

            {/* Header Details */}
            <div className="space-y-3">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Header (Kop Surat)
              </h3>
              <div>
                <label htmlFor="yayasan" className="block text-xs font-semibold text-stone-600 mb-1">
                  Yayasan
                </label>
                <input
                  id="yayasan"
                  ref={inputRefs.yayasan}
                  type="text"
                  value={yayasan}
                  onFocus={() => handleInputFocusOrSelect(setYayasan, yayasan, inputRefs.yayasan)}
                  onSelect={() => handleInputFocusOrSelect(setYayasan, yayasan, inputRefs.yayasan)}
                  onChange={(e) => {
                    setYayasan(e.target.value);
                    handleInputFocusOrSelect(setYayasan, e.target.value, inputRefs.yayasan);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="schoolName" className="block text-xs font-semibold text-stone-600 mb-1">
                  Nama Sekolah
                </label>
                <input
                  id="schoolName"
                  ref={inputRefs.schoolName}
                  type="text"
                  value={schoolName}
                  onFocus={() => handleInputFocusOrSelect(setSchoolName, schoolName, inputRefs.schoolName)}
                  onSelect={() => handleInputFocusOrSelect(setSchoolName, schoolName, inputRefs.schoolName)}
                  onChange={(e) => {
                    setSchoolName(e.target.value);
                    handleInputFocusOrSelect(setSchoolName, e.target.value, inputRefs.schoolName);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs font-bold focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="npsnNss" className="block text-xs font-semibold text-stone-600 mb-1">
                    NPSN / NSS
                  </label>
                  <input
                    id="npsnNss"
                    ref={inputRefs.npsnNss}
                    type="text"
                    value={npsnNss}
                    onFocus={() => handleInputFocusOrSelect(setNpsnNss, npsnNss, inputRefs.npsnNss)}
                    onSelect={() => handleInputFocusOrSelect(setNpsnNss, npsnNss, inputRefs.npsnNss)}
                    onChange={(e) => {
                      setNpsnNss(e.target.value);
                      handleInputFocusOrSelect(setNpsnNss, e.target.value, inputRefs.npsnNss);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="akreditasi" className="block text-xs font-semibold text-stone-600 mb-1">
                    Akreditasi
                  </label>
                  <input
                    id="akreditasi"
                    ref={inputRefs.akreditasi}
                    type="text"
                    value={akreditasi}
                    onFocus={() => handleInputFocusOrSelect(setAkreditasi, akreditasi, inputRefs.akreditasi)}
                    onSelect={() => handleInputFocusOrSelect(setAkreditasi, akreditasi, inputRefs.akreditasi)}
                    onChange={(e) => {
                      setAkreditasi(e.target.value);
                      handleInputFocusOrSelect(setAkreditasi, e.target.value, inputRefs.akreditasi);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="jurusan" className="block text-xs font-semibold text-stone-600 mb-1">
                  Jurusan / Keahlian
                </label>
                <textarea
                  id="jurusan"
                  ref={inputRefs.jurusan}
                  rows={2}
                  value={jurusan}
                  onFocus={() => handleInputFocusOrSelect(setJurusan, jurusan, inputRefs.jurusan)}
                  onSelect={() => handleInputFocusOrSelect(setJurusan, jurusan, inputRefs.jurusan)}
                  onChange={(e) => {
                    setJurusan(e.target.value);
                    handleInputFocusOrSelect(setJurusan, e.target.value, inputRefs.jurusan);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-stone-600 mb-1">
                  Alamat
                </label>
                <textarea
                  id="address"
                  ref={inputRefs.address}
                  rows={2}
                  value={address}
                  onFocus={() => handleInputFocusOrSelect(setAddress, address, inputRefs.address)}
                  onSelect={() => handleInputFocusOrSelect(setAddress, address, inputRefs.address)}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    handleInputFocusOrSelect(setAddress, e.target.value, inputRefs.address);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Letter Metadata */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Surat Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="nomor" className="block text-xs font-semibold text-stone-600 mb-1">
                    Nomor Surat
                  </label>
                  <input
                    id="nomor"
                    ref={inputRefs.nomor}
                    type="text"
                    value={nomor}
                    onFocus={() => handleInputFocusOrSelect(setNomor, nomor, inputRefs.nomor)}
                    onSelect={() => handleInputFocusOrSelect(setNomor, nomor, inputRefs.nomor)}
                    onChange={(e) => {
                      setNomor(e.target.value);
                      handleInputFocusOrSelect(setNomor, e.target.value, inputRefs.nomor);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cityDate" className="block text-xs font-semibold text-stone-600 mb-1">
                    Kota & Tanggal
                  </label>
                  <input
                    id="cityDate"
                    ref={inputRefs.cityDate}
                    type="text"
                    value={cityDate}
                    onFocus={() => handleInputFocusOrSelect(setCityDate, cityDate, inputRefs.cityDate)}
                    onSelect={() => handleInputFocusOrSelect(setCityDate, cityDate, inputRefs.cityDate)}
                    onChange={(e) => {
                      setCityDate(e.target.value);
                      handleInputFocusOrSelect(setCityDate, e.target.value, inputRefs.cityDate);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="perihal" className="block text-xs font-semibold text-stone-600 mb-1">
                  Perihal
                </label>
                <input
                  id="perihal"
                  ref={inputRefs.perihal}
                  type="text"
                  value={perihal}
                  onFocus={() => handleInputFocusOrSelect(setPerihal, perihal, inputRefs.perihal)}
                  onSelect={() => handleInputFocusOrSelect(setPerihal, perihal, inputRefs.perihal)}
                  onChange={(e) => {
                    setPerihal(e.target.value);
                    handleInputFocusOrSelect(setPerihal, e.target.value, inputRefs.perihal);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="recipient" className="block text-xs font-semibold text-stone-600 mb-1">
                  Penerima (Recipient)
                </label>
                <textarea
                  id="recipient"
                  ref={inputRefs.recipient}
                  rows={2}
                  value={recipient}
                  onFocus={() => handleInputFocusOrSelect(setRecipient, recipient, inputRefs.recipient)}
                  onSelect={() => handleInputFocusOrSelect(setRecipient, recipient, inputRefs.recipient)}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    handleInputFocusOrSelect(setRecipient, e.target.value, inputRefs.recipient);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Body Paragraphs
              </h3>
              <div>
                <label htmlFor="openingText" className="block text-xs font-semibold text-stone-600 mb-1">
                  Paragraf Pembuka (Opening)
                </label>
                <textarea
                  id="openingText"
                  ref={inputRefs.openingText}
                  rows={4}
                  value={openingText}
                  onFocus={() => handleInputFocusOrSelect(setOpeningText, openingText, inputRefs.openingText)}
                  onSelect={() => handleInputFocusOrSelect(setOpeningText, openingText, inputRefs.openingText)}
                  onChange={(e) => {
                    setOpeningText(e.target.value);
                    handleInputFocusOrSelect(setOpeningText, e.target.value, inputRefs.openingText);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs leading-relaxed focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="closingText" className="block text-xs font-semibold text-stone-600 mb-1">
                  Paragraf Penutup (Closing)
                </label>
                <textarea
                  id="closingText"
                  ref={inputRefs.closingText}
                  rows={3}
                  value={closingText}
                  onFocus={() => handleInputFocusOrSelect(setClosingText, closingText, inputRefs.closingText)}
                  onSelect={() => handleInputFocusOrSelect(setClosingText, closingText, inputRefs.closingText)}
                  onChange={(e) => {
                    setClosingText(e.target.value);
                    handleInputFocusOrSelect(setClosingText, e.target.value, inputRefs.closingText);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs leading-relaxed focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Event Schedule
              </h3>
              <div>
                <label htmlFor="eventDay" className="block text-xs font-semibold text-stone-600 mb-1">
                  Hari / Tanggal
                </label>
                <input
                  id="eventDay"
                  ref={inputRefs.eventDay}
                  type="text"
                  value={eventDay}
                  onFocus={() => handleInputFocusOrSelect(setEventDay, eventDay, inputRefs.eventDay)}
                  onSelect={() => handleInputFocusOrSelect(setEventDay, eventDay, inputRefs.eventDay)}
                  onChange={(e) => {
                    setEventDay(e.target.value);
                    handleInputFocusOrSelect(setEventDay, e.target.value, inputRefs.eventDay);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="eventTime" className="block text-xs font-semibold text-stone-600 mb-1">
                    Waktu
                  </label>
                  <input
                    id="eventTime"
                    ref={inputRefs.eventTime}
                    type="text"
                    value={eventTime}
                    onFocus={() => handleInputFocusOrSelect(setEventTime, eventTime, inputRefs.eventTime)}
                    onSelect={() => handleInputFocusOrSelect(setEventTime, eventTime, inputRefs.eventTime)}
                    onChange={(e) => {
                      setEventTime(e.target.value);
                      handleInputFocusOrSelect(setEventTime, e.target.value, inputRefs.eventTime);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-xs font-semibold text-stone-600 mb-1">
                    Tempat
                  </label>
                  <input
                    id="eventLocation"
                    ref={inputRefs.eventLocation}
                    type="text"
                    value={eventLocation}
                    onFocus={() => handleInputFocusOrSelect(setEventLocation, eventLocation, inputRefs.eventLocation)}
                    onSelect={() => handleInputFocusOrSelect(setEventLocation, eventLocation, inputRefs.eventLocation)}
                    onChange={(e) => {
                      setEventLocation(e.target.value);
                      handleInputFocusOrSelect(setEventLocation, e.target.value, inputRefs.eventLocation);
                    }}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Signer Details */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Signer
              </h3>
              <div>
                <label htmlFor="signerTitle" className="block text-xs font-semibold text-stone-600 mb-1">
                  Jabatan Penandatangan
                </label>
                <input
                  id="signerTitle"
                  ref={inputRefs.signerTitle}
                  type="text"
                  value={signerTitle}
                  onFocus={() => handleInputFocusOrSelect(setSignerTitle, signerTitle, inputRefs.signerTitle)}
                  onSelect={() => handleInputFocusOrSelect(setSignerTitle, signerTitle, inputRefs.signerTitle)}
                  onChange={(e) => {
                    setSignerTitle(e.target.value);
                    handleInputFocusOrSelect(setSignerTitle, e.target.value, inputRefs.signerTitle);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="signerName" className="block text-xs font-semibold text-stone-600 mb-1">
                  Nama Penandatangan
                </label>
                <input
                  id="signerName"
                  ref={inputRefs.signerName}
                  type="text"
                  value={signerName}
                  onFocus={() => handleInputFocusOrSelect(setSignerName, signerName, inputRefs.signerName)}
                  onSelect={() => handleInputFocusOrSelect(setSignerName, signerName, inputRefs.signerName)}
                  onChange={(e) => {
                    setSignerName(e.target.value);
                    handleInputFocusOrSelect(setSignerName, e.target.value, inputRefs.signerName);
                  }}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs font-bold focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Clean Preview Wrapper */}
          <div
            className={`xl:col-span-7 bg-stone-200 p-2 sm:p-4 rounded-xl border border-stone-800 w-full xl:max-h-[85vh] xl:overflow-y-auto ${
              activeTab === "preview" ? "block" : "hidden xl:block"
            }`}
          >
            <div className="a4-container w-full xl:w-[210mm] xl:min-h-[297mm] mx-auto bg-white p-4 sm:p-8 xl:p-12 border border-stone-300 shadow-md font-serif text-stone-900 text-[11px] sm:text-xs leading-normal flex flex-col justify-between box-border">
              <div>
                {/* Header Kop Surat */}
                <div className="flex items-center justify-between gap-2 border-b-2 border-stone-900 pb-2 mb-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center border-2 border-dashed border-blue-600 rounded-full bg-blue-50 text-[8px] font-bold text-blue-900 text-center p-0.5">
                    LOGO LETRIS
                  </div>

                  <div className="text-center flex-1 space-y-0.5">
                    <h2 className="font-bold text-[9px] sm:text-[11px] tracking-wider uppercase">
                      {yayasan}
                    </h2>
                    <h1 className="font-extrabold text-[11px] sm:text-sm xl:text-base tracking-wide uppercase leading-tight">
                      {schoolName}
                    </h1>
                    <p className="font-semibold text-[8px] sm:text-[10px]">
                      {npsnNss}
                    </p>
                    <p className="font-bold text-[8px] sm:text-[10px]">
                      {akreditasi}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] leading-tight text-stone-700">
                      {jurusan}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] text-stone-700">
                      {address}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] text-blue-800 underline">
                      {website}
                    </p>
                  </div>

                  <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center border-2 border-dashed border-emerald-600 rounded bg-emerald-50 text-[8px] font-bold text-emerald-900 text-center p-0.5">
                    LOGO BANTEN
                  </div>
                </div>

                {/* City and Date Header */}
                <div className="flex justify-end mb-4">
                  <span>{cityDate}</span>
                </div>

                {/* Letter Metadata */}
                <div className="space-y-1 mb-4">
                  <div className="flex gap-2">
                    <span className="w-16 sm:w-20">Nomor</span>
                    <span>: {nomor}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 sm:w-20">Perihal</span>
                    <span className="font-semibold">: {perihal}</span>
                  </div>
                  <div className="pt-2 space-y-0.5">
                    <p>Kepada Yth,</p>
                    <p className="font-semibold whitespace-pre-line leading-snug">
                      {recipient}
                    </p>
                    <p>di Tempat</p>
                  </div>
                </div>

                {/* Opening Body */}
                <div className="space-y-2 mb-4">
                  <p>Dengan hormat,</p>
                  <p className="text-justify indent-6 sm:indent-8 leading-relaxed">
                    {openingText}
                  </p>
                </div>

                {/* Event Schedule Details */}
                <div className="pl-4 sm:pl-8 space-y-1 mb-4">
                  <div className="flex gap-2">
                    <span className="w-24 sm:w-28">Hari/Tanggal</span>
                    <span>: {eventDay}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-24 sm:w-28">Waktu</span>
                    <span>: {eventTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-24 sm:w-28">Tempat</span>
                    <span>: {eventLocation}</span>
                  </div>
                </div>

                {/* Closing Body */}
                <div className="space-y-2 mb-4">
                  <p className="text-justify indent-6 sm:indent-8 leading-relaxed">
                    {closingText}
                  </p>
                </div>
              </div>

              {/* Bottom Signature Section */}
              <div className="flex justify-end pt-4 mt-4">
                <div className="text-center min-w-36 sm:min-w-48 space-y-10">
                  <div>
                    <p>Hormat Kami,</p>
                    <p className="font-semibold">{signerTitle}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">
                      {signerName}
                    </p>
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