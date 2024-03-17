import {Elysia} from 'elysia';
import fetch from 'node-fetch';

const app = new Elysia();

const weatherConditionToEmoji = (condition: string): string => {
    if (condition.includes('Clear')) return '🌤';
    if (condition.includes('Sunny')) return '☀️';
    if (condition.includes('Partly')) return '⛅';
    if (condition.includes('Cloudy')) return '☁️';
    if (condition.includes('Overcast')) return '🌥';
    if (condition.includes('Mist')) return '🌫';
    if (condition.includes('Patchy rain nearby')) return '🌦';
    if (condition.includes('Rain')) return '🌧';
    if (condition.includes('Snow')) return '❄️';
    if (condition.includes('Thunder')) return '⛈';
    // Добавьте дополнительные условия погоды и соответствующие эмодзи
    return '🌈'; // Эмодзи по умолчанию, если условие неизвестно
};

const getClothingRecommendation = (tempCelsius: number): string => {
    if (tempCelsius >= 25) {
        return '🩳👕 It\'s hot, wear shorts and a t-shirt.';
    } else if (tempCelsius >= 15) {
        return '👖👕 You\'ll be comfortable in pants and a t-shirt.';
    } else if (tempCelsius >= 5) {
        return '🧥🧣 It\'s chilly, you should wear a coat and a scarf.';
    } else {
        return '🧥🧤🧣 It\'s cold, make sure to dress warmly with a coat, gloves, and a scarf.';
    }
};

const createWeatherTable = (weatherData: any): Response => {
    let weatherTable = '<table>';


    for (const weather of weatherData.weather) {
        let morningEmoji = weatherConditionToEmoji(weather.hourly[1].weatherDesc[0].value);
        let dayEmoji = weatherConditionToEmoji(weather.hourly[4].weatherDesc[0].value);
        let eveningEmoji = weatherConditionToEmoji(weather.hourly[7].weatherDesc[0].value);
        let morningTemp = parseInt(weather.hourly[1].tempC, 10);
        let dayTemp = parseInt(weather.hourly[4].tempC, 10);
        let eveningTemp = parseInt(weather.hourly[7].tempC, 10);

        weatherTable += `
            <tr>
                <td>${weather.date}</td>
                <td>Утро: ${morningTemp}°C ${morningEmoji} ${weather.hourly[1].lang_ru[0].value} <br> ${getClothingRecommendation(morningTemp)}</td>
                <td>День: ${dayTemp}°C ${dayEmoji} ${weather.hourly[4].lang_ru[0].value} <br> ${getClothingRecommendation(dayTemp)}</td>
                <td>Вечер: ${eveningTemp}°C ${eveningEmoji} ${weather.hourly[7].lang_ru[0].value} <br> ${getClothingRecommendation(eveningTemp)}</td>
            </tr>
        `;
    }

    weatherTable += '</table>';

    return new Response(weatherTable,
        {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        }
    );
};

app.get("/api", () => "Hello from Elysia!");

app.get('/weather/:location', async ({params: {location}}) => {
    const response = await fetch(`https://wttr.in/${location}?format=j1&lang=ru`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    const weatherData = await response.json();
    const htmlResponse = createWeatherTable(weatherData);

    return htmlResponse;
});

app.listen(3000, () => {
    console.log('🦊 Server running on http://localhost:3000');
});
