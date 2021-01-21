const trace1 = {
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

  const trace2 = {
    x: [],
    y: [],
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'lines',
    name: 'q1',
    line: { color: '#DF56F1' }
  };

  const trace3 = {
    x: [],
    y: [],
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    name: 'ref q2',
    line: { color: '#80CAF6' }
  };

  const trace4 = {
    x: [],
    y: [],
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    name: 'q2',
    line: { color: '#DF56F1' }
  };

  const layout = {
    xaxis: {
      title: 'Time (s)'
    },
    yaxis: {
      title: 'Posicón (m)',
      range: [0, 1],
      autorange: false,
    },
    xaxis2: {
      title: 'Time (s)',
      anchor: 'y2'
    },
    yaxis2: {
      title: 'Posicón (m)',
      range: [0, 1],
      anchor: 'x2',
      autorange: false
    },
    grid: {
      rows: 2,
      columns: 2,
      pattern: 'independent'
    },
  }

  const data = [trace1, trace2, trace3, trace4]

  export { data, layout };