import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa, { ParseResult } from 'papaparse';

interface LineGraphData {
  [key: string]: string | number;
}

interface LineGraphProps {
  data: LineGraphData[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
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
    series: [],
    options: {
      xaxis: {
        categories: [],
      },
    },
  });

  const [selectedField, setSelectedField] = useState<string>('');
  const [xAxisField, setXAxisField] = useState<string>(''); // Declare xAxisField state

  useEffect(() => {
    setChartData({
      series: [],
      options: {
        xaxis: {
          categories: [],
        },
      },
    });
  }, [data]);

  const updateChart = () => {
    const fieldData = data.map((item) => item[selectedField]);

    setChartData({
      series: [{ name: selectedField, data: fieldData }],
      options: {
        xaxis: {
          categories: data.map((item) => item[xAxisField]), // Use xAxisField here
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
        <h5 className="card-title">Line Chart</h5>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="selectField">Select Field:</label>
              <select
                id="selectField"
                className="form-control"
                onChange={(e) => setSelectedField(e.target.value)}
              >
                <option value="">Select Field</option>
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
              <label htmlFor="selectXAxis">Select X-Axis Field:</label>
              <select
                id="selectXAxis"
                className="form-control"
                onChange={(e) => setXAxisField(e.target.value)}
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
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={updateChart}
          disabled={!selectedField || !xAxisField}
        >
          Update Chart
        </button>

        <div className="mt-4">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
      </div>
    </div>
  );
};

export default LineGraph;