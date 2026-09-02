import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.template.create({
    data: {
      title: "Surat Keterangan Aktif Siswa",
      category: "Surat Keterangan",
      description: "Surat keterangan resmi yang menyatakan bahwa siswa terdaftar aktif di SMK Letris Indonesia 2 Pamulang.",
      placeholders: JSON.stringify([
        { label: "Nomor Surat", key: "nomor_surat" },
        { label: "Nama Siswa", key: "nama_siswa" },
        { label: "Tempat Tanggal Lahir", key: "ttl" },
        { label: "Jenis Kelamin", key: "jenis_kelamin" },
        { label: "NISN", key: "nisn" },
        { label: "NPSN", key: "npsn" },
        { label: "Kelas", key: "kelas" },
        { label: "Kompetensi Keahlian", key: "kompetensi_keahlian" },
        { label: "Tahun Ajaran", key: "tahun_ajaran" },
        { label: "Tanggal Surat", key: "tanggal_surat" },
        { label: "Nama Kepsek", key: "nama_kepsek" }
      ]),
      bodyContent: 
`Yang bertanda tangan di bawah ini kepala Sekolah SMK Letris Indonesia 2 Pamulang Kota Tangerang Selatan - Prov. Banten menerangkan bahwa:

Nama                    : {{nama_siswa}}
Tempat Tanggal Lahir    : {{ttl}}
Jenis kelamin           : {{jenis_kelamin}}
NISN                    : {{nisn}}
NPSN                    : {{npsn}}
Kelas                   : {{kelas}}
Kompetensi Keahlian     : {{kompetensi_keahlian}}

Benar nama yang tersebut di atas terdaftar sebagai peserta didik kelas {{kelas}} di SMK Letris Indonesia 2 Tahun Ajaran {{tahun_ajaran}}. Demikian surat keterangan ini kami berikan untuk digunakan sebagaimana mestinya.`
    },
  });

  console.log("Template successfully seeded to database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });