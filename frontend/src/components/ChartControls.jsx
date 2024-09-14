import React, { useState,useEffect } from 'react';

const ChartControls = ({ columns, onChartUpdate, recommendedChartType  }) => {
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('');

  useEffect(() => {
    if (recommendedChartType && recommendedChartType !== 'table') {
      setChartType(recommendedChartType);
    }
  }, [recommendedChartType]);

  useEffect(() => {
    if (columns.length > 0) {
      setXAxis(columns[0]);
      setYAxis(columns[1] || columns[0]);
    }
  }, [columns, chartType]);


  const isNumerical = (column) => {
    const numericalColumns = ['GPA', 'Credits_Completed', 'Age'];
    return numericalColumns.includes(column);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
    setXAxis('');
    setYAxis('');
  };

  const handleSubmit = () => {
    if ((chartType === 'scatter' || chartType === 'bar' || chartType === 'line') && (!xAxis || !yAxis)) {
      alert('Please select both X and Y axes');
    } else if (chartType === 'pie' && !xAxis) {
      alert('Please select a column for the Pie chart');
    } else {
      onChartUpdate({ xAxis, yAxis, chartType });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Select Chart Type and Axes</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Chart Type</label>
        <select value={chartType} onChange={handleChartTypeChange} className="w-full mt-2 p-2 border rounded">
          <option value="">Select Chart Type</option>
          <option value="scatter">Scatter</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      {chartType && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">
              {chartType === 'pie' ? 'Select Column (for Pie chart)' : 'X-Axis'}
            </label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Select {chartType === 'pie' ? 'Column' : 'X-Axis'}</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {(chartType === 'scatter' || chartType === 'bar' || chartType === 'line') && (
            <div className="mb-4">
              <label className="block text-gray-700">Y-Axis (Numerical)</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
              >
                <option value="">Select Y-Axis</option>
                {columns.map((col) => (
                  <option key={col} value={col} disabled={!isNumerical(col)}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-accent transition duration-300"
          >
            Update Chart
          </button>
        </>
      )}
    </div>
  );
};

export default ChartControls;
