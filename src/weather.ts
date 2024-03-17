// write fetch function for get weather data from tomorrow.io

fetch("https://api.tomorrow.io/v4/timelines?location=23.09,113.17&fields=temperature_2m&units=metric&timesteps=1h").then(
    (response) => {
        console.log(response)
        return response.json();
    }
).then((data) => {
        console.log(data);
    }
)
