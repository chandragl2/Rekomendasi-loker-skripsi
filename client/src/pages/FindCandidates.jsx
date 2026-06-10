import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CandidateCard from '../components/CandidateCard';
import { Search, Loader2, Users, Target, CheckCircle, XCircle, X } from 'lucide-react';
import axios from 'axios';

const FindCandidates = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      showToast('error', 'Masukkan deskripsi lowongan terlebih dahulu.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.post('/api/candidates/recommend', {
        jobDescription
      });
      setCandidates(res.data.data);
      showToast('success', `Ditemukan ${res.data.count} kandidat yang relevan.`);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showToast('error', 'Gagal memproses rekomendasi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-md w-[calc(100%-2rem)]"
            style={{
              backgroundColor: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
              borderColor: toast.type === 'success' ? '#86efac' : '#fca5a5',
            }}
          >
            {toast.type === 'success'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              : <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            }
            <p className={`text-sm font-medium flex-1 ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest mb-6"
            >
              <Users className="h-4 w-4" /> Employer Panel
            </Motion.div>
            <Motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight"
            >
              Temukan Kandidat <span className="text-indigo-600">Terbaik</span>
            </Motion.h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-lg">
              Masukkan kebutuhan lowongan pekerjaan Anda, dan algoritma kami akan memberikan ranking kandidat yang paling sesuai berdasarkan keahlian dan pengalaman.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto mb-16">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-gray-100"
            >
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-3 ml-1">
                    <Target className="h-4 w-4 text-indigo-600" /> Deskripsi Lowongan / Kriteria Pekerjaan
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Contoh: Dibutuhkan React Developer dengan keahlian Node.js, Express, dan pengalaman minimal 2 tahun di bidang startup..."
                    className="w-full min-h-[150px] p-5 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-gray-700 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <><Loader2 className="h-6 w-6 animate-spin" /> Menganalisis...</>
                  ) : (
                    <><Search className="h-6 w-6" /> Cari Kandidat Terbaik</>
                  )}
                </button>
              </form>
            </Motion.div>
          </div>

          {/* Results Section */}
          <div id="results-section" className="scroll-mt-24">
            <AnimatePresence>
              {searched && (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Hasil Rekomendasi
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Diurutkan berdasarkan skor kemiripan tertinggi
                      </p>
                    </div>
                    {candidates.length > 0 && (
                      <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold">
                        Menampilkan {candidates.length} kandidat
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="p-4 bg-indigo-50 rounded-full mb-4">
                        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                      </div>
                      <p className="text-gray-500 font-medium">Memproses data dengan TF-IDF...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {candidates.length > 0 ? (
                        candidates.map((candidate, index) => (
                          <CandidateCard key={candidate._id} candidate={candidate} index={index} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-20 bg-gray-100/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg font-medium">Tidak ada kandidat yang cocok dengan kriteria tersebut.</p>
                          <button 
                            onClick={() => setSearched(false)}
                            className="mt-4 text-indigo-600 font-bold hover:underline"
                          >
                            Coba kriteria lain
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FindCandidates;
