// import { store } from "./store"
import { ICarsGarage, ICarsWinners } from "./types"

const base = 'http://127.0.0.1:3000'

const garage = `${base}/garage`
const winners = `${base}/winners`

export async function getCars(page: number, limit = 7): Promise<ICarsGarage> {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`)
  return {
    items: await response.json(),
    count: await response.headers.get('X-Total-Count')
  }
}

export async function getWinners(page: number, limit = 10, sort = 'id', order = 'asc'): Promise<ICarsWinners> {
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
  // const winnersArr = store.winnersCars.filter(car => car.id === id)
  // if (winnersArr.length === 1) {
  //   await fetch(`${winners}/${id}`, {
  //     method: 'DELETE'
  //   })
  // }
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