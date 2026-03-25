# Sistem Rekomendasi Lowongan Pekerjaan (MERN Stack)

Sistem rekomendasi lowongan pekerjaan berbasis **Content-Based Filtering** menggunakan algoritma **TF-IDF** dan **Cosine Similarity**. Sistem ini mencocokkan dokumen CV (PDF) pengguna dengan database lowongan pekerjaan untuk menemukan kecocokan yang paling relevan.

## 🚀 Fitur Utama

- **Web Scraping / Seeding**: Mengambil data lowongan otomatis (atau menggunakan seed data jika scraping diblokir).
- **Text Preprocessing**: Lowercase, Stopword Removal (ID/EN), Stemming, Tokenization.
- **Global TF-IDF**: Membangun vocabulary global dan menghitung bobot IDF dari seluruh korpus lowongan.
- **Vector Space Model**: Representasi dokumen CV dan Job sebagai vektor matematika.
- **Cosine Similarity**: Menghitung skor kemiripan (0-1) antar vektor.
- **PDF Parsing**: Ekstraksi teks otomatis dari file CV yang diupload.

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: Server framework.
- **MongoDB & Mongoose**: Database NoSQL.
- **Natural**: Library NLP untuk stemming dan tokenisasi.
- **Pdf-parse**: Ekstraksi teks dari PDF.
- **Multer**: Handle file upload.

### Frontend
- **React.js (Vite)**: Frontend UI.
- **Tailwind CSS**: Styling.
- **Axios**: HTTP Client.
- **Framer Motion**: Animasi UI.

## 📂 Struktur Project

```
root/
├── client/           # Frontend React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── server/           # Backend Express App
│   ├── config/       # DB Connection
│   ├── controllers/  # Logic (Scrape, Recommend)
│   ├── models/       # Mongoose Schemas (Job, Vocabulary)
│   ├── utils/        # Algo (TF-IDF, Preprocess, Cosine)
│   ├── routes/       # API Routes
│   └── server.js     # Entry point
```

## ⚡ Cara Menjalankan

### Prasyarat
- Node.js terinstall.
- MongoDB service berjalan (Default: `mongodb://127.0.0.1:27017`).

### 1. Install Dependencies
```bash
# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Jalankan Backend (Terminal 1)
```bash
cd server
npm run dev
# Server berjalan di port 5000
```

### 3. Jalankan Frontend (Terminal 2)
```bash
cd client
npm run dev
# Buka http://localhost:5173 di browser
```

### 4. Inisialisasi Database (PENTING!)
Sebelum menggunakan fitur rekomendasi, database harus diisi dan model TF-IDF harus dilatih.
- Buka Dashboard di aplikasi.
- Klik tombol kecil **"Reset/Train Algo (Admin)"** di bawah judul.
- Atau jalankan curl: `curl http://localhost:5000/api/jobs/scrape`

## 🧠 Penjelasan Algoritma

1.  **Preprocessing**: CV dan Deskripsi Job dibersihkan dari tanda baca, diubah ke huruf kecil, dan distemming (kata dasar).
2.  **Training**: Sistem memindai semua Job di database untuk membangun **Global Vocabulary** dan menghitung **IDF** untuk setiap kata unik.
3.  **Vectorization**: 
    - Setiap Job diubah menjadi vektor TF-IDF dan disimpan di DB.
    - Saat user upload CV, CV diubah menjadi vektor menggunakan **Vocabulary & IDF yang sama** dengan yang ada di DB.
4.  **Matching**: Sistem menghitung **Cosine Similarity** antara vektor CV dan vektor setiap Job.
5.  **Ranking**: Job diurutkan berdasarkan skor tertinggi.

## 📝 Catatan Implementasi
- **TF-IDF Manual**: Implementasi algoritma dilakukan dari nol di `server/utils/tfidf.js` tanpa library otomatis (seperti scikit-learn), sesuai requirement akademik.
- **Caching**: Vektor Job di-cache di database untuk performa rekomendasi yang cepat (O(1) vector lookup vs O(N) calculation).
