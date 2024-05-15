import { PlantedPlant } from '../plant';

interface BaseGameGridCellCoordinates {
  x: number;
  y: number;
}

interface BaseGameGridCell extends BaseGameGridCellCoordinates {
  canBeUnlocked: boolean;
  hasBeenUnlocked: boolean;
}

export interface UnPlantedGameGridCell extends BaseGameGridCell {
  hasPlant: false;
}

export interface PlantedGameGridCell extends BaseGameGridCell {
  hasPlant: true;
  plant: PlantedPlant;
}

export type GameGridCell = UnPlantedGameGridCell | PlantedGameGridCell;

export interface GameGrid {
  unlockableCellsCount: number;
  cells: Record<number, GameGridCell>;
}
