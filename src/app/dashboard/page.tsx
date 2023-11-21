'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Papa, { ParseResult } from 'papaparse';
import PieChart from './pieChart';
import BarGraph from './BarGraph';
import LineGraph from './LineChart';
import StackedBarGraph from './DonutChart';

const Page = () => {
  const [csvData, setCsvData] = useState<any[]>([]); // Update the type accordingly

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const parsePromises = Array.from(files).map((file) =>
        new Promise((resolve) => {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results: ParseResult<any>) => {
              const data = results.data || [];
              resolve(data);
            },
          });
        })
      );

      Promise.all(parsePromises).then((allData) => {
        const mergedData = allData.flat();
        setCsvData(mergedData);
      });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 p-4">
          <h5>Upload File</h5>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-3" multiple />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 p-4">
          <PieChart data={csvData} />
        </div>
        <div className="col-md-6 p-4">
          <BarGraph data={csvData} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 p-4">
          <LineGraph data={csvData} />
        </div>
        <div className="col-md-6 p-4">
          <StackedBarGraph data={csvData} />
        </div>
        {/* Add more cards here if needed */}
      </div>
    </div>
  );
};

export default Page;