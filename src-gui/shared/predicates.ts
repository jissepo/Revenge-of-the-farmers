import {
  BattleEndedMessage,
  BattleReadyStatusMessage,
  CellUnlockedMessage,
  ContinueableGameMessage,
  DamageDealtMessage,
  GameStartedMessage,
  OpponentFoundMessage,
  PlantBoughtMessage,
  PlantPlantedMessage,
  PlantSoldMessage,
  PlantStateChangedMessage,
} from '../types/client/worker';
import { GameStatus, ReceivedWorkerActions } from '../types/enums';
import { GameState, StartedGameState } from '../types/worker/gameState';
import { Plant } from '../types/plant';
import { AvailablePlant } from '../types/player';


export const isStartedGameState = (gameState: GameState|null): gameState is StartedGameState => {
  return gameState?.status === GameStatus.STARTED;
};
export const targetIsHTMLElement = (target: EventTarget | null): target is HTMLElement => {
  return target instanceof HTMLElement;
};

export const isPlantStateChangeMessageEvent = (event: MessageEvent): event is MessageEvent<PlantStateChangedMessage> => {
  return event.data.action === ReceivedWorkerActions.PLANT_STATE_CHANGED;
};
export const isBattleReadyMessageEvent = (event: MessageEvent): event is MessageEvent<BattleReadyStatusMessage> => {
  return event.data.action === ReceivedWorkerActions.BATTLE_READY_STATUS;
};
export const isOpponentFoundMessageEvent = (event: MessageEvent): event is MessageEvent<OpponentFoundMessage> => {
  return event.data.action === ReceivedWorkerActions.OPPONENT_FOUND;
};
export const isDamageDealtMessageEvent = (event: MessageEvent): event is MessageEvent<DamageDealtMessage> => {
  return event.data.action === ReceivedWorkerActions.DEAL_DAMAGE;
};
export const isBattleEndedMessageEvent = (event: MessageEvent): event is MessageEvent<BattleEndedMessage> => {
  return event.data.action === ReceivedWorkerActions.BATTLE_ENDED;
};
export const isCellUnlockedMessageEvent = (event: MessageEvent): event is MessageEvent<CellUnlockedMessage> => {
  return event.data.action === ReceivedWorkerActions.CELL_UNLOCKED;
};

export const isGameStartedMessageEvent = (event: MessageEvent): event is MessageEvent<GameStartedMessage> => {
  return event.data.action === ReceivedWorkerActions.GAME_STARTED;
};

export const isContinuableGameMessageEvent = (event: MessageEvent): event is MessageEvent<ContinueableGameMessage> => {
  return event.data.action === ReceivedWorkerActions.CONTINUEABLE_GAME;
};

export const isPlantPlantedMessageEvent = (event: MessageEvent): event is MessageEvent<PlantPlantedMessage> => {
  return event.data.action === ReceivedWorkerActions.PLANT_PLANTED;
};

export const isPlantBoughtMessageEvent = (event: MessageEvent): event is MessageEvent<PlantBoughtMessage> => {
  return event.data.action === ReceivedWorkerActions.PLANT_BOUGHT;
};
export const isPlantSoldMessageEvent = (event: MessageEvent): event is MessageEvent<PlantSoldMessage> => {
  return event.data.action === ReceivedWorkerActions.PLANT_SOLD;
};
export const isAvailablePlant = (plant: Plant | AvailablePlant): plant is AvailablePlant => {
  return ( plant as AvailablePlant ).quantity !== undefined;
};

