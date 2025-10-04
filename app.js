// Fetch NASA POWER API data and display it

async function Average(parameter,latitude, longitude,month,day,hour,values) {

    if (!values ) values =await dayData(parameter, latitude, longitude, month, day,hour); // error string
    if (!values || typeof values === 'string') return values; // error string
   
    const sum = values.reduce((a, b) => a + b, 0);
    let avgDayData = sum / values.length;

    return avgDayData;
}


async function loadData(parameter, longitude, latitude) {
    const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=${parameter}&community=SB&longitude=${longitude}&latitude=${latitude}&start=20010101&end=30000102&format=JSON`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 422) {
                return 'Error 422: Invalid request. Please check the coordinates or try a different location.';
            }
            throw new Error('Error loading data: ' + response.statusText);
        }
        const json = await response.json();
        const data = json.properties.parameter[parameter];
        let inDayData = {};
        for (let date in data) {
            if (data[date] === -999) continue; // Skip missing data
            let day = date.slice(4);
            if (!inDayData[day]) {
                inDayData[day] = [];
            }
            inDayData[day].push(data[date]);
        }
        return inDayData;
    } catch (error) {
        console.warn(error);
        return 'Error loading data';
    }
}

async function Distribution(parameter,latitude, longitude,month,day,hour,values) {
      
      if (!values ) values =await dayData(parameter, latitude, longitude, month, day,hour); // error string
      if (!values || typeof values === 'string') return values; // error string

      const distribution = {};
        for (const value of values) {
          const rounded = Math.round(value*2)/2;
          distribution[rounded] = (distribution[rounded] || 0) + 1;
        }
      
      return distribution;
}

async function dayData(parameter,latitude, longitude,month,day,hour) {
      hour = hour.toString();
    day = day.toString();
      month = month.toString();
      if (!month || !day || !hour) new Error('Month, day, and hour are required');

      if (day.length===1) day='0'+day;
      if (month.length===1) month='0'+month;
      if (hour.length===1) hour='0'+hour;
      data = await loadData(parameter, longitude, latitude);

      if (!data || typeof data === 'string') return data; // error string

      // Check if the day exists in the data
      if (!data[month + day+hour]) {
        return `No data available for the specified month (${month}), day (${day}), and hour (${hour}).`;
      }
      const values = data[month + day+hour];
      return values;
}