// components/ResultTable.js
import React, { useState } from 'react';
import { FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';

const ResultTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  // Handle sorting
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    // Apply filters
    if (Object.keys(filters).length > 0) {
      sortableData = sortableData.filter((item) => {
        return Object.keys(filters).every((key) => {
          if (!filters[key]) return true;
          const itemValue = String(item[key]).toLowerCase();
          const filterValue = filters[key].toLowerCase();
          return itemValue.includes(filterValue);
        });
      });
    }

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle numeric and string sorting
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        } else {
          return String(aValue).localeCompare(String(bValue));
        }
      });

      if (sortConfig.direction === 'descending') {
        sortableData.reverse();
      }
    }

    return sortableData;
  }, [data, sortConfig, filters]);

  // Handle pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (columnKey) => {
    let direction = 'ascending';
    if (
      sortConfig.key === columnKey &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnKey]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDownload = () => {
    const csvContent = [
      columns.join(','), // Header row
      ...sortedData.map((row) =>
        columns.map((col) => `"${row[col]}"`).join(',')
      ), // Data rows
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'query_result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Query Results</h2>
        <button
          onClick={handleDownload}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-accent transition duration-300"
        >
          Download CSV
        </button>
      </div>

      {/* Rows per page selection */}
      <div className="flex items-center mb-4">
        <label htmlFor="rowsPerPage" className="mr-2 text-gray-700">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-2 px-4 border-b"
                >
                  <div className="flex items-center">
                    {/* Column Header */}
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => handleSort(col)}
                    >
                      {col}
                      {sortConfig.key === col ? (
                        sortConfig.direction === 'ascending' ? (
                          <FaSortUp className="inline ml-1" />
                        ) : (
                          <FaSortDown className="inline ml-1" />
                        )
                      ) : null}
                    </span>
                    {/* Filter Icon */}
                    <span className="relative ml-2">
                      <FaFilter
                        className="cursor-pointer hover:text-primary"
                        onClick={() => {
                          const input = document.getElementById(`filter-${col}`);
                          if (input) input.focus();
                        }}
                      />
                      {/* Filter Input */}
                      <input
                        id={`filter-${col}`}
                        type="text"
                        placeholder="Filter"
                        value={filters[col] || ''}
                        onChange={(e) =>
                          handleFilterChange(col, e.target.value)
                        }
                        className="absolute top-full left-0 mt-1 w-40 p-1 border border-gray-300 rounded shadow-lg bg-white z-10"
                        style={{ display: 'none' }}
                        onBlur={(e) => {
                          e.target.style.display = 'none';
                        }}
                        onFocus={(e) => {
                          e.target.style.display = 'block';
                        }}
                      />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  {columns.map((col) => (
                    <td key={col} className="py-2 px-4 border-b">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 bg-primary text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === number
                ? 'bg-accent text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1 bg-primary text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultTable;
