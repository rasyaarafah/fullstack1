import React from "react";
import { Input } from "../atoms/Input";
import { TextArea } from "../atoms/TextArea";
import { Button } from "../atoms/Button";

export interface LetterFormData{
    institutionName: string;
    letterNumber: string;
    subject: string;
    recipient: string;
    date: string;
    body: string;
}

interface LetterFormEditorProps {
    formData: LetterFormData;
    onChange: (field: keyof LetterFormData, value: string) => void;
    onSubmit?: () => void;
    onExportPdf?: () => void;
}

export const LetterFormEditor = ({
    formData,
    onChange,
    onSubmit,
    onExportPdf,
}: LetterFormEditorProps) => {
    return (
        <div className="grid grid-cols-1 lg-grid-cols-2 gap-6 w-full h-[calc(100vh-140px)]">
            {/* Left Collumn: Form Inputs */}
            <div className="flex flex-col gap-4 p-5 bg-white-border border-black/10 rounded-2xl overflow-y-auto">
            <h3 className="text-lg font-bold text-black border-b border-black/10 pb-3">
                Edit Detail Surat
            </h3>

            <Input
            label="Tanggal Surat"
            type="date"
            value={formData.date}
            onChange={(e) => onChange("date", e.target.value)}
            />

            </div>

            <Input
            label="Penerima Surat"
            placeholder="Permohonan Kerjasama"
            value={formData.subject}
            onChange={(e) => onChange("subject", e.target.value)}
            />

            <TextArea
            label="Isi Surat"
            placeholder="Tuliskan isi lengkap surat di sini..."
            value={formData.body}
            onChange={(e) => onChange("body", e.target.value)}
            rows={6}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
            <Button variant="Outline" onClick={onExportPdf}>
                Simpan Surat
            </Button>
            </div>

            {/* Right Collumn: Live Letter Preview */}
            <div className="flex flex-col p-6  bg-gray-100 border border-black/10 rounded-2xl overflow-y-auto items-center">
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 self-start">
                Pratinjau Langsung
            </span>
            
            {/* Paper Document Preview Sheet */}
            <div className="w-full max-w-125px min -h-[650px] bg-white border border-gray-300 shadow-md p-8 flex flex-col justify-between text-black text-xs font-serif leading-relaxed">
             <div>
                {/* kop Surat Header */}
                <div className="text-center border-b-2 border-black pb-3 mb-4">
                    <h2 className="font-bold text-sm uppercase tracking-wide">
                        {formData.institutionName || "[Nama Instansi Mandiri]"} 
                    </h2>
                    <p className="text-[10px] text-gray-600 italic">
                        Jl. Pendidikan No.12, Jakarta Selatan | Telp: (021) 555-0199
                    </p>
                </div>

                {/* Letter Meta */}
                <div className="flex justidy-between items-start mb-4">
                    <div>
                        <p>Nomor : {formData.letterNumber || "___/__/2026"}</p>
                        <p>Hal : {formData.subject || "-"}</p>
                    </div>
                    <p className="text-right"> {formData.date || "Jakarta, ___"} </p>
                </div>

                {/* Recipient */}
                <div className="mb-4">
                    <p>Kepada Yth.</p>
                    <p className="font-semibold">
                        {formData.recipient || "[Nama / Jabatan Penerima]"}
                    </p>
                </div>

                {/* Signature Placeholder */}
                <div className="flex justify-end pt-6">
                    <div className="text-center w-36">
                        <p>Hormat Kami,</p>
                        <div className="h-12"></div>
                        <p className="font-bold border-b border-black inline-block px-2">
                            [Penandatangan]
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
    </div>
    );
};