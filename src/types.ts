export interface ICarsGarage {
  count: string | null;
  items: ICarGarage[]
}

interface ICarGarage {
  name: string;
  color: string;
  id: number;
}

export interface ICarsWinners {
  count: string | null;
  items: ICarWinner[]
}

interface ICarWinner {
  id: number;
  wins: number;
  time: number;
}