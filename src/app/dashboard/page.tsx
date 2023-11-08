'use client'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PieChart from './pieChart';
import BarGraph from './BarGraph';
import LineGraph from './LineChart';
import StackedBarGraph from './DonutChart';


const Page = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 p-4">
          <PieChart />
        </div>
        <div className="col-md-6 p-4">
          <BarGraph />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 p-4">
          <LineGraph />
        </div>
        <div className="col-md-6 p-4">
          <StackedBarGraph />
        </div>
        {/* Add more cards here if needed */}
      </div>
    </div>
  );
};

export default Page;
