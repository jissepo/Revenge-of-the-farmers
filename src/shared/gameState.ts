import { NotStartedGameState } from '../types/worker/gameState';
import { GameStatus } from '../types/enums';

export const getDefaultGameState = (): NotStartedGameState => {
  return {
    status: GameStatus.NOT_STARTED,
  };
};
