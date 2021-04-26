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
              imgSrc: './assets/milan/milan-7.jpg',
              latitude: 45.27,
              longitude: 9.09,
              weather: null,
              active: true
            },
            {
              index: 1,
              name: 'Bangkok',
              imgSrc: './assets/bangkok/bangkok-4.jpg',
              latitude: 13.73,
              longitude: 100.52,
              weather: null,
              active: false
            },
            {
              index: 2,
              name: 'London',
              imgSrc: './assets/london/london-1.jpg',
              latitude: 51.51,
              longitude: -0.11,
              weather: null,
              active: false
            },
            {
              index: 3,
              name: 'Nairobi',
              imgSrc: './assets/nairobi/nairobi-1.jpg',
              latitude: -1.28,
              longitude: 36.81,
              weather: null,
              active: false
            },
            {
              index: 4,
              name: 'Los Angeles',
              imgSrc: './assets/los-angeles/los-angeles-1.jpg',
              latitude: 34.05,
              longitude: -118.24,
              weather: null,
              active: false
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

const fetchAllCitiesWeather = async () => {
  const myAPIKey = '2d6ebfd28fe3605c83bebbfd9a7532fa';
  const dataToExclude = 'hourly,alerts,minutely';
  const citiesLatLong = cities[0].list.map(city => [city.latitude, city.longitude]);
  const [milanLatLong, bangkokLatLong, londonLatLong, nairobiLatLong, losAngelesLatLong] = citiesLatLong;
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

initData();

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

const getDay = (num) => {
  let newDay = new Date().getDay() + num;
  if (newDay > 6){
    newDay = newDay - 7;
  }
  switch(newDay){
    case 0:
      return 'SUN';
    case 1:
      return 'MON';
    case 2:
      return 'TUE';
    case 3:
      return 'WED';
    case 4:
      return 'THU';
    case 5:
      return 'FRI';
    case 6:
      return 'SAT';
    default:
      return;
  }
}


fetchAllCitiesWeather().then(data => {
  const newCurrentCity = data[0];

  const todayInfoCity = document.getElementById('today-info__city');
  todayInfoCity.textContent = cities[0].list[0].name;

  const todayInfoWeatherStatus = document.getElementById('today-info__weather-status');
  todayInfoWeatherStatus.textContent = newCurrentCity.current.weather[0].main;

  const todayInfoCurrentTemp = document.getElementById('today-info__current-temp');
  todayInfoCurrentTemp.textContent = `${Math.round(newCurrentCity.current.temp)}°`;

  const todayInfoMinMaxTemp = document.getElementById('today-info__min-max-temp');
  todayInfoMinMaxTemp.textContent = `${Math.round(newCurrentCity.daily[0].temp.min)}° / ${Math.round(newCurrentCity.daily[0].temp.max)}°`;


  for (let i = 0; i < data[0].daily.length - 1; i++) {
    const dayText = document.createElement('h4');
    dayText.setAttribute('class', 'day__text')
    dayText.textContent = getDay(i);

    const dayIcon = document.createElement('img');
    dayIcon.setAttribute('class', 'day-icon');
    dayIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data[0].daily[i].weather[0].icon}@2x.png`);
    dayIcon.setAttribute('alt', 'day icon');

    const tempMinMax = document.createElement('span');
    tempMinMax.setAttribute('class', 'temp__min-max');
    tempMinMax.textContent = `${Math.round(data[0].daily[i].temp.min)}°/${Math.round(data[0].daily[i].temp.max)}°`;

    const dayInfo = document.createElement('div');
    dayInfo.setAttribute('class', 'day__info');
    dayInfo.appendChild(dayText);
    dayInfo.appendChild(dayIcon);
    dayInfo.appendChild(tempMinMax);

    const weatherAppDaysWeek = document.getElementById('weather-app__days-week');
    weatherAppDaysWeek.appendChild(dayInfo);
  }

  const activeCarousel = document.getElementById(`carousel-state__sensor-${0}`);
  activeCarousel.classList.add('carousel-active');
  console.log('activeCarousel ', activeCarousel)

  document.body.style.backgroundImage = `url(${cities[0].list[0].imgSrc})`;

  console.log('localStorage.length => ', localStorage.length);
});

const loadCurrentDayData = () => {
  /* START */
  const currentCity = cities[0].list[currentIndex];
  console.log('currentCity => ', currentCity)

  const pastActiveCarousel = document.getElementById(`carousel-state__sensor-${currentIndex + 1 > cities[0].list.length - 1 ? 0 : currentIndex + 1}`);
  pastActiveCarousel.classList.remove('carousel-active');

  const nextActiveCarousel = document.getElementById(`carousel-state__sensor-${currentIndex - 1 < 0 ? cities[0].list.length - 1 : currentIndex - 1}`);
  nextActiveCarousel.classList.remove('carousel-active');

  document.body.style.backgroundImage = `url(${currentCity.imgSrc})`;
  
  cities[0].list.map(city => city.active = false);
  currentCity.active = true;

  const todayInfoCity = document.getElementById('today-info__city');
  todayInfoCity.textContent = currentCity.name;

  const todayInfoWeatherStatus = document.getElementById('today-info__weather-status');
  todayInfoWeatherStatus.textContent = currentCity.weather.current.weather[0].description;

  const todayInfoCurrentTemp = document.getElementById('today-info__current-temp');
  todayInfoCurrentTemp.textContent = `${Math.round(currentCity.weather.current.temp)}°`;

  const todayInfoMinMaxTemp = document.getElementById('today-info__min-max-temp');
  todayInfoMinMaxTemp.textContent = `${Math.round(currentCity.weather.daily[0].temp.min)}°/${Math.round(currentCity.weather.daily[0].temp.max)}°`;

  const oldWeatherAppDaysWeek = document.getElementById('weather-app__days-week');
  oldWeatherAppDaysWeek.parentNode.removeChild(oldWeatherAppDaysWeek);

  const newWeatherAppDaysWeek = document.createElement('section');
  newWeatherAppDaysWeek.setAttribute('id', 'weather-app__days-week');

  for (let i = 0; i < currentCity.weather.daily.length - 1; i++) {
    const dayText = document.createElement('h4');
    dayText.setAttribute('class', 'day__text')
    dayText.textContent = getDay(i);

    const dayIcon = document.createElement('img');
    dayIcon.setAttribute('class', 'day-icon');
    dayIcon.setAttribute('src', `http://openweathermap.org/img/wn/${currentCity.weather.daily[i].weather[0].icon}@2x.png`);
    dayIcon.setAttribute('alt', 'day icon');

    const tempMinMax = document.createElement('span');
    tempMinMax.setAttribute('class', 'temp__min-max');
    tempMinMax.textContent = `${Math.round(currentCity.weather.daily[i].temp.min)}°/${Math.round(currentCity.weather.daily[i].temp.max)}°`;

    const dayInfo = document.createElement('div');
    dayInfo.setAttribute('class', 'day__info');
    dayInfo.appendChild(dayText);
    dayInfo.appendChild(dayIcon);
    dayInfo.appendChild(tempMinMax);

    newWeatherAppDaysWeek.appendChild(dayInfo);
  }

  const weatherApp = document.getElementById('weather-app');
  weatherApp.appendChild(newWeatherAppDaysWeek);

  const activeCarousel = document.getElementById(`carousel-state__sensor-${currentIndex}`);
  activeCarousel.classList.add('carousel-active');

  /* END */

}

const sliderRightHandler = () => {
  currentIndex--;
  if(currentIndex < 0) currentIndex = cities[0].list.length - 1;

  loadCurrentDayData();
}
const sliderLeftHandler = () => {
  currentIndex++;
  if(currentIndex === cities[0].list.length) currentIndex = 0;

  loadCurrentDayData();
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

    if (diff < -9) {
      sliderLeftHandler();
      diff = 0;
    } else if (diff > 9) {
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

const removeHandlers = () => {
  if (window.screen.width > 768) {
    window.removeEventListener("pointerdown", gestureStart);
    window.removeEventListener("pointermove", gestureMove);
    window.removeEventListener("pointerup", gestureEnd);
  }
}

window.addEventListener('resize', () => {
  removeHandlers();
  if (window.PointerEvent && window.screen.width < 768) {
    window.addEventListener("pointerdown", gestureStart);
  
    window.addEventListener("pointermove", gestureMove);
  
    window.addEventListener("pointerup", gestureEnd);
  }
});

const leftButtonHandler = document.getElementById('left-chevron');
leftButtonHandler.setAttribute('onclick', 'sliderRightHandler()');

const rightButtonHandler = document.getElementById('right-chevron');
rightButtonHandler.setAttribute('onclick', 'sliderLeftHandler()');
