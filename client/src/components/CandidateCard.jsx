import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Award, ChevronRight } from 'lucide-react';

const CandidateCard = ({ candidate, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-indigo-200 transition-all group relative overflow-hidden"
    >
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-2xl text-xs font-black border border-indigo-100">
        {candidate.score}% Match
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
            {candidate.nama}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
            <GraduationCap className="h-4 w-4" />
            <span className="line-clamp-1">{candidate.pendidikan}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keahlian Utama</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.keahlian.split(',').map((skill, i) => (
              <span 
                key={i} 
                className="text-[10px] md:text-xs px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg font-bold"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pengalaman</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 italic">
            "{candidate.pengalaman}"
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <button className="text-sm font-black text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
          Lihat Profil Lengkap <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
