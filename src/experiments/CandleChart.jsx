//import React from 'react'
import React, { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const CandleChart = ({data}) => {

    const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  
  useEffect(() => {
    if (chart) {
      chart.updateSeries([{ data: data }]);
    } else {
      const newChart = new ApexCharts(chartRef.current, {
        series: [{
          data: data
        }],
        chart: {
          type: 'candlestick',
          height: 350
        },
        title: {
          text: 'Candlestick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      });

      newChart.render();
      setChart(newChart);
    }
  }, [data]);

  return (
    <div ref={chartRef}></div>
  )
}

export default CandleChart