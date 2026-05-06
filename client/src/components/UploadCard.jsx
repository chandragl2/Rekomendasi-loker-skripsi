import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const UploadCard = ({ onAnalyze }) => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    if (file && file.type === 'application/pdf') {
      setFile(file);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('cv', file);

    try {
      // Direct call to running backend
      // On Vercel, we use relative path
      const response = await axios.post('/api/jobs/recommend', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onAnalyze(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error analysing CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Upload Your CV</h2>
      <p className="text-gray-500 text-center mb-8">Format supported: PDF only (Max 2MB)</p>

      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current.click()}
      >
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-indigo-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">{file.name}</p>
            <p className="text-sm text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {!loading && (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-4 text-red-500 text-sm hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">Drag & Drop your CV here</p>
            <p className="text-sm text-gray-500 mt-2">or <span className="text-indigo-600 font-medium">browse files</span></p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className={`w-full mt-8 py-3 rounded-xl font-bold text-white transition-all transform shadow-md flex justify-center items-center ${
          file && !loading
            ? 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] hover:shadow-lg' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Analysing...
          </>
        ) : (
          'Bandingkan Kecocokan'
        )}
      </button>
    </motion.div>
  );
};

export default UploadCard;
