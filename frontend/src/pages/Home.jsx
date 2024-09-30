import React, { useState, useEffect } from 'react';
import DataUploader from '../components/DataUploader';
import ResultTable from '../components/ResultTable';
import ChartControls from '../components/ChartControls';
import ChartDisplay from '../components/ChartDisplay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { recommendChartType } from '../utils/recommendChartType';
import '../App.css'; // Import your custom CSS for modern styling
import Typewriter from 'typewriter-effect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faChartBar, faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner'; // New Loading Spinner Component

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [chartType, setChartType] = useState('');
  const [userChoice, setUserChoice] = useState(''); // 'filter' or 'analyze'
  const [recommendedChartType, setRecommendedChartType] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false); // Add Loading State
  const [xAxisLabel, setXAxisLabel] = useState(''); // X-Axis label
  const [yAxisLabel, setYAxisLabel] = useState(''); // Y-Axis label

  const handleQuerySubmit = async () => {
    if (!query) {
      toast.error('Please enter a query.');
      return;
    }

    setLoading(true); // Set loading to true when query starts
    try {
      const apiEndpoint = userChoice === 'filter' ? '/filter-query' : '/analysis-query';
      const response = await axios.post(`http://localhost:5000${apiEndpoint}`, { query });
      toast.success('Query executed successfully!');
      handleQueryResult(response.data, query);
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Error executing query. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after query completes
    }
  };

  const handleQueryResult = (result, userQuestion) => {
    try {
        console.log('Query result:', result);

        // Handle filter and analysis results differently based on their structure
        let queryData = [];
        let columnsData = [];

        if (result.result && result.result.length > 0) {
            // Handle 'analysis-query' format where result is nested inside 'result'
            queryData = result.result;
            columnsData = result.columns;
        } else if (Array.isArray(result) && result.length > 0) {
            // Handle 'filter-query' format where the result is directly returned as an array
            queryData = result;
            columnsData = Object.keys(result[0]);
        } else {
            // If neither has valid data, return an error
            toast.error('No data returned from the query.');
            return;
        }

        // Set the query result and columns from the response
        setQueryResult(queryData);
        setColumns(columnsData);
        // Dynamically set X-Axis and Y-Axis labels based on query result columns
        if (columnsData.length >= 2) {
          setXAxisLabel(columnsData[0]);
          setYAxisLabel(columnsData[1]);
        }

        // If the user has selected "analyze", set the chart type
        if (userChoice === 'analyze') {
            const recommendedChart = result.recommendedChart || recommendChartType(userQuestion);
            setRecommendedChartType(recommendedChart);
            setChartType(recommendedChart);
        }
    } catch (error) {
        toast.error('An error occurred while processing the query.');
        console.error('Error processing query result:', error);
    }
};


  useEffect(() => {
    if (queryResult && columns.length >= 2 && chartType) {
      const defaultXAxis = columns[0];
      const defaultYAxis = columns[1];
      handleChartUpdate({ xAxis: defaultXAxis, yAxis: defaultYAxis, chartType });
    }
  }, [queryResult, columns, chartType]);

  const handleChartUpdate = ({ xAxis, yAxis, chartType }) => {
    console.log("handleChartUpdate")
    const data = queryResult;

    if (!data || data.length === 0) {
        toast.error('No data available to generate the chart.');
        return;
    }

    let xValues = [];
    let yValues = [];

    // Logic for different chart types
    switch (chartType) {
        case 'bar':
            xValues = data.map((item) => item[xAxis]);
            yValues = data.map((item) => item[yAxis]);
            break;

        case 'pie':
            // For pie chart, we use xAxis as labels and yAxis as values
            xValues = data.map((item) => item[xAxis]); // Labels (e.g., Gender)
            yValues = data.map((item) => item[yAxis]); // Values (e.g., Average_GPA)
            break;

        case 'scatter':
            // For scatter plot, both x and y axis need numerical data
            xValues = data.map((item) => item[xAxis]);
            yValues = data.map((item) => item[yAxis]);
            break;

        case 'line':
            // Line chart, typically time on x-axis, numerical data on y-axis
            xValues = data.map((item) => item[xAxis]);
            yValues = data.map((item) => item[yAxis]);
            break;
        case 'histogram':
            // Line chart, typically time on x-axis, numerical data on y-axis
            xValues = data.map((item) => item[xAxis]);
            yValues = data.map((item) => item[yAxis]);
            break;

        default:
            toast.error('Unsupported chart type.');
            return;
    }

    if (!xValues.length || (chartType !== 'pie' && !yValues.length)) {
        toast.error('No data available for the chart.');
        return;
    }

    // Construct the formatted data for Plotly charts
    const formattedData = [
        {
            labels: chartType === 'pie' ? xValues : undefined,
            values: chartType === 'pie' ? yValues : undefined,
            x: chartType !== 'pie' ? xValues : undefined,
            y: chartType !== 'pie' ? yValues : undefined,
            type: chartType,
            mode: chartType === 'scatter' ? 'markers' : undefined,
            marker: { color: 'blue' }, // Customize colors if needed
            hoverinfo: chartType === 'pie' ? 'label+percent' : 'x+y',
        },
    ];

    setChartData(formattedData);
};

  return (
    <div className="main">
      <header className="relative pt-20 z-10">
        <h1 className="text-center text-6xl font-extrabold text-primary py-4 px-16 capitalize">
          <span className="text-green-600">Unleash the Power of Data</span>
          <span className="block mt-2 text-gray-700">
            <Typewriter
              options={{
                strings: [
                  'with Real-time Insights',
                  'through Advanced Analytics',
                  'for Better Decision Making',
                ],
                autoStart: true,
                loop: true,
                delay: 80,
              }}
            />
          </span>
        </h1>
        <p className="text-center text-lg text-gray-600 mt-4">
          Empower your data analysis with our state-of-the-art AI platform.
        </p>
        <p className="text-center text-base text-gray-500 max-w-3xl mx-auto mt-2">
          Our AI-powered platform allows you to seamlessly upload data, ask natural language questions, and visualize trends, distributions, and more with ease.
        </p>
      </header>

      <main className="p-8 flex justify-center relative z-10">
        <div className="w-full max-w-6xl  rounded-lg p-8 z-10 relative">
          {/* Tabs for Filter and Analysis */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-4">
                {/* filter-button */}
                <button
                  onClick={() => setUserChoice('filter')}
                  className={`px-6 py-2 font-semibold text-sm rounded-full transition-all duration-300 ${
                    userChoice === 'filter' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Filter
                </button>

                {/* Visualization */}
                <button
                  onClick={() => setUserChoice('analyze')}
                  className={`px-6 py-2 font-semibold text-sm rounded-full transition-all duration-300 ${
                    userChoice === 'analyze' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Analysis
                </button>
              </div>
            </div>

            <div className="w-full mt-6 relative flex">
              <input
                type="text"
                placeholder={`Type your ${userChoice} query...`}
                className="w-full px-6 py-3 text-gray-700 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
              <button
                onClick={handleQuerySubmit}
                className="absolute right-0 bg-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-700 transition duration-300"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                )}
                Generate
              </button>
            </div>
          </div>

          {/* Display Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-8">
              <LoadingSpinner message={`Processing your ${userChoice} request...`} />
            </div>
          )}

          {/* Content based on Tab Selection */}
          {userChoice === 'filter' && !loading && (
            <div className="flex flex-col space-y-4 mt-8">
              {queryResult && columns.length > 0 ? (
                <ResultTable data={queryResult} columns={columns} />
              ) : (
                <p className="text-gray-500">No results to display. Try querying the data.</p>
              )}
            </div>
          )}

          {userChoice === 'analyze' && !loading && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-primary">Data Visualization</h2>
              {queryResult && columns.length > 0 &&  (
                <>
                  {chartData.length > 0 ? (
                    <div className="flex flex-col">
                      
                      <ChartDisplay data={chartData} chartType={chartType} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} // Passing Y-Axis Label
 />
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
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Home;
