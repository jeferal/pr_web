/* global ROSLIB */
import 'roslib/build/roslib';
// import 'eventemitter2/lib/eventemitter2';

import { useEffect } from 'react';
import { ROS_WEBBRIDGE_SERVER } from './constants';

import './App.css';

function App() {

  useEffect(() => {
    var ros = new ROSLIB.Ros();

    ros.on('error', error => console.log('Error! 💥'));
    ros.on('connection', error => console.log('Connected! ✅'));
    ros.on('close', error => console.log('Connection closed! ❌'));

    ros.connect(ROS_WEBBRIDGE_SERVER);
  })

  return (
    <>
      <main className="main">
        <h1>PR Web</h1>
        <button>Click me!</button>
      </main>
    </>
  );
}

export default App;
