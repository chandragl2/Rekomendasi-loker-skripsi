const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('../models/Candidate');
const connectDB = require('../config/db');

dotenv.config();

const candidates = [
  {
    nama: "Budi Santoso",
    pendidikan: "S1 Teknik Informatika, Universitas Indonesia",
    keahlian: "JavaScript, React, Node.js, Express, MongoDB, REST API, Git",
    pengalaman: "2 Tahun sebagai Fullstack Developer di Startup Teknologi"
  },
  {
    nama: "Siti Aminah",
    pendidikan: "S1 Akuntansi, Universitas Gadjah Mada",
    keahlian: "Microsoft Excel, Financial Reporting, Tax Planning, Audit, SAP",
    pengalaman: "3 Tahun sebagai Senior Accountant di Kantor Akuntan Publik"
  },
  {
    nama: "Andi Wijaya",
    pendidikan: "S1 Desain Komunikasi Visual, ITB",
    keahlian: "Figma, Adobe Illustrator, Photoshop, UI/UX Design, Prototyping",
    pengalaman: "Freelance UI/UX Designer selama 4 tahun"
  },
  {
    nama: "Dewi Lestari",
    pendidikan: "S1 Ilmu Komunikasi, Universitas Padjadjaran",
    keahlian: "Content Writing, Copywriting, Social Media Management, SEO, Public Relations",
    pengalaman: "Content Creator di Digital Agency ternama"
  },
  {
    nama: "Eko Prasetyo",
    pendidikan: "S1 Teknik Elektro, ITS",
    keahlian: "Python, Machine Learning, SQL, Data Analysis, Power BI, TensorFlow",
    pengalaman: "Data Scientist di Perusahaan E-commerce"
  },
  {
    nama: "Fitri Handayani",
    pendidikan: "S1 Manajemen, Universitas Diponegoro",
    keahlian: "Human Resources, Recruitment, Payroll, Employee Engagement, KPI",
    pengalaman: "HR Generalist di Perusahaan Manufaktur"
  },
  {
    nama: "Guntur Wibowo",
    pendidikan: "S1 Sistem Informasi, BINUS University",
    keahlian: "PHP, Laravel, MySQL, HTML, CSS, Bootstrap, jQuery",
    pengalaman: "Backend Developer fokus pada Sistem ERP"
  },
  {
    nama: "Hesti Putri",
    pendidikan: "S1 Sastra Inggris, Universitas Airlangga",
    keahlian: "English Proficiency, Translation, Customer Service, Communication Skills",
    pengalaman: "Customer Success Specialist di Perusahaan SaaS"
  },
  {
    nama: "Indra Kusuma",
    pendidikan: "S1 Hukum, Universitas Brawijaya",
    keahlian: "Legal Drafting, Corporate Law, Compliance, Negotiation, Contract Management",
    pengalaman: "Legal Officer di Perusahaan Properti"
  },
  {
    nama: "Joko Widodo (Bukan Presiden)",
    pendidikan: "S1 Teknik Sipil, Universitas Sebelas Maret",
    keahlian: "AutoCAD, Project Management, RAB, Structure Analysis, SketchUp",
    pengalaman: "Site Manager pada proyek pembangunan gedung bertingkat"
  },
  {
    nama: "Kartika Sari",
    pendidikan: "S1 Psikologi, Universitas Indonesia",
    keahlian: "Psychological Testing, Behavioral Interview, Counseling, Training & Development",
    pengalaman: "Talent Acquisition di Tech Startup"
  },
  {
    nama: "Lutfi Hakim",
    pendidikan: "S1 Informatika, Telkom University",
    keahlian: "Cyber Security, Network Administration, Linux, Cisco, Firewall",
    pengalaman: "Network Security Engineer di Provider Internet"
  },
  {
    nama: "Maya Indah",
    pendidikan: "S1 Ekonomi, Universitas Hasanuddin",
    keahlian: "Marketing Strategy, Market Research, Brand Management, Sales Forecasting",
    pengalaman: "Brand Manager di FMCG"
  },
  {
    nama: "Nanda Pratama",
    pendidikan: "S1 Teknik Mesin, UGM",
    keahlian: "SolidWorks, Maintenance, Production Planning, Quality Control, Lean Manufacturing",
    pengalaman: "Production Engineer di Industri Otomotif"
  },
  {
    nama: "Oki Setiawan",
    pendidikan: "S1 Arsitektur, Universitas Trisakti",
    keahlian: "ArchiCAD, V-Ray, Revit, Interior Design, Architectural Drawing",
    pengalaman: "Junior Architect di Firma Konsultan Arsitek"
  },
  {
    nama: "Putri Rahayu",
    pendidikan: "S1 Farmasi, Universitas Padjadjaran",
    keahlian: "Pharmacology, Clinical Pharmacy, Drug Interaction, Laboratory Research",
    pengalaman: "Apoteker di Rumah Sakit Swasta"
  },
  {
    nama: "Qori Anisa",
    pendidikan: "S1 Matematika, IPB University",
    keahlian: "Statistical Modeling, R Programming, Data Mining, Predictive Analytics",
    pengalaman: "Quantitative Analyst di Lembaga Keuangan"
  },
  {
    nama: "Rian Hidayat",
    pendidikan: "S1 Informatika, Gunadarma",
    keahlian: "Mobile Development, Flutter, Dart, Firebase, Android Studio",
    pengalaman: "Mobile Developer spesialis Android & iOS"
  },
  {
    nama: "Sari Dewi",
    pendidikan: "S1 Hubungan Internasional, Universitas Indonesia",
    keahlian: "Diplomacy, International Relations, Analysis, Negotiation, Foreign Language",
    pengalaman: "Staff di Kedutaan Besar"
  },
  {
    nama: "Taufik Ismail",
    pendidikan: "S1 Teknik Kimia, ITB",
    keahlian: "Chemical Process, Heat Transfer, ASPEN HYSYS, Laboratory Safety",
    pengalaman: "Process Engineer di Kilang Minyak"
  },
  {
    nama: "Utami Ningsih",
    pendidikan: "S1 Pendidikan Guru SD, UPI",
    keahlian: "Teaching, Curriculum Development, Child Psychology, Classroom Management",
    pengalaman: "Guru Kelas di Sekolah Dasar Internasional"
  },
  {
    nama: "Vino Bastian",
    pendidikan: "S1 Seni Teater, IKJ",
    keahlian: "Acting, Public Speaking, Creative Directing, Script Writing",
    pengalaman: "Aktor dan Sutradara Teater Komunitas"
  },
  {
    nama: "Winda Astuti",
    pendidikan: "S1 Gizi, Universitas Diponegoro",
    keahlian: "Nutrition Planning, Food Science, Dietetics, Public Health",
    pengalaman: "Ahli Gizi di Pusat Kesehatan"
  },
  {
    nama: "Xavier Aris",
    pendidikan: "S1 Teknik Penerbangan, ITB",
    keahlian: "Aerodynamics, Aircraft Maintenance, Avionics, CAD",
    pengalaman: "Maintenance Engineer di Maskapai Penerbangan"
  },
  {
    nama: "Yuni Shara",
    pendidikan: "S1 Pariwisata, STP Bandung",
    keahlian: "Hotel Management, Hospitality, Event Planning, Tour Guiding",
    pengalaman: "Front Office Manager di Hotel Berbintang"
  },
  {
    nama: "Zaki Mubarak",
    pendidikan: "S1 Jurnalistik, Universitas Padjadjaran",
    keahlian: "Investigative Journalism, Photography, Video Editing, News Writing",
    pengalaman: "Reporter di Media Cetak Nasional"
  },
  {
    nama: "Agus Supriatna",
    pendidikan: "S1 Peternakan, IPB University",
    keahlian: "Animal Husbandry, Feed Nutrition, Farm Management, Livestock Breeding",
    pengalaman: "Manager Operasional di Peternakan Modern"
  },
  {
    nama: "Bella Saphira",
    pendidikan: "S1 Kedokteran Gigi, Universitas Indonesia",
    keahlian: "Dental Surgery, Orthodontics, Patient Care, Oral Health",
    pengalaman: "Dokter Gigi Praktik Mandiri"
  },
  {
    nama: "Chandra Gulo",
    pendidikan: "S1 Teknik Informatika, Universitas Sumatera Utara",
    keahlian: "Fullstack Web, React Native, AI, Machine Learning, Cloud Computing",
    pengalaman: "Lead Developer di Proyek Skripsi"
  },
  {
    nama: "Dian Sastro",
    pendidikan: "S1 Filsafat, Universitas Indonesia",
    keahlian: "Critical Thinking, Ethics, Philosophy, Research, Academic Writing",
    pengalaman: "Peneliti di Lembaga Kajian Budaya"
  }
];

const seedCandidates = async () => {
  try {
    await connectDB();

    // Clear existing candidates
    await Candidate.deleteMany();
    console.log('🗑️  Old candidates cleared');

    // Insert new candidates
    await Candidate.insertMany(candidates);
    console.log(`✅ ${candidates.length} candidates seeded successfully`);

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding candidates:', error);
    process.exit(1);
  }
};

seedCandidates();
