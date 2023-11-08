import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa from 'papaparse';

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    series: number[];
    options: {
      labels: string[];
    };
  }>({
    series: [],
    options: {
      labels: [],
    },
  });

  useEffect(() => {
    // Load data from the CSV file
    Papa.parse('./Activity_by_location.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data: any[] = results.data; // Explicitly set data type to any

        // Extract data for the Pie Chart
        const series = data.map((item: any) => item['CO2e_(t)']); // Explicitly set item type to any
        const labels = data.map((item: any) => item['Locations']); // Explicitly set item type to any

        setChartData({
          series,
          options: {
            labels,
          },
        });
      },
    });
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Emissions by locations</h5>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={363}
        />
      </div>
    </div>
  );
};

export default PieChart;
