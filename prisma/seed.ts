import { prisma } from "../lib/prisma";

async function main() {
  // Create an Admin user in MySQL
  const admin = await prisma.user.upsert({
    where: { email: "admin" },
    update: {},
    create: {
      name: "School Admin",
      email: "admin",
      password: "password123",
      role: "ADMIN",
    },
  });

  // Create a Teacher user in MySQL
  const teacher = await prisma.user.upsert({
    where: { email: "teacher" },
    update: {},
    create: {
      name: "John Doe",
      email: "teacher",
      password: "password123",
      role: "TEACHER",
    },
  });

  // Seed the "Surat Keterangan Aktif Siswa" template — idempotent, so
  // re-running `prisma db seed` won't create duplicates.
  const existingTemplate = await prisma.template.findFirst({
    where: { title: "Surat Keterangan Aktif Siswa" },
  });

  const template =
    existingTemplate ||
    (await prisma.template.create({
      data: {
        title: "Surat Keterangan Aktif Siswa",
        category: "Surat Keterangan",
        description:
          "Surat keterangan resmi yang menyatakan bahwa siswa terdaftar aktif di SMK Letris Indonesia 2 Pamulang.",
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
          { label: "Nama Kepsek", key: "nama_kepsek" },
        ]),
        bodyContent: `Yang bertanda tangan di bawah ini kepala Sekolah SMK Letris Indonesia 2 Pamulang Kota Tangerang Selatan - Prov. Banten menerangkan bahwa:

Nama                    : {{nama_siswa}}
Tempat Tanggal Lahir    : {{ttl}}
Jenis kelamin           : {{jenis_kelamin}}
NISN                    : {{nisn}}
NPSN                    : {{npsn}}
Kelas                   : {{kelas}}
Kompetensi Keahlian     : {{kompetensi_keahlian}}

Benar nama yang tersebut di atas terdaftar sebagai peserta didik kelas {{kelas}} di SMK Letris Indonesia 2 Tahun Ajaran {{tahun_ajaran}}. Demikian surat keterangan ini kami berikan untuk digunakan sebagaimana mestinya.`,
      },
    }));

  console.log("Database seeded successfully!");
  console.log({ admin, teacher, template });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });