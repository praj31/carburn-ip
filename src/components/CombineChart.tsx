'use client'
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import ReactApexChart from "react-apexcharts";
import Papa from "papaparse";
import { ApexOptions } from "apexcharts";

interface GraphProps { }

interface CsvRow {
    Month: string;
    Actual: number;
    Accrued: number;
    Estimated: number;
    'Cost per GJ': number;
}


interface ChartState {
    series: { name: string, type: string, data: number[] } [];
    options: any;
}

const CombineChart: React.FC<GraphProps> = () => {

    const chartOptions: ApexOptions = {
        // Define your chart options here
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
        },
        series: [],
        title: {
        text: 'Energy Cost by Month', // Add your desired heading here
        align: 'center', // You can adjust the alignment as needed
        margin: 10,
        style: {
            fontSize: '20px',
        }
    },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: [],
        },
        yaxis: [
            {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#008FFB',
                },
                labels: {
                    style: {
                        colors: '#008FFB',
                    },
                },
                title: {
                    text: 'Actual',
                    style: {
                        color: '#008FFB',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            {
                opposite: false,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#00e397',
                },
                labels: {
                    style: {
                        colors: '#00e397',
                    },
                },
                title: {
                    text: 'Accrued',
                    style: {
                        color: '#00e397',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            {
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#feb219',
                },
                labels: {
                    style: {
                        colors: '#feb219',
                    },
                },
                title: {
                    text: 'Estimated',
                    style: {
                        color: '#feb219',
                    },
                },
                min: 0,
                max: 60,
            },
            {
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#ff4561',
                },
                labels: {
                    style: {
                        colors: '#ff4561',
                    },
                },
                title: {
                    text: 'Cost per GJ',
                    style: {
                        color: '#ff4561',
                    },
                },
            },
        ],
    };
    const [chartState, setChartState] = useState<ChartState>({
        series: [],
        options: chartOptions,
    });
    useEffect(() => {
        // Fetch your CSV data for the main chart
        fetch('./Energy.csv')
            .then((response) => response.text())
            .then((csv) => {
                const parsedData = Papa.parse<CsvRow>(csv, { header: true });
                const month = parsedData.data.map((item)=>item.Month)
                setChartState((prevState) => ({
                    ...prevState,
                    series: [
                        {
                            name: 'Actual',
                            type: 'column',
                            data: parsedData.data.map((item) => item['Actual']),
                        },
                        {
                            name: 'Accrued',
                            type: 'column',
                            data: parsedData.data.map((item) => item['Accrued']),
                        },
                        {
                            name: 'Estimated',
                            type: 'line',
                            data: parsedData.data.map((item) => item['Estimated']),
                        },
                        {
                            name: 'Cost per GJ',
                            type: 'line',
                            data: parsedData.data.map((item) => item['Cost per GJ']),
                        },
                    ],
                    options: {
                        ...prevState.options,
                        xaxis: {
                            categories: month,
                        },
                    },
                }));
            })
            .catch((error) => {
                console.error('Error fetching or parsing CSV data:', error);
            });
    }, []);
   
    return (
        <div>
            <ReactApexChart
                options={chartState.options}
                series={chartState.series}
                type="line"
                height={350}
                width={"100%"}
            />
        </div>
    );
};

export default CombineChart;