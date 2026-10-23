document.addEventListener('DOMContentLoaded', function () {
  updateCV();
});

// ==============================================
// UBAH BAHASA JADI BAKU OTOMATIS
// ==============================================
function ubahKeFormal(teks) {
  if (!teks) return teks;
  const aturan = [
    {dari: /\baku\b/g, ke: "Saya"},
    {dari: /\bgue\b/g, ke: "Saya"},
    {dari: /\bgua\b/g, ke: "Saya"},
    {dari: /\bbisa pakai/gi, ke: "mahir mengoperasikan"},
    {dari: /\bbisa make/gi, ke: "mahir menguasai"},
    {dari: /\bmicrosoft/gi, ke: "Microsoft Office"},
    {dari: /\budah\b/gi, ke: "telah"},
    {dari: /\bgak\b|\bnggak\b/gi, ke: "tidak"},
    {dari: /\bbanget\b/gi, ke: "sangat"},
    {dari: /\bkerjain\b/gi, ke: "menyelesaikan"},
    {dari: /\bngerjain\b/gi, ke: "melaksanakan"},
    {dari: /\bbikin\b/gi, ke: "menyusun"},
    {dari: /\bjago\b/gi, ke: "sangat menguasai"},
    {dari: /\bpunya\b/gi, ke: "memiliki"},
    {dari: /\bbantu\b/gi, ke: "membantu"},
    {dari: /\bkarna\b/gi, ke: "karena"},
    {dari: /\byg\b/gi, ke: "yang"},
    {dari: /\bdgn\b/gi, ke: "dengan"},
    {dari: /\bdlm\b/gi, ke: "dalam"},
    {dari: /\bskrg\b/gi, ke: "saat ini"}
  ];
  let hasil = teks;
  aturan.forEach(a => hasil = hasil.replace(a.dari, a.ke));
  hasil = hasil.trim();
  return hasil.charAt(0).toUpperCase() + hasil.slice(1);
}

// ==============================================
// PERBARUI ISI CV
// ==============================================
function updateCV() {
  document.getElementById('cv-nama').textContent = 
    document.getElementById('nama').value || 'Nama Lengkap';
  document.getElementById('cv-jabatan').textContent = 
    document.getElementById('jabatan').value || 'Jabatan / Tujuan';
  document.getElementById('cv-email').textContent = 
    document.getElementById('email').value || 'email@kamu.com';
  document.getElementById('cv-telp').textContent = 
    document.getElementById('telp').value || '08xx-xxxx-xxxx';
  document.getElementById('cv-alamat').textContent = 
    document.getElementById('alamat').value || 'Alamat Lengkap';

  // Buat Inisial Otomatis
  const nama = document.getElementById('nama').value || '';
  const inisial = nama
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .filter(kata => kata.length > 0)
    .map(kata => kata[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const elemenInisial = document.getElementById('initial');
  if (elemenInisial) elemenInisial.textContent = inisial || 'SA';

  // Perbarui semua bagian teks
  ubahFormatOtomatis('profil', 'cv-profil', true);
  ubahFormatOtomatis('pendidikan', 'cv-pendidikan', true);
  ubahFormatOtomatis('pengalaman', 'cv-pengalaman', true);
  ubahFormatOtomatis('keahlian', 'cv-keahlian', true);
  ubahFormatOtomatis('sertifikat', 'cv-sertifikat', true);
  ubahFormatOtomatis('organisasi', 'cv-organisasi', true);
}

// ==============================================
// UBAH FORMAT TEKS & BAHASA
// ==============================================
function ubahFormatOtomatis(inputId, targetId, pakaiFormal = false) {
  const input = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;

  let teks = input.value;
  if (!teks) {
    target.innerHTML = '<em>Belum diisi...</em>';
    return;
  }

  if (pakaiFormal) {
    teks = ubahKeFormal(teks);
  }

  target.innerHTML = teks.replace(/\n/g, '<br>');
}

// ==============================================
// TAMPILKAN FOTO PROFIL
// ==============================================
function tampilkanFoto() {
  const input = document.getElementById('unggah-foto');
  const tampilFoto = document.getElementById('tampil-foto');
  const inisial = document.getElementById('initial');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      tampilFoto.src = e.target.result;
      tampilFoto.style.display = 'block';
      if (inisial) inisial.style.display = 'none';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ==============================================
// GANTI WARNA AKSEN
// ==============================================
let warnaAksenSaatIni = '#1e293b';
function gantiWarna(tombol) {
  document.querySelectorAll('.warna-pilihan .warna').forEach(b => b.classList.remove('aktif'));
  tombol.classList.add('aktif');
  warnaAksenSaatIni = tombol.dataset.warna;

  const fotoProfil = document.getElementById('foto-profil');
  const garis = document.getElementById('garis-pemisah');
  if (fotoProfil) fotoProfil.style.background = warnaAksenSaatIni;
  if (garis) garis.style.background = warnaAksenSaatIni;
  
  document.querySelectorAll('.cv-konten h3').forEach(judul => {
    judul.style.color = warnaAksenSaatIni;
    judul.style.borderBottomColor = warnaAksenSaatIni + '40';
  });
}

// ==============================================
// GANTI WARNA LATAR KERTAS
// ==============================================
function gantiLatar(tombol) {
  document.querySelectorAll('.warna-latar .warna').forEach(b => b.classList.remove('aktif'));
  tombol.classList.add('aktif');
  const cvPreview = document.getElementById('cv-preview');
  if (cvPreview) cvPreview.style.background = tombol.dataset.latar;
}

// ==============================================
// UNDUH KE PDF
// ==============================================

async function unduhPDF() {
  const elemen = document.getElementById("cv-preview");

  if (!elemen) {
    alert("Bagian CV tidak ditemukan!");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("Library PDF belum dimuat. Periksa koneksi internet.");
    return;
  }

  const tombol = document.querySelector(".btn-unduh");

  try {
    if (tombol) {
      tombol.disabled = true;
      tombol.textContent = "Sedang membuat PDF...";
    }

    // Tunggu font selesai dimuat
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Tunggu gambar di CV selesai dimuat
    const gambar = Array.from(elemen.querySelectorAll("img"));

    await Promise.all(
      gambar.map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Pastikan CV mempunyai ukuran yang bisa dicetak
    if (elemen.getBoundingClientRect().width === 0 ||
        elemen.getBoundingClientRect().height === 0) {
      throw new Error(
        "Pratinjau CV tidak terlihat atau ukurannya nol."
      );
    }

    const nama =
      document.getElementById("nama")?.value.trim() || "Saya";

    const namaAman = nama.replace(/[\\/:*?"<>|]/g, "_");

    const opsi = {
      margin: [8, 8, 8, 8],
      filename: `CV_${namaAman}.pdf`,

      image: {
        type: "jpeg",
        quality: 0.98
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
        scrollX: 0,
        scrollY: 0,

        onclone: function (dokumen) {
          const cv = dokumen.getElementById("cv-preview");

          if (cv) {
            cv.style.display = "block";
            cv.style.visibility = "visible";
            cv.style.opacity = "1";
            cv.style.height = "auto";
            cv.style.maxHeight = "none";
            cv.style.overflow = "visible";
            cv.style.transform = "none";
            cv.style.backgroundColor =
              getComputedStyle(elemen).backgroundColor || "#ffffff";
          }
        }
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },

      pagebreak: {
        mode: ["css", "legacy"]
      }
    };

    await html2pdf()
      .set(opsi)
      .from(elemen)
      .save();

  } catch (error) {
    console.error("Kesalahan saat membuat PDF:", error);

    alert(
      "PDF gagal dibuat. Tekan F12, buka Console, " +
      "lalu periksa pesan error berwarna merah."
    );

  } finally {
    if (tombol) {
      tombol.disabled = false;
      tombol.textContent = "📄 Unduh CV ke PDF";
    }
  }
}

