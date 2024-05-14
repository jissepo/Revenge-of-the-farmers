import { GameGrid } from './grid';
import { GamePlayer } from '../player';
import { GameOutcome, GameStatus } from '../enums.ts';

export interface NotStartedGameState {
  status: GameStatus.NOT_STARTED;
}

export interface StartedGameState {
  status: GameStatus.STARTED;
  grid: GameGrid;
  player: GamePlayer;
  battleStats: {
    livesLeft: number;
    roundsWon: number;
    currentRound: number;
  };
}

export interface EndedGameState {
  status: GameStatus.ENDED;
  outcome: GameOutcome;
}

export type GameState = NotStartedGameState | StartedGameState | EndedGameState;
