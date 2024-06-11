// WebSocket connection
const socketUrl = 'ws://145.49.127.250:1880/ws/aaad4';
const socket = new WebSocket(socketUrl);

// Button event listeners
const btn12 = document.getElementById('servo12');


btn12.addEventListener('click', (event) => {
  
  fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=Servo12`, {
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

// Button event listeners
const btn3 = document.getElementById('servo3');


btn3.addEventListener('click', (event) => {

fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=Servo3`, {
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

// Button event listeners
const btn4 = document.getElementById('servo4');


btn4.addEventListener('click', (event) => {
  
  fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=Servo4`, {
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


// Button kalibreer event listeners
const btnkalibreer = document.getElementById('kalibreer');


btnkalibreer.addEventListener('click', (event) => {

fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=KalibreerOn`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})

.catch((error) => {
  alert("Fout");
  console.error('Error occurred while sending POST request:', error);
})
})


