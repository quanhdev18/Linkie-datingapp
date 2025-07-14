import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { ArrowUpOutlined } from '@ant-design/icons';
const RevenueCard = () => {
    useEffect(() => {
        // Options for the bar chart
        const options = {
            series: [
                {
                    name: 'Doanh số',
                    color: '#31C48D',
                    data: [1420, 1620, 1820, 2500],
                },

            ],
            chart: {
                type: 'bar',
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '100%',
                    borderRadius: 6,
                },
            },
            legend: {
                show: true,
                position: 'bottom',
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (value) => value + '.000 vnđ',
                },
            },
            xaxis: {
                categories: ["Silver", "Gold", "Platinum ", "Personal Trainer Cost"],
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                    },
                    formatter: (value) => value,
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                    },
                },
            },
            grid: {
                strokeDashArray: 4,
                padding: {
                    left: 2,
                    right: 2,
                    top: -20,
                },
            },
        };

        // Initialize the chart
        const chartElement = document.getElementById('bar-chart');
        if (chartElement) {
            const chart = new ApexCharts(chartElement, options);
            chart.render();
        }
    }, []);

    return (
        <div className=" w-full bg-white rounded-lg shadow p-4">
            <div className="flex justify-between border-gray-200 border-b pb-3">
                <dl>
                    <dt className="text-base font-normal text-gray-500 pb-1">Doanh thu</dt>
                    <dd className="leading-none text-3xl font-bold text-gray-900">5.426.000 VNĐ</dd>
                </dl>
                <div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
                        <ArrowUpOutlined className="w-2.5 h-2.5 me-1.5" />
                        23.5%
                    </span>
                </div>
            </div>
            <div id="bar-chart"></div>
        </div>
    );
};

export default RevenueCard;
