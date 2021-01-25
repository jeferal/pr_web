import { useEffect, useState } from 'react'

import Plotly from 'plotly.js-dist'

import { data, layout} from './data';

const Chart = ({ refPosition = [], position = [] }) => {

const [time, setTime] = useState({date: new Date()});


useEffect(() => {
  Plotly.newPlot('q1_chart', data, layout);

  setInterval(() => {
    setTime({date: new Date()});
    console.log('update time');
  }, 1000);
}, []);

useEffect(() => {

  const update = {
    x: [[time.date], [time.date], [time.date], [time.date], [time.date], [time.date], [time.date], [time.date]],
    y: [[refPosition[0]], [position[0]], [refPosition[1]], [position[1]], [refPosition[2]], [position[2]], [refPosition[3]], [position[3]]]
  }

  const olderTime = time.date.setSeconds(time.date.getSeconds() - 15);
  const futureTime = time.date.setSeconds(time.date.getSeconds() + 15);

  const secondView = {
    xaxis: {
      type: 'date',
      range: [olderTime, futureTime]
    },
    xaxis2: {
      type: 'date',
      range: [olderTime, futureTime]
    },
    xaxis3: {
      type: 'date',
      range: [olderTime, futureTime]
    },
    xaxis4: {
      type: 'date',
      range: [olderTime, futureTime]
    }
  };

  Plotly.relayout('q1_chart', secondView);
  Plotly.extendTraces('q1_chart', update, [0, 1, 2, 3, 4, 5, 6, 7]);

}, [time])

    return  <div id="q1_chart" />
}

export { Chart };