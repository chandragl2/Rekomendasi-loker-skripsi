import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Detail from "./pages/Detail";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import FindCandidates from "./pages/FindCandidates";
import CompanyRegister from "./pages/company/Register";
import CompanyLogin from "./pages/company/Login";
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyCreateJob from "./pages/company/CreateJob";
import CompanyJobs from "./pages/company/MyJobs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/find-candidates" element={<FindCandidates />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/about" element={<About />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/jobs/create" element={<CompanyCreateJob />} />
        <Route path="/company/jobs" element={<CompanyJobs />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
