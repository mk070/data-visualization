import React from 'react';
import Plot from 'react-plotly.js';

const ChartDisplay = ({ data, chartType }) => {
  if (!data || data.length === 0) {
    return <p>No chart data available</p>;
  }

  // Define color palette dynamically for categories
  const colors = [
    '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A',
    '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'
  ];

  const colorScale = [
    [0, '#636EFA'],
    [0.2, '#19D3F3'],
    [0.4, '#00CC96'],
    [0.6, '#FFA15A'],
    [0.8, '#EF553B'],
    [1, '#AB63FA']
  ];

  // Chart configurations for each chart type
  const getChartConfig = (trace) => {
    switch (chartType) {
      case 'bar':
        return {
          ...trace,
          type: 'bar',
          marker: {
            color: colors,
            line: { color: '#fff', width: 2 },
          },
          hoverinfo: 'x+y',
        };
      case 'line':
        return {
          ...trace,
          type: 'scatter',
          mode: 'lines',
          line: { color: colors[0], width: 2 },
          hoverinfo: 'x+y',
        };
      case 'area':
        return {
          ...trace,
          type: 'scatter',
          mode: 'lines',
          fill: 'tozeroy',
          line: { color: colors[0], width: 2 },
          hoverinfo: 'x+y',
        };
      case 'pie':
        return {
          ...trace,
          type: 'pie',
          hoverinfo: 'label+percent+value',
          marker: {
            colors: colors,
          },
        };
      case 'donut':
        return {
          ...trace,
          type: 'pie',
          hole: 0.4,
          hoverinfo: 'label+percent+value',
          marker: {
            colors: colors,
          },
        };
      case 'heatmap':
        return {
          ...trace,
          type: 'heatmap',
          colorscale: colorScale,
        };
      case 'scatter':
        return {
          ...trace,
          type: 'scatter',
          mode: 'markers',
          marker: {
            color: colors,
            size: 10,
            opacity: 0.8,
          },
          hoverinfo: 'x+y',
        };
      case 'histogram':
        return {
          ...trace,
          type: 'histogram',
          marker: {
            color: colors[0],
          },
          hoverinfo: 'x+y',
        };
      case 'box':
        return {
          ...trace,
          type: 'box',
          marker: {
            color: colors[0],
          },
          hoverinfo: 'x+y',
        };
      case 'treemap':
        return {
          ...trace,
          type: 'treemap',
          marker: {
            colors: colors,
          },
        };
      default:
        return trace;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-6">
      <h2 className="text-3xl font-bold text-primary mb-4">Data Visualization</h2>
      <div className="w-full h-full">
        {data.length > 0 ? (
          <Plot
            data={data.map((trace, index) => getChartConfig(trace))}
            layout={{
              title: {
                text: 'Powerful Data Insights',
                font: { family: 'Arial, sans-serif', size: 24, color: '#333' }
              },
              xaxis: chartType !== 'pie' && chartType !== 'donut' ? {
                title: {
                  text: '',
                  font: { family: 'Arial, sans-serif', size: 18, color: '#333' }
                },
                automargin: true,
                tickangle: -45,
                showgrid: true,
                zeroline: false,
              } : undefined,
              yaxis: chartType !== 'pie' && chartType !== 'donut' ? {
                title: {
                  text: 'Y Axis Label',
                  font: { family: 'Arial, sans-serif', size: 18, color: '#333' }
                },
                automargin: true,
                showgrid: true,
                zeroline: false,
              } : undefined,
              plot_bgcolor: '#f9fafb',  // Light background for the plot
              paper_bgcolor: '#f0f4f8',  // Light background for the whole chart
              font: {
                family: 'Arial, sans-serif',
                size: 14,
                color: '#333'
              },
              showlegend: chartType === 'pie' || chartType === 'donut',
              hovermode: 'closest',
              margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 },
              height: 600,
              width: 1000,
              colorway: colors, // Apply the color palette
            }}
            config={{
              displayModeBar: true,  // Enable mode bar like Power BI
              responsive: true,  // Enable responsiveness
              displaylogo: false,  // Hide Plotly logo for a cleaner look
              toImageButtonOptions: {
                format: 'png',  // Download as PNG
                filename: 'custom_chart',
                height: 600,
                width: 1000,
                scale: 1  // 1x scale to maintain quality
              }
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p className="text-gray-500">No chart data available</p>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;
