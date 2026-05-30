# TODO - JobMatch

## Status Project

Progress keseluruhan: 85%

## Selesai

* [x] Frontend Landing Page
* [x] Dashboard Pencari Kerja
* [x] Upload CV PDF
* [x] Ekstraksi teks PDF
* [x] TF-IDF
* [x] Cosine Similarity
* [x] Sistem rekomendasi lowongan
* [x] Detail lowongan
* [x] Admin Dashboard
* [x] Monitoring kategori
* [x] Monitoring jobs
* [x] Python Scraper Glints
* [x] MongoDB Integration
* [x] Expired Job System
* [x] Decoupled Architecture (Website dan Scraper terpisah)
* [x] Documentation PROJECT_STATUS.md

---

## Sedang Dikerjakan

* [ ] Perusahaan Pemberi Kerja (Employer)

---

## Sprint Berikutnya (Prioritas Tinggi)

### Employer Module

* [ ] Collection employers
* [ ] Registrasi perusahaan
* [ ] Login perusahaan
* [ ] Dashboard perusahaan
* [ ] Input lowongan manual
* [ ] Edit lowongan
* [ ] Hapus lowongan
* [ ] Atur masa aktif lowongan (7/14/30/60 hari)

### Application Module

* [ ] Collection applications
* [ ] Tombol Lamar Sekarang
* [ ] Simpan CV yang dilamar
* [ ] Simpan kandidat yang melamar
* [ ] Riwayat lamaran kandidat
* [ ] Daftar pelamar per lowongan
* [ ] Status Lamaran:

  * [ ] Pending
  * [ ] Diterima
  * [ ] Ditolak

---

## Sprint Berikutnya (Opsional)

### Admin

* [ ] Statistik lowongan aktif
* [ ] Statistik lowongan expired
* [ ] Statistik perusahaan
* [ ] Statistik pelamar

### User Experience

* [ ] Pagination lowongan
* [ ] Filter lokasi
* [ ] Filter kategori
* [ ] Search lowongan

---

## Tidak Akan Dibuat (Scope Skripsi)

* [ ] Chat kandidat-perusahaan
* [ ] Interview scheduling
* [ ] Video interview
* [ ] Payment gateway
* [ ] AI Chatbot recruiter
* [ ] Notifikasi WhatsApp
* [ ] Multi-role kompleks

---

## Target Demo Skripsi

Alur Kandidat:

1. Upload CV
2. Sistem TF-IDF memproses CV
3. Sistem menampilkan rekomendasi
4. Kandidat melamar pekerjaan
5. Riwayat lamaran tersimpan

Alur Perusahaan:

1. Login perusahaan
2. Input lowongan
3. Melihat pelamar
4. Melihat CV kandidat
5. Terima/Tolak kandidat

Alur Admin:

1. Monitoring seluruh lowongan
2. Monitoring scraper
3. Monitoring perusahaan
4. Monitoring statistik sistem
