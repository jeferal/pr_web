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

   /*
    const lineGraph = Plotly.plot('chart', [{
      y: [],
      type:'line'
    }]);

    */
    var cnt = 0;

    position.subscribe(throttle(message => {

      var time = new Date();

      var update = {
        x: [[time]],
        y: [[message.data[0]]]
      }

      var olderTime = time.setSeconds(time.getSeconds() - 30);
      var futureTime = time.setSeconds(time.getSeconds() + 30);

      var secondView = {
        xaxis: {
          type: 'date',
          range: [olderTime,futureTime]
        }
      };

      Plotly.relayout('q1_chart', secondView);
      Plotly.extendTraces('q1_chart', update, [0])

      /*cnt++;
  
      if(cnt > 100) {
        Plotly.relayout('q1_chart', {
          xaxis: {
            range: [cnt-100, cnt]
          }
        })
      }*/

    }, 100));
    
    var data = [{
      x: [], 
      y: [],
      mode: 'lines',
      line: {color: '#80CAF6'}
    }, {
      y: [],
      mode: 'lines',
      line: {color: '#DF56F1'}
    }]

    var layout = {
      title: 'Articulación q1',
      xaxis: {
        title: 'Time (s)'
      },
      yaxis: {
        title: 'Posicón (m)',
        range: [0, 1200.0],
        autorange: false
      }
    };

    Plotly.newPlot('q1_chart', data, layout);

  }, []);

  const click = () => {
    
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
