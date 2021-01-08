/* global ROSLIB */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect } from 'react';
import throttle from 'lodash/throttle'
import Plotly from 'plotly.js-dist'

import { ROS_WEBBRIDGE_SERVER } from './constants';
import './App.css';

function App() {

  useEffect(() => {

    var ros = new ROSLIB.Ros();

    ros.on('error', () => console.log('Error! 💥'));
    ros.on('connection', () => console.log('Connected! ✅'));
    ros.on('close', () => console.log('Connection closed! ❌'));

    ros.connect(ROS_WEBBRIDGE_SERVER);

    const position = new ROSLIB.Topic({
      ros : ros,
      name : '/ref_pose',
      messageType : 'pr_msgs/PRArrayH'
    });

    position.subscribe(throttle(message => {

      var time = new Date();

      var update = {
        x: [[time], [time], [time], [time]],
        y: [[message.data[0]], [message.data[1]], [message.data[2]], [message.data[3]]]
      }

      var olderTime = time.setSeconds(time.getSeconds() - 7);
      var futureTime = time.setSeconds(time.getSeconds() + 7);

      var secondView = {
        xaxis: {
          type: 'date',
          range: [olderTime,futureTime]
        },
        xaxis2: {
          type: 'date',
          range: [olderTime,futureTime]
        }
      };

      Plotly.relayout('q1_chart', secondView);
      Plotly.extendTraces('q1_chart', update, [0, 1, 2, 3])

    }, 1000));
    

    var trace1 = {
      x: [],
      y: [],
      xaxis: 'x1',
      yaxis: 'y1',
      mode: 'lines',
      name: 'ref q1',
      line: {
        color: '#80CAF6',
      }
    }

    var trace2 = {
      x: [],
      y: [],
      xaxis: 'x1',
      yaxis: 'y1',
      mode: 'lines',
      name: 'q1',
      line: {color: '#DF56F1'}
    };

    var trace3 = {
      x: [],
      y: [],
      xaxis: 'x2',
      yaxis: 'y2',
      mode: 'lines',
      name: 'ref q2',
      line: {color: '#80CAF6'}
    };

    var trace4 = {
      x: [],
      y: [],
      xaxis: 'x2',
      yaxis: 'y2',
      mode: 'lines',
      name: 'q2',
      line: {color: '#DF56F1'}
    };

    var layout = {
      xaxis: {
        title: 'Time (s)'
      },
      yaxis: {
        title: 'Posicón (m)',
        range: [-1, 1],
        autorange: false,
      },
      xaxis2: {
        title: 'Time (s)',
        anchor: 'y2'
      },
      yaxis2: {
        title: 'Posicón (m)',
        range: [-1, 1],
        anchor: 'x2',
        autorange: false
      },
      grid: {
        rows: 2,
         columns: 2, 
         pattern: 'independent'},
    }

    var data = [trace1, trace2, trace3, trace4]

    Plotly.newPlot('q1_chart', data, layout);

  }, []);

  const click = (generate_ref_server) => {

  }

  return (
    <>
      <main className="main">
        <h1>PR Web</h1>
        <button onClick={click}>Click me!</button>
        <div id="q1_chart" />
      </main>
    </>
  );
}

export default App;
