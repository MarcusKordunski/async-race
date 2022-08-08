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

export interface ICarParams {
  velocity: number;
  distance: 500000;
}

export interface IBestTime {
  name: string;
  time: number;
  id: number;
}