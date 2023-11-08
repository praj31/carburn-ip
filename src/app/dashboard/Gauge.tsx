import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Gauge = ({ data }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Gauge Chart</h5>
      <ReactApexChart options={data.options} series={data.series} type="radialBar" height={250} />
    </div>
  </div>
);

export default Gauge;
