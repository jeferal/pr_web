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
      name : '/joint_position',
      messageType : 'pr_msgs/PRArrayH'
    });

    position.subscribe(throttle(message => {

      var time = new Date();

      var update = {
        x: [[time], [time]],
        y: [[message.data[0]], [message.data[1]]]
      }

      var olderTime = time.setSeconds(time.getSeconds() - 15);
      var futureTime = time.setSeconds(time.getSeconds() + 15);

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
      Plotly.extendTraces('q1_chart', update, [0, 1])

    }, 1000));
    

    var trace1 = {
      x: [],
      y: [],
      xaxis: 'x1',
      yaxis: 'y1',
      mode: 'lines',
      line: {
        color: '#80CAF6',
      }
    }

    var trace2 = {
      x: [],
      y: [],
      xaxis: 'x2',
      yaxis: 'y2',
      mode: 'lines',
      line: {color: '#DF56F1'}
    };

    var layout = {
      xaxis: {
        title: 'Time (s)'
      },
      yaxis: {
        title: 'Posicón (m)',
        range: [0, 1200.0],
        autorange: false,
        domain: [0.6,1]
      },
      xaxis2: {
        title: 'Time (s)',
        anchor: 'y2'
      },
      yaxis2: {
        title: 'Posicón (m)',
        range: [0, 1200.0],
        domain: [0, 0.4],
        anchor: 'x2',
        autorange: false
      }
    }

    var data = [trace1, trace2]

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
