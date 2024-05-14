import { StartedGameState } from '../worker/gameState';
import { PlantedGameGridCell } from '../worker/grid';
import { GameOutcome, ReceivedWorkerActions } from '../enums.ts';


export interface ReceivedWorkerMessage {
  action: ReceivedWorkerActions;
  value: any;
}

export interface ExceptionMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.ERROR;
  value: {
    message: string;
    name: string;
  };
}

export interface PlantStateChangedMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.PLANT_STATE_CHANGED;
  value: PlantedGameGridCell;
}

export interface BattleReadyStatusMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.BATTLE_READY_STATUS;
  value: boolean;
}

export interface GameStartedMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.GAME_STARTED;
  value: StartedGameState;
}

export interface ContinueableGameMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.CONTINUEABLE_GAME;
  value: StartedGameState;
}

export interface PlantPlantedMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.PLANT_PLANTED;
  value: {
    plantedCell: PlantedGameGridCell;
    gameState: StartedGameState;
  };
}

export interface PlantBoughtMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.PLANT_BOUGHT;
  value: StartedGameState;
}

export interface PlantSoldMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.PLANT_SOLD;
  value: StartedGameState;
}

export interface OpponentFoundMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.OPPONENT_FOUND;
  value: {
    self: StartedGameState;
    opponent: StartedGameState;
  };
}

export interface CellUnlockedMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.CELL_UNLOCKED;
  value: {
    gameState: StartedGameState;
  };
}

export interface DamageDealtMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.DEAL_DAMAGE;
  value: {
    cell: PlantedGameGridCell,
    damage: number,
    isSelf: boolean,
    newHealth: number
  };
}

export interface BattleEndedMessage extends ReceivedWorkerMessage {
  action: ReceivedWorkerActions.BATTLE_ENDED;
  value: {
    cellsUnlocked: number;
    outcome: GameOutcome;
    gameState: StartedGameState;
  };
}
