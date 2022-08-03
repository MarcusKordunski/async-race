import { addCar, deleteCar, getCars } from "./api"
import { carImageSprite } from "./assets/sprites"
import { store } from "./store"

export function render() {
  const html = `<button class="to-garage" disabled>TO GARAGE</button>
  <button class="to-winners">TO WINNERS</button>

  <div class="garage active">
  ${renderGarage()}
  </div>

  <div class="winners">
  ${renderWinners()}
  </div>`

  const root = document.createElement('div')
  root.innerHTML = html
  document.body.appendChild(root)
  root.classList.add('root')
}

function renderGarage() {
  return `<div class="create">
 <input class="create__name" type="text">
 <input class="create__color" type="color">
 <button class="create__btn">CREATE</button>
</div>
<div class="update">
 <input class="update__name" type="text">
 <input class="update__color" type="color">
 <button class="update__btn" disabled>UPDATE</button>
</div>
<button class="race">RACE</button>
<button class="reset">RESET</button>
<button class="generate">GENERATE CARS</button>
<h1 class="garage-counter">Garage (${store.garageCount} cars)</h1>
<h2>Page ${store.garagePage}</h2>
<div class="cars">
${renderAllCars()}
</div>
<button class="prev-garage">◄</button>
<button class="next-garage">►</button>`
}

function renderCar(name: string, color: string, id: number) {
  return `
  <div class="car ${id}">
    <div>
      <button class="select ${id}">SELECT</button>
      <button class="remove ${id}" >REMOVE</button>
      <span><b>${name}</b></span>
    </div>

    <div>
      <button class="start ${id}">A</button>
      <button class="break ${id}">B</button>
    </div>
    <div class="racing-line">
        <div class="car-img car-img ${id}">
          ${carImageSprite(color)}
        </div>
        <img class="finish-img"  width="100" src="https://www.svgrepo.com/show/210077/finish.svg" alt="finish">
    </div>
  </div>
  `
}

function renderAllCars() {
  const cars = store.garageCars.map((car) => renderCar(car.name, car.color, car.id))
  return cars.join(' ')
}

console.log(store.garageCars)

function renderWinners() {
  return `<h1>Winners (${store.winnersCount} cars)</h1>
  <h2>Page ${store.winnersPage}</h2>
  <table>
    <thead>
      <tr>
        <th>Number</th>
        <th>Car</th>
        <th>Name</th>
        <th>Wins</th>
        <th>Best time</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
  <button class="prev-winners">◄</button>
  <button class="next-winners">►</button>`
}

export function listenViewButtons() {
  const toGarage = document.querySelector('.to-garage') as HTMLElement
  const toWinners = document.querySelector('.to-winners') as HTMLElement
  const winners = document.querySelector('.garage') as HTMLElement
  const garage = document.querySelector('.winners') as HTMLElement
  toGarage.addEventListener('click', () => {
    if (!toGarage.hasAttribute('disabled')) {
      toGarage.setAttribute('disabled', 'disabled')
      toWinners.removeAttribute('disabled')
      garage.classList.toggle('active')
      winners.classList.toggle('active')
    }
  })

  toWinners.addEventListener('click', () => {
    if (!toWinners.hasAttribute('disabled')) {
      toWinners.setAttribute('disabled', 'disabled')
      toGarage.removeAttribute('disabled')
      winners.classList.toggle('active')
      garage.classList.toggle('active')
    }
  })
}

export function listenRemoveButton() {
  document.addEventListener('click', async (e) => {
    const el = e.target as HTMLElement
    if (el.className.includes('remove')) {
      const carId = Number(el.className.split(' ')[1])
      await deleteCar(carId)
      const car = document.getElementsByClassName(`car ${carId}`)
      car[0].remove()
      const garageCounter = document.querySelector('.garage-counter') as HTMLElement
      const cars = await getCars(1)

      store.garageCount = cars.count
      console.log(store.garageCount)
      garageCounter.innerHTML = `Garage (${store.garageCount} cars)`
    }
  })
}

export function listenCreateButton() {
  const createBtn = document.querySelector('.create__btn') as HTMLElement
  const createName = document.querySelector('.create__name') as HTMLInputElement
  const createColor = document.querySelector('.create__color') as HTMLInputElement
  // const cars = document.querySelector('.cars') as HTMLElement
  createBtn.addEventListener('click', () => {
    addCar(createName.value, createColor.value)
    // const car = document.createElement('div')
    // cars.appendChild()
  })
}