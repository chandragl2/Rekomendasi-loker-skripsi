const seedJobs = [
    // --- 1. ENGINEERING (10 Jobs) ---
    {
      title: "Senior Frontend Developer",
      company: "Tech Giant Indonesia",
      location: "Jakarta Selatan",
      type: "Penuh Waktu",
      category: "Engineering",
      description: "Kami mencari Senior Frontend Developer berpengalaman untuk memimpin pengembangan antarmuka pengguna platform e-commerce utama kami. Kamu akan bertanggung jawab merancang dan mengimplementasikan komponen UI yang kompleks menggunakan React dan Redux. Kandidat ideal memiliki pemahaman mendalam tentang optimasi performa web, aksesibilitas, dan pengalaman dengan sistem desain skala besar. Kamu akan berkolaborasi erat dengan tim desain, backend, dan produk untuk menghadirkan pengalaman belanja online yang mulus.",
      skills: ["React", "JavaScript", "TypeScript", "Redux", "Webpack"]
    },
    {
      title: "Backend Golang Engineer",
      company: "Fintech Startup",
      location: "Jakarta Pusat",
      type: "Penuh Waktu",
      category: "Engineering",
      description: "Posisi ini berfokus pada pembangunan payment gateway berkinerja tinggi menggunakan bahasa pemrograman Go. Kamu akan mendesain dan mengimplementasikan layanan mikro (microservices) yang andal dan skalabel menggunakan arsitektur gRPC. Tanggung jawab utama meliputi penulisan kode Go yang bersih dan efisien, pembuatan unit test dan integration test, serta optimasi query database PostgreSQL. Pengalaman di bidang fintech atau payment processing adalah nilai tambah yang sangat besar.",
      skills: ["Golang", "Microservices", "PostgreSQL", "Docker", "gRPC"]
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Solutions",
      location: "Remote",
      type: "Penuh Waktu",
      category: "Engineering",
      description: "Sebagai DevOps Engineer, kamu akan mengelola dan mengoptimalkan infrastruktur cloud berbasis AWS yang mendukung ratusan ribu pengguna. Pekerjaan ini meliputi pembuatan dan pemeliharaan pipeline CI/CD menggunakan Jenkins atau GitLab CI, manajemen kluster Kubernetes, dan otomasi infrastruktur dengan Terraform. Kamu akan menjadi jembatan antara tim development dan operasional, memastikan deployment yang cepat, aman, dan dapat diandalkan.",
      skills: ["AWS", "Terraform", "Kubernetes", "Jenkins", "Linux"]
    },
    {
        title: "Full Stack Developer (MERN)",
        company: "Digital Agency",
        location: "Bandung",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Kami membutuhkan Full Stack Developer yang mahir dengan teknologi MERN untuk mengembangkan berbagai proyek klien dan tools internal. Kamu akan terlibat dari proses perancangan database MongoDB, pembuatan REST API dengan Express dan Node.js, hingga pengembangan tampilan frontend dengan React. Kemampuan untuk bekerja secara mandiri, memahami kebutuhan bisnis klien, dan menerjemahkannya menjadi solusi teknis yang tepat sangat diperlukan di peran ini.",
        skills: ["MongoDB", "Express", "React", "Node.js", "REST API"]
    },
    {
        title: "Mobile Developer (Flutter)",
        company: "App Studio",
        location: "Yogyakarta",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Bergabunglah dengan tim kami untuk membangun aplikasi mobile cross-platform yang diunduh jutaan kali menggunakan Flutter. Kamu akan bertanggung jawab atas seluruh siklus pengembangan aplikasi, mulai dari penulisan kode Dart, integrasi dengan layanan Firebase (Firestore, Auth, Push Notification), hingga publikasi ke Google Play Store dan Apple App Store. Kandidat yang memiliki portofolio aplikasi Flutter yang sudah publis akan mendapat poin lebih.",
        skills: ["Flutter", "Dart", "Firebase", "Android", "iOS"]
    },
    {
        title: "QA Automation Engineer",
        company: "Software House",
        location: "Surabaya",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Peran ini bertujuan untuk memastikan kualitas perangkat lunak yang tinggi sebelum dirilis ke pengguna. Kamu akan mendesain framework pengujian otomatis menggunakan Selenium dan Cypress, membuat skrip test yang komprehensif, dan mengintegrasikannya ke dalam pipeline CI/CD Jenkins. Selain itu, kamu juga akan melakukan pengujian manual untuk skenario yang kompleks dan berkolaborasi dengan developer untuk memperbaiki bug yang ditemukan secara efisien.",
        skills: ["Selenium", "Cypress", "Python", "Testing", "Jenkins"]
    },
    {
        title: "Cybersecurity Analyst",
        company: "SecureNet Systems",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Kami mencari Cybersecurity Analyst untuk melindungi infrastruktur TI kami dari ancaman siber. Kamu akan melakukan monitoring keamanan, analisis insiden, penetration testing basic, dan memastikan kepatuhan terhadap standar keamanan data. Kandidat harus memahami firewall, IDS/IPS, serta memiliki kemampuan analisis log yang kuat untuk mendeteksi anomali.",
        skills: ["Cybersecurity", "Network Security", "Penetration Testing", "Firewall", "Incident Response"]
    },
    {
        title: "System Architect",
        company: "Enterprise Corp",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Sebagai System Architect, kamu akan bertanggung jawab atas perancangan arsitektur sistem untuk aplikasi enterprise berskala besar yang digunakan oleh ribuan karyawan. Kamu akan mendefinisikan pola arsitektur, standar teknologi, dan panduan pengembangan untuk seluruh tim engineering. Pengalaman mendalam dengan Java, cloud computing (AWS/GCP/Azure), desain database relasional dan non-relasional, serta keamanan sistem sangat diperlukan untuk menjalankan peran strategis ini.",
        skills: ["System Design", "Cloud Computing", "Java", "SQL", "Security"]
    },
    {
        title: "Frontend Vue.js Developer",
        company: "Creative Web",
        location: "Bali",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Kami mencari pengembang frontend yang bersemangat dan kreatif untuk bergabung membangun aplikasi web yang interaktif dan indah menggunakan Vue.js dan Nuxt.js. Kamu akan bekerja sama dengan tim desainer untuk mengubah mockup menjadi antarmuka yang hidup, memastikan performa optimal, dan menjaga konsistensi kode. Pengalaman dengan state management (Vuex/Pinia), CSS framework (Tailwind), dan pemahaman dasar tentang SEO sangat diutamakan.",
        skills: ["Vue.js", "Nuxt.js", "JavaScript", "CSS", "HTML"]
    },
    {
        title: "Python Backend Developer",
        company: "AI Labs",
        location: "Singapore (Remote)",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Posisi ini difokuskan pada pengembangan API yang melayani model-model kecerdasan buatan kami ke berbagai platform. Kamu akan membangun layanan backend yang cepat dan skalabel menggunakan Django REST Framework dan FastAPI. Selain itu, kamu juga akan terlibat dalam optimasi query PostgreSQL, konfigurasi caching dengan Redis, dan integrasi dengan layanan cloud AWS. Pemahaman tentang konsep machine learning adalah nilai tambah.",
        skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis"]
    },
    {
        title: "Junior Java Developer",
        company: "Banking IT",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Engineering",
        description: "Ini adalah kesempatan emas bagi lulusan baru atau developer dengan pengalaman 1-2 tahun untuk belajar dan berkembang di lingkungan perbankan yang terstruktur. Kamu akan dimentori oleh senior developer dalam memelihara dan mengembangkan sistem inti perbankan menggunakan Java dan Spring Boot. Tugas sehari-hari meliputi penulisan kode untuk fitur baru, perbaikan bug, dan penulisan dokumentasi teknis. Keuletan belajar dan kemampuan pemecahan masalah lebih diutamakan daripada pengalaman.",
        skills: ["Java", "Spring Boot", "SQL", "Hibernate", "API"]
    },

    // --- 2. DATA (10 Jobs) ---
    {
        title: "Data Scientist",
        company: "Fintech Startup",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Data",
        description: "Sebagai Data Scientist di fintech kami, kamu akan membangun dan memvalidasi model credit scoring yang menentukan kelayakan kredit jutaan calon peminjam. Pekerjaan ini melibatkan eksplorasi data keuangan yang besar (EDA), rekayasa fitur (feature engineering), pelatihan model machine learning dengan scikit-learn, dan evaluasi model menggunakan metrik bisnis yang relevan. Kemampuan komunikasi yang baik untuk mempresentasikan temuan kepada stakeholder non-teknis juga sangat penting.",
        skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn", "SQL"]
    },
    {
        title: "Senior Data Analyst",
        company: "E-Commerce Unicorn",
        location: "Tangerang",
        type: "Penuh Waktu",
        category: "Data",
        description: "Kami membutuhkan seorang analis data senior yang dapat menggali wawasan mendalam dari data perilaku jutaan pelanggan e-commerce kami. Kamu akan membangun dashboard interaktif di Tableau, merancang dan menganalisis eksperimen A/B testing, serta menyediakan rekomendasi berbasis data kepada manajemen produk dan marketing. Keahlian SQL tingkat lanjut, pemahaman statistik yang kuat, dan kemampuan storytelling melalui visualisasi data adalah kunci keberhasilan di peran ini.",
        skills: ["SQL", "Tableau", "Excel", "Data Visualization", "Statistics"]
    },
    {
        title: "Data Engineer",
        company: "Big Data Corp",
        location: "Jakarta Barat",
        type: "Penuh Waktu",
        category: "Data",
        description: "Bergabunglah sebagai Data Engineer untuk membangun dan memelihara infrastruktur data yang menjadi tulang punggung analitik perusahaan. Tanggung jawab utamamu adalah mendesain pipeline ETL (Extract, Transform, Load) yang handal menggunakan Apache Airflow, mengelola data warehouse di BigQuery, dan memastikan kualitas data yang tinggi di seluruh sistem. Kamu akan berkolaborasi dengan tim Data Scientist dan Analyst untuk memahami kebutuhan data mereka dan menyediakan solusi yang tepat.",
        skills: ["Python", "SQL", "ETL", "Airflow", "BigQuery"]
    },
    {
        title: "Business Intelligence Analyst",
        company: "Retail Group",
        location: "Bekasi",
        type: "Penuh Waktu",
        category: "Data",
        description: "Posisi BI Analyst ini bertanggung jawab untuk mengubah data operasional bisnis ritel menjadi laporan dan dashboard yang bermakna bagi para pengambil keputusan. Kamu akan merancang dan mengembangkan laporan menggunakan Power BI, bekerja sama dengan manajemen untuk memahami KPI bisnis, dan memastikan data yang disajikan akurat dan tepat waktu. Pemahaman tentang proses bisnis ritel (inventory, penjualan, supply chain) adalah nilai tambah yang signifikan.",
        skills: ["Power BI", "SQL", "Excel", "Business Analysis", "Reporting"]
    },
    {
        title: "Machine Learning Engineer",
        company: "AI Research",
        location: "Bandung",
        type: "Penuh Waktu",
        category: "Data",
        description: "Peran ini berfokus pada jembatan antara riset AI dan produk nyata. Kamu akan mengambil model machine learning yang dikembangkan oleh tim riset dan menerapkannya ke lingkungan produksi yang handal dan skalabel. Pekerjaan ini mencakup containerisasi model dengan Docker, pembuatan API untuk serving prediksi, monitoring performa model di produksi (model drift), dan otomatisasi pipeline pelatihan ulang (retraining). Pengalaman dengan MLOps tools seperti MLflow atau Kubeflow menjadi keuntungan.",
        skills: ["Python", "TensorFlow", "PyTorch", "Docker", "MLOps"]
    },
    {
        title: "Data Analytics Consultant",
        company: "Consulting Firm",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Data",
        description: "Sebagai konsultan, kamu akan bekerja dengan berbagai klien dari industri yang beragam untuk membantu mereka mengambil keputusan bisnis yang lebih cerdas berbasis data. Setiap proyek akan memberimu tantangan unik, mulai dari analisis data penjualan, optimasi rantai pasok, hingga segmentasi pelanggan. Kemampuan analitis yang tajam, keterampilan presentasi yang mumpuni, dan kemampuan adaptasi yang cepat di lingkungan yang berubah-ubah adalah kunci sukses di posisi ini.",
        skills: ["Python", "R", "SQL", "Excel", "Presentation"]
    },
    {
        title: "Big Data Specialist",
        company: "Telco Provider",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Data",
        description: "Bergabunglah dengan tim data kami untuk menangani dan mengolah dataset masif dari jutaan pelanggan telekomunikasi. Kamu akan bekerja dengan ekosistem Hadoop dan Apache Spark untuk memproses data dalam skala terabyte, membangun pipeline data batch dan streaming, serta mengoptimalkan query pada platform distributed computing. Pemahaman mendalam tentang Scala atau Java untuk pengembangan Spark job sangat diperlukan.",
        skills: ["Hadoop", "Spark", "Scala", "Java", "NoSQL"]
    },
    {
        title: "Marketing Data Analyst",
        company: "AdTech",
        location: "Remote",
        type: "Penuh Waktu",
        category: "Data",
        description: "Posisi ini ada di persimpangan antara data dan marketing. Kamu akan menganalisis performa kampanye iklan digital di berbagai platform (Google Ads, Meta Ads, TikTok Ads), mengoptimalkan alokasi anggaran iklan untuk memaksimalkan ROI, dan membangun model atribusi untuk memahami kontribusi setiap channel marketing. Pengalaman dengan Google Analytics, platform BI, dan dasar-dasar statistik adalah hal yang wajib dimiliki.",
        skills: ["Google Analytics", "SQL", "Excel", "Python", "Marketing"]
    },
    {
        title: "Junior Data Analyst",
        company: "StartUp Inc",
        location: "Yogyakarta",
        type: "Penuh Waktu",
        category: "Data",
        description: "Ini adalah posisi entry-level yang sempurna bagi kamu yang ingin memulai karir di bidang data. Kamu akan belajar sambil bekerja dalam membersihkan dan memvalidasi data, membuat laporan berkala menggunakan SQL dan Excel, serta membantu tim senior dalam analisis yang lebih kompleks. Startup kami menawarkan lingkungan belajar yang dinamis, mentor yang berpengalaman, dan kesempatan untuk berkembang cepat seiring pertumbuhan perusahaan.",
        skills: ["Excel", "SQL", "Python", "Basics"]
    },
    {
        title: "Database Administrator",
        company: "Server Host",
        location: "Surabaya",
        type: "Penuh Waktu",
        category: "Data",
        description: "Sebagai Database Administrator, kamu adalah penjaga keamanan dan performa data perusahaan. Tanggung jawabmu meliputi instalasi, konfigurasi, dan pemeliharaan server database MySQL dan PostgreSQL, pembuatan strategi backup dan recovery yang efektif, monitoring dan optimasi performa query (tuning), serta pengelolaan hak akses pengguna database. Pengalaman dengan lingkungan Linux dan pemahaman tentang konsep keamanan database sangat diperlukan.",
        skills: ["MySQL", "PostgreSQL", "Linux", "Backup", "Performance Tuning"]
    },

    // --- 3. PRODUCT (10 Jobs) ---
    {
        title: "Senior Product Manager",
        company: "SuperApp",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Product",
        description: "Kami mencari Product Manager berpengalaman untuk memimpin vertical ride-hailing di superapp kami yang digunakan oleh lebih dari 50 juta pengguna. Kamu akan mendefinisikan visi dan roadmap produk, melakukan riset pengguna mendalam, menganalisis data untuk menemukan peluang pertumbuhan, dan bekerja sama erat dengan tim engineering dan desain untuk mengeksekusi strategi. Kemampuan untuk menyeimbangkan kebutuhan pengguna, tujuan bisnis, dan kemungkinan teknis adalah kunci keberhasilanmu.",
        skills: ["Product Management", "Agile", "Roadmap", "User Research", "Analytics"]
    },
    {
        title: "Product Owner",
        company: "Banking App",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Product",
        description: "Sebagai Product Owner, kamu adalah suara dari pelanggan di dalam tim pengembangan. Kamu akan mengelola dan memprioritasikan backlog produk, menulis user stories yang jelas dan terperinci, serta berpartisipasi aktif dalam seluruh seremonial Scrum (Sprint Planning, Daily Standup, Review, Retrospective). Keminatan terhadap produk perbankan digital, kemampuan komunikasi yang tajam, dan pengalaman dengan Jira adalah hal yang sangat kami cari.",
        skills: ["Scrum", "Jira", "User Stories", "Communication", "Backlog"]
    },
    {
        title: "Associate Product Manager",
        company: "EdTech",
        location: "Tangerang Selatan",
        type: "Penuh Waktu",
        category: "Product",
        description: "Posisi APM di startup edtech kami adalah pintu masuk yang ideal untuk memulai karir sebagai product manager. Kamu akan mendukung Senior PM dalam mendefinisikan fitur, melakukan competitive analysis, membantu pelaksanaan user testing, dan menganalisis data penggunaan produk. Kami menawarkan program mentoring terstruktur, lingkungan yang mendukung pertumbuhan, dan kesempatan untuk memiliki dampak nyata pada pembelajaran jutaan pelajar di Indonesia.",
        skills: ["Product", "Analysis", "Excel", "Communication", "Tech Savvy"]
    },
    {
        title: "Technical Product Manager",
        company: "Cloud Service",
        location: "Singapore (Remote)",
        type: "Penuh Waktu",
        category: "Product",
        description: "Peran Technical PM ini membutuhkan seseorang yang dapat menjembatani dunia teknis dan bisnis dengan mulus. Kamu akan mengelola produk cloud infrastructure kami, menerjemahkan kebutuhan teknis yang kompleks menjadi spesifikasi produk yang jelas, dan bekerja sama langsung dengan tim software engineer tingkat senior. Latar belakang teknis yang kuat (misalnya, pernah menjadi software developer) adalah persyaratan utama untuk dapat berhasil di posisi ini.",
        skills: ["API", "Cloud", "System Architecture", "Product Management", "Agile"]
    },
    {
        title: "Product Marketing Manager",
        company: "SaaS Company",
        location: "Bali",
        type: "Penuh Waktu",
        category: "Product",
        description: "BergabUnglah sebagai Product Marketing Manager untuk mendefinisikan bagaimana produk SaaS kami diposisikan dan dikomunikasikan kepada pasar. Kamu akan merancang strategi go-to-market untuk peluncuran fitur baru, membuat materi pemasaran dan sales enablement yang menarik, serta berkolaborasi dengan tim penjualan untuk memahami kebutuhan prospek. Kemampuan penulisan copywriting yang kuat dan pemahaman mendalam tentang target audiens B2B sangat diutamakan.",
        skills: ["Marketing Strategy", "Copywriting", "Product Launch", "Market Research", "Sales Enablement"]
    },
    {
        title: "Growth Product Manager",
        company: "Social Media",
        location: "Jakarta Utara",
        type: "Penuh Waktu",
        category: "Product",
        description: "Sebagai Growth PM, seluruh fokusmu adalah membuat platform media sosial kami tumbuh — lebih banyak pengguna baru, lebih banyak pengguna aktif, dan lebih tinggi retensi. Kamu akan merancang dan menjalankan eksperimen pertumbuhan yang cepat (growth experiments), menganalisis funnel akuisisi dan retensi pengguna, serta bekerja sama dengan tim data dan engineering untuk mengidentifikasi dan mengeksploitasi peluang pertumbuhan yang belum dimanfaatkan.",
        skills: ["A/B Testing", "Data Analysis", "Growth Hacking", "UX", "Product"]
    },
    {
        title: "Scrum Master",
        company: "Agile Team",
        location: "Bandung",
        type: "Penuh Waktu",
        category: "Product",
        description: "Kami membutuhkan seorang Scrum Master bersertifikat (CSM/PSM) yang berpengalaman untuk membimbing dan memfasilitasi tim pengembangan kami dalam mengadopsi praktik Agile yang efektif. Kamu akan memimpin seluruh seremonial Scrum, mengidentifikasi dan menghilangkan hambatan (impediments) yang menghalangi tim, serta mendorong budaya perbaikan berkelanjutan (continuous improvement). Pengalaman coaching tim yang sedang dalam transformasi ke Agile adalah nilai tambah.",
        skills: ["Scrum", "Agile", "Coaching", "Jira", "Kanban"]
    },
    {
        title: "Product Analyst",
        company: "E-Commerce",
        location: "Jakarta Barat",
        type: "Penuh Waktu",
        category: "Product",
        description: "Sebagai Product Analyst, kamu akan menjadi mata dan telinga tim produk dalam memahami bagaimana pengguna berinteraksi dengan platform e-commerce kami. Menggunakan tools seperti Amplitude dan Mixpanel, kamu akan men-tracking metrik kunci, membangun funnel analysis, dan melakukan analisis kohort untuk mengidentifikasi pola perilaku pengguna. Temuanmu akan langsung menginformasikan keputusan fitur dan prioritas roadmap produk.",
        skills: ["SQL", "Amplitude", "Mixpanel", "Data Analysis", "Product"]
    },
    {
        title: "Head of Product",
        company: "New Venture",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Product",
        description: "Ini adalah posisi eksekutif yang membutuhkan pemimpin produk berpengalaman untuk bergabung dalam tahap awal yang krusial dari perusahaan kami. Kamu akan mendefinisikan visi dan strategi produk jangka panjang, membangun dan memimpin tim product management dari nol, serta bekerja langsung dengan CEO dan investor dalam menetapkan arah perusahaan. Rekam jejak yang terbukti dalam membangun produk dari 0 ke 1 dan mendorong pertumbuhan yang signifikan sangat diharapkan.",
        skills: ["Leadership", "Strategy", "Management", "Product", "Vision"]
    },
    {
        title: "UX Researcher",
        company: "Product Design Firm",
        location: "Remote",
        type: "Penuh Waktu",
        category: "Product",
        description: "Sebagai UX Researcher, kamu akan menjadi advokat utama bagi pengguna kami. Dengan menggunakan berbagai metode penelitian seperti wawancara pengguna mendalam, survei, usability testing, dan analisis card sorting, kamu akan menghasilkan wawasan yang memandu keputusan desain dan produk. Kamu akan bekerja sama erat dengan desainer dan product manager untuk memastikan setiap keputusan berakar pada pemahaman nyata tentang kebutuhan pengguna.",
        skills: ["User Research", "Interviewing", "Usability Testing", "Reporting", "Empathy"]
    },

    // --- 4. DESIGN (10 Jobs) ---
    {
        title: "Senior UI/UX Designer",
        company: "Design Studio",
        location: "Bandung",
        type: "Penuh Waktu",
        category: "Design",
        description: "Kami mencari desainer UI/UX senior yang memiliki portofolio kuat dan hasrat mendalam terhadap pembuatan pengalaman digital yang indah sekaligus fungsional. Kamu akan memimpin proses desain end-to-end mulai dari wireframing, pembuatan prototipe interaktif di Figma, hingga handoff spesifikasi kepada developer. Kamu juga akan terlibat aktif dalam sesi riset pengguna untuk memvalidasi keputusan desain. Mentor bagi desainer junior adalah bagian dari tanggung jawabmu.",
        skills: ["Figma", "UI Design", "UX Design", "Prototyping", "Wireframing"]
    },
    {
        title: "Product Designer",
        company: "Tech Startup",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Design",
        description: "Sebagai Product Designer, kamu akan merancang pengalaman produk yang holistik dari konsep awal hingga peluncuran. Kamu akan bertanggung jawab atas keseluruhan alur pengalaman pengguna (user flow), mulai dari onboarding hingga fitur inti, memastikan setiap elemen desain kohesif, intuitif, dan konsisten dengan design system kami. Kolaborasi erat dengan product manager dan engineer adalah bagian integral dari pekerjaan sehari-hari.",
        skills: ["Product Design", "Figma", "Design Systems", "User Flows", "Interaction Design"]
    },
    {
        title: "Graphic Designer",
        company: "Creative Agency",
        location: "Yogyakarta",
        type: "Penuh Waktu",
        category: "Design",
        description: "Kami adalah agensi kreatif yang dinamis dan kami membutuhkan Graphic Designer yang berbakat untuk memperkuat tim kami. Kamu akan membuat berbagai materi kreatif termasuk desain iklan digital, konten media sosial, brosur, serta identitas visual merek untuk klien-klien kami. Penguasaan Adobe Creative Suite (Photoshop dan Illustrator) adalah mutlak, serta kemampuan bekerja di bawah deadline yang ketat sambil menjaga kualitas output.",
        skills: ["Adobe Photoshop", "Illustrator", "Branding", "Layout", "Typography"]
    },
    {
        title: "UX Writer",
        company: "Global App",
        location: "Remote",
        type: "Penuh Waktu",
        category: "Design",
        description: "UX Writer kami bertanggung jawab untuk memastikan setiap kata dalam aplikasi kami — mulai dari label tombol, pesan error, hingga onboarding flow — terasa natural, jelas, dan membantu pengguna. Kamu akan berkolaborasi sangat erat dengan desainer UX dan product manager untuk menciptakan microcopy yang tidak hanya informatif tetapi juga mencerminkan suara merek (brand voice) kami yang ramah dan cerdas. Kemampuan menulis dalam Bahasa Indonesia dan Inggris adalah keharusan.",
        skills: ["Copywriting", "UX Writing", "Content Strategy", "Design", "Communication"]
    },
    {
        title: "Interaction Designer",
        company: "Digital Lab",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Design",
        description: "Bergabunglah dengan lab inovasi digital kami sebagai Interaction Designer yang berfokus pada animasi dan micro-interactions yang membuat pengguna terkesan. Kamu akan membuat prototipe interaksi yang sangat rinci menggunakan Figma dan After Effects, mendefinisikan prinsip gerak (motion principles) untuk produk kami, serta bekerja sama dengan frontend developer untuk memastikan animasi diimplementasikan dengan tepat. Portofolio yang menampilkan animasi UI yang menarik adalah wajib.",
        skills: ["After Effects", "Prototyping", "Animation", "Figma", "Interaction"]
    },
    {
        title: "Web Designer",
        company: "Web Dev Shop",
        location: "Semarang",
        type: "Penuh Waktu",
        category: "Design",
        description: "Posisi ini cocok untuk Kamu yang memiliki keahlian visual yang kuat dan memahami dasar-dasar pengembangan web. Kamu akan mendesain tampilan website yang responsif dan menarik untuk klien bisnis kami, mulai dari landing page, company profile, hingga toko online. Selain desain di Figma, kamu juga diharapkan dapat mengimplementasikan desain menggunakan HTML, CSS, dan berkolaborasi dengan developer untuk integrasi dengan platform CMS seperti WordPress.",
        skills: ["Web Design", "HTML", "CSS", "Figma", "Wordpress"]
    },
    {
        title: "Design System Lead",
        company: "Enterprise UX",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Design",
        description: "Sebagai pemimpin design system, kamu akan membangun, mengelola, dan mengembangkan library komponen desain terpusat yang digunakan oleh lebih dari 20 tim produk di seluruh perusahaan. Tanggung jawabmu mencakup pembuatan dokumentasi komponen yang komprehensif, pengelolaan design tokens, memastikan konsistensi aksesibilitas (WCAG), dan berkoordinasi dengan tim engineering untuk menjaga sinkronisasi antara komponen desain dan kode. Ini adalah peran yang membutuhkan ketelitian tinggi dan kemampuan kolaborasi lintas tim.",
        skills: ["Design Systems", "Figma", "Documentation", "Tokens", "Accessibility"]
    },
    {
        title: "Visual Designer",
        company: "Brand Agency",
        location: "Bali",
        type: "Penuh Waktu",
        category: "Design",
        description: "Bergabunglah dengan agensi branding kami yang berbasis di Bali untuk menciptakan konsep visual yang memukau untuk kampanye digital klien-klien premium kami. Sebagai Visual Designer, kamu akan mengembangkan estetika visual yang unik dan kohesif, mulai dari pemilihan palet warna, tipografi, hingga komposisi layout. Kamu memiliki mata yang tajam untuk detail estetika dan kemampuan mengomunikasikan konsep visual kepada klien dengan percaya diri.",
        skills: ["Visual Design", "Color Theory", "Composition", "Adobe CC", "Art Direction"]
    },
    {
        title: "Junior UI Designer",
        company: "Startup",
        location: "Malang",
        type: "Penuh Waktu",
        category: "Design",
        description: "Mulai karir desainmu di startup teknologi kami yang sedang berkembang pesat! Sebagai Junior UI Designer, kamu akan belajar dari para senior designer yang berpengalaman sambil berkontribusi secara nyata dalam pembuatan komponen UI dan layar aplikasi. Kamu akan menggunakan Figma sebagai tool utama dan diharapkan memiliki pemahaman dasar tentang prinsip-prinsip desain antarmuka pengguna. Rasa ingin tahu yang tinggi dan kemauan belajar adalah yang paling kami hargai.",
        skills: ["Figma", "UI Basics", "Adobe XD", "Sketch", "Learning"]
    },
    {
        title: "Creative Director",
        company: "Big Agency",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Design",
        description: "Posisi Creative Director adalah posisi kepemimpinan senior yang membutuhkan seorang visioner kreatif dengan rekam jejak yang terbukti. Kamu akan mendefinisikan arah kreatif keseluruhan agensi, memimpin dan menginspirasi tim desainer, ilustrator, dan videografer, serta memastikan output kreatif yang dihasilkan selalu berkualitas tinggi dan konsisten dengan visi merek klien. Kemampuan presentasi yang menawan dan pengalaman minimal 8 tahun di industri kreatif adalah persyaratan.",
        skills: ["Leadership", "Creative Direction", "Management", "Design", "Strategy"]
    },

    // --- 5. MARKETING (10 Jobs) ---
    {
        title: "Digital Marketing Manager",
        company: "Growth Agency",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Kami mencari Digital Marketing Manager yang strategis dan berbasis data untuk merancang dan mengeksekusi kampanye marketing digital yang komprehensif bagi klien-klien agensi kami. Kamu akan mengelola strategi SEO/SEM, kampanye media sosial berbayar, dan menganalisis performa menggunakan berbagai tools analitik. Kemampuan untuk mengelola multiple campaign secara bersamaan, memahami target audiens yang berbeda, dan mengoptimalkan ROI kampanye adalah hal yang paling kami cari.",
        skills: ["Digital Marketing", "SEO", "SEM", "Social Media", "Analytics"]
    },
    {
        title: "SEO Specialist",
        company: "E-Commerce",
        location: "Tangerang",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Sebagai SEO Specialist, kamu akan bertanggung jawab atas strategi dan eksekusi optimasi mesin pencari (SEO) untuk platform e-commerce kami dengan ribuan halaman produk. Pekerjaan ini mencakup riset kata kunci (keyword research), optimasi konten on-page, analisis backlink, pembuatan laporan peringkat, dan kolaborasi dengan tim konten dan developer untuk implementasi rekomendasi teknis SEO. Pengalaman dengan tools seperti Ahrefs, SEMrush, atau Google Search Console sangat diperlukan.",
        skills: ["SEO", "Keyword Research", "Content", "HTML", "Analytics"]
    },
    {
        title: "Content Marketing Writer",
        company: "Media Co",
        location: "Remote",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Posisi penulisan konten ini adalah untuk seseorang yang memiliki hasrat menulis dan pemahaman tentang bagaimana konten yang baik dapat mendorong pertumbuhan organik. Kamu akan membuat artikel blog, panduan, studi kasus, dan konten long-form lainnya yang informatif, menarik, dan dioptimalkan untuk SEO. Kemampuan riset yang kuat, kemampuan menulis dalam gaya yang beragam sesuai audiens, dan kemampuan menghasilkan ide konten secara konsisten adalah kunci peran ini.",
        skills: ["Writing", "Content Marketing", "SEO", "Storytelling", "Editing"]
    },
    {
        title: "Social Media Specialist",
        company: "Fashion Brand",
        location: "Bandung",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Kami adalah brand fashion lokal yang sedang naik daun dan kami membutuhkan Social Media Specialist yang kreatif dan paham tren untuk mengelola presence kami di Instagram dan TikTok. Kamu akan merencanakan dan membuat konten yang menarik (foto, video reels, story), mengelola interaksi komunitas, berkolaborasi dengan influencer, dan menganalisis performa post menggunakan data insights platform. Pengalaman aktif mengelola akun brand di media sosial adalah persyaratan utama.",
        skills: ["Instagram", "TikTok", "Social Media", "Content Creation", "Community Management"]
    },
    {
        title: "Performance Marketer",
        company: "App Developer",
        location: "Jakarta Barat",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Sebagai Performance Marketer, seluruh pekerjaanmu berputar di sekitar angka dan konversi. Kamu akan mengelola kampanye iklan berbayar di Facebook Ads Manager dan Google Ads dengan anggaran yang signifikan, membuat dan menguji berbagai variasi kreatif iklan (A/B testing), mengoptimalkan biaya per akuisisi (CPA) dan return on ad spend (ROAS), serta memberikan laporan performa yang transparan kepada manajemen. Pengalaman mengoptimalkan kampanye dengan budget di atas 100 juta per bulan adalah nilai plus.",
        skills: ["Facebook Ads", "Google Ads", "PPC", "Data Analysis", "ROI"]
    },
    {
        title: "Email Marketing Specialist",
        company: "SaaS",
        location: "Singapore (Remote)",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Kami membutuhkan email marketing specialist untuk memaksimalkan potensi database email pelanggan kami yang terus berkembang. Kamu akan merancang dan mengelola alur otomasi email (drip campaigns, onboarding series, win-back campaigns) menggunakan Mailchimp atau HubSpot, menulis copywriting email yang menarik dan personal, serta menganalisis metrik email (open rate, CTR, konversi) untuk terus mengoptimalkan performa. Pemahaman tentang CRM dan segmentasi list adalah hal penting.",
        skills: ["Email Marketing", "Mailchimp", "Automation", "Copywriting", "CRM"]
    },
    {
        title: "Brand Manager",
        company: "Consumer Goods",
        location: "Jakarta Pusat",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Sebagai Brand Manager untuk salah satu lini produk consumer goods kami, kamu akan menjadi penanggung jawab penuh atas kesehatan merek dan performa penjualan. Tanggung jawabmu meliputi pengembangan strategi merek jangka panjang, perencanaan dan eksekusi kampanye 360 derajat (ATL & BTL), manajemen anggaran merek, serta analisis share of market dan kompetitor. Kolaborasi dengan agensi kreatif, media, dan tim sales adalah bagian sehari-hari pekerjaanmu.",
        skills: ["Branding", "Strategy", "Marketing", "Communication", "Management"]
    },
    {
        title: "Public Relations Specialist",
        company: "PR Firm",
        location: "Jakarta Selatan",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Sebagai PR Specialist, kamu akan menjaga dan membangun reputasi klien-klien kami di mata publik dan media. Tanggung jawab meliputi penulisan dan distribusi siaran pers, pengembangan hubungan dengan jurnalis dan editor media, manajemen krisiskomunikasi, serta perencanaan dan pelaksanaan event media. Kamu harus memiliki jaringan kontak media yang luas, keterampilan menulis yang sangat baik, dan kemampuan berpikir cepat di bawah tekanan.",
        skills: ["PR", "Media Relations", "Communication", "Writing", "Events"]
    },
    {
        title: "Market Research Analyst",
        company: "Research Agency",
        location: "Surabaya",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Bergabunglah dengan tim riset kami untuk melakukan studi pasar yang mendalam dan memberikan wawasan berharga kepada klien korporat. Kamu akan mendesain metodologi riset (kualitatif dan kuantitatif), mengelola survei online dan focus group discussion (FGD), mengolah data menggunakan SPSS atau Python, serta menyusun laporan riset yang komprehensif dan mudah dipahami. Kemampuan analitis yang kuat dan pemahaman mendalam tentang consumer behavior sangat dibutuhkan.",
        skills: ["Market Research", "Surveys", "Data Analysis", "Reporting", "Statistics"]
    },
    {
        title: "Marketing Coordinator",
        company: "Events Co",
        location: "Bali",
        type: "Penuh Waktu",
        category: "Marketing",
        description: "Posisi Marketing Coordinator ini adalah untuk seseorang yang terorganisir, detail-oriented, dan bersemangat dalam industri event dan pariwisata. Kamu akan mengkoordinasikan seluruh aktivitas marketing untuk berbagai event di Bali, mulai dari penyusunan materi promosi, koordinasi dengan vendor desain dan media, pengelolaan media sosial event, hingga pelaporan pasca event. Kemampuan multitasking yang tinggi dan ketenangan di bawah tekanan deadline adalah kemampuan yang sangat kami butuhkan.",
        skills: ["Coordination", "Marketing", "Events", "Organization", "Communication"]
    }
];

module.exports = seedJobs;
