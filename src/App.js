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

    const lineGraph = Plotly.plot('chart', [{
      y: [],
      type:'line'
    }]);

    position.subscribe(throttle(message => {
      // Update plotly graph here!
      // Plotly.addTraces(lineGraph, {y: message.data });
    }, 1000));

  }, []);

  const click = () => {
    
  }

  return (
    <>
      <main className="main">
        <h1>PR Web</h1>
        <button onClick={click}>Click me!</button>
        <div id="chart" />
      </main>
    </>
  );
}

export default App;
