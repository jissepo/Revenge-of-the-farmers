import { GameState } from '../types/worker/gameState';
import { getDefaultGameState } from '../shared/gameState';
import { GameGridCell } from '../types/worker/grid';
import { isStartedGameState } from '../shared/predicates';
import { calculateGridCellIndexForCell } from '../shared/grid';

let gameState: GameState = getDefaultGameState();

export const getCurrentGameState = (): GameState => {
  return gameState;
};

export const setGameState = (local: GameState) => {
  gameState = local;
};
export const updateGridCell = (newCell: GameGridCell) => {
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Trying to update cell on game not running');
  }
  const cellIndex = calculateGridCellIndexForCell(newCell);
  gameState.grid.cells.set(cellIndex, newCell);
};
