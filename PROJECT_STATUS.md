Project: JobMatch – Sistem Rekomendasi Lowongan Pekerjaan Berbasis Website

Stack:

* MERN Stack (MongoDB, Express, React, Node.js)
* Python Scraper (Playwright)
* TF-IDF
* Cosine Similarity

Arsitektur:

* Decoupled Architecture
* Python Scraper Eksternal → MongoDB → Backend Website → Frontend

Progress saat ini:

1. Sistem rekomendasi sudah berjalan

   * Upload CV PDF
   * Extract text
   * TF-IDF
   * Cosine Similarity
   * Menampilkan rekomendasi lowongan

2. Scraper Python

   * Scraping Glints
   * Menyimpan ke MongoDB
   * Anti duplikasi berdasarkan URL
   * Interval 15 menit
   * Scraper berada di luar project website

3. Expired Jobs

   * postedAt
   * expiredAt
   * durationDays
   * status
   * createdByType
   * Default 30 hari

4. Backend Website

   * Tidak menjalankan scraper
   * ENABLE_BACKEND_SCRAPER=false
   * Backend hanya membaca MongoDB

5. Kategori sudah dirapikan

   * Engineering & IT
   * Data & AI
   * Design & Creative
   * Marketing & Growth
   * Finance & Accounting
   * Operations & Supply Chain
   * Sales & Business Development
   * Healthcare & Medical
   * Product & Project
   * Human Resources
   * Education
   * Miscellaneous

6. Admin Dashboard

   * Sedang diupdate menjadi monitoring
   * Bukan control scraper

7. Revisi skripsi

   * Aktor:

     * Pencari Kerja
     * Perusahaan
     * Admin
     * Scraper
   * BAB 3 sebagian besar sudah selesai

Target berikutnya:

Phase 1:

* Company Register
* Company Login
* Tambah Lowongan
* Daftar Lowongan Saya

Phase 2:

* Applications Collection
* Lamar Sekarang
* Riwayat Lamaran

Phase 3:

* Dashboard Perusahaan
* Lihat Pelamar
* Lihat CV
* Accept/Reject

Mohon lanjutkan dari kondisi ini tanpa mengulang pembahasan sebelumnya.
