import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const QueryForm = ({ onQueryResult }) => {
  const [query, setQuery] = useState('');

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!query) {
      toast.error("Please enter a query.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      toast.success('Query executed successfully!');
      onQueryResult(response.data);
    } catch (error) {
      toast.error('Error executing query. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Ask a Question</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your natural language query"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
      />
      <button
        onClick={handleQuerySubmit}
        className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-accent transition duration-300"
      >
        Submit Query
      </button>
    </div>
  );
};

export default QueryForm;
