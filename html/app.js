// Fetch NASA POWER API data and display it
const output = document.getElementById('output');
let inDayData = {};

fetch('https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=SB&longitude=0&latitude=0&start=19810101&end=20260201&format=JSON')
  .then(response => response.json())
  .then(data => {
    // Display the JSON data in a readable format
    data = data.properties.parameter.T2M;
    for (date in data) {
        if (data[date] == -900) continue;
            day =  date.slice(4);
            if (!inDayData[day]) {
                inDayData[day] = [];
            }
            inDayData[day].push(data[date]);
    }
    output.textContent = JSON.stringify(inDayData);
})
  .catch(error => {
    output.textContent = 'Error loading data: ' + error;
  });
