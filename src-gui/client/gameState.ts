import { GameState } from '../types/worker/gameState';
import { getDefaultGameState } from '../shared/gameState';
import { GameGridCell } from '../types/worker/grid';
import { isStartedGameState } from '../shared/predicates';
import { calculateGridCellIndexForCell } from '../shared/grid';
import { HudState } from '../types/enums';

let gameState: GameState = getDefaultGameState();
let hudState: HudState = HudState.MENU;

export const getCurrentGameState = (): GameState => {
  return gameState;
};
export const getCurrentHudState = (): HudState => {
  return hudState;
};

export const setGameState = (local: GameState) => {
  gameState = local;
};

export const setHudState = (local: HudState) => {
  hudState = local;
};
export const updateGridCell = (newCell: GameGridCell) => {
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Trying to update cell on game not running');
  }
  const cellIndex = calculateGridCellIndexForCell(newCell);
  gameState.grid.cells[cellIndex] = newCell;
};
