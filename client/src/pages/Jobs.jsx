import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Building2, Briefcase, ChevronRight,
  ChevronLeft, Filter, Loader2, RefreshCw, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const CATEGORIES = [
  'Semua', 'Engineering', 'Data', 'Product', 'Design', 'Marketing',
  'Finance', 'Healthcare', 'Education', 'Legal', 'Sales', 'HR',
  'Operations', 'Creative', 'Technology', 'Lainnya'
];

const JOBS_PER_PAGE = 12;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('Semua');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: JOBS_PER_PAGE };
      if (category !== 'Semua') params.category = category;
      if (search) params.search = search;

      const res = await axios.get('http://localhost:5000/api/jobs/all', { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Gagal memuat data lowongan. Pastikan server berjalan dan database sudah di-seed.');
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 pt-14 pb-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-white mb-2"
          >
            Daftar Lowongan Pekerjaan
          </motion.h1>
          <p className="text-indigo-200 mb-8 text-sm">
            {total > 0 ? `${total} lowongan tersedia` : 'Memuat data...'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari posisi, perusahaan, atau skill..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors text-sm"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Kategori */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
          {(search || category !== 'Semua') && (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setCategory('Semua'); setPage(1); }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Reset Filter
            </button>
          )}
        </div>

        {/* Status Info */}
        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-5">
            Menampilkan <span className="font-semibold text-gray-800">{jobs.length}</span> dari{' '}
            <span className="font-semibold text-gray-800">{total}</span> lowongan
            {search && <> untuk "<span className="font-semibold text-indigo-600">{search}</span>"</>}
            {category !== 'Semua' && <> di kategori <span className="font-semibold text-indigo-600">{category}</span></>}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin mb-3 text-indigo-500" />
            <p className="text-sm">Memuat lowongan...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-gray-600 text-sm max-w-sm">{error}</p>
            <p className="text-xs text-gray-400 mt-2">
              Coba klik <strong>"Reset/Train Algo"</strong> di Dashboard terlebih dahulu.
            </p>
            <Link to="/dashboard" className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
              Ke Dashboard
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Tidak ada lowongan yang ditemukan</p>
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setCategory('Semua'); setPage(1); }}
              className="mt-4 text-indigo-600 text-sm underline"
            >
              Tampilkan semua lowongan
            </button>
          </div>
        )}

        {/* Job Grid */}
        {!loading && !error && jobs.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${category}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 30px -5px rgba(99,102,241,0.15)' }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300"
                >
                  {/* Category Badge */}
                  <div className="px-5 pt-5 pb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-3">
                      {job.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Job Type Tag */}
                  <div className="px-5 pb-3">
                    <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">
                      {job.type}
                    </span>
                  </div>

                  {/* Skill Tags */}
                  <div className="px-5 pb-4 flex flex-wrap gap-1.5 flex-1">
                    {(job.skills || []).slice(0, 4).map((skill, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {(job.skills || []).length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Lihat Detail Button */}
                  <div className="px-5 pb-5 mt-auto">
                    <Link
                      to={`/detail/${job._id}`}
                      state={{ job: { ...job, id: job._id } }}
                      className="flex items-center justify-center w-full py-2 bg-white border border-indigo-500 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all group"
                    >
                      Lihat Detail
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pb-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                      page === p
                        ? 'bg-indigo-600 text-white shadow'
                        : 'border border-gray-200 text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
