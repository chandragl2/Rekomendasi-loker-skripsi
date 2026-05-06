import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, FileText, BarChart2, Layers, ArrowRight, CheckCircle, BookOpen, Code2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
  {
    icon: <FileText className="h-7 w-7 text-white" />,
    color: 'bg-blue-500',
    title: '1. Upload CV (PDF)',
    desc: 'Pengguna mengunggah CV dalam format PDF. Sistem mengekstrak teks secara otomatis menggunakan library pdf-parse.',
  },
  {
    icon: <Brain className="h-7 w-7 text-white" />,
    color: 'bg-indigo-500',
    title: '2. Preprocessing Teks',
    desc: 'Teks CV dan deskripsi lowongan diproses: lowercase, hapus tanda baca, tokenisasi, hapus stopwords (ID+EN), dan stemming.',
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-white" />,
    color: 'bg-violet-500',
    title: '3. Vektorisasi TF-IDF',
    desc: 'Setiap dokumen direpresentasikan sebagai vektor numerik menggunakan bobot TF-IDF berdasarkan vocabulary global dari seluruh korpus lowongan.',
  },
  {
    icon: <Layers className="h-7 w-7 text-white" />,
    color: 'bg-purple-500',
    title: '4. Cosine Similarity',
    desc: 'Sistem menghitung kemiripan (0–100%) antara vektor CV pengguna dengan vektor setiap lowongan, lalu mengurutkan hasil dari yang tertinggi.',
  },
];

const techStack = [
  { name: 'React.js', desc: 'Frontend UI library', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Node.js & Express', desc: 'Backend REST API', color: 'text-green-600 bg-green-50 border-green-200' },
  { name: 'MongoDB & Mongoose', desc: 'Database NoSQL', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'TF-IDF (Manual)', desc: 'Algoritma ranking teks', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { name: 'Cosine Similarity', desc: 'Metrik kemiripan vektor', color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { name: 'pdf-parse', desc: 'Ekstrasi teks dari PDF', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { name: 'Natural (NLP)', desc: 'Stemming & tokenisasi', color: 'text-red-600 bg-red-50 border-red-200' },
  { name: 'Framer Motion', desc: 'Animasi antarmuka', color: 'text-pink-600 bg-pink-50 border-pink-200' },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Tentang Sistem Ini
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Sistem rekomendasi lowongan kerja berbasis <strong>Content-Based Filtering</strong> menggunakan
              algoritma <strong>TF-IDF</strong> dan <strong>Cosine Similarity</strong> yang diimplementasikan
              dari nol tanpa library otomatis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latar Belakang */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Latar Belakang</h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>
                Proses pencarian kerja seringkali memerlukan waktu yang lama dan hasilnya tidak selalu
                relevan dengan kemampuan pelamar. Pelamar harus menyortir ratusan lowongan secara manual
                untuk menemukan yang paling sesuai dengan latar belakang dan keahlian mereka.
              </p>
              <p>
                Sistem ini hadir sebagai solusi dengan memanfaatkan teknik <strong>Information
                Retrieval</strong> — secara khusus metode <strong>Vector Space Model (VSM)</strong> dengan
                representasi <strong>TF-IDF (Term Frequency-Inverse Document Frequency)</strong> — untuk
                menghitung secara otomatis seberapa relevan sebuah lowongan dengan profil CV yang diunggah.
              </p>
              <p>
                Implementasi algoritma dilakukan <strong>dari nol (from scratch)</strong> di sisi backend
                tanpa menggunakan library NLP siap pakai seperti scikit-learn, sebagai bagian dari
                persyaratan akademik penelitian ini.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Cara Kerja Algoritma</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Empat tahapan cerdas dari pengolahan data CV hingga menghasilkan rekomendasi yang personal.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col sm:flex-row gap-6"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg shadow-indigo-100`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rumus */}
      <section className="py-20 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Formula Matematika</h2>
            <p className="text-indigo-200 opacity-70">Dasar perhitungan yang digunakan dalam sistem rekomendasi ini.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'TF (Term Frequency)',
                formula: 'TF(t,d) = f(t,d) / |d|',
                desc: 'Menghitung seberapa sering sebuah kata muncul dalam dokumen relatif terhadap panjang dokumen.',
                color: 'bg-white/5 border-white/10',
                textColor: 'text-blue-400',
              },
              {
                title: 'IDF (Inverse Doc Freq)',
                formula: 'IDF(t) = log(N / df(t))',
                desc: 'Memberikan bobot lebih besar pada kata-kata unik yang jarang muncul di dokumen lain.',
                color: 'bg-white/5 border-white/10',
                textColor: 'text-indigo-400',
              },
              {
                title: 'Cosine Similarity',
                formula: 'cos(θ) = (A·B) / (|A|×|B|)',
                desc: 'Mengukur sudut antara vektor CV dan Lowongan untuk menentukan tingkat kemiripan.',
                color: 'bg-white/5 border-white/10',
                textColor: 'text-emerald-400',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-[2rem] border p-8 ${item.color} backdrop-blur-sm hover:bg-white/10 transition-colors group`}
              >
                <h3 className="font-bold text-white mb-4 text-lg">{item.title}</h3>
                <div className={`font-mono text-base md:text-lg font-black ${item.textColor} bg-black/40 rounded-2xl px-4 py-4 mb-4 border border-white/5 text-center group-hover:scale-105 transition-transform`}>
                  {item.formula}
                </div>
                <p className="text-indigo-100/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-4 px-4 py-2 bg-indigo-50 rounded-full">
              <Code2 className="h-4 w-4" />
              <span>Technology Stack</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Teknologi Terkini</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${tech.color.replace('bg-', 'bg-opacity-40 bg-')}`}
              >
                <div className="font-black text-base mb-1">{tech.name}</div>
                <div className="text-xs font-medium opacity-70 leading-relaxed">{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Coba Sekarang!</h2>
            <p className="text-indigo-100 mb-8">Upload CV kamu dan lihat lowongan yang paling cocok dengan skillmu.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Mulai Cari Lowongan <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
