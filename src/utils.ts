import { addCar, getCars } from "./api"
import { store } from "./store"
import { renderCar } from "./UI"

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
  for (let i = 0; i < 100; i++) {
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
}