// Ensure that JavaScript is loaded after HTML
document.addEventListener("DOMContentLoaded", function() {
  // WebSocket connection
  const socketUrl = 'ws://145.49.127.250:1880/ws/aaad4';
  const socket = new WebSocket(socketUrl);

  const ctx = document.getElementById('myChart').getContext('2d');
  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'gram',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      spanGaps: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'second',
            displayFormats: {
              second: 'HH:mm:ss'
            },
            timezone: 'Europe/Amsterdam'
          },
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          title: {
            display: true,
            text: 'gram'
          }
        }
      }
    }
  });
  

let chartData = lineChart.data;
let defaultData = 30; // default value to fill the chart
let defaultInterval = 2000; // interval to fill the chart with default data (in ms)
let defaultDataTimer = null; // timer to fill the chart with default data
let maxDataPoints = 25; // adjust this value to your liking

  // Function to add data point
  function addDataPoint(time, value) {
    chartData.labels.push(time);
    chartData.datasets[0].data.push(value);
    if (chartData.labels.length > maxDataPoints) {
      chartData.labels.shift();
      chartData.datasets[0].data.shift();
    }
    lineChart.update();
    // clear the default data timer
    clearTimeout(defaultDataTimer);
  }
  
  function fillWithDefaultData() {
    // get the current time
    let currentTime = new Date().getTime();
    // add a default data point to the chart
    addDataPoint(currentTime, defaultData);
    // set the timer to fill the chart with default data again
    defaultDataTimer = setTimeout(fillWithDefaultData, defaultInterval);
  }
  
  // start filling the chart with default data
  fillWithDefaultData();
  
  

  // Function to insert live weight
  function insertLiveWeight(value) {
    document.getElementById('huidig-gewicht').innerHTML = value + ' gram';
  }

  // WebSocket event listeners
  socket.onmessage = (event) => {
    console.log('Message received from WebSocket:', event.data);
    const data = JSON.parse(event.data);
    addDataPoint(data.time, data.value);
    insertLiveWeight(data.value);
    // clear the default data timer
    clearTimeout(defaultDataTimer);
  };

  socket.onopen = () => {
    console.log('Connected to WebSocket');
  };

  socket.onerror = (error) => {
    console.error('Error occurred while connecting to WebSocket:', error);
  };

  socket.onclose = () => {
    console.log('Disconnected from WebSocket');
  };

  // Button event listeners
  const btnpakken = document.getElementById('btnpakken');
  btnpakken.addEventListener('click', (event) => {
    fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=ArmPakken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      alert("Fout");
      console.error('Error occurred while sending POST request:', error);
    });
  });

  const btnreset = document.getElementById('btnreset');
  btnreset.addEventListener('click', (event) => {
    fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=ArmReset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      alert("Fout");
      console.error('Error occurred while sending POST request:', error);
    });
  });
});
