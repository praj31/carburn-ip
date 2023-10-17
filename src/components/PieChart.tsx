'use client'
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import ReactApexChart from "react-apexcharts";
import Papa from "papaparse";
import { ApexOptions } from "apexcharts";

interface GraphProps { }

interface CsvData {
  Locations: string;
  'CO2e_(t)': string;
}

interface ChartState {
  series: number[]; 
  options: any; 
}

const PieChart: React.FC<GraphProps> = () => {

  const chartOptions: ApexOptions = {
    // Define your chart options here
    chart: {
      type: 'pie',
    },
    series: [],
    title: {
      text: 'Carbon Emission by Location', // Add your desired heading here
      align: 'center', // You can adjust the alignment as needed
      margin: 10,
      style: {
        fontSize: '20px',
      },
    },
    colors: [
      '#E91E63',
      '#9C27B0',
      '#2196F3',
      '#009688',
      '#FF5722',
      '#CDDC39',
      '#FF9800',
      '#795548',
      '#607D8B',
      '#F44336',]
  };
  const [pieState, setPieState] = useState<ChartState>({
    series: [],
    options: chartOptions,
  });

  useEffect(() => {
    fetch('./Activity_by_location.csv')
      .then((response) => response.text())
      .then((csv) => {
        const parsedData = Papa.parse<CsvData>(csv, { header: true });
        const locations = parsedData.data.map((item) => item.Locations);
        const co2eData = parsedData.data.map((item) => parseFloat(item['CO2e_(t)']));
        setPieState((prevState) => ({
          ...prevState,
          series: co2eData,
          options: {
            ...prevState.options,
            labels: locations,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching or parsing CSV data for the pie chart:', error);
      });
  }, []);

  return (
    <div>
      <ReactApexChart
        options={pieState.options}
        series={pieState.series}
        type="pie"
        height={350}
      />
    </div>
  );
};

export default PieChart;