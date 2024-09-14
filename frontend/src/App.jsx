import React, { useState, useEffect } from 'react';
import DataUploader from './components/DataUploader';
import QueryForm from './components/QueryForm';
import ResultTable from './components/ResultTable';
import ChartControls from './components/ChartControls';
import ChartDisplay from './components/ChartDisplay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { recommendChartType } from './utils/recommendChartType';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [chartType, setChartType] = useState('');
  const [userChoice, setUserChoice] = useState(''); // 'analyze' or 'table'
  const [recommendedChartType, setRecommendedChartType] = useState('');

  const handleUploadComplete = (choice) => {
    setUserChoice(choice);
  };

  const handleQueryResult = (result, userQuestion) => {
    try {
      console.log('Query result:', result);
      console.log('User question:', userQuestion);

      if (!result || result.length === 0) {
        console.error('Query result is empty or undefined.');
        toast.error('No data returned from the query.');
        return;
      }

      const datasetColumns = Object.keys(result[0]);
      console.log('Dataset Columns:', datasetColumns);

      if (datasetColumns.some((col) => col === undefined || col === null)) {
        console.error('Columns array contains undefined or null values:', datasetColumns);
        toast.error('An error occurred while processing column names.');
        return;
      }

      setQueryResult(result);
      setColumns(datasetColumns);

      // Use the utility function to recommend a chart type
      const recommendedChart = recommendChartType(userQuestion);
      setRecommendedChartType(recommendedChart);
      setChartType(recommendedChart);

      if (recommendedChart === 'table') {
        setUserChoice('table');
      } else {
        setUserChoice('analyze');
      }

      // No need to call handleChartUpdate here

    } catch (error) {
      console.error('Error processing query result:', error);
      toast.error('An error occurred while processing your query.');
    }
  };

  useEffect(() => {
    if (queryResult && columns.length >= 2 && chartType) {
      const defaultXAxis = columns[0];
      const defaultYAxis = columns[1];

      handleChartUpdate({
        xAxis: defaultXAxis,
        yAxis: defaultYAxis,
        chartType: chartType,
      });
    }
  }, [queryResult, columns, chartType]);

  const handleChartUpdate = ({ xAxis, yAxis, chartType }) => {
    try {
      const data = queryResult;

      if (!data) {
        console.error('No data available for the chart');
        toast.error('No data available to generate the chart.');
        return;
      }

      console.log('Data passed to handleChartUpdate:', data);
      console.log(`Updating chart with X: ${xAxis}, Y: ${yAxis}, Type: ${chartType}`);

      let xValues = [];
      let yValues = [];

      if (chartType === 'pie') {
        // Pie chart logic...
      } else {
        xValues = data.map((item) => item[xAxis]);
        yValues = data.map((item) => item[yAxis]);
      }

      if (!xValues.length || (chartType !== 'pie' && !yValues.length)) {
        console.error('No data available for the chart');
        toast.error('No data available to generate the chart.');
        return;
      }

      const formattedData = [
        {
          labels: chartType === 'pie' ? xValues : undefined,
          values: chartType === 'pie' ? yValues : undefined,
          x: chartType !== 'pie' ? xValues : undefined,
          y: chartType !== 'pie' ? yValues : undefined,
          type: chartType,
          mode: chartType === 'scatter' ? 'markers' : undefined,
          marker: { color: 'blue' },
          hoverinfo: chartType === 'pie' ? 'label+percent' : 'x+y',
        },
      ];

      setChartData(formattedData);
    } catch (error) {
      console.error('Error updating chart:', error);
      toast.error('An error occurred while updating the chart.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="pt-20">
        <h1 className="text-center text-4xl font-extrabold text-primary py-4 capitalize">
          AI Data Analytics
        </h1>
      </header>
      <main className="p-8 flex justify-center">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
          <DataUploader onUploadComplete={handleUploadComplete} />

          {userChoice && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Ask a Question</h2>
                <QueryForm onQueryResult={handleQueryResult} />
              </div>

              {queryResult && columns.length > 0 && (
  <>
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setUserChoice('table')}
        className={`mr-2 px-4 py-2 ${userChoice === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Table View
      </button>
      <button
        onClick={() => setUserChoice('analyze')}
        className={`px-4 py-2 ${userChoice === 'analyze' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Visualize Data
      </button>
    </div>

    {userChoice === 'table' && (
      <ResultTable data={queryResult} columns={columns} />
    )}
    {userChoice === 'analyze' && (
      <>
        
        {chartData.length > 0 ? (
          <div className='flex flex-col'>
            <ChartDisplay data={chartData} chartType={chartType} />
            <ChartControls
              columns={columns}
              onChartUpdate={handleChartUpdate}
              recommendedChartType={recommendedChartType}
            />
           </div>
        ) : (
          <p>Please select chart options to display data</p>
        )}
        
      </>
    )}
  </>
)}
            </>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;
