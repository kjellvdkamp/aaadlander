document.addEventListener("DOMContentLoaded", function() {
  // WebSocket connection
  const socketUrl = 'ws://145.49.127.250:1880/ws/aaad4';
  const socket = new WebSocket(socketUrl);

  // Button event listeners
  function addEventListenerToButton(id, command) {
      const btn = document.getElementById(id);
      btn.addEventListener('click', () => {
          sendCommand(command);
      });
  }

  function sendCommand(command) {
      fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=${command}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
      })
      .catch(error => {
          alert("Fout");
          console.error('Error occurred while sending POST request:', error);
      });
  }

  // Add event listeners to buttons
  addEventListenerToButton('servo12', 'Servo12');
  addEventListenerToButton('servo3', 'Servo3');
  addEventListenerToButton('servo4', 'Servo4');
  addEventListenerToButton('kalibreer', 'KalibreerOn');

  // WebSocket event listeners
  socket.onopen = () => {
      console.log('Connected to WebSocket');
  };

  socket.onerror = (error) => {
      console.error('Error occurred while connecting to WebSocket:', error);
  };

  socket.onclose = () => {
      console.log('Disconnected from WebSocket');
  };
});
