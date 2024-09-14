// QueryForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const QueryForm = ({ onQueryResult }) => {
  const [query, setQuery] = useState('');

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!query) {
      toast.error('Please enter a query.');
      return;
    }

    try {
      // Make the API call with the user's query
      const response = await axios.post('http://localhost:5000/query', { query });
      toast.success('Query executed successfully!');

      // Pass both the result and the user's question back to App.js
      onQueryResult(response.data, query);
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Error executing query. Please try again.');
    }
  };

  return (
    <form onSubmit={handleQuerySubmit}>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your natural language query"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
        Submit Query
      </button>
    </form>
  );
};

export default QueryForm;
