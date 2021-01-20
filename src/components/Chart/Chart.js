import { useEffect } from 'react'

import Plotly from 'plotly.js-dist'

import { data, layout} from './data';

const Chart = ({ refPosition = [], position = [] }) => {

useEffect(() => {
  Plotly.newPlot('q1_chart', data, layout);
}, []);

useEffect(() => {
  const time = new Date();

  console.log(position);

  const update = {
    x: [[time], [time], [time], [time]],
    y: [[refPosition[0]], [position[0]], [refPosition[1]], [position[1]]]
  }

  const olderTime = time.setSeconds(time.getSeconds() - 7);
  const futureTime = time.setSeconds(time.getSeconds() + 7);

  const secondView = {
    xaxis: {
      type: 'date',
      range: [olderTime, futureTime]
    },
    xaxis2: {
      type: 'date',
      range: [olderTime, futureTime]
    }
  };

  Plotly.relayout('q1_chart', secondView);
  Plotly.extendTraces('q1_chart', update, [0, 1, 2, 3]);

  //return ()=>clearInterval(interval);

}, [position, refPosition])

    return  <div id="q1_chart" />
}

export { Chart };