import { addCar, deleteCar, driveCar, getCars, startCar, updateCar } from "./api"
import { carImageSprite } from "./assets/sprites"
import { store } from "./store"
import { ICarsGarage } from "./types"
import { animate, generate100Cars, req } from "./utils"

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
<button class="clear">DELETE ALL</button>
<button class="reset">RESET</button>
<button class="generate">GENERATE CARS</button>
<h1 class="garage-counter">Garage (${store.garageCount} cars)</h1>
<h2 class="garage-page">Page ${store.garagePage}</h2>
<div class="cars">
${renderAllCars()}
</div>
<button class="prev-garage">◄</button>
<button class="next-garage">►</button>`
}

export function renderCar(name: string, color: string, id: number) {
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
    <div class="racing-line ${id}">
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
      const cars = await getCars(store.garagePage)

      store.garageCount = cars.count
      garageCounter.innerHTML = `Garage (${store.garageCount} cars)`
    }
  })
}

export function listenCreateButton() {
  const createBtn = document.querySelector('.create__btn') as HTMLElement
  const createName = document.querySelector('.create__name') as HTMLInputElement
  const createColor = document.querySelector('.create__color') as HTMLInputElement
  const allCars = document.querySelector('.cars') as HTMLElement
  const garageCounter = document.querySelector('.garage-counter') as HTMLElement
  createBtn.addEventListener('click', async () => {
    const carsInPage = document.querySelectorAll('car')
    await addCar(createName.value, createColor.value)
    const carsApi = await getCars(store.garagePage)
    store.garageCount = carsApi.count
    garageCounter.innerHTML = `Garage (${store.garageCount} cars)`
    if (carsApi.count !== null && carsInPage.length <= 7) {
      allCars.innerHTML += `${await renderCar(createName.value, createColor.value, carsApi.items[carsApi.items.length - 1].id)}`
    }
  })
}

export function listenSelectUpdateButtons() {
  const selectBtns = document.querySelectorAll('.select')
  const updateName = document.querySelector('.update__name') as HTMLInputElement
  const updateColor = document.querySelector('.update__color') as HTMLInputElement
  const update = document.querySelector('.update__btn') as HTMLElement
  selectBtns.forEach(select => select.addEventListener('click', async () => {
    update.toggleAttribute('disabled')
    update.removeEventListener('click', selectClick)
    const currCar = document.getElementsByClassName(`car ${Number(select.className.split(' ')[1])}`)
    async function selectClick() {
      update.setAttribute('disabled', 'disabled')
      updateCar(updateName.value, updateColor.value, Number(select.className.split(' ')[1]))
      currCar[0].innerHTML = renderCar(updateName.value, updateColor.value, Number(select.className.split(' ')[1]))
      update.removeEventListener('click', selectClick)
      update.setAttribute('disabled', 'disabled')
    }
    if (!update.hasAttribute('disabled')) {
      update.addEventListener('click', selectClick)
    }
  }))
}

export function listenNextPageButton() {
  const next = document.querySelector('.next-garage') as HTMLElement
  const prev = document.querySelector('.prev-garage') as HTMLElement
  const allCars = document.querySelector('.cars') as HTMLElement
  const pageNum = document.querySelector('.garage-page') as HTMLElement
  next.addEventListener('click', async () => {
    let cars = await getCars(store.garagePage) as ICarsGarage
    const totalPages = Math.ceil(Number(cars.count) / 7)
    if (store.garagePage < totalPages) {
      cars = await getCars(store.garagePage += 1) as ICarsGarage
      pageNum.innerHTML = `Page ${store.garagePage}`
    } else {
      cars = await getCars(store.garagePage) as ICarsGarage
    }
    store.garageCars = cars.items
    allCars.innerHTML = renderAllCars()
    if (store.garagePage === totalPages) {
      next.setAttribute('disabled', 'disabled')
    }
    if (store.garagePage > 1) {
      prev.removeAttribute('disabled')
    }
    listenSelectUpdateButtons()
  })
}

export function listenPrevPageButton() {
  const next = document.querySelector('.next-garage') as HTMLElement
  const prev = document.querySelector('.prev-garage') as HTMLElement
  const allCars = document.querySelector('.cars') as HTMLElement
  const pageNum = document.querySelector('.garage-page') as HTMLElement
  if (store.garagePage === 1) {
    prev.setAttribute('disabled', 'disabled')
  }
  prev.addEventListener('click', async () => {
    let cars = await getCars(store.garagePage) as ICarsGarage
    const totalPages = Math.ceil(Number(cars.count) / 7)
    if (store.garagePage !== 1) {
      cars = await getCars(store.garagePage -= 1) as ICarsGarage
      pageNum.innerHTML = `Page ${store.garagePage}`
    } else {
      cars = await getCars(store.garagePage) as ICarsGarage
    }
    console.log(store.garagePage)
    store.garageCars = cars.items
    allCars.innerHTML = renderAllCars()
    if (store.garagePage === 1) {
      prev.setAttribute('disabled', 'disabled')
    }
    if (store.garagePage < totalPages) {
      next.removeAttribute('disabled')
    }
    listenSelectUpdateButtons()
  })
}

export function listenGenerateCarsButton() {
  const generate = document.querySelector('.generate') as HTMLElement
  generate.addEventListener('click', generate100Cars)
}

export function listenClearButton() {
  const clear = document.querySelector('.clear') as HTMLElement
  const allCars = document.querySelector('.cars') as HTMLElement
  const garageCounter = document.querySelector('.garage-counter') as HTMLElement
  clear.addEventListener('click', async () => {
    const carsNum = await getCars(undefined, 99999) as ICarsGarage
    for (let i = 0; i < Number(carsNum.count); i++) {
      const cars = await getCars(undefined, 99999) as ICarsGarage
      await deleteCar(carsNum.items[i].id)
      allCars.innerHTML = ''
      store.garageCount = cars.count
      garageCounter.innerHTML = `Garage (${store.garageCount} cars)`
    }
    garageCounter.innerHTML = `Garage (0 cars)`
  })
}

export function listenStartButton() {
  const startButtons = document.querySelectorAll('.start')
  startButtons.forEach(start => start.addEventListener('click', async () => {
    const id = Number(start.className.split(' ')[1])
    const currCar = <HTMLElement>document.getElementsByClassName(`car-img ${id}`)[0]
    const responseStart = await startCar(id)
    const travelTime = responseStart.distance / responseStart.velocity
    animate(0, currCar, travelTime)
    const responseDrive = await driveCar(id)

    if (responseDrive === undefined) {
      window.cancelAnimationFrame(req)
    }
  }))
}

export function listenRaceButton() {
  const race = document.querySelector('.race') as HTMLElement
  race.addEventListener('click', () => {
    const cars = document.querySelectorAll<HTMLElement>('.car-img')
    cars.forEach(async (car) => {
      const id = Number(car.className.split(' ')[2])
      const responseStart = await startCar(id)
      const travelTime = responseStart.distance / responseStart.velocity
      animate(0, car, travelTime)
      const responseDrive = await driveCar(id)
      if (responseDrive === undefined) {
        window.cancelAnimationFrame(req)
      }
    })
  })
}