// Zorg ervoor dat JavaScript niet eerder wordt ingeladen dan HTML
document.addEventListener('DOMContentLoaded', function() {
  // WebSocket verbinding
  const socketUrl = 'ws://145.49.127.250:1880/ws/aaad4';
  const socket = new WebSocket(socketUrl);

  // Grafiekconfiguratie
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
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'second',
            displayFormats: {
              second: 'HH:mm:ss'
            },
            timezone: 'Europe/Amsterdam'
          },
          scaleLabel: {
            display: true,
            labelString: 'Tijd'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'gram'
          }
        }]
      }
    }
  });

  // Functie om een datapunt toe te voegen
  function addDataPoint(value) {
    lineChart.data.labels.push(new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' }));
    lineChart.data.datasets[0].data.push(value);
    if (lineChart.data.labels.length > 25) {
      lineChart.data.labels.shift();
      lineChart.data.datasets[0].data.shift();
    }
    lineChart.update();
  }

  // Functie om het huidige gewicht weer te geven
  function insertLiveWeight(value) {
    document.getElementById('huidiggewicht').innerHTML = value + ' gram';
  }

  // WebSocket event listeners
  socket.onmessage = (event) => {
    console.log('Bericht ontvangen van WebSocket:', event.data);
    const data = JSON.parse(event.data);
    addDataPoint(data.value);
    insertLiveWeight(data.value);
  };

  socket.onopen = () => {
    console.log('Verbonden met WebSocket');
  };

  socket.onerror = (error) => {
    console.error('Fout bij verbinden met WebSocket:', error);
  };

  socket.onclose = () => {
    console.log('Verbinding met WebSocket verbroken');
  };

  // Functie om een POST-verzoek te sturen
  function sendPostRequest(commandText) {
    fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=${commandText}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      alert('Fout');
      console.error('Fout bij het versturen van POST-verzoek:', error);
    });
  }

  // Event listeners voor knoppen
  document.getElementById('servo12').addEventListener('click', () => sendPostRequest('servo12'));
  document.getElementById('servo3').addEventListener('click', () => sendPostRequest('servo3'));
  document.getElementById('servo4').addEventListener('click', () => sendPostRequest('servo4'));
  document.getElementById('kalibreer').addEventListener('click', () => sendPostRequest('kalibreerOn'));
  document.getElementById('btn red lighten-2').addEventListener('click', () => sendPostRequest('Armpakken'));
  document.getElementById('btn green lighten-2').addEventListener('click', () => sendPostRequest('ArmReset'));
});
