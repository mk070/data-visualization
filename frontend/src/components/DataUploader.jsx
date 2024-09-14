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
      <h2 className="text-2xl font-bold text-primary mb-4">Upload Your Data</h2>
      {!uploadSuccess ? (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-gray-700">
                Selected file: <strong>{file.name}</strong>
              </p>
            ) : isDragActive ? (
              <p className="text-gray-700">Drop the file here...</p>
            ) : (
              <p className="text-gray-700">
                Drag and drop a CSV or Excel file here, or click to select a file.
              </p>
            )}
          </div>
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300"
          >
            Upload
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-green-600 font-semibold mb-4">File uploaded successfully!</p>
          {/* <div className="flex space-x-4">
            <button
              onClick={() => onUploadComplete('analyze')}
              className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Analyze Chart
            </button>
            <button
              onClick={() => onUploadComplete('table')}
              className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
            >
              Get Table
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default DataUploader;
