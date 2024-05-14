import { GameGridCell } from './grid';
import { Plant } from '../plant';
import { SendableWorkerActions } from '../enums.ts';
import { StartedGameState } from './gameState';

export interface SendableWorkerMessage {
  action: SendableWorkerActions;
  value?: any;
}

export interface StartGameMessage extends Omit<SendableWorkerMessage, 'value'> {
  action: SendableWorkerActions.START_GAME;
}

export interface ContinueGameMessage extends Omit<SendableWorkerMessage, 'value'> {
  action: SendableWorkerActions.CONTINUE_GAME;
}

export interface FindOpponentMessage extends Omit<SendableWorkerMessage, 'value'> {
  action: SendableWorkerActions.FIND_OPPONENT;
}

export interface StartBattleMessage extends Omit<SendableWorkerMessage, 'value'> {
  action: SendableWorkerActions.START_BATTLE;
}

export interface PlantPlantMessage extends SendableWorkerMessage {
  action: SendableWorkerActions.PLANT_PLANT;
  value: {
    plant: Plant;
    cell: GameGridCell;
  };
}

export interface BuyPlantMessage extends SendableWorkerMessage {
  action: SendableWorkerActions.BUY_PLANT;
  value: {
    plant: Plant;
  };
}

export interface SellPlantMessage extends SendableWorkerMessage {
  action: SendableWorkerActions.SELL_PLANT;
  value: {
    cellIndex: number;
  };
}

export interface UnlockCellMessage extends SendableWorkerMessage {
  action: SendableWorkerActions.UNLOCK_CELL;
  value: {
    cell: GameGridCell;
  };
}
