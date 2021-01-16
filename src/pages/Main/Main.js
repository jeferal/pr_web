/* global ROSLIB */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect, useState } from 'react';

import throttle from 'lodash/throttle'
import Plotly from 'plotly.js-dist'

import { Chart } from '../../components/Chart';
import { PR_DB_SERVER, ROS_WEBBRIDGE_SERVER } from '../../constants';
import { data, layout} from '../../data';

let PerformTrajectory;

const Main = () => {

  //Variable de estado
  const [references, setReferences] = useState([]);
  const [currentReference, setCurrentReference] = useState(null);
  const [refPosition, setRefPosition] = useState([]);
  const [position, setPosition] = useState([]);

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

    joint_position_sub.subscribe(throttle(message => {
      setPosition(message.data);
    }, 100));

    ref_pose_sub.subscribe(throttle(message => {
        setRefPosition(message.data);
    }, 100));

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
      <Chart refPosition={refPosition} position={position} />
      {references.length === 0 && <div>Loading references ...</div>} 
      <select onChange={updateReference}>
        {references.length > 0 && references.map(({ file_name }, index) => (
          <option key={index} value={file_name}>{file_name}</option>
        ))}
      </select>
      <button onClick={start}>Start</button>
    </main>
  );
}

export { Main };