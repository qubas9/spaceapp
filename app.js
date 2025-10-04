// Fetch NASA POWER API data and display it

async function T2MAverage(latitude, longitude) {
    const Data = await loadData('T2M', longitude, latitude);
    if (!Data || typeof Data === 'string') return Data; // error string
    const avgDayData = {};
    for (const day in Data) {
        const values = Data[day];
        const sum = values.reduce((a, b) => a + b, 0);
        avgDayData[day] = sum / values.length;
    }
    return avgDayData;
}


async function loadData(parameter, longitude, latitude) {
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameter}&community=SB&longitude=${longitude}&latitude=${latitude}&start=19810101&end=20260201&format=JSON`;
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
