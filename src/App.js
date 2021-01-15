/* global ROSLIB, PerformTrajectory */
import 'eventemitter2/lib/eventemitter2';
import 'roslib/build/roslib';

import { useEffect } from 'react';
import { useState } from 'react';

import throttle from 'lodash/throttle'
import Plotly from 'plotly.js-dist'

import { ROS_WEBBRIDGE_SERVER } from './constants';
import { PR_DB_SERVER } from './constants';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './App.css';


function App() {

  //Variable de estado
  const [references, setReferences] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {

    var PerformTrajectory = new ROSLIB.Service({
      ros: ros,
      name: '/perform_trajectory',
      serviceType: 'pr_msgs/srv/Trajectory'
    });

    var request = new ROSLIB.ServiceRequest({
      path_trajectory: "/home/paralelo4dofnew/ros2_eloquent_ws/parallel_robot/references/refecart_TRR8_identificar.txt",
      is_cart: false
    });

    PerformTrajectory.callService(request, function(result) {
      console.log(result.error_code);
      console.log(result.n_ref_loaded);
    });
    setAnchorEl(null);
  };

  useEffect(() => {

    //ROS Connection
    var ros = new ROSLIB.Ros();

    ros.on('error', () => console.log('Error! ?'));
    ros.on('connection', () => console.log('Connected! ?'));
    ros.on('close', () => console.log('Connection closed! ?'));

    ros.connect(ROS_WEBBRIDGE_SERVER);

    const joint_position_sub = new ROSLIB.Topic({
      ros : ros,
      name : '/joint_position',
      messageType : 'pr_msgs/PRArrayH'
    });

    const ref_pose_sub = new ROSLIB.Topic({
      ros : ros,
      name : '/ref_pose',
      messageType : 'pr_msgs/PRArrayH'
    });

    var joint_position = [];
    var ref_pose = [];

    joint_position_sub.subscribe(throttle(message => {
      joint_position = message.data;
    }, 100));

    ref_pose_sub.subscribe(throttle(message => {
      ref_pose = message.data;
    }, 100));

    var interval = setInterval(function() {
      
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
          range: [olderTime,futureTime]
        },
        xaxis2: {
          type: 'date',
          range: [olderTime,futureTime]
        }
      };

      Plotly.relayout('q1_chart', secondView);
      Plotly.extendTraces('q1_chart', update, [0, 1, 2, 3]);

    }, 1000);
    

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
        range: [-1, 5],
        autorange: false,
      },
      xaxis2: {
        title: 'Time (s)',
        anchor: 'y2'
      },
      yaxis2: {
        title: 'Posicón (m)',
        range: [-1, 5],
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

    fetch(PR_DB_SERVER, {method: "get"})
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setReferences(JSON.stringify(data));
    })

    
  }, []);

  return (
    <>
      <main className="main">
        <h1>PR Web</h1>
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Open Menu
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
        </div>

        <div id="q1_chart" />
        <div id="references">{references}</div>
      </main>
    </>
  );
}

export default App;
