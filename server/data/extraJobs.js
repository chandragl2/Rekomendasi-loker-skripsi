const extraJobs = [

  // --- FINANCE (10 Jobs) ---
  {
    title: "Financial Analyst",
    company: "Bank Mandiri",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Kami mencari Financial Analyst untuk menganalisis laporan keuangan, mempersiapkan proyeksi keuangan, dan memberikan rekomendasi investasi. Kamu akan bekerja dengan tim treasury untuk memantau arus kas, menganalisis risiko keuangan, dan menyusun laporan untuk manajemen senior. Kandidat harus memiliki pemahaman mendalam tentang akuntansi, pemodelan keuangan, dan analisis pasar modal.",
    skills: ["Financial Modeling", "Excel", "SQL", "Accounting", "Forecasting"]
  },
  {
    title: "Investment Banking Analyst",
    company: "Mandiri Sekuritas",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Bergabunglah dengan tim investment banking kami untuk mendukung transaksi M&A, IPO, dan penerbitan obligasi. Kamu akan menyiapkan pitch deck, melakukan valuasi perusahaan menggunakan DCF dan comparable company analysis, serta melakukan due diligence finansial. Jam kerja tinggi namun imbalan karir dan kompensasi yang sangat kompetitif.",
    skills: ["Valuation", "Excel", "Financial Modeling", "PowerPoint", "M&A"]
  },
  {
    title: "Risk Management Officer",
    company: "BCA",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Posisi ini bertanggung jawab mengidentifikasi, mengukur, dan memitigasi berbagai risiko yang dihadapi bank, termasuk risiko kredit, risiko pasar, dan risiko operasional. Kamu akan menyusun kebijakan manajemen risiko, melakukan stress testing, dan menyiapkan laporan risiko untuk regulator OJK. Sertifikasi FRM atau CFA menjadi nilai tambah.",
    skills: ["Risk Analysis", "Basel III", "SQL", "Statistics", "Compliance"]
  },
  {
    title: "Akuntan Senior",
    company: "Deloitte Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Sebagai Akuntan Senior di Deloitte, kamu akan memimpin audit laporan keuangan klien dari berbagai industri sesuai standar PSAK dan IFRS. Tanggung jawab meliputi perencanaan audit, review kertas kerja, komunikasi dengan klien, dan pelaporan kepada partner. Sertifikasi CPA atau CA Indonesia sangat diperlukan untuk mendukung kredibilitas profesional.",
    skills: ["PSAK", "IFRS", "Auditing", "Excel", "Financial Reporting"]
  },
  {
    title: "Treasury Analyst",
    company: "Pertamina",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Treasury Analyst kami mengelola likuiditas harian perusahaan, mengoptimalkan penempatan dana, dan mengelola eksposur mata uang asing. Kamu akan bekerja dengan bank-bank mitra, memonitor pasar forex, dan mempersiapkan laporan posisi kas harian. Pemahaman mendalam tentang instrumen keuangan dan pasar uang sangat dibutuhkan.",
    skills: ["Treasury", "Forex", "Cash Management", "Bloomberg", "Excel"]
  },
  {
    title: "Tax Consultant",
    company: "PwC Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Bergabunglah dengan tim pajak kami untuk memberikan saran perencanaan pajak dan kepatuhan pajak kepada klien korporat. Kamu akan menyiapkan SPT badan, menangani pemeriksaan pajak, dan menganalisis dampak regulasi pajak terbaru. Pemahaman mendalam tentang UU PPh, PPN, dan peraturan perpajakan internasional sangat diutamakan.",
    skills: ["Perpajakan", "Excel", "SAP", "Tax Planning", "Compliance"]
  },
  {
    title: "Credit Analyst",
    company: "Bank BRI",
    location: "Surabaya",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Sebagai Credit Analyst, kamu akan mengevaluasi kelayakan kredit calon debitur korporat, menganalisis laporan keuangan bisnis, dan merekomendasikan limit kredit yang sesuai. Pekerjaan ini melibatkan kunjungan ke lokasi usaha, analisis industri, dan penyusunan memorandum kredit yang komprehensif untuk comite kredit.",
    skills: ["Credit Analysis", "Financial Statement", "Risk Assessment", "Excel", "Accounting"]
  },
  {
    title: "Insurance Underwriter",
    company: "Allianz Indonesia",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Underwriter kami bertugas menilai risiko polis asuransi jiwa dan kesehatan, menentukan premi yang sesuai, dan memutuskan penerimaan atau penolakan pengajuan asuransi. Kamu akan menganalisis data medis, historis klaim, dan faktor risiko lainnya menggunakan model aktuaria untuk memastikan profitabilitas portofolio.",
    skills: ["Risk Assessment", "Actuarial", "Statistics", "Excel", "Insurance"]
  },
  {
    title: "Financial Controller",
    company: "Unilever Indonesia",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Financial Controller bertanggung jawab atas akurasi dan integritas seluruh laporan keuangan perusahaan. Kamu akan mengawasi proses tutup buku bulanan, mempersiapkan laporan konsolidasi untuk holding, memastikan kepatuhan PSAK, dan mengelola tim akuntan. Pengalaman dengan SAP FI/CO dan pemahaman IFRS adalah persyaratan utama.",
    skills: ["SAP", "IFRS", "Financial Reporting", "Management Accounting", "Leadership"]
  },
  {
    title: "Fintech Compliance Officer",
    company: "GoPay",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Finance",
    description: "Compliance Officer kami memastikan operasional fintech kami sesuai dengan regulasi OJK dan Bank Indonesia tentang uang elektronik dan pembayaran digital. Kamu akan memantau perubahan regulasi, mengembangkan kebijakan internal, mengelola program AML/CFT, dan berkoordinasi dengan regulator dalam proses perizinan dan pelaporan.",
    skills: ["Compliance", "Regulatory", "AML", "KYC", "Risk Management"]
  },

  // --- HEALTHCARE (10 Jobs) ---
  {
    title: "Health Informatics Analyst",
    company: "Siloam Hospitals",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Kami mencari Health Informatics Analyst untuk mengelola dan menganalisis data klinis dari sistem rekam medis elektronik (RME/EMR) kami. Kamu akan mengembangkan dashboard kesehatan, menganalisis tren penyakit, membantu implementasi sistem clinical decision support, dan memastikan kualitas serta keamanan data pasien sesuai standar HIPAA.",
    skills: ["Health Informatics", "SQL", "Python", "EMR Systems", "Data Analysis"]
  },
  {
    title: "Hospital IT Manager",
    company: "RS Pondok Indah",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Pimpin tim IT rumah sakit kami dalam mengelola infrastruktur teknologi yang mendukung operasional medis 24/7. Tanggung jawab mencakup pemeliharaan sistem HIS (Hospital Information System), keamanan data pasien, implementasi sistem baru, dan memastikan uptime sistem yang kritis. Pengalaman di lingkungan healthcare IT sangat diutamakan.",
    skills: ["IT Management", "Healthcare IT", "Network", "Security", "Project Management"]
  },
  {
    title: "Clinical Data Manager",
    company: "Kalbe Farma",
    location: "Jakarta Utara",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Kelola data uji klinis obat-obatan kami untuk memastikan integritas dan kepatuhan terhadap regulasi BPOM dan ICH-GCP. Kamu akan merancang database studi klinis, memvalidasi data yang masuk, mengidentifikasi dan menyelesaikan data query, serta menyiapkan laporan data untuk tim biostatistik dan regulatory affairs.",
    skills: ["Clinical Data Management", "SQL", "SAS", "Regulatory", "Excel"]
  },
  {
    title: "Medical Device Sales Specialist",
    company: "Medtronic Indonesia",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Jadilah sales specialist untuk lini alat kesehatan kardiovaskular kami. Kamu akan membangun dan memelihara hubungan dengan dokter spesialis jantung dan kardiologi intervensi, memberikan dukungan teknis selama prosedur, mengidentifikasi peluang bisnis baru di rumah sakit target, dan mencapai target penjualan bulanan. Latar belakang sains/medis sangat membantu.",
    skills: ["Medical Sales", "Cardiology", "Relationship Management", "Anatomy", "Negotiation"]
  },
  {
    title: "Healthcare Data Scientist",
    company: "Halodoc",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Bangun model prediktif untuk meningkatkan kualitas layanan kesehatan digital kami. Kamu akan menganalisis data konsultasi dokter, membangun sistem rekomendasi spesialis, mengembangkan model prediksi penyakit, dan menganalisis pola penggunaan platform. Pemahaman tentang domain kesehatan dan privasi data medis sangat penting dalam peran ini.",
    skills: ["Python", "Machine Learning", "Healthcare", "SQL", "Statistics"]
  },
  {
    title: "Pharmaceutical Product Manager",
    company: "Kimia Farma",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Kelola portofolio produk farmasi OTC kami, dari strategi pemasaran hingga peluncuran produk baru. Kamu akan menganalisis tren pasar farmasi, mengembangkan strategi promosi kepada apoteker dan dokter, berkoordinasi dengan tim medical dan regulatory, serta memantau performa penjualan di berbagai channel distribusi.",
    skills: ["Product Management", "Marketing", "Pharma", "Market Research", "Strategy"]
  },
  {
    title: "Telemedicine Platform Engineer",
    company: "KlikDokter",
    location: "Remote",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Kembangkan platform telemedicine kami yang melayani konsultasi dokter online untuk jutaan pasien. Kamu akan membangun fitur video call yang andal, sistem antrian dokter, integrasi dengan sistem rekam medis, dan memastikan keamanan data kesehatan pasien. Pengalaman dengan WebRTC, real-time systems, dan standar keamanan data kesehatan sangat dibutuhkan.",
    skills: ["Node.js", "WebRTC", "React", "MongoDB", "Security"]
  },
  {
    title: "Public Health Analyst",
    company: "BPJS Kesehatan",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Analisis data klaim dan kepesertaan JKN untuk mendukung pengambilan keputusan kebijakan kesehatan nasional. Kamu akan mengidentifikasi pola penyakit, menganalisis utilisasi layanan kesehatan, mendeteksi potensi kecurangan klaim, dan mempersiapkan laporan untuk Kementerian Kesehatan. Pengalaman analisis data besar di sektor publik menjadi keunggulan.",
    skills: ["Public Health", "SQL", "Statistical Analysis", "Python", "Policy"]
  },
  {
    title: "Biomedical Engineer",
    company: "RS Cipto Mangunkusumo",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Kelola, kalibrasi, dan perbaiki peralatan medis canggih di rumah sakit pendidikan terbesar di Indonesia ini. Kamu akan memastikan semua alat kesehatan berfungsi optimal dan aman, mengimplementasikan program pemeliharaan preventif, melatih staf medis dalam penggunaan alat baru, serta berkoordinasi dengan vendor dan BPFK untuk sertifikasi alat.",
    skills: ["Biomedical Engineering", "Equipment Maintenance", "Calibration", "Electronics", "Healthcare"]
  },
  {
    title: "Health Tech Product Designer",
    company: "Alodokter",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Healthcare",
    description: "Rancang pengalaman pengguna yang intuitif dan empatik untuk platform kesehatan kami yang digunakan jutaan masyarakat Indonesia. Kamu akan menerapkan prinsip human-centered design dalam konteks healthcare, melakukan riset pengguna dengan pasien dan dokter, memastikan aksesibilitas desain untuk berbagai kelompok umur, dan merancang fitur yang kompleks menjadi sederhana.",
    skills: ["UX Design", "Figma", "User Research", "Healthcare", "Accessibility"]
  },

  // --- EDUCATION (10 Jobs) ---
  {
    title: "Instructional Designer",
    company: "Ruangguru",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Rancang kurikulum dan konten pembelajaran digital yang menarik dan efektif untuk platform kami yang digunakan jutaan pelajar Indonesia. Kamu akan menganalisis kebutuhan belajar, menulis naskah video pembelajaran, merancang aktivitas interaktif, dan berkolaborasi dengan guru pengajar dan tim produksi video untuk menghasilkan konten berkualitas tinggi.",
    skills: ["Curriculum Design", "E-learning", "Content Writing", "Articulate", "LMS"]
  },
  {
    title: "EdTech Product Manager",
    company: "Zenius",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Pimpin pengembangan fitur-fitur inovatif platform belajar kami yang berfokus pada pemahaman konsep mendalam. Kamu akan memahami kebutuhan belajar siswa dan guru melalui riset pengguna, mendefinisikan roadmap fitur, berkolaborasi dengan tim teknologi dan konten, serta mengukur dampak fitur terhadap hasil belajar pengguna menggunakan data.",
    skills: ["Product Management", "EdTech", "User Research", "Agile", "Analytics"]
  },
  {
    title: "Corporate Trainer",
    company: "Prasetiya Mulya Consulting",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Kembangkan dan fasilitasi program pelatihan korporat untuk perusahaan-perusahaan klien di bidang kepemimpinan, manajemen, dan soft skill. Kamu akan melakukan training need analysis, merancang modul pelatihan yang relevan dan engaging, memfasilitasi workshop baik secara tatap muka maupun online, serta mengukur efektivitas program melalui evaluasi pasca pelatihan.",
    skills: ["Training", "Facilitation", "Communication", "Leadership Development", "Instructional Design"]
  },
  {
    title: "LMS Administrator",
    company: "Universitas Terbuka",
    location: "Tangerang Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Kelola dan kembangkan platform Learning Management System (Moodle) yang digunakan ratusan ribu mahasiswa UT di seluruh Indonesia. Tanggung jawabmu meliputi administrasi sistem, pemeliharaan server, pengembangan plugin kustom, pelatihan dosen dalam penggunaan LMS, serta memastikan ketersediaan dan stabilitas platform terutama di masa ujian.",
    skills: ["Moodle", "PHP", "MySQL", "Linux", "E-learning"]
  },
  {
    title: "Education Data Analyst",
    company: "Kemendikbudristek",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Analisis data pendidikan nasional dari berbagai sumber termasuk rapor pendidikan, data AKM, dan data Dapodik untuk mendukung kebijakan pendidikan. Kamu akan mengembangkan dashboard pemantauan indikator pendidikan, mengidentifikasi kesenjangan kualitas pendidikan antar daerah, dan menyiapkan laporan analitik untuk pimpinan kementerian dalam pengambilan keputusan berbasis bukti.",
    skills: ["Data Analysis", "Python", "SQL", "Tableau", "Education Policy"]
  },
  {
    title: "Online Tutor Platform Operations",
    company: "Quipper",
    location: "Remote",
    type: "Penuh Waktu",
    category: "Education",
    description: "Kelola operasional platform tutor online kami, memastikan kualitas pengajaran dan kepuasan pengguna terjaga. Kamu akan merekrut dan menyeleksi tutor, memantau kualitas sesi belajar, mengelola keluhan, mengembangkan panduan kualitas mengajar, dan menganalisis data performa tutor untuk program peningkatan kualitas secara berkelanjutan.",
    skills: ["Operations", "Quality Assurance", "Communication", "Data Analysis", "E-learning"]
  },
  {
    title: "Curriculum Developer (Programming)",
    company: "DQLab",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Education",
    description: "Kembangkan kurikulum kursus data science dan pemrograman yang komprehensif dan up-to-date untuk platform kami. Kamu akan meneliti tren industri data, merancang learning path yang terstruktur, membuat modul kursus interaktif (coding exercises, quiz, proyek), dan berkolaborasi dengan praktisi industri sebagai pembicara tamu atau reviewer konten.",
    skills: ["Python", "Data Science", "Curriculum Design", "Content Creation", "E-learning"]
  },
  {
    title: "School Counselor (Teknologi)",
    company: "BINUS School",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Education",
    description: "Berikan bimbingan akademik dan karir kepada siswa SMA untuk membantu mereka memilih jurusan perguruan tinggi, terutama di bidang teknologi dan STEM. Kamu akan melakukan sesi konseling individu dan kelompok, mengorganisir seminar karir, membantu siswa mempersiapkan portofolio dan esai beasiswa, serta berkoordinasi dengan orang tua dalam mendukung perjalanan akademik siswa.",
    skills: ["Counseling", "Communication", "Career Guidance", "Psychology", "Education"]
  },
  {
    title: "Game-Based Learning Developer",
    company: "Sekolah Mu",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Education",
    description: "Rancang dan kembangkan game edukatif yang membuat belajar menjadi menyenangkan dan efektif untuk siswa SD dan SMP. Kamu akan menggabungkan prinsip game design dengan teori pembelajaran untuk menciptakan pengalaman gamifikasi yang meningkatkan motivasi belajar. Pengalaman dengan Unity atau Phaser.js dan pemahaman tentang pedagogi anak sangat diutamakan.",
    skills: ["Game Development", "Unity", "Gamification", "Instructional Design", "JavaScript"]
  },
  {
    title: "Higher Education Consultant",
    company: "IDP Education",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Education",
    description: "Bantu calon mahasiswa Indonesia dalam perjalanan studi mereka ke luar negeri. Kamu akan memberikan konsultasi pemilihan universitas dan program studi di Australia, UK, USA, dan Kanada, membantu persiapan aplikasi beasiswa dan visa, membimbing persiapan IELTS, serta membangun jaringan dengan universitas-universitas mitra untuk mendukung proses penerimaan mahasiswa.",
    skills: ["Counseling", "International Education", "Communication", "English", "Client Relations"]
  },

  // --- LEGAL (10 Jobs) ---
  {
    title: "Corporate Lawyer",
    company: "SSEK Law Firm",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Bergabunglah dengan tim hukum korporat kami untuk memberikan layanan hukum kepada klien multinasional dalam transaksi bisnis, M&A, dan pendirian perusahaan. Kamu akan menyusun dan mereview perjanjian komersial, memo hukum, dan dokumen transaksi. Kemampuan analisis hukum yang tajam dan kemampuan komunikasi dalam Bahasa Indonesia dan Inggris adalah persyaratan utama.",
    skills: ["Corporate Law", "Contract Drafting", "M&A", "Legal Research", "English"]
  },
  {
    title: "Legal Counsel (Fintech)",
    company: "Dana",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Berikan saran hukum strategis kepada bisnis fintech kami yang beroperasi dalam lingkungan regulasi yang dinamis. Kamu akan mengnalysi regulasi OJK dan BI, menyusun kebijakan internal, mereview kontrak mitra dan merchant, mengelola isu litigasi, serta mendukung ekspansi bisnis dari perspektif hukum. Pengalaman di industri keuangan atau teknologi sangat diutamakan.",
    skills: ["Financial Law", "Regulatory", "Contract Review", "Compliance", "Negotiation"]
  },
  {
    title: "Intellectual Property Specialist",
    company: "Tokopedia",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Kelola portofolio kekayaan intelektual Tokopedia, termasuk merek dagang, hak cipta, dan paten. Kamu akan mengurus pendaftaran dan pemeliharaan merek di berbagai yurisdiksi, menangani kasus pelanggaran IP di platform kami, berkoordinasi dengan tim trust & safety untuk pemberantasan produk palsu, dan memberikan edukasi tentang IP kepada tim internal.",
    skills: ["Intellectual Property", "Trademark", "Copyright", "Legal Research", "Negotiation"]
  },
  {
    title: "Employment Law Specialist",
    company: "Grab Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Tangani semua aspek hukum ketenagakerjaan di perusahaan teknologi multi-nasional kami yang beroperasi di Indonesia. Kamu akan menyusun dan mereview perjanjian kerja, menangani perselisihan hubungan industrial, memastikan kepatuhan terhadap UU Cipta Kerja, serta memberikan advis hukum kepada tim HR dalam kebijakan kepegawaian dan proses PHK.",
    skills: ["Employment Law", "Industrial Relations", "Contract Drafting", "PKWT", "HR Law"]
  },
  {
    title: "Data Privacy Officer",
    company: "Shopee Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Pimpin program perlindungan data pribadi kami sesuai dengan UU PDP dan regulasi privasi internasional. Kamu akan mengembangkan kebijakan privasi, melakukan penilaian dampak perlindungan data (DPIA), melatih karyawan tentang pengelolaan data, berkoordinasi dengan regulator, dan menangani permintaan akses dan penghapusan data dari pengguna.",
    skills: ["Data Privacy", "GDPR", "UU PDP", "Compliance", "Legal Research"]
  },
  {
    title: "Contract Manager",
    company: "PLN",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Kelola siklus hidup kontrak pengadaan infrastruktur dan jasa PLN, dari negosiasi awal hingga penyelesaian kontrak. Kamu akan mereview draft kontrak dari vendor, mengidentifikasi risiko kontraktual, memastikan kepatuhan terhadap regulasi pengadaan BUMN, dan menyelesaikan sengketa kontrak. Pemahaman tentang hukum pengadaan barang/jasa pemerintah sangat dibutuhkan.",
    skills: ["Contract Management", "Procurement Law", "Negotiation", "Risk Analysis", "BUMN Regulation"]
  },
  {
    title: "Legal Tech Consultant",
    company: "Hukumonline",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Jadilah jembatan antara dunia hukum dan teknologi. Kamu akan mengembangkan konten hukum berbasis teknologi, memberikan konsultasi implementasi legal tech kepada firma hukum dan korporasi, menganalisis penggunaan AI untuk riset hukum, serta memberikan pelatihan penggunaan platform hukum digital. Latar belakang hukum dengan minat kuat pada teknologi sangat dicari.",
    skills: ["Legal Research", "Legal Tech", "Communication", "LegalAI", "Consulting"]
  },
  {
    title: "Litigation Associate",
    company: "Mochtar Karuwin Komar",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Bergabunglah dengan tim litigasi salah satu firma hukum tertua dan terkemuka di Indonesia. Kamu akan menangani perkara perdata dan niaga di berbagai tingkatan pengadilan, menyiapkan dokumen persidangan (gugatan, replik, memori banding), melakukan riset yurisprudensi, dan mendampingi klien dalam sidang. Kemampuan analisis hukum dan advokasi yang kuat sangat diperlukan.",
    skills: ["Litigation", "Legal Drafting", "Court Procedure", "Legal Research", "Advocacy"]
  },
  {
    title: "Paralegal",
    company: "Baker McKenzie",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Dukung tim lawyer dalam firma hukum internasional kami dengan berbagai tugas legal support. Kamu akan melakukan riset hukum dan yurisprudensi, menyiapkan draft dokumen hukum dasar, mengelola due diligence data room, mengurus filing dan administrasi dokumen legal, serta membantu koordinasi dengan klien dan pihak ketiga lainnya.",
    skills: ["Legal Research", "Document Management", "Due Diligence", "English", "Organization"]
  },
  {
    title: "Compliance & Regulatory Affairs",
    company: "Gojek",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Legal",
    description: "Kembangkan dan implementasikan program kepatuhan regulasi untuk bisnis super-app kami yang beroperasi di multiple sektor (transport, food, payment). Kamu akan memantau perubahan regulasi dari berbagai kementerian, menganalisis dampaknya pada bisnis, mengembangkan SOP kepatuhan, melakukan audit internal, dan berkoordinasi dengan pemerintah dalam proses konsultasi regulasi.",
    skills: ["Compliance", "Regulatory Affairs", "Risk Management", "Government Relations", "Analysis"]
  },

  // --- SALES (10 Jobs) ---
  {
    title: "Enterprise Account Executive",
    company: "Salesforce Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Jual solusi CRM enterprise kami kepada perusahaan-perusahaan besar di Indonesia. Kamu akan mengidentifikasi dan mengembangkan peluang di akun strategis, memimpin proses penjualan yang kompleks dan panjang, berkoordinasi dengan tim pre-sales dan implementasi, serta membangun hubungan jangka panjang dengan C-level executives klien. Target penjualan tahunan yang ambisius dengan komisi yang sangat menarik.",
    skills: ["Enterprise Sales", "CRM", "Negotiation", "Solution Selling", "Relationship Building"]
  },
  {
    title: "B2B Sales Manager",
    company: "Xendit",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Pimpin tim sales kami dalam mengakuisisi dan mengembangkan akun bisnis merchant yang menggunakan solusi pembayaran Xendit. Kamu akan mengembangkan strategi penjualan B2B, memimpin dan melatih tim sales, membangun pipeline yang kuat, bernegosiasi dengan klien korporat, dan bekerja sama dengan tim produk untuk memahami kebutuhan merchant dalam roadmap produk.",
    skills: ["B2B Sales", "Team Leadership", "Fintech", "Negotiation", "Pipeline Management"]
  },
  {
    title: "Sales Development Representative",
    company: "Midtrans",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Sebagai SDR, kamu adalah ujung tombak tim penjualan kami dalam menciptakan peluang bisnis baru. Kamu akan melakukan prospecting melalui cold outreach, LinkedIn, dan referral, mengkualifikasikan prospek, menjadwalkan demo produk untuk Account Executive, dan membangun pipeline yang sehat. Ini adalah posisi yang tepat untuk memulai karir penjualan di industri teknologi.",
    skills: ["Prospecting", "Cold Calling", "CRM", "Communication", "Sales"]
  },
  {
    title: "Key Account Manager",
    company: "Nestlé Indonesia",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Kelola dan kembangkan hubungan bisnis dengan retailer modern (minimarket, supermarket, hypermarket) sebagai kanal distribusi utama produk-produk Nestlé. Kamu akan menegosiasikan listing dan promosi produk, menganalisis data sell-out, mengimplementasikan program trade marketing, dan mengidentifikasi peluang pertumbuhan di setiap akun yang kamu kelola.",
    skills: ["Key Account Management", "Retail", "Negotiation", "Trade Marketing", "Excel"]
  },
  {
    title: "Field Sales Representative",
    company: "Telkomsel",
    location: "Surabaya",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Ekspansi penetrasi produk Telkomsel di kawasan Surabaya dan sekitarnya dengan membangun jaringan dealer dan outlet. Kamu akan melakukan kunjungan lapangan harian ke dealer dan outlet, memastikan ketersediaan produk dan display, memberikan pelatihan kepada SPG/SPB dealer, dan menganalisis kondisi pasar lokal untuk mengidentifikasi peluang pertumbuhan.",
    skills: ["Field Sales", "Distribution", "Communication", "Territory Management", "Retail"]
  },
  {
    title: "SaaS Inside Sales",
    company: "Mekari",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Jual solusi software HR, akuntansi, dan pajak kami kepada UKM dan perusahaan menengah di Indonesia secara remote. Kamu akan melakukan demo online, memahami kebutuhan bisnis prospek, mempresentasikan value proposition produk kami, menangani keberatan, dan menutup transaksi. Kemampuan presentasi yang baik dan pemahaman tentang kebutuhan bisnis UKM sangat penting.",
    skills: ["SaaS Sales", "Demo", "Communication", "CRM", "Negotiation"]
  },
  {
    title: "Real Estate Sales Agent",
    company: "Sinar Mas Land",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Jual properti residensial dan komersial kami di kawasan BSD City kepada pembeli end-user dan investor. Kamu akan memprospek dan melayani calon pembeli, memberikan informasi properti yang komprehensif, mengelola proses pembelian dari awal hingga akad kredit, dan membangun jaringan referral yang kuat. Sistem komisi yang sangat menarik berdasarkan performa penjualan.",
    skills: ["Real Estate", "Sales", "Negotiation", "Client Relations", "Property Knowledge"]
  },
  {
    title: "Pharmaceutical Sales Representative",
    company: "Novartis Indonesia",
    location: "Bandung",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Promosikan produk-produk farmasi Novartis kepada dokter spesialis dan rumah sakit di area Bandung. Kamu akan melakukan kunjungan rutin (detailing) ke praktek dokter dan RS, menjelaskan manfaat dan keunggulan produk berdasarkan evidence klinis, mengorganisasi simposium medis, serta menganalisis potensi pasar dan aktivitas kompetitor di area.",
    skills: ["Pharma Sales", "Medical Knowledge", "Communication", "Detailing", "Relationship"]
  },
  {
    title: "E-Commerce Key Account (Marketplace)",
    company: "Unilever Indonesia",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Kelola bisnis Unilever di platform e-commerce (Tokopedia, Shopee, Lazada) untuk mengoptimalkan performa penjualan online. Kamu akan berkoordinasi dengan tim buyer marketplace, merencanakan kampanye promosi seasonal, mengoptimalkan konten halaman produk, menganalisis data penjualan dan tren, serta mengembangkan strategi pertumbuhan channel online.",
    skills: ["E-Commerce", "Key Account", "Marketplace", "Digital Marketing", "Analytics"]
  },
  {
    title: "Sales Operations Analyst",
    company: "Bukalapak",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Sales",
    description: "Dukung efektivitas tim penjualan melalui analisis data, optimasi proses, dan pengelolaan tools. Kamu akan membangun dan memelihara dashboard performa sales, menganalisis pipeline dan aktivitas penjualan, mengoptimalkan proses CRM, menyiapkan laporan penjualan berkala, dan mendukung perencanaan target serta insentif tim sales.",
    skills: ["Sales Analytics", "CRM", "SQL", "Excel", "Process Improvement"]
  },

  // --- HR (10 Jobs) ---
  {
    title: "HR Business Partner",
    company: "Tokopedia",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "HR",
    description: "Berperan sebagai mitra strategis HR untuk unit bisnis teknologi kami. Kamu akan memberikan saran tentang manajemen bakat, mendukung proses rekrutmen untuk posisi teknis, mengelola permasalahan hubungan karyawan, memimpin inisiatif keterlibatan karyawan, dan menerjemahkan kebutuhan bisnis menjadi solusi SDM yang efektif. Pengalaman di lingkungan tech company sangat diutamakan.",
    skills: ["HRBP", "Talent Management", "Employee Relations", "Communication", "Analytics"]
  },
  {
    title: "Technical Recruiter",
    company: "Gojek",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "HR",
    description: "Rekrut talenta teknologi terbaik untuk berbagai posisi engineering, product, dan data di Gojek. Kamu akan menyusun strategi sourcing, melakukan screening CV dan wawancara awal, berkolaborasi dengan hiring manager untuk memahami kebutuhan, memanfaatkan LinkedIn Recruiter dan platform tech talent lainnya, serta memberikan pengalaman kandidat yang luar biasa sepanjang proses.",
    skills: ["Technical Recruiting", "Sourcing", "Boolean Search", "Interviewing", "ATS"]
  },
  {
    title: "Learning & Development Manager",
    company: "Astra International",
    location: "Jakarta Utara",
    type: "Penuh Waktu",
    category: "HR",
    description: "Kembangkan dan implementasikan strategi pembelajaran dan pengembangan karyawan di salah satu konglomerat terbesar Indonesia. Kamu akan menganalisis kebutuhan pelatihan, merancang program pengembangan kepemimpinan, mengelola pusat pelatihan (training center), mengukur ROI program pelatihan, dan mengimplementasikan platform e-learning korporat untuk ribuan karyawan.",
    skills: ["L&D", "Training Design", "LMS", "Leadership Development", "Assessment"]
  },
  {
    title: "Compensation & Benefits Specialist",
    company: "Unilever Indonesia",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "HR",
    description: "Kelola kebijakan kompensasi dan benefit yang kompetitif dan adil untuk seluruh karyawan. Kamu akan melakukan benchmarking gaji, menganalisis survey upah nasional (Mercer, Willis Towers Watson), mengelola sistem grading dan struktur gaji, menghitung bonus tahunan, mengelola program benefit (kesehatan, BPJS, asuransi jiwa), dan memastikan kepatuhan terhadap regulasi ketenagakerjaan.",
    skills: ["Compensation", "Benefits", "Job Evaluation", "HR Analytics", "Excel"]
  },
  {
    title: "HR Analytics Specialist",
    company: "Bank Central Asia",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "HR",
    description: "Transformasi cara HR membuat keputusan melalui data dan analitik. Kamu akan membangun dashboard HR (turnover, engagement, produktivitas), mengembangkan model prediktif untuk mengidentifikasi risiko attrisi karyawan, menganalisis efektivitas program HR, dan menyajikan wawasan HR kepada manajemen puncak dalam format yang mudah dipahami.",
    skills: ["HR Analytics", "Python", "SQL", "Power BI", "HRIS"]
  },
  {
    title: "Talent Acquisition Lead",
    company: "Shopee Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "HR",
    description: "Pimpin tim rekrutmen dalam membangun dan mengeksekusi strategi akuisisi talenta untuk perusahaan e-commerce yang tumbuh pesat. Kamu akan mengembangkan employer branding, membangun talent pipeline strategis, mengoptimalkan proses rekrutmen untuk kecepatan dan kualitas, mengimplementasikan ATS, serta membangun hubungan dengan universitas terkemuka untuk program fresh graduate.",
    skills: ["Talent Acquisition", "Employer Branding", "Team Leadership", "ATS", "Strategy"]
  },
  {
    title: "Organizational Development Consultant",
    company: "McKinsey Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "HR",
    description: "Bantu organisasi klien kami meningkatkan efektivitas dan kinerja melalui intervensi OD yang berbasis bukti. Kamu akan melakukan diagnosis organisasi, merancang dan mengimplementasikan program transformasi budaya, mengembangkan kerangka manajemen kinerja, memfasilitasi workshop change management, dan mengukur dampak perubahan organisasi terhadap kinerja bisnis.",
    skills: ["Organizational Development", "Change Management", "Facilitation", "Analytics", "Consulting"]
  },
  {
    title: "HRIS Implementation Specialist",
    company: "SAP Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "HR",
    description: "Implementasikan solusi SAP SuccessFactors untuk klien-klien korporat besar di Indonesia. Kamu akan melakukan analisis gap antara proses HR klien dan sistem, mengkonfigurasi modul HRIS sesuai kebutuhan, melatih super-user dan karyawan, serta memberikan dukungan pasca go-live. Sertifikasi SAP SuccessFactors menjadi persyaratan yang sangat diutamakan.",
    skills: ["SAP SuccessFactors", "HRIS", "Implementation", "Training", "HR Processes"]
  },
  {
    title: "Employee Experience Manager",
    company: "Microsoft Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "HR",
    description: "Rancang dan implementasikan program yang membuat karyawan kami merasa dihargai, terlibat, dan produktif. Kamu akan mengelola survey keterlibatan karyawan, mengembangkan program wellness dan work-life balance, merancang onboarding yang berkesan, menginisiasi program recognition, dan menciptakan lingkungan kerja yang inklusif dan inspiratif sesuai nilai-nilai perusahaan.",
    skills: ["Employee Experience", "Engagement", "Program Management", "Communication", "Culture"]
  },
  {
    title: "Industrial Relations Officer",
    company: "Honda Prospect Motor",
    location: "Karawang",
    type: "Penuh Waktu",
    category: "HR",
    description: "Kelola hubungan industrial yang kondusif antara perusahaan, serikat pekerja, dan karyawan di pabrik manufaktur kami. Kamu akan bernegosiasi Perjanjian Kerja Bersama (PKB), menangani keluhan dan perselisihan kerja, memastikan kepatuhan terhadap UU Ketenagakerjaan, berkoordinasi dengan Disnaker, serta mengimplementasikan program-program yang mendukung produktivitas dan kesejahteraan karyawan.",
    skills: ["Industrial Relations", "Labor Law", "Negotiation", "PKB", "Union Relations"]
  },

  // --- OPERATIONS (10 Jobs) ---
  {
    title: "Supply Chain Manager",
    company: "Indomaret",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Optimalkan rantai pasok jaringan ritel kami yang mencakup ribuan gerai di seluruh Indonesia. Kamu akan mengelola hubungan dengan supplier, mengoptimalkan tingkat persediaan di gudang distribusi dan gerai, mengimplementasikan strategi pengurangan biaya logistik, serta memimpin proyek digitalisasi supply chain menggunakan data analytics untuk meningkatkan efisiensi operasional.",
    skills: ["Supply Chain", "Inventory Management", "Logistics", "Excel", "ERP"]
  },
  {
    title: "Operations Manager (Logistik)",
    company: "J&T Express",
    location: "Tangerang",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Pimpin operasional hub sortir utama kami yang memproses ratusan ribu paket setiap harinya. Kamu akan mengelola tim ratusan operator, mengoptimalkan alur sortir dan penugasan kurir, memastikan SLA pengiriman terpenuhi, mengendalikan biaya operasional, serta memimpin proyek peningkatan kapasitas dan otomasi hub untuk menghadapi pertumbuhan volume.",
    skills: ["Logistics", "Operations Management", "Team Leadership", "Process Improvement", "KPI"]
  },
  {
    title: "Process Improvement Engineer",
    company: "Toyota Indonesia",
    location: "Karawang",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Terapkan metodologi Toyota Production System (TPS) dan Lean manufacturing untuk terus meningkatkan efisiensi lini produksi otomotif kami. Kamu akan mengidentifikasi pemborosan (waste) di proses produksi, memimpin proyek kaizen, mengimplementasikan standar kerja baru, menganalisis OEE dan KPI produksi, serta melatih operator dan supervisor dalam prinsip-prinsip lean.",
    skills: ["Lean Manufacturing", "Kaizen", "Six Sigma", "Process Improvement", "Industrial Engineering"]
  },
  {
    title: "Project Manager",
    company: "Accenture Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Pimpin proyek transformasi bisnis dan teknologi untuk klien-klien korporat dari berbagai industri. Kamu akan merencanakan dan mengelola scope, jadwal, dan anggaran proyek, memimpin tim proyek yang beragam (konsultan, klien, vendor), mengelola risiko dan isu, mengkomunikasikan status proyek kepada stakeholder, dan memastikan deliverable berkualitas tinggi disampaikan tepat waktu.",
    skills: ["Project Management", "PMP", "Agile", "Stakeholder Management", "Risk Management"]
  },
  {
    title: "Procurement Specialist",
    company: "Pertamina",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Kelola proses pengadaan barang dan jasa untuk kebutuhan operasional perusahaan BUMN energi terbesar Indonesia. Kamu akan melakukan evaluasi vendor, mengelola tender sesuai regulasi pengadaan BUMN, bernegosiasi kontrak untuk mendapatkan nilai terbaik, melakukan due diligence vendor, serta memastikan seluruh proses pengadaan transparan dan sesuai tata kelola perusahaan yang baik.",
    skills: ["Procurement", "Vendor Management", "Negotiation", "Contract Management", "SAP"]
  },
  {
    title: "Quality Assurance Manager",
    company: "Indofood",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Pastikan semua produk makanan yang keluar dari pabrik kami memenuhi standar keamanan pangan tertinggi. Kamu akan memimpin tim QC, mengimplementasikan dan mempertahankan sertifikasi ISO 22000 dan HACCP, mengawasi pengujian produk, menginvestigasi dan menyelesaikan keluhan produk, serta mengembangkan sistem kontrol kualitas yang lebih baik secara berkelanjutan.",
    skills: ["Quality Assurance", "ISO 22000", "HACCP", "Food Safety", "Team Management"]
  },
  {
    title: "Business Analyst (Operations)",
    company: "Lazada Indonesia",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Analisis proses operasional e-commerce kami untuk mengidentifikasi bottleneck dan peluang efisiensi. Kamu akan memetakan proses bisnis, menganalisis data operasional, mengidentifikasi akar masalah, mengembangkan solusi perbaikan, dan memimpin implementasi perubahan. Kemampuan analitis yang kuat, penguasaan SQL dan Excel, serta kemampuan komunikasi dengan berbagai stakeholder sangat diperlukan.",
    skills: ["Business Analysis", "Process Mapping", "SQL", "Excel", "Problem Solving"]
  },
  {
    title: "Warehouse Operations Supervisor",
    company: "Shopee Express",
    location: "Bekasi",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Supervisi operasional gudang fulfillment kami yang menangani ribuan pesanan e-commerce setiap harinya. Kamu akan mengawasi proses inbound, picking, packing, dan outbound, mengelola tim operator gudang, memastikan akurasi inventori, mengimplementasikan standar K3, serta mengoptimalkan layout dan alur operasional gudang untuk meningkatkan throughput pada peak season.",
    skills: ["Warehouse Management", "WMS", "Team Supervision", "Inventory", "Logistics"]
  },
  {
    title: "Customer Success Manager",
    company: "Jurnal by Mekari",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Pastikan pelanggan kami mendapatkan nilai maksimal dari software akuntansi kami dan tetap loyal. Kamu akan onboarding pelanggan baru, memberikan pelatihan penggunaan produk, menangani pertanyaan dan masalah penggunaan, mengidentifikasi peluang upsell, memantau kesehatan akun (churn risk), dan mengumpulkan feedback untuk pengembangan produk. Target NPS dan retensi pelanggan adalah ukuran keberhasilan utamamu.",
    skills: ["Customer Success", "SaaS", "Onboarding", "Communication", "Account Management"]
  },
  {
    title: "Facilities Manager",
    company: "EY Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Operations",
    description: "Kelola operasional dan pemeliharaan gedung kantor EY yang besar dan modern di pusat bisnis Jakarta. Tanggung jawabmu meliputi manajemen vendor pemeliharaan, pengelolaan anggaran fasilitas, perencanaan renovasi, manajemen keamanan gedung, implementasi kebijakan workplace yang mendukung produktivitas karyawan, serta memastikan kepatuhan terhadap standar K3 dan lingkungan.",
    skills: ["Facilities Management", "Vendor Management", "Budget Management", "Building Operations", "K3"]
  },

  // --- CREATIVE (10 Jobs) ---
  {
    title: "Video Content Creator",
    company: "IDN Media",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Produksi konten video yang engaging dan viral untuk platform media digital kami yang menjangkau puluhan juta Gen-Z dan Milenial. Kamu akan mengembangkan konsep konten, menulis skrip, mengkoordinasi proses shooting, mengedit video menggunakan Adobe Premiere Pro, dan mengoptimalkan konten untuk berbagai platform (YouTube, TikTok, Instagram Reels). Kepekaan terhadap tren digital sangat diperlukan.",
    skills: ["Video Editing", "Adobe Premiere", "After Effects", "Storytelling", "Content Strategy"]
  },
  {
    title: "Podcast Producer",
    company: "Spotify Indonesia",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Produksi podcast-podcast original Spotify yang berkualitas tinggi untuk pasar Indonesia. Kamu akan bertanggung jawab atas seluruh pipeline produksi, mulai dari pengembangan konsep dan penelitian mendalam, koordinasi narasumber, perekaman, editing audio menggunakan Adobe Audition, hingga distribusi dan promosi episode. Pemahaman mendalam tentang audio storytelling dan format podcast terkini sangat diutamakan.",
    skills: ["Audio Production", "Adobe Audition", "Storytelling", "Research", "Content"]
  },
  {
    title: "Copywriter (Advertising)",
    company: "Grey Indonesia",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Ciptakan kampanye iklan yang berkesan dan efektif untuk brand-brand FMCG terkemuka. Kamu akan mengembangkan big idea kreatif bersama Art Director, menulis naskah iklan untuk berbagai media (TV, digital, OOH), mempresentasikan ide kepada klien, dan memastikan pesan iklan relevan dengan target audiens. Kemampuan berpikir kreatif dan insight consumer yang tajam adalah modal utamamu.",
    skills: ["Copywriting", "Advertising", "Creative Thinking", "Branding", "Ideation"]
  },
  {
    title: "3D Animator",
    company: "Infinite Studio",
    location: "Batam",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Ciptakan animasi 3D berkualitas tinggi untuk proyek-proyek game, film animasi, dan iklan digital. Kamu akan membuat rig karakter, menganimasikan pergerakan yang natural dan ekspresif menggunakan Maya atau Blender, berkolaborasi dengan tim art director dan animator lainnya, serta mengoptimalkan aset 3D untuk berbagai platform target.",
    skills: ["3D Animation", "Maya", "Blender", "Character Rigging", "VFX"]
  },
  {
    title: "Motion Graphics Designer",
    company: "Kompas TV",
    location: "Jakarta Pusat",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Buat grafis bergerak yang memukau untuk program-program berita dan konten digital Kompas TV. Kamu akan mendesain lower third, title sequences, infografis animasi, dan package grafis untuk berbagai program TV. Penguasaan After Effects dan pemahaman tentang estetika broadcast design adalah kunci. Kemampuan bekerja cepat di bawah tekanan deadline siaran langsung sangat diperlukan.",
    skills: ["Motion Design", "After Effects", "Cinema 4D", "Broadcast Design", "Typography"]
  },
  {
    title: "Game Artist",
    company: "Agate Studio",
    location: "Bandung",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Ciptakan aset visual yang menawan untuk game-game mobile dan PC dari studio game terkemuka Indonesia. Kamu akan membuat karakter, environment, dan item game menggunakan gaya seni yang ditentukan tim, bekerja sama dengan game designer dan programmer, mengoptimalkan aset untuk performa game terbaik, dan berkontribusi dalam pengembangan art style guide proyek.",
    skills: ["2D Art", "Photoshop", "Game Art", "Concept Art", "Spine 2D"]
  },
  {
    title: "Illustrator",
    company: "Gramedia",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Ciptakan ilustrasi yang indah dan berkarakter untuk buku-buku terbitan Gramedia, mulai dari buku anak-anak, novel grafis, hingga buku edukasi. Kamu akan menginterpretasikan naskah menjadi visual yang kuat dan menarik, memgembangkan karakter yang konsisten, bekerja dalam berbagai gaya ilustrasi sesuai kebutuhan, dan menghasilkan artwork dalam format digital yang siap cetak.",
    skills: ["Illustration", "Procreate", "Photoshop", "Drawing", "Character Design"]
  },
  {
    title: "Brand Identity Designer",
    company: "Brand Insight",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Rancang identitas visual yang kuat dan berkesan untuk startup dan brand lokal yang sedang berkembang. Kamu akan memimpin riset dan strategi brand, mengembangkan logo dan sistem identitas visual yang komprehensif, membuat brand guideline yang detail, serta mengaplikasikan identitas ke berbagai touchpoint (stationery, packaging, digital). Portofolio identitas brand yang beragam adalah syarat utama.",
    skills: ["Brand Identity", "Logo Design", "Illustrator", "Typography", "Strategy"]
  },
  {
    title: "Photography & Videography",
    company: "Fabelio",
    location: "Jakarta Barat",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Abadikan keindahan furnitur dan produk interior kami melalui foto dan video berkualitas tinggi untuk katalog online dan media sosial. Kamu akan merencanakan dan mengeksekusi sesi pemotretan produk, mengatur pencahayaan studio, melakukan post-processing hingga hasilkan foto yang menakjubkan, serta membuat video lifestyle yang menginspirasi di lingkungan interior nyata.",
    skills: ["Photography", "Videography", "Lightroom", "Photoshop", "Lighting"]
  },
  {
    title: "Creative Content Strategist",
    company: "Kumparan",
    location: "Jakarta Selatan",
    type: "Penuh Waktu",
    category: "Creative",
    description: "Kembangkan strategi konten yang memenangkan perhatian pembaca muda dan mendorong pertumbuhan platform berita digital kami. Kamu akan menganalisis tren konten, mengidentifikasi topik yang berpotensi viral, mendefinisikan suara dan gaya editorial kami, mengkoordinasikan kalender editorial, serta bereksperimen dengan format konten baru (explainer, thread, visual stories) untuk meningkatkan engagement.",
    skills: ["Content Strategy", "Editorial", "Analytics", "Social Media", "Writing"]
  }

];

module.exports = extraJobs;
