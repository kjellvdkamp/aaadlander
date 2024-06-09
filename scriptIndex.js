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
  

  // Function to add data point
  function addDataPoint(value) {
    lineChart.data.labels.push(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Amsterdam' }));
    lineChart.data.datasets[0].data.push(value);
    if (lineChart.data.labels.length > 25) {
      lineChart.data.labels.shift();
      lineChart.data.datasets[0].data.shift();
    }
    lineChart.update();
  }

  // Function to insert live weight
  function insertLiveWeight(value) {
    document.getElementById('huidig-gewicht').innerHTML = value + ' gram';
  }

  // WebSocket event listeners
  socket.onmessage = (event) => {
    console.log('Message received from WebSocket:', event.data);
    const data = JSON.parse(event.data);
    addDataPoint(data.value);
    insertLiveWeight(data.value);
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
