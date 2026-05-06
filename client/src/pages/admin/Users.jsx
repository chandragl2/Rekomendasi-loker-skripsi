import React from "react";
import { 
  Users as UsersIcon, 
  Mail, 
  FileUp, 
  MoreVertical,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

const Users = () => {
  const users = [
    { id: 1, name: "Chandra Gulo", email: "chandra@example.com", totalCV: 5, date: "2 Mei 2025" },
    { id: 2, name: "Budi Santoso", email: "budi@gmail.com", totalCV: 2, date: "3 Mei 2025" },
    { id: 3, name: "Ani Wijaya", email: "ani.w@outlook.com", totalCV: 8, date: "4 Mei 2025" },
    { id: 4, name: "Dedi Setiadi", email: "dedi@tech.id", totalCV: 1, date: "5 Mei 2025" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 font-medium">Monitoring aktivitas user dan pengunggahan CV.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            {users.length} Active Users
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={user.id}
            className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-900 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              {user.name.charAt(0)}
            </div>

            <h3 className="text-lg font-black text-slate-900 truncate">{user.name}</h3>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-semibold truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <FileUp className="w-4 h-4" />
                <span className="text-xs font-semibold">{user.totalCV} CV Uploaded</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Joined</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{user.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Users;
