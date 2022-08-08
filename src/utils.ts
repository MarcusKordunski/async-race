import { addCar, getCars } from "./api"
import { store } from "./store"
import { renderCar } from "./UI"
export let req = 0

const brands = [
  'Volkswagen',
  'Tesla',
  'Renault',
  'Bugatti',
  'Zhiguli',
  'Lexus',
  'Nissan',
  'Toyota',
  'Honda',
  'BMW',
  'Kia',
  'Audi',
  'Ford',
  'Skoda',
  'Aston Martin',
  'Chevrolet',
  'Maserati',
  'Mazda',
  'Mercedes-Benz',
  'Porsche',
  'Volvo',
  'Lada',
  'Rolls-Royce',
  'Mitsubishi',
  'Land Rover',
  'Dodge',
  'Bentley',
  'Jeep'
]

const models = [
  'Express',
  'A8',
  'ILX',
  'Suburban',
  'X6',
  'Z4',
  'XT4',
  'Challenger',
  'Explorer',
  'F-250',
  'G70',
  'HR-V',
  'Pilot',
  'K5',
  'LC',
  'CX-50',
  'S-Class',
  '3500',
  'Model 3',
  'Supra',
  'Tundra',
  'V60',
  'Canyon',
  'Terrain',
  'Odyssey',
  'Accent',
  'Q570',
  'LRT'
]

export async function generate100Cars() {
  const clear = document.querySelector('.clear') as HTMLElement
  const generate = document.querySelector('.generate') as HTMLElement
  const race = document.querySelector('.race') as HTMLElement
  for (let i = 0; i < 100; i++) {
    if (i === 7) {
      raceBtnLock()
    }
    clear.setAttribute('disabled', 'disabled')
    generate.setAttribute('disabled', 'disabled')
    race.setAttribute('disabled', 'disabled')
    const randomIndex1 = Math.floor(Math.random() * 28)
    const randomIndex2 = Math.floor(Math.random() * 28)
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    const randomCarName = `${brands[randomIndex1]} ${models[randomIndex2]}`
    addCar(randomCarName, randomColor)

    const allCars = document.querySelector('.cars') as HTMLElement
    const garageCounter = document.querySelector('.garage-counter') as HTMLElement
    const carsInPage = document.querySelectorAll('.car')
    console.log(carsInPage.length)
    const carsApi = await getCars(store.garagePage)
    store.garageCount = carsApi.count
    garageCounter.innerHTML = `Garage (${store.garageCount} cars)`
    if (carsInPage.length < 7) {
      allCars.innerHTML += `${renderCar(randomCarName, randomColor, carsApi.items[carsApi.items.length - 1].id)}`
    }
  }
  clear.removeAttribute('disabled')
  generate.removeAttribute('disabled')
  race.removeAttribute('disabled')
}

export function animate(timeFraction: number, element: HTMLElement, duration: number) {

  const start = performance.now()

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) {
      timeFraction = 1
    }

    draw(timeFraction ** 5, element)
    if (timeFraction < 1) {
      req = requestAnimationFrame(animate)
    }

  })
}

function draw(timeFraction: number, element: HTMLElement) {
  const winner = document.querySelector('.show-winner') as HTMLElement
  winner.style.display = 'none'
  element.style.position = 'absolute'
  turnButtons('off')
  element.style.left = `calc((${timeFraction * 100}%) + 13px - ${timeFraction}*120px)`
  if (timeFraction >= 1) {
    winner.style.display = 'inline-block'
    turnButtons('on')
  }
}

export function turnButtons(flag: 'on' | 'off') {
  const btnArr = []
  btnArr.push(document.querySelector('.create__btn'))
  btnArr.push(document.querySelector('.update__btn'))
  btnArr.push(document.querySelector('.race'))
  btnArr.push(document.querySelector('.clear'))
  btnArr.push(document.querySelector('.reset'))
  btnArr.push(document.querySelector('.generate'))
  document.querySelectorAll('.select').forEach(item => btnArr.push(item))
  document.querySelectorAll('.remove').forEach(item => btnArr.push(item))
  document.querySelectorAll('.start').forEach(item => btnArr.push(item))
  btnArr.forEach(item => {
    if (flag === 'off' && item) {
      item.setAttribute('disabled', 'disabled')
    } else if (item) {
      item.removeAttribute('disabled')
    }
  })
}

export function raceBtnLock() {
  const cars = document.querySelectorAll('.car')
  const race = document.querySelector('.race') as HTMLElement
  if (cars.length === 0) {
    race.setAttribute('disabled', 'disabled')
  } else {
    race.removeAttribute('disabled')
  }
}