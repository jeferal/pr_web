/* global ROSLIB */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect } from 'react';
import { useState } from 'react';

import throttle from 'lodash/throttle'
import Plotly from 'plotly.js-dist'

import { ROS_WEBBRIDGE_SERVER } from './constants';
import { PR_DB_SERVER } from './constants';
import { data, layout} from './data';

import './App.css';

let PerformTrajectory;

function App() {

  //Variable de estado
  const [references, setReferences] = useState([]);
  const [currentReference, setCurrentReference] = useState(null);

  useEffect(() => {

    //ROS Connection
    var ros = new ROSLIB.Ros();

    ros.on('error', () => console.log('Error! ?'));
    ros.on('connection', () => console.log('Connected! ?'));
    ros.on('close', () => console.log('Connection closed! ?'));

    ros.connect(ROS_WEBBRIDGE_SERVER);

    const joint_position_sub = new ROSLIB.Topic({
      ros: ros,
      name: '/joint_position',
      messageType: 'pr_msgs/PRArrayH'
    });

    const ref_pose_sub = new ROSLIB.Topic({
      ros: ros,
      name: '/ref_pose',
      messageType: 'pr_msgs/PRArrayH'
    });

    PerformTrajectory = new ROSLIB.Service({
      ros: ros,
      name: '/perform_trajectory',
      serviceType: 'pr_msgs/srv/Trajectory'
    });

    var joint_position = [];
    var ref_pose = [];

    joint_position_sub.subscribe(throttle(message => {
      joint_position = message.data;
    }, 100));

    ref_pose_sub.subscribe(throttle(message => {
      ref_pose = message.data;
    }, 100));

    setInterval(function () {

      var time = new Date();

      var update = {
        x: [[time], [time], [time], [time]],
        y: [[ref_pose[0]], [joint_position[0]], [ref_pose[1]], [joint_position[0]]]
      }

      var olderTime = time.setSeconds(time.getSeconds() - 7);
      var futureTime = time.setSeconds(time.getSeconds() + 7);

      var secondView = {
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

    }, 1000);

    Plotly.newPlot('q1_chart', data, layout);

    fetch(PR_DB_SERVER)
      .then(response => response.json())
      .then(data => {
        setReferences(data);
      })

  }, []);

  useEffect(() => {
    if (!references.length) {
      return;
    }

    setCurrentReference(references[0].file_name);
  }, [references])

  const updateReference = (event) => {
    setCurrentReference(event.target.value);
  };

  const start = () => {
    const request = new ROSLIB.ServiceRequest({
      path_trajectory: `/home/paralelo4dofnew/ros2_eloquent_ws/parallel_robot/references/${currentReference}.txt`,
      is_cart: false
    });

    PerformTrajectory.callService(request, function(result) {
      console.log(result.error_code);
      console.log(result.n_ref_loaded);
    });
  }

  return (
    <main className="main">
      <h1>PR Web</h1>
      <div id="q1_chart" />
      {references.length === 0 && <div>Loading references ...</div>} 
      <select onChange={updateReference}>
        {references.length > 0 && references.map(({ file_name }) => (
          <option value={file_name}>{file_name}</option>
        ))}
      </select>
      <button onClick={start}>Start</button>
    </main>
  );
}

export default App;