import React from 'react'

const Upload = () => {
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
        } catch (error) {
          console.error('Error processing query result:', error);
          toast.error('An error occurred while processing your query.');
        }
      };
    const handleUploadComplete = (choice) => {
        setUserChoice(choice);
      };
  return (
    <div>Upload</div>
  )
}

export default Upload