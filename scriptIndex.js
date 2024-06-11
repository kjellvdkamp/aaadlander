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
            tooltipFormat: 'll HH:mm:ss',
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

  let db;
  let meting = 0;

  function initDatabase() {
    const request = indexedDB.open("aaad17", 1);
  
    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully");
    };
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      // Creating the Metingen store
      const metingenStore = db.createObjectStore("MetingenStore", { autoIncrement: true });
      metingenStore.createIndex("Meting", "Meting", { unique: false });
      metingenStore.createIndex("Gewicht", "Gewicht", { unique: false });
      metingenStore.createIndex("TimeStamp", "TimeStamp", { unique: false });
  
      // Creating the Acties store
      const actiesStore = db.createObjectStore("ActiesStore", { keyPath: "TimeStamp1" });
      actiesStore.createIndex("Actie", "Actie", { unique: false });
      actiesStore.createIndex("TimeStamp1", "TimeStamp1", { unique: false });
  
      console.log("Object stores for Metingen and Acties created or upgraded successfully");
    };
  }

  function addMeting(meting, gewicht, timeStamp) {
    if (!db) {
      console.error("Database is not initialized");
      return;
    }
  
    const transaction = db.transaction(["MetingenStore"], "readwrite");
    const objectStore = transaction.objectStore("MetingenStore");
  
    const data = {
      Meting: meting,
      Gewicht: gewicht,
      TimeStamp: timeStamp
    };

    const request = objectStore.add(data);

    request.onsuccess = () => {
      console.log("Meting added to the database:", data);
    };

    request.onerror = (event) => {
      console.error("Error adding meting to DB:", event.target.error);
    };
  }

  function addActie(actie, timeStamp1) {
    if (!db) {
      console.error("Database is not initialized");
      return;
    }

    if (!timeStamp1) {
      console.error("Error: timeStamp1 is not defined");
      return;
    }

    const transaction = db.transaction(["ActiesStore"], "readwrite");
    const objectStore = transaction.objectStore("ActiesStore");

    const data = {
      TimeStamp1: timeStamp1,
      Actie: actie
    };

    const request = objectStore.add(data);

    request.onsuccess = () => {
      console.log("Actie added to the database:", data);
    };

    request.onerror = (event) => {
      console.error("Error adding actie to DB:", event.target.error);
    };
  }

  // Initialization of the database
  initDatabase();

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
    if (defaultDataTimer) {
      clearTimeout(defaultDataTimer);
    }
  }

  function fillWithDefaultData() {
    // get the current time
    let currentTime = new Date();
    // add a default data point to the chart
    addDataPoint(currentTime, defaultData);
    // set the timer to fill the chart with default data again
    defaultDataTimer = setTimeout(fillWithDefaultData, defaultInterval);
  }

  // start filling the chart with default data
  fillWithDefaultData();

  // Function to insert live weight
  function insertLiveWeight(value) {
    document.getElementById('huidig-gewicht').innerHTML = value + 'gram';
  }

  socket.onmessage = (event) => {
    console.log('Message received from WebSocket:', event.data);
    const data = JSON.parse(event.data);
    const time = new Date(data.timestamp); // parse the timestamp
    const value = data.weight / 100;
    const servo1 = data.servo1_degrees;
    const servo2 = data.servo2_degrees;
    const servo3 = data.servo3_degrees;
    const servo4 = data.servo4_degrees;

    addDataPoint(time, value);
    insertLiveWeight(value);

    const currentTime = time.getTime();

    // save the data to the database
    addMeting(++meting, value, currentTime); 
    addActie('Servo1: ' + servo1, currentTime);
    addActie('Servo2: ' + servo2, currentTime);
    addActie('Servo3: ' + servo3, currentTime);
    addActie('Servo4: ' + servo4, currentTime);

    // clear the default data timer
    if (defaultDataTimer) {
      clearTimeout(defaultDataTimer);
    }
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
    .then((response) => {
      if (response.ok) {
        console.log('POST request successful');
      } else {
        console.error('Error occurred while sending POST request:', response.status);
      }
    })
    .catch((error) => {
      console.error('Error occurred while sending POST request:', error);
    });
    // save the actie to the database
    addActie('ArmPakken', new Date().getTime());
  });

  const btnreset = document.getElementById('btnreset');
  btnreset.addEventListener('click', (event) => {
    fetch(`http://145.49.127.250:1880/aaadlander/aaad4?commandoText=ArmReset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.ok) {
        console.log('POST request successful');
      } else {
        console.error('Error occurred while sending POST request:', response.status);
      }
    })
    .catch((error) => {
      console.error('Error occurred while sending POST request:', error);
    });
    // save the actie to the database
    addActie('ArmReset', new Date().getTime());
  });
});
