import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa, { ParseResult } from 'papaparse';

interface BarGraphData {
  Groups: string;
  "CO2e  (t)": number;
}

const StackedBarGraph: React.FC = () => {
  const [chartData, setChartData] = useState<{
    series: {
      name: string;
      data: number[];
    }[];
    options: {
      xaxis: {
        categories: string[];
        title: {
          text: string;
        };
      };
      yaxis: {
        title: {
          text: string;
        };
      };
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          };
        };
      };
    };
  }>({
    series: [
      {
        name: 'CO2e  (t)',
        data: [],
      },
    ],
    options: {
      xaxis: {
        categories: [],
        title: {
          text: 'Data type', // Label for the x-axis
        },
      },
      yaxis: {
        title: {
          text: 'CO2 emission', // Label for the y-axis
        },
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
    },
  });

  useEffect(() => {
    // Load data from the CSV file
    Papa.parse('./Activity by group.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results: ParseResult<BarGraphData>) => {
        const data = results.data || [];

        // Extract data for the Bar Graph
        const co2Emissions = data.map((item) => item["CO2e  (t)"] || 0);
        const dataTypes = data.map((item) => item.Groups || '');

        setChartData({
          series: [
            { name: 'CO2e  (t)', data: co2Emissions },
          ],
          options: {
            xaxis: {
              categories: dataTypes,
              title: {
                text: 'Data type', // Label for the x-axis
              },
            },
            yaxis: {
              title: {
                text: 'CO2 emission', // Label for the y-axis
              },
            },
            plotOptions: {
              bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                  position: 'bottom',
                },
              },
            },
          },
        });
      },
    });
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Emissions by Data type</h5>
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default StackedBarGraph;
