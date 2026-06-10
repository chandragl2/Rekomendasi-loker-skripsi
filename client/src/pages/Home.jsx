import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Upload, Cpu, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8"
            >
              <Sparkles className="h-3 w-3" />
              <span>AI-Powered Job Recommendations</span>
            </Motion.div> */}

            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]"
            >
              Temukan Pekerjaan <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">
                Sesuai Keterampilanmu
              </span>
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Upload CV Anda, biarkan AI kami menganalisis keahlian Anda, dan
              dapatkan rekomendasi pekerjaan yang paling cocok dengan persentase
              kecocokan akurat.
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                Lihat Lowongan
              </Link>
            </Motion.div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-50 blur-[120px] opacity-60 animate-pulse"></div>
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-50 blur-[120px] opacity-60 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      {/* Stats Section - Added for visual impact */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -ml-20 -mb-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  88%
                </div>
                <div className="text-indigo-300 font-medium">
                  Akurasi Matching
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  130+
                </div>
                <div className="text-indigo-300 font-medium">
                  Lowongan Kerja
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  &lt; 1.5s
                </div>
                <div className="text-indigo-300 font-medium">
                  Waktu Rekomendasi
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tiga langkah mudah untuk mendapatkan pekerjaan yang benar-benar
              cocok dengan kualifikasi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Upload className="h-8 w-8 text-white" />,
                title: "1. Upload CV",
                desc: "Unggah CV Anda dalam format PDF. Sistem kami akan memproses dokumen secara aman.",
                color: "bg-blue-600",
                gradient: "from-blue-600 to-blue-400",
              },
              {
                icon: <Cpu className="h-8 w-8 text-white" />,
                title: "2. Analisis AI",
                desc: "Algoritma TF-IDF kami mengekstrak kata kunci dan keahlian penting dari profil Anda.",
                color: "bg-indigo-600",
                gradient: "from-indigo-600 to-indigo-400",
              },
              {
                icon: <Briefcase className="h-8 w-8 text-white" />,
                title: "3. Hasil Rekomendasi",
                desc: "Lihat daftar lowongan kerja dengan skor kecocokan tertinggi untuk Anda.",
                color: "bg-violet-600",
                gradient: "from-violet-600 to-violet-400",
              },
            ].map((step, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-10 rounded-4xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br ${step.gradient} shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
