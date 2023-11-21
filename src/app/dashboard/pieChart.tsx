import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa, { ParseResult } from 'papaparse';

interface PieChartData {
  [key: string]: string | number;
}

interface PieChartProps {
  data: PieChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
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

  const [selectedValueField, setSelectedValueField] = useState<string>('');
  const [selectedLabelField, setSelectedLabelField] = useState<string>('');

  useEffect(() => {
    setChartData({
      series: [],
      options: {
        labels: [],
      },
    });
  }, [data]);

  const updateChart = () => {
    const valueFieldData = data.map((item) => item[selectedValueField]);
    const labelFieldData = data.map((item) => item[selectedLabelField]);

    setChartData({
      series: valueFieldData,
      options: {
        labels: labelFieldData.map(String),
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
        <h5 className="card-title">Pie Chart</h5>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="selectValueField">Select Value Field:</label>
              <select
                id="selectValueField"
                className="form-control"
                onChange={(e) => setSelectedValueField(e.target.value)}
              >
                <option value="">Select Value Field</option>
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
              <label htmlFor="selectLabelField">Select Label Field:</label>
              <select
                id="selectLabelField"
                className="form-control"
                onChange={(e) => setSelectedLabelField(e.target.value)}
              >
                <option value="">Select Label Field</option>
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
          disabled={!selectedValueField || !selectedLabelField}
        >
          Update Chart
        </button>

        <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={363} />
      </div>
    </div>
  );
};

export default PieChart;