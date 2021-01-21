/* global ROSLIB */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect, useState } from 'react';

import throttle from 'lodash/throttle'
//import Plotly from 'plotly.js-dist'

import { Chart } from '../../components/Chart';
import { PR_DB_SERVER, ROS_WEBBRIDGE_SERVER } from '../../constants';
<<<<<<< HEAD
import { data, layout} from '../../data';
import { differenceBy } from 'lodash';
=======
//import { data, layout} from '../../components/Chart/data';
>>>>>>> 1c30292cd5b77c2d8b9f165ebe07cc850dbe9a6c

let PerformTrajectory;

const Main = () => {
  
  const [trajectories, setTrajectories] = useState([]);
  const [currentTrajectory, setCurrentTrajectory] = useState(null);
  const [refPosition, setRefPosition] = useState([]);
  const [position, setPosition] = useState([]);

  useEffect(() => {
    //ROS Connection
    const ros = new ROSLIB.Ros();

    ros.on('error', () => console.log('Error!'));
    ros.on('connection', () => console.log('Connected!'));
    ros.on('close', () => console.log('Connection closed!'));

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

    /*
    joint_position_sub.subscribe(throttle(message => {
      setPosition(message.data);
      console.log(message.data);
    }, 100));
    */
   setInterval(() => {
      const msg_pose = [1,2,3,4];
      setPosition(msg_pose);
      console.log(msg_pose)
   }, 1000);

   /*
    ref_pose_sub.subscribe(throttle(message => {
      setRefPosition(message.data);
    }, 100));
    */

    //Plotly.newPlot('q1_chart', data, layout);

    fetch(PR_DB_SERVER)
      .then(response => response.json())
      .then(data => {
        setTrajectories(data);
      })

  }, []);

  useEffect(() => {
    if (!trajectories.length) {
      return;
    }

    setCurrentTrajectory(trajectories[0].file_name);
  }, [trajectories])

<<<<<<< HEAD
  const updateReference = (event) => {
    setCurrentReference(event.target.value);
    console.log(event.target.value)
  };

  const start = () => {
    console.log(currentReference);
=======
  const updateTrajectory = (event) => {
    setCurrentTrajectory(+event.target.value);
  };

  const start = () => {
    
    const {file_name, is_cart} = trajectories.find(t => t.id === currentTrajectory);

    console.log(is_cart);

>>>>>>> 1c30292cd5b77c2d8b9f165ebe07cc850dbe9a6c
    const request = new ROSLIB.ServiceRequest({
      path_trajectory: `/home/paralelo4dofnew/ros2_eloquent_ws/parallel_robot/references/${file_name}.txt`,
      is_cart
    });

    PerformTrajectory.callService(request, function(result) {
      console.log(result.error_code);
      console.log(result.n_ref_loaded);
    });
  }

  return (
    <main className="main">
      <h1>PR Web</h1>
<<<<<<< HEAD
      <Chart refPosition={refPosition} position={position} />
      {references.length === 0 && <div>Loading references ...</div>} 
      <select onChange={updateReference}>
      {references.length > 0 && references.map(({ file_name }, index) => (
          <option key={index} value={file_name}>{file_name}</option>
        ))}
      </select>
      <button onClick={start}>Start</button>
      <div>{currentReference}</div>
=======
      <Chart refPosition={refPosition} position={position}/>
      {trajectories.length === 0 && <div>Loading references ...</div>} 
      <select onChange={updateTrajectory}>
        {trajectories.length > 0 && trajectories.map(({ file_name, id }, index) => (
          <option key={index} value={id}>{file_name}</option>
        ))}
      </select>
      <button onClick={start}>Start</button>
      <p>{currentTrajectory}</p>
>>>>>>> 1c30292cd5b77c2d8b9f165ebe07cc850dbe9a6c
    </main>
  );
}

export { Main };