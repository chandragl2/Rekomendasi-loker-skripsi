import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Cpu, Briefcase, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Temukan Pekerjaan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Sesuai Keterampilanmu
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Upload CV Anda, biarkan AI kami menganalisis keahlian Anda, dan dapatkan rekomendasi pekerjaan yang paling cocok dengan persentase kecocokan akurat.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
              >
                Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Bagaimana Cara Kerjanya?</h2>
            <p className="mt-4 text-gray-500">Tiga langkah mudah untuk mendapatkan pekerjaan impian Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Upload className="h-10 w-10 text-white" />,
                title: "1. Upload CV",
                desc: "Unggah CV Anda dalam format PDF. Sistem kami menerima berbagai format layout.",
                color: "bg-blue-500"
              },
              {
                icon: <Cpu className="h-10 w-10 text-white" />,
                title: "2. Sistem Analisis Skill",
                desc: "AI canggih kami akan mengekstrak skill dan pengalaman dari dokumen Anda.",
                color: "bg-indigo-500"
              },
              {
                icon: <Briefcase className="h-10 w-10 text-white" />,
                title: "3. Dapatkan Rekomendasi",
                desc: "Lihat daftar lowongan yang paling cocok dengan persentase kecocokan tinggi.",
                color: "bg-purple-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full ${step.color} shadow-lg mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
