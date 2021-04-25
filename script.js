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
    list: [
            {
              index: 0,
              name: 'Milan',
              imgSrc: './assets/milan/milan-duomo-2.jpg',
              weatherStatus: 'sunny',  //placeholder
              currentTemp: 34,  //placeholder
              tempMin: 23,  //placeholder
              tempMax: 36,  //placeholder
              latitude: 45.27,
              longitude: 9.09,
              weather: null,
            },
            {
              index: 1,
              name: 'Bangkok',
              imgSrc: './assets/bangkok/bangkok-1.jpg',
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
      ]
  },
  {
    currentCity: []
  }
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
  const citiesLatLong = cities[0].list.map(city => [city.latitude, city.longitude]);
  const [milanLatLong, bangkokLatLong, londonLatLong, nairobiLatLong, losAngelesLatLong] = citiesLatLong;
  console.log('fetchAllCitiesWeather => citiesLatLong => ', citiesLatLong);
  const [milanResponse, bangkokResponse, londonResponse, nairobiResponse, losAngelesResponse] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${milanLatLong[0]}&lon=${milanLatLong[1]}&units=metric&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${bangkokLatLong[0]}&lon=${bangkokLatLong[1]}&units=metric&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${londonLatLong[0]}&lon=${londonLatLong[1]}&units=metric&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${nairobiLatLong[0]}&lon=${nairobiLatLong[1]}&units=metric&exclude=${dataToExclude}&appid=${myAPIKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${losAngelesLatLong[0]}&lon=${losAngelesLatLong[1]}&units=metric&exclude=${dataToExclude}&appid=${myAPIKey}`),
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

  return [milanWeatherData, bangkokWeatherData, londonWeatherData, nairobiWeatherData, losAngelesWeatherData];
}

handleScreenOrientation();

const initData = () => {
  handleScreenOrientation();

  fetchAllCitiesWeather().then(([milanWeatherData, bangkokWeatherData, londonWeatherData, nairobiWeatherData, losAngelesWeatherData]) => {
    console.log('cities[0].list => ', cities[0].list);
    for (city of cities[0].list){
      switch(city.name.toLowerCase()){
        case 'milan':
            newCity = {...city, weather: milanWeatherData};
            cities[0].list[cities[0].list.findIndex(city => city.name.toLowerCase() === 'milan')] = newCity;
            cities[1].currentCity.push(newCity);
            break;
        case 'bangkok':
            newCity = {...city, weather: bangkokWeatherData};
            cities[0].list[cities[0].list.findIndex(city => city.name.toLowerCase() === 'bangkok')] = newCity;
            break;
        case 'london':
            newCity = {...city, weather: londonWeatherData};
            cities[0].list[cities[0].list.findIndex(city => city.name.toLowerCase() === 'london')] = newCity;
            break;
        case 'nairobi':
            newCity = {...city, weather: nairobiWeatherData};
            cities[0].list[cities[0].list.findIndex(city => city.name.toLowerCase() === 'nairobi')] = newCity;
            break;
        case 'los angeles':
            newCity = {...city, weather: losAngelesWeatherData};
            cities[0].list[cities[0].list.findIndex(city => city.name.toLowerCase() === 'los angeles')] = newCity;
            break;
        default:
          break;
      }
    }
  })

};

// initData();

const carouselDataHandler = (cities) => {
  const carouselData = [];
  for (city of cities){
    carouselData.push(city)
  }
  console.log('carouselDataHandler => carouselData => ', carouselData);
}

fetchAllCitiesWeather().then(data => {
  const newCurrentCity = data[0];
  console.log('newCurrentCity => ', newCurrentCity);
  carouselDataHandler(data);

  let carouselStateFragment = document.createDocumentFragment();
  for (let i = 1; i <= 5; i++){
    const carouselStateSensor = document.createElement('div');
    carouselStateSensor.setAttribute('class', 'carousel-state__sensor');
    carouselStateFragment.appendChild(carouselStateSensor);
  }
  const carouselState = document.getElementById('carousel-state');
  carouselState.appendChild(carouselStateFragment);

  console.log('carouselStateFragment => ', carouselStateFragment);


  const todayInfoCurrent = document.createElement('div');
  todayInfoCurrent.setAttribute('id', 'today-info__current');
  const todayInfoCity = document.createElement('div');
  todayInfoCity.setAttribute('id', 'today-info__city');
  todayInfoCity.textContent = cities[0].list[0].name;
  const todayInfoWeatherStatus = document.createElement('div');
  todayInfoWeatherStatus.setAttribute('id', 'today-info__weather-status');
  todayInfoWeatherStatus.textContent = newCurrentCity.current.weather[0].description;
  const todayInfoCurrentTemp = document.createElement('div');
  todayInfoCurrentTemp.setAttribute('id', 'today-info__current-temp');
  todayInfoCurrentTemp.textContent = `${Math.floor(newCurrentCity.current.temp)}`;
  const todayInfoMinMaxTemp = document.createElement('div');
  todayInfoMinMaxTemp.setAttribute('id', 'today-info__min-max-temp');
  todayInfoMinMaxTemp.textContent = `${Math.floor(newCurrentCity.daily[0].temp.min)}/${Math.floor(newCurrentCity.daily[0].temp.max)}`;

  let todayInfoCurrentFragment = document.createDocumentFragment();
  todayInfoCurrentFragment.appendChild(todayInfoCity);
  todayInfoCurrentFragment.appendChild(todayInfoWeatherStatus);
  todayInfoCurrentFragment.appendChild(todayInfoCurrentTemp);

  console.log('todayInfoCurrentFragment => ', todayInfoCurrentFragment);

  const todayInfo = document.getElementById('today-info');
  todayInfo.appendChild(todayInfoCurrentFragment);
  todayInfo.appendChild(todayInfoMinMaxTemp);

  const weatherAppRecap = document.getElementById('weather-app__recap');
  weatherAppRecap.appendChild(carouselState);
  weatherAppRecap.appendChild(todayInfo);
});

// const carouselElement = document.getElementById('carousel');
// const todayInfoElement = document.getElementById('today-info');
// const todayInfoCurrent = document.createElement('div');
// todayInfoCurrent.setAttribute('id', 'today-info__current');
// const todayInfoCity = document.createElement('div');
// todayInfoCity.setAttribute('id', 'today-info__city');
// todayInfoCity.textContent = cities[0].name;
// const todayInfoWeatherStatus = document.createElement('div');
// todayInfoWeatherStatus.setAttribute('id', 'today-info__weather-status');
// todayInfoWeatherStatus.textContent = cities[0].weather.current.weather[0].description;
// const todayInfoCurrentTemp = document.createElement('div');
// todayInfoCurrentTemp.setAttribute('id', 'today-info__current-temp');
// todayInfoCurrentTemp.textContent = `${cities[0].weather.current.temp}°C`;
// const todayInfoMinMaxTemp = document.createElement('div');
// todayInfoMinMaxTemp.setAttribute('id', 'today-info__min-max-temp');
// todayInfoMinMaxTemp.textContent = `${cities[0].weather.daily[0].temp.min}°C/${cities[0].weather.daily[0].temp.max}°C}°C`;

// let todayInfoCurrentFragment = document.createrDocumentFragment();
// todayInfoCurrentFragment.appendChild(todayInfoCity);
// todayInfoCurrentFragment.appendChild(todayInfoWeatherStatus);
// todayInfoCurrentFragment.appendChild(todayInfoCurrentTemp);

// console.log('todayInfoCurrentFragment => ', todayInfoCurrentFragment);

const loadCarousel = () => {
  const carouselElement = document.getElementById('carousel');
  carouselElement.setAttribute('src', cities[0].list[0].imgSrc);
  console.log('carouselElement => ', carouselElement);
}
const loadTodayInfo = () => {
  const todayInfoElement = document.getElementById('today-info');
  const todayInfoCurrent = document.getElementById('today-info__current');
  const todayInfoCity = document.getElementById('today-info__city'); 

  // todayInfoCity.textContent = cities[0].list[0].name;
console.log('todayInfoCity => ', todayInfoCity)

  todayInfoCurrent.appendChild(todayInfoCity);
  todayInfoElement.appendChild(todayInfoCurrent);

  const todayInfoWeatherStatus = document.getElementById('today-info__weather-status');
  const todayInfoCurrentTemp = document.getElementById('today-info__current-temp');
  const todayInfoMinMaxTemp = document.getElementById('today-info__min-max-temp');
  // todayInfoElement.appendChild();
  console.log('todayInfoElement => ', todayInfoElement);
}

const initApp = () => {
  loadCarousel();
  loadTodayInfo();
  // loadWeekInfo();
  // loadChart();
}

initApp();



const sliderRightHandler = () => {
  currentIndex--;
  if(currentIndex < 0) currentIndex = cities[0].list.length - 1;
  const currentCity = cities[0].list[currentIndex];
  carouselElement.setAttribute('src', currentCity.imgSrc);


  console.log('sliderRightHandler => currentIndex => ', currentIndex);
  console.log('sliderRightHandler => currrentCity => ', currentCity);
}
const sliderLeftHandler = () => {
  currentIndex++;
  if(currentIndex === cities[0].list.length) currentIndex = 0;
  const currentCity = cities[0].list[currentIndex];
  carouselElement.setAttribute('src', currentCity.imgSrc);

  console.log('sliderLeftHandler => currentIndex => ', currentIndex);
  console.log('sliderLeftHandler => currrentCity => ', currentCity);
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
//   nextIndex = currentIndex >= 0 && currentIndex < cities[0].list.length - 1 ? currentIndex + 1 : 0;
//   console.log('nextIndex => ', nextIndex);
// }

// const fetchWeather = async => {
//   let url = 
// }

