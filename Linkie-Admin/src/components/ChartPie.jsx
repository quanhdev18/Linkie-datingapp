import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const ChartPie = () => {
    const chartRef = useRef(null);

    // Function to get the chart options
    const getChartOptions = () => {
        return {
            series: [50, 25, 15, 25],
            colors: ["#C0C0C0", "#FFFF00", "#0000FF", "silver"],
            chart: {
                height: 320,
                width: "100%",
                type: "donut",
            },
            stroke: {
                colors: ["transparent"],
                lineCap: "",
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontFamily: "Inter, sans-serif",
                                offsetY: 20,
                            },
                            total: {
                                showAlways: true,
                                show: true,
                                label: "Người dùng",
                                fontFamily: "Inter, sans-serif",
                                formatter: function (w) {
                                    const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                    return sum;
                                },
                            },
                            value: {
                                show: true,
                                fontFamily: "Inter, sans-serif",
                                offsetY: -20,
                                formatter: (value) => value + "k",
                            },
                        },
                        size: "80%",
                    },
                },
            },
            labels: ["Silver", "Gold", "Platinum ", "Personal Trainer Cost"],
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif",
            },
        };
    };

    useEffect(() => {
        if (chartRef.current) {
            const chart = new ApexCharts(chartRef.current, getChartOptions());
            chart.render();
            return () => {
                chart.destroy();

            };
        }
    }, []);

    return (
        <div className=" w-full mx-1  bg-white rounded-lg shadow  p-4 ">



            <div className="py-6" ref={chartRef}></div>
        </div>
    );
};

export default ChartPie;
