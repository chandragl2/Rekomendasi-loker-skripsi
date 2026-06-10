import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, ChevronRight } from 'lucide-react';

const JobCard = ({ job }) => {
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const matchScore = Number.isFinite(Number(job.matchScore))
    ? Number(job.matchScore)
    : 0;

  return (
    <Motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-2">
              {job.category}
            </span>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{job.title}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="mr-3">{job.company}</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-indigo-600">{matchScore.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Match</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${Math.min(Math.max(matchScore, 0), 100)}%` }}
          ></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              +{skills.length - 3}
            </span>
          )}
        </div>

        <Link 
          to={`/detail/${job.id}`}
          state={{ job }}
          className="flex items-center justify-center w-full py-2.5 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors group"
        >
          Lihat Detail
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Motion.div>
  );
};

export default JobCard;
