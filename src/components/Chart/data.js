const trace1 = {
    x: [],
    y: [],
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'lines',
    name: 'ref q1',
    line: {
      color: 'rgb(164, 194, 244)',
    }
  }

  const trace2 = {
    x: [],
    y: [],
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'lines',
    name: 'q1',
    line: { color: 'rgb(234, 153, 153)' }
  };

  const trace3 = {
    x: [],
    y: [],
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    name: 'ref q2',
    line: { color: 'rgb(164, 194, 244)' }
  };

  const trace4 = {
    x: [],
    y: [],
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    name: 'q2',
    line: { color: 'rgb(234, 153, 153)' }
  };

  const trace5 = {
    x: [],
    y: [],
    xaxis: 'x3',
    yaxis: 'y3',
    mode: 'lines',
    name: 'ref q3',
    line: {
      color: 'rgb(164, 194, 244)',
    }
  }

  const trace6 = {
    x: [],
    y: [],
    xaxis: 'x3',
    yaxis: 'y3',
    mode: 'lines',
    name: 'q3',
    line: { color: 'rgb(234, 153, 153)' }
  };

  const trace7 = {
    x: [],
    y: [],
    xaxis: 'x4',
    yaxis: 'y4',
    mode: 'lines',
    name: 'ref q4',
    line: { color: 'rgb(164, 194, 244)' }
  };

  const trace8 = {
    x: [],
    y: [],
    xaxis: 'x4',
    yaxis: 'y4',
    mode: 'lines',
    name: 'q4',
    line: { color: 'rgb(234, 153, 153)' }
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
    xaxis3: {
      title: 'Time (s)',
      anchor: 'y3'
    },
    yaxis3: {
      title: 'Posicón (m)',
      range: [0, 1],
      anchor: 'x3',
      autorange: false,
    },
    xaxis4: {
      title: 'Time (s)',
      anchor: 'y4'
    },
    yaxis4: {
      title: 'Posicón (m)',
      range: [0, 1],
      anchor: 'x4',
      autorange: false
    },
    grid: {
      rows: 2,
      columns: 2,
      pattern: 'independent'
    },
    showlegend: false,
  }

  const data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8]

  export { data, layout };