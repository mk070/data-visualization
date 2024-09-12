import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DataUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!');
      onUpload(response.data);
    } catch (error) {
      toast.error('File upload failed. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">Upload Your Data</h2>
      <input
        type="file"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-accent transition duration-300"
      >
        Upload
      </button>
    </div>
  );
};

export default DataUploader;
