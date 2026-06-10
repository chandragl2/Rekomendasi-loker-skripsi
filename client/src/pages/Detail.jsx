import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft, Building2, MapPin, Share2, Bookmark,
  LayoutList, CheckCircle, Briefcase, Tag, Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import API_URL from '../utils/api';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [applicationStatus, setApplicationStatus] = React.useState({ type: '', message: '' });

  React.useEffect(() => {
    if (location.state?.job) {
      setJob(location.state.job);
      setLoading(false);
      return;
    }
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/jobs/${id}`);
        const data = response?.data || {};
        setJob({ ...data, matchScore: data?.matchScore || 0 });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Job not found or server error');
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, location.state]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-indigo-600">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Memuat detail lowongan...</p>
      </div>
    </div>
  );

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Lowongan Tidak Ditemukan</h2>
          <Link to="/jobs" className="text-indigo-600 mt-4 inline-block hover:underline">
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    );
  }

  // Pastikan skills unik untuk tampilan
  const uniqueSkills = [...new Set((Array.isArray(job?.skills) ? job.skills : []).map(s => s?.trim()).filter(Boolean))];
  const qualifications = Array.isArray(job?.qualifications) ? job.qualifications : [];
  const hasMatchScore = job.matchScore && job.matchScore > 0;

  const handleApplyClick = () => {
    setApplicationStatus({ type: '', message: '' });

    const originalUrl = typeof job.url === 'string' ? job.url.trim() : '';
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const message = 'URL lowongan tidak tersedia.';
    setApplicationStatus({
      type: 'error',
      message,
    });
    window.alert(message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
            <div className="bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 mb-3">
                    {job.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-indigo-100 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {job.type || 'Penuh Waktu'}
                    </span>
                    {job.source && job.source !== 'Seed' && (
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4" />
                        Sumber: {job.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score (hanya jika ada) */}
                {hasMatchScore && (
                  <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-4 text-center min-w-[96px]">
                    <p className="text-xs text-indigo-200 mb-1">Kecocokan</p>
                    <p className="text-4xl font-extrabold text-white">{job.matchScore}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-5 md:px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleApplyClick}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] text-base"
              >
                Lamar Sekarang
              </button>
              <div className="flex gap-3">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 text-sm font-bold transition-all">
                  <Bookmark className="h-5 w-5" /> <span className="sm:hidden">Simpan</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 text-sm font-bold transition-all">
                  <Share2 className="h-5 w-5" /> <span className="sm:hidden">Bagikan</span>
                </button>
              </div>
            </div>
            {applicationStatus.message && (
              <div className="px-5 md:px-8 pb-5">
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {applicationStatus.message}
                </div>
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Description + Qualifications */}
            <div className="lg:col-span-2 space-y-5">
              {/* Deskripsi */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                  Deskripsi Pekerjaan
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {job.description || 'Deskripsi tidak tersedia.'}
                </p>
              </div>

              {/* Kualifikasi */}
              {qualifications.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
                    Kualifikasi
                  </h2>
                  <ul className="space-y-2.5">
                    {qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {uniqueSkills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
                    Skill yang Dibutuhkan
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700 font-medium"
                      >
                        <Tag className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-5">
              {/* Info Pekerjaan */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Info Lowongan</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Tipe', value: job.type || 'Penuh Waktu' },
                    { label: 'Kategori', value: job.category || '-' },
                    { label: 'Lokasi', value: job.location || '-' },
                    { label: 'Perusahaan', value: job.company || '-' },
                    ...(job.source ? [{ label: 'Sumber', value: job.source }] : []),
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm text-gray-800 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Lamar Ulang (sticky di sidebar) */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                <p className="text-sm text-indigo-700 font-medium mb-3">Tertarik dengan posisi ini?</p>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors text-sm shadow hover:shadow-md"
                >
                  Lamar Sekarang
                </button>
              </div>

              {/* Back to list */}
              <button
                onClick={() => navigate('/jobs')}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <LayoutList className="h-4 w-4" />
                Lihat Semua Lowongan
              </button>
            </div>
          </div>
        </Motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Detail;
