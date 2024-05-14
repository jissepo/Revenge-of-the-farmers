import { Plant } from './plant';

export interface AvailablePlant extends Plant {
  quantity: number;
}

export interface GamePlayer {
  health: number;
  maxHealth: number;
  cardboard: number;
  availablePlants: AvailablePlant[];
}
