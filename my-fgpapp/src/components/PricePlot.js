import React, { useState, useEffect, useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import '../css/PricePage.css'

function PricePlot(prop) {
    const [priceDetail, setPriceDetail] = useState(null);
    useEffect(() => {
      const coin = prop.coin;
      if (!coin) { setPriceDetail(null); return; }
      fetch('/api/historical-prices/' + coin).then(resp => resp.json()).then(data => {
        if (prop.coin !== coin) return;
        const plotData = {
          datasets: [{
            label: coin,
            data: data.map(item => ({ x: new Date(item.date), y: item.price })),
            tension: 0,
            showLine: true,
          }],
        };
        setPriceDetail(plotData);
        console.log(plotData);
      });
    }, [prop.coin]);
    const options = useMemo(() => ({
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'yyyy-MM-dd'
            },
            tooltipFormat: 'yyyy-MM-dd',
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    }), []);
    return priceDetail == null ? null : <div className="chart">
      <Scatter data={priceDetail} options={options} />
    </div>;
  }

  export default PricePlot;