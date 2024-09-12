import React, { useState } from 'react';
import DataUploader from './components/DataUploader';
import QueryForm from './components/QueryForm';
import ChartDisplay from './components/ChartDisplay';
import ChartControls from './components/ChartControls';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [queryResult, setQueryResult] = useState(null);  // Track when query result is available
  const [chartType, setChartType] = useState('scatter');

  const handleUpload = (response) => {
    console.log('File uploaded:', response);
  };

  const handleQueryResult = (result) => {
    console.log('Query result:', result);
    setQueryResult(result);  // Save query result
    setColumns(Object.keys(result[0]));  // Get column names from the result
  };

  const handleChartUpdate = ({ xAxis, yAxis, chartType }) => {
    console.log(`Updating chart with X: ${xAxis}, Y: ${yAxis}, Type: ${chartType}`);

    let xValues = [];
    let yValues = [];

    if (chartType === 'pie') {
        // For pie chart, we need distinct categories and their counts
        const groupBy = queryResult.reduce((acc, item) => {
            const xValue = item[xAxis]; // e.g., "Gender" or "Department"
            if (!acc[xValue]) {
                acc[xValue] = 0;
            }
            acc[xValue] += 1; // Count occurrences of each category
            return acc;
        }, {});

        xValues = Object.keys(groupBy); // e.g., ['Male', 'Female']
        yValues = Object.values(groupBy); // e.g., [120, 146] counts for each category

        if (xValues.length <= 1) {
            console.error("Pie chart needs more than one category to display.");
            alert("Please select a column with multiple categories for a Pie chart.");
            return; // Exit if not enough categories for pie chart
        }

        console.log('Pie Chart X values:', xValues);
        console.log('Pie Chart Y values:', yValues);
    } else {
        // For scatter, bar, line charts
        xValues = queryResult.map(item => item[xAxis]);
        yValues = queryResult.map(item => item[yAxis]);

        console.log('X values:', xValues);
        console.log('Y values:', yValues);
    }

    // Check if xValues and yValues are correctly populated
    if (!xValues.length || (chartType !== 'pie' && !yValues.length)) {
        console.error("No data available for the chart");
        return;
    }

    // Format the chart data
    const formattedData = [{
        labels: chartType === 'pie' ? xValues : undefined,  // For pie chart
        values: chartType === 'pie' ? yValues : undefined,  // For pie chart
        x: chartType !== 'pie' ? xValues : undefined,
        y: chartType !== 'pie' ? yValues : undefined,
        type: chartType,
        mode: chartType === 'scatter' ? 'markers' : undefined,
        marker: { color: 'blue' },
        hoverinfo: chartType === 'pie' ? 'label+percent' : undefined,  // For pie chart
    }];

    console.log("Formatted chart data:", formattedData);

    setChartData(formattedData);
    setChartType(chartType);
};


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white py-4 shadow-md">
        <h1 className="text-center text-4xl font-bold">Data Analysis & Visualization</h1>
      </header>
      <main className="p-8">
        <DataUploader onUpload={handleUpload} />
        <QueryForm onQueryResult={handleQueryResult} />

        {/* Only show chart controls and chart display after query result is available */}
        {queryResult && columns.length > 0 && (
          <>
            <ChartControls columns={columns} onChartUpdate={handleChartUpdate} />
            {chartData.length > 0 ? (
              <ChartDisplay data={chartData} chartType={chartType} />
            ) : (
              <p>Please select chart options to display data</p>
            )}
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;
