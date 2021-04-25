// const track = document.querySelector(".track");
const track = document.querySelector("#swipe-area");
let initialPosition = null;
let moving = false;
let currentIndex = 0;
let nextIndex = 1;
let previousIndex = 5;
let goLeft = null;
let goRight = null;
let screenOrientation = null;

let cities = [
  {
    index: 0,
    name: 'Milan',
    imgSrc: '',
    weatherStatus: 'sunny',  //placeholder
    currentTemp: 34,  //placeholder
    tempMin: 23,  //placeholder
    tempMax: 36,  //placeholder
    latitude: 9.18,
    longitude: 45.46,
    weather: null,
  },
  {
    index: 1,
    name: 'Bangkok',
    imgSrc: '',
    weatherStatus: 'rainy',  //placeholder
    currentTemp: 14,  //placeholder
    tempMin: 3,  //placeholder
    tempMax: 26,  //placeholder
    latitude: 13.73,
    longitude: 100.52,
    weather: null,
  },
  {
    index: 2,
    name: 'London',
    imgSrc: '',
    weatherStatus: 'sunny',  //placeholder
    currentTemp: 32,  //placeholder
    tempMin: 30,  //placeholder
    tempMax: 41,  //placeholder
    latitude: 51.51,
    longitude: -0.11,
    weather: null,
  },
  {
    index: 3,
    name: 'Nairobi',
    imgSrc: '',
    weatherStatus: 'sunny',  //placeholder
    currentTemp: 32,  //placeholder
    tempMin: 12,  //placeholder
    tempMax: 36,  //placeholder
    latitude: -1.28,
    longitude: 36.81,
    weather: null,
  },
  {
    index: 4,
    name: 'Los Angeles',
    imgSrc: '',
    weatherStatus: 'cloudy',  //placeholder
    currentTemp: 18,  //placeholder
    tempMin: 15,  //placeholder
    tempMax: 27,  //placeholder
    latitude: 34.05,
    longitude: -118.24,
    weather: null,
  },
];
let currentCity = null;

const handleScreenOrientation = () => {
  if (window.screen.width > window.screen.height) {
    screenOrientation = "landscape";
    console.log(" screenOrientation is => ", screenOrientation);
  } else {
    screenOrientation = "portrait";
    console.log(" screenOrientation is => ", screenOrientation);
  }
};

const weatherDataMilan = async () => {
  const myAPIKey = '2d6ebfd28fe3605c83bebbfd9a7532fa';
  const milanLatitude = 45.27;
  const milanLongitude = 9.09;
  const dataToExclude = 'hourly,alerts,minutely';
  let myUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${milanLatitude}&lon=${milanLongitude}&exclude=${dataToExclude}&appid=${myAPIKey}`;

  const response = await fetch(myUrl);

  /* Fetch request Error handling */
  if(!response.ok){
    const message = `An error has occured: ${respose.status}`;
    throw new Error(message);
  }

  const responseJSON = await response.json();
  return responseJSON;
}

const fetchAllCitiesWeather = async () => {
  const myAPIKey = '2d6ebfd28fe3605c83bebbfd9a7532fa';
  const dataToExclude = 'hourly,alerts,minutely';
  const citiesLatLong = cities.map(city => [city.latitude, city.longitude]);
  const [milanLatLong, bangkokLatLong, londonLatLong, nairobiLatLong, losAngelesLatLong] = citiesLatLong;
  console.log('fetchAllCitiesWeather => citiesLatLong => ', citiesLatLong);
  const [milanResponse, bangkokResponse, londonResponse, nairobiResponse, losAngelesResponse] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${milanLatLong[0]}&lon=${milanLatLong[1]}&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${bangkokLatLong[0]}&lon=${bangkokLatLong[1]}&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${londonLatLong[0]}&lon=${londonLatLong[1]}&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${nairobiLatLong[0]}&lon=${nairobiLatLong[1]}&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${losAngelesLatLong[0]}&lon=${losAngelesLatLong[1]}&exclude=${dataToExclude}&appid=${myAPIKey}`),
  ]);

  /* Fetch request Error handling */
  if(!milanResponse.ok || !bangkokResponse.ok || !londonResponse.ok || !nairobiResponse.ok || !losAngelesResponse.ok){
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  console.log('start');
  const milanWeatherData = await milanResponse.json();
  const bangkokWeatherData = await bangkokResponse.json();
  const londonWeatherData = await londonResponse.json();
  const nairobiWeatherData = await nairobiResponse.json();
  const losAngelesWeatherData = await losAngelesResponse.json();

  for (city of cities){
    switch(city.name.toLowerCase()){
      case 'milan':
          newCity = {...city, weather: milanWeatherData};
          cities[cities.findIndex(city => city.name.toLowerCase() === 'milan')] = newCity;
          break;
      case 'bangkok':
          newCity = {...city, weather: bangkokWeatherData};
          cities[cities.findIndex(city => city.name.toLowerCase() === 'bangkok')] = newCity;
          break;
      case 'london':
          newCity = {...city, weather: londonWeatherData};
          cities[cities.findIndex(city => city.name.toLowerCase() === 'london')] = newCity;
          break;
      case 'nairobi':
          newCity = {...city, weather: nairobiWeatherData};
          cities[cities.findIndex(city => city.name.toLowerCase() === 'nairobi')] = newCity;
          break;
      case 'los angeles':
          newCity = {...city, weather: losAngelesWeatherData};
          cities[cities.findIndex(city => city.name.toLowerCase() === 'los angeles')] = newCity;
          break;
      default:
        break;
    }
  }
  // console.log('fetchAllCitiesWeather => cities => ', cities);
  // console.log('fetchAllCitiesWeather => currentCity => ', cities[0]);
}

const init = () => {
  handleScreenOrientation();
  fetchAllCitiesWeather();
  console.log('init => cities => ', cities);
};

const setInitialCurrentCity = () => {
  console.log('setInitialCurrentCity => cities => ', cities)
  currentCity = cities[0];
  console.log('setInitialCurrentCity => ', cities[2]);
}

/* Initialization */
// init().then(() => {
//   const dummy = cities[0];
//   console.log('initialization => cities => ', cities);
//   console.log('initialization => cities[0] => ', cities[0]);
//   console.log('initialization => dummy => ', dummy);
//   setInitialCurrentCity()}
//   );

init();

// while (cities[0].weather === null){
//   currentCity = cities[0];
//   console.log('if => currentCity => ', currentCity);
//   }

// setInitialCurrentCity();



const sliderLeftHandler = () => {
  currentIndex--;
  if(currentIndex < 0) currentIndex = cities.length - 1;
  currentCity = cities[currentIndex];

  console.log('sliderLeftHandler => currentIndex => ', currentIndex);
  console.log('sliderLeftHandler => currrentCity => ', currentCity);
}
const sliderRightHandler = () => {
  currentIndex++;
  if(currentIndex === cities.length) currentIndex = 0;
  currentCity = cities[currentIndex]

  console.log('sliderRightHandler => currentIndex => ', currentIndex);
  console.log('sliderRightHandler => currrentCity => ', currentCity);
}

const gestureStart = (e) => {
  initialPosition = e.pageX;
  moving = true;
  const transformMatrix = window
    .getComputedStyle(track)
    .getPropertyValue("transform");
  console.log("transformMatrix =>  ", transformMatrix);
};

const gestureMove = (e) => {
  if (moving) {
    const currentPosition = e.pageX;
    let diff = currentPosition - initialPosition;
    track.style.transform = `translateX(${diff}px)`;
    console.log("diff => ", diff);

    if (diff < -5) {
      alert("we are moving left");
      sliderLeftHandler();
      diff = 0;
    } else if (diff > 5) {
      alert("we are moving right");
      sliderRightHandler();
      diff = 0;
    }
  }
};

const gestureEnd = (e) => {
  moving = false;
};

if (window.PointerEvent && window.screen.width < 768) {
  window.addEventListener("pointerdown", gestureStart);

  window.addEventListener("pointermove", gestureMove);

  window.addEventListener("pointerup", gestureEnd);
}
/*
else {
  window.addEventListener("pointerdown", gestureStart);

  window.addEventListener("pointermove", gestureMove);

  window.addEventListener("pointerup", gestureEnd);
}
*/



// const sliderHandler = () => {
//   nextIndex = currentIndex >= 0 && currentIndex < cities.length - 1 ? currentIndex + 1 : 0;
//   console.log('nextIndex => ', nextIndex);
// }

// const fetchWeather = async => {
//   let url = 
// }

