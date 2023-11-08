import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa, { ParseResult } from 'papaparse';

interface LineGraphData {
  Date: string;
  "Scope 1": number;
  "Scope 2": number;
  "Scope 3": number;
}

const LineGraph: React.FC = () => {
  const [chartData, setChartData] = useState<{
    series: {
      name: string;
      data: number[];
    }[];
    options: {
      xaxis: {
        categories: string[];
      };
    };
  }>({
    series: [
      {
        name: 'Scope 1',
        data: [],
      },
      {
        name: 'Scope 2',
        data: [],
      },
      {
        name: 'Scope 3',
        data: [],
      },
    ],
    options: {
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(() => {
    // Load data from the CSV file
    Papa.parse('./Activity by period by scope.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results: ParseResult<LineGraphData>) => {
        const data = results.data || [];

        // Extract data for the Line Graph
        const dates = data.map((item) => item.Date || '');
        const scope1Data = data.map((item) => item['Scope 1'] || 0);
        const scope2Data = data.map((item) => item['Scope 2'] || 0);
        const scope3Data = data.map((item) => item['Scope 3'] || 0);

        setChartData({
          series: [
            { name: 'Scope 1', data: scope1Data },
            { name: 'Scope 2', data: scope2Data },
            { name: 'Scope 3', data: scope3Data },
          ],
          options: {
            xaxis: {
              categories: dates,
            },
          },
        });
      },
    });
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Emissions by Scope</h5>
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
      </div>
    </div>
  );
};

export default LineGraph;
