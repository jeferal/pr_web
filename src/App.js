/* global ROSLIB */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect, useState } from 'react';
import { ROS_WEBBRIDGE_SERVER } from './constants';

import './App.css';

function App() {

  const [data, setData] = useState([]);

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

    position.subscribe(message => setData(message.data));
  }, []);

  return (
    <>
      <main className="main">
        <h1>PR Web</h1>
        <button>Click me!</button>
        {data.map((item, index) => <div key={index}>{item}</div>)}
      </main>
    </>
  );
}

export default App;
