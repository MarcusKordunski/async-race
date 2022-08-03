import { getCars, getWinners } from "./api"

const { items: garageCars, count: garageCount } = await getCars(1)
const { items: winnersCars, count: winnersCount } = await getWinners(1)

export const store = {
  garagePage: 1,
  garageCount,
  garageCars,
  winnersPage: 1,
  winnersCount,
  winnersCars,
}