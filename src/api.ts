// import { store } from "./store"
import { ICarParams, ICarsGarage, ICarsWinners } from "./types"

const base = 'http://127.0.0.1:3000'

const garage = `${base}/garage`
const winners = `${base}/winners`
const engine = `${base}/engine`

export async function getCars(page?: number, limit = 7): Promise<ICarsGarage> {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`)
  return {
    items: await response.json(),
    count: await response.headers.get('X-Total-Count')
  }
}

export async function getWinners(page: number, limit = 10, sort = 'id', order = 'ASC'): Promise<ICarsWinners> {
  const response = await fetch(`${winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_ordr=${order}`)
  return {
    items: await response.json(),
    count: await response.headers.get('X-Total-Count')
  }
}

export async function deleteCar(id: number) {
  await fetch(`${garage}/${id}`, {
    method: 'DELETE'
  })
  const winnersArr = await getWinners(1, 99)
  const winnerById = winnersArr.items.filter(car => car.id === id)
  if (winnerById.length === 1) {
    await fetch(`${winners}/${id}`, {
      method: 'DELETE'
    })
  }
}

export async function addCar(name: string, color: string) {
  await fetch(`${garage}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      color: color,
    })
  })
}

export async function updateCar(name: string, color: string, id: number) {
  await fetch(`${garage}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      color: color,
    })
  })
}

export async function startCar(id: number, status = 'started'): Promise<ICarParams> {
  const response = await fetch(`${engine}?id=${id}&status=${status}`, {
    method: 'PATCH',
  })
  return await response.json()
}

export async function driveCar(id: number, status = 'drive') {
  const response = await fetch(`${engine}?id=${id}&status=${status}`, {
    method: 'PATCH',
  })
  if (!response.ok) {
    await console.log(await response.text())
  } else {
    return await response.json()
  }
}

export async function stopCar(id: number, status = 'stopped') {
  const response = await fetch(`${engine}?id=${id}&status=${status}`, {
    method: 'PATCH',
  })
  return response
}

export async function addWinner(id: number, wins: number, time: number) {
  const response = await fetch(`${winners}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      wins: wins,
      time: time,
    })
  })
  const cars = await getWinners(1, 999)
  if (!response.ok) {
    if (cars.items.filter(item => item.id === id)[0].time < time) {
      patchWinner(id, cars.items.filter(item => item.id === id)[0].wins + wins)
    }
    putWinner(id, cars.items.filter(item => item.id === id)[0].wins + wins, time)
  }
}

export async function putWinner(id: number, wins: number, time: number) {
  const response = await fetch(`${winners}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wins: wins,
      time: time,
    })
  })
  return await response.json()
}

export async function patchWinner(id: number, wins: number) {
  const response = await fetch(`${winners}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wins: wins,
    })
  })
  return await response.json()
}
