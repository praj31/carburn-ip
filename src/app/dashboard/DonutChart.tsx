import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface BarGraphData {
  [key: string]: string | number;
}

interface StackedBarGraphProps {
  data: BarGraphData[];
}

const StackedBarGraph: React.FC<StackedBarGraphProps> = ({ data }) => {
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
          barHeight: '100%';
          distributed: true;
          horizontal: true;
          dataLabels: {
            position: 'bottom';
          };
        };
      };
    };
  }>({
    series: [],
    options: {
      xaxis: {
        categories: [],
        title: {
          text: '',
        },
      },
      yaxis: {
        title: {
          text: '',
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

  const [selectedXField, setSelectedXField] = useState<string>('');
  const [selectedYField, setSelectedYField] = useState<string>('');

  useEffect(() => {
    setChartData({
      series: [],
      options: {
        xaxis: {
          categories: [],
          title: {
            text: '',
          },
        },
        yaxis: {
          title: {
            text: '',
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
  }, [data]);

  const updateChart = () => {
    const xFieldData = data.map((item) => item[selectedXField]);
    const yFieldData = data.map((item) => item[selectedYField]);

    setChartData({
      series: [{ name: selectedYField, data: yFieldData }],
      options: {
        xaxis: {
          categories: xFieldData,
          title: {
            text: selectedXField,
          },
        },
        yaxis: {
          title: {
            text: selectedYField,
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
  };

  const getAllFields = () => {
    const allFields: string[] = [];
    data.forEach((item) => {
      Object.keys(item).forEach((field) => {
        if (!allFields.includes(field)) {
          allFields.push(field);
        }
      });
    });
    return allFields;
  };

  const availableFields = getAllFields();

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Stacked Bar Graph</h5>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="selectXAxis">Select X-Axis Field:</label>
              <select
                id="selectXAxis"
                className="form-control"
                onChange={(e) => setSelectedXField(e.target.value)}
              >
                <option value="">Select X-Axis Field</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="selectYAxis">Select Y-Axis Field:</label>
              <select
                id="selectYAxis"
                className="form-control"
                onChange={(e) => setSelectedYField(e.target.value)}
              >
                <option value="">Select Y-Axis Field</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={updateChart}
          disabled={!selectedXField || !selectedYField}
        >
          Update Chart
        </button>

        <div className="mt-4">
          <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default StackedBarGraph;