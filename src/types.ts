export interface ICarsGarage {
  count: string | null;
  items: {
    [key: number]: {
      name: string;
      color: string;
      id: number;
    }
  }
}

export interface ICarsWinners {
  count: string | null;
  items: {
    [key: number]: {
      id: number;
      wins: number;
      time: number;
    }
  }
}