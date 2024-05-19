import { PlantAttributes, PlantGrowthState, PlantType } from './enums.ts';

export interface PlantStats {
  /**
   * The attack power of the plant
   */
  attack: number;
  /**
   * The attack speed of the plant in ms
   */
  speed: number;
  /**
   * Time in seconds for the whole growth cycle. If the time is not divisible by 2
   */
  growthTime: number;
  /**
   * How much cardboard the plant produces when harvested
   */
  harvestValue: number;
  /**
   * How much cardboard the plant costs to buy
   */
  cost: number;
}

export interface Plant {
  id: number;
  name: string;
  description: string;
  icon: string;
  cellImagesFolder: string;
  stats: PlantStats;
  type: PlantType;
  attributes: PlantAttributes[];
}

export interface PlantedPlant {
  plant: Plant;
  // Unix timestamp
  plantedAt: number;
  growthState: PlantGrowthState;
}
