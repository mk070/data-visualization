import React from 'react';
import Plot from 'react-plotly.js';



const ChartDisplay = ({ data, chartType }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Chart Visualization</h2>
      <div className="w-full h-full">
     
        {data.length > 0 ? (
          <Plot
            data={data}
            layout={{
              title: 'Chart Visualization',
              xaxis: chartType !== 'pie' ? {
                title: 'X Axis',
                automargin: true,
                tickangle: -45,
              } : undefined,
              yaxis: chartType !== 'pie' ? {
                title: 'Y Axis',
                automargin: true,
              } : undefined,
              plot_bgcolor: '#f0f4f8',
              paper_bgcolor: '#f0f4f8',
              font: { color: '#333', size: 14 },
              showlegend: chartType === 'pie',  // Show legend only for pie charts
              height: 600,
              width: 800,
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p>No chart data available</p>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;
