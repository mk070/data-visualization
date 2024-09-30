import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';

const ChartDisplay = ({ data, chartType, xAxisLabel, yAxisLabel }) => {
  if (!data || data.length === 0) {
    return <p>No chart data available</p>;
  }

  // Define the base color palette (Power BI-like colors)
  const baseColors = [
    '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A',
    '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'
  ];

  // Dynamically extend the color palette if there are more categories
  const extendColorPalette = (categories) => {
    const extendedColors = [];
    const numberOfColorsNeeded = categories.length;

    // Cycle through the base colors if needed
    for (let i = 0; i < numberOfColorsNeeded; i++) {
      extendedColors.push(baseColors[i % baseColors.length]);
    }

    return extendedColors;
  };

  // Debugging: Log chart type and data for troubleshooting
  useEffect(() => {
    console.log('Chart Type:', chartType);
    console.log('Chart Data:', data);
    console.log('X-Axis Label:', xAxisLabel);
    console.log('Y-Axis Label:', yAxisLabel);
  }, [chartType, data, xAxisLabel, yAxisLabel]);

  const preparePieChartData = (data) => {
    // Check if the labels and values exist in the data
    const labels = data.map(item => item[xAxisLabel] || item['Country']);  // Fallback to 'Country' if undefined
    const values = data.map(item => item[yAxisLabel] || item['SupplierCount']);  // Fallback to 'SupplierCount' if undefined

    console.log('Pie Chart Labels:', labels);
    console.log('Pie Chart Values:', values);

    if (!labels || !values || labels.length === 0 || values.length === 0) {
      console.error('Pie chart data is missing labels or values');
      return [];
    }

    return [{
      labels: labels,
      values: values,
      type: 'pie',
      hoverinfo: 'label+percent+value',
      marker: {
        colors: extendColorPalette(labels),
      }
    }];
  };

  // Get the categories (assuming they are based on x values)
  const categories = data.map(item => item[xAxisLabel] || '');  // Fallback to empty if undefined



  // Chart configurations for each chart type
  const getChartConfig = (trace) => {
    switch (chartType) {
      case 'bar':
        return {
          ...trace,
          type: 'bar',
          marker: {
            color: extendColorPalette(trace.x),
            line: { color: '#fff', width: 2 },
          },
          hoverinfo: 'x+y',
        };
      case 'line':
        return {
          ...trace,
          type: 'scatter',
          mode: 'lines',
          line: { color: baseColors[0], width: 2 },
          hoverinfo: 'x+y',
        };
      case 'area':
        return {
          ...trace,
          type: 'scatter',
          mode: 'lines',
          fill: 'tozeroy',
          line: { color: baseColors[0], width: 2 },
          hoverinfo: 'x+y',
        };
      case 'pie':
        return preparePieChartData(data);  // Pie chart-specific function
      case 'donut':
        return {
          ...trace,
          type: 'pie',
          hole: 0.4,
          hoverinfo: 'label+percent+value',
          marker: {
            colors: extendColorPalette(trace.x),
          },
        };
      case 'heatmap':
        return {
          ...trace,
          type: 'heatmap',
          colorscale: 'Blues',
        };
      case 'scatter':
        return {
          ...trace,
          type: 'scatter',
          mode: 'markers',
          marker: {
            color: extendColorPalette(trace.x),
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
            color: baseColors[0],
          },
          hoverinfo: 'x+y',
        };
      case 'box':
        return {
          ...trace,
          type: 'box',
          marker: {
            color: baseColors[0],
          },
          hoverinfo: 'x+y',
        };
      case 'treemap':
        return {
          ...trace,
          type: 'treemap',
          marker: {
            colors: extendColorPalette(trace.x),
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
        {Array.isArray(data) && data.length > 0 ? (
          <Plot
            data={chartType === 'pie' ? preparePieChartData(data) : data.map((trace) => {
              if (typeof trace !== 'object' || Array.isArray(trace)) {
                console.error('Invalid trace data format:', trace);
                return {};
              }
              return getChartConfig(trace);
            })}
            layout={{
              title: {
                text: 'Powerful Data Insights',
                font: { family: 'Arial, sans-serif', size: 24, color: '#333' }
              },
              xaxis: chartType !== 'pie' && chartType !== 'donut' ? {
                title: {
                  text: xAxisLabel || 'X Axis', // Use xAxisLabel prop
                  font: { family: 'Arial, sans-serif', size: 18, color: '#333' }
                },
                automargin: true,
                tickangle: -45,
                showgrid: true,
                zeroline: false,
              } : undefined,
              yaxis: chartType !== 'pie' && chartType !== 'donut' ? {
                title: {
                  text: yAxisLabel || 'Y Axis', // Use yAxisLabel prop
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
              colorway: baseColors, // Apply the base color palette
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
