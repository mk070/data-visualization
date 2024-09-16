// components/DataUploader.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';

const DataUploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv, .xlsx',
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!');
      onUploadComplete('analyze')
      setUploadSuccess(true);
    } catch (error) {
      toast.error('File upload failed. Please try again.');
    }
  };

  return (
    <div className="mb-8">
  <h2 className="text-3xl font-bold text-primary mb-6">Upload Your Data</h2>
  
  {!uploadSuccess ? (
    <>
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } shadow-md hover:shadow-lg`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-gray-700 text-lg">
            Selected file: <strong>{file.name}</strong>
          </p>
        ) : isDragActive ? (
          <p className="text-gray-700 text-lg">Drop the file here...</p>
        ) : (
          <p className="text-gray-700 text-lg">
            Drag and drop a CSV or Excel file here, or <span className="text-blue-600 underline">click to select a file</span>.
          </p>
        )}
      </div>
      
      <button
        onClick={handleUpload}
        className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Upload
      </button>
    </>
  ) : (
    <div className="flex flex-col items-center">
      <p className="text-green-600 font-semibold text-lg mb-4">File uploaded successfully!</p>
      
      <div className="flex space-x-6">
        <button
          onClick={() => onUploadComplete('analyze')}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Analyze Chart
        </button>
        
        <button
          onClick={() => onUploadComplete('table')}
          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-purple-500 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Get Table
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default DataUploader;
