'use client'
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Papa from "papaparse";
import { ApexOptions } from "apexcharts";

interface IGraphProps { }

interface ICsvRow {
    Month: string;
    Actual: number;
    Accrued: number;
    Estimated: number;
    'Cost per GJ': number;
}


interface IChartState {
    series: { name: string, type: string, data: number[] }[];
    options: ApexOptions;
}

export const CombineChart: React.FC<IGraphProps> = () => {

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
    const [chartState, setChartState] = useState<IChartState>({
        series: [],
        options: chartOptions,
    });
    useEffect(() => {
        // Fetch your CSV data for the main chart
        fetch('./Energy.csv')
            .then((response) => response.text())
            .then((csv) => {
                const parsedData = Papa.parse<ICsvRow>(csv, { header: true });
                const month = parsedData.data.map((item) => item.Month)
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
                height={350}
                options={chartState.options}
                series={chartState.series}
                type="line"
                width="100%"
            />
        </div>
    );
};

