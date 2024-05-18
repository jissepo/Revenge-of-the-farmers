import {
  BuyPlantMessage,
  PlantPlantMessage,
  SellPlantMessage,
  SendableWorkerMessage,
  UnlockCellMessage,
} from '../../types/worker/worker';
import {
  BattleReadyStatusMessage,
  CellUnlockedMessage,
  GameStartedMessage,
  OpponentFoundMessage,
  PlantBoughtMessage,
  PlantPlantedMessage,
  PlantSoldMessage,
  PlantStateChangedMessage,
  ReceivedWorkerMessage,
} from '../../types/client/worker';
import {
  GameStatus,
  PlantGrowthState,
  ReceivedWorkerActions,
  SendableWorkerActions,
} from '../../types/enums';
import { StartedGameState } from '../../types/worker/gameState';
import { generateGameGrid, setUnlockableCells } from './grid';
import { getGameState, updateGameState } from './helpers/gameState';
import { PlantedPlant } from '../../types/plant';
import { GameGridCell, PlantedGameGridCell } from '../../types/worker/grid';
import { sendMessageToAllConnectedPorts } from './helpers/messenger';
import data from '../../data';
import { calculateGridCellIndexForCell } from '../../shared/grid';
import { isStartedGameState } from '../../shared/predicates';
import { removeCellAttackInterval, setLocalSelf, setOpponent, startBattle } from './battleHandler';

export const handleGameEvent = async (data: SendableWorkerMessage): Promise<ReceivedWorkerMessage | void> => {
  switch ( data.action ) {
    case SendableWorkerActions.START_GAME:
      return startGame();
    case SendableWorkerActions.CONTINUE_GAME:
      return continueGame();
    case SendableWorkerActions.PLANT_PLANT:
      return plantPlant(data.value);
    case SendableWorkerActions.BUY_PLANT:
      return buyPlant(data.value);
    case SendableWorkerActions.SELL_PLANT:
      return sellPlant(data.value);
    case SendableWorkerActions.FIND_OPPONENT:
      return findOpponent();
    case SendableWorkerActions.START_BATTLE:
      return startBattle();
    case SendableWorkerActions.UNLOCK_CELL:
      return unlockCell(data.value);
    default:
      throw new Error(`Unknown action: ${ data.action }`);
  }
};

const handleGameTick = async () => {
  const gameState = await getGameState();
  if ( gameState.status !== GameStatus.STARTED ) {
    return;
  }
  const currentTime = new Date().getTime();
  const newGrid: Record<number, GameGridCell> = {};
  let hasAnyPlantChanged = false;
  Object.values(gameState.grid.cells).forEach((cell, index) => {
    if ( cell.hasPlant ) {
      const plant = cell.plant;
      const growthDurationPassed = currentTime - plant.plantedAt;
      let newPlant: PlantedPlant | undefined = undefined;
      if ( plant.growthState === PlantGrowthState.SEED && growthDurationPassed >= Math.floor(plant.plant.stats.growthTime / 2 * 1000) ) {
        newPlant = {
          ...plant,
          growthState: PlantGrowthState.GROWING,
        };
      } else if ( plant.growthState === PlantGrowthState.GROWING && growthDurationPassed >= plant.plant.stats.growthTime * 1000 ) {
        newPlant = {
          ...plant,
          growthState: PlantGrowthState.READY,
        };
      }

      if ( newPlant ) {
        hasAnyPlantChanged = true;
        const plantedPlantCell: PlantedGameGridCell = {
          ...cell,
          plant: newPlant,
        };
        newGrid[index] = plantedPlantCell;
        const plantStateChangedMessage: PlantStateChangedMessage = {
          action: ReceivedWorkerActions.PLANT_STATE_CHANGED,
          value: plantedPlantCell,
        };
        sendMessageToAllConnectedPorts(plantStateChangedMessage);

        return;
      }
    }
    newGrid[index] = cell;
  });

  gameState.grid.cells = newGrid;
  await updateGameState(gameState);

  let allPlantsReady = true;
  Object.values(gameState.grid.cells).forEach((cell) => {
    if ( cell.hasPlant && cell.plant.growthState !== PlantGrowthState.READY ) {
      allPlantsReady = false;
    }
  });
  if ( allPlantsReady && hasAnyPlantChanged ) {
    const allPlantsReadyMessage: BattleReadyStatusMessage = {
      action: ReceivedWorkerActions.BATTLE_READY_STATUS,
      value: true,
    };
    sendMessageToAllConnectedPorts(allPlantsReadyMessage);
  }
};

const startGame = async (): Promise<GameStartedMessage> => {

  const gameStartedState: StartedGameState = {
    status: GameStatus.STARTED,
    grid: generateGameGrid(),
    player: {
      health: 100,
      maxHealth: 100,
      cardboard: 15,
      availablePlants: [],
    },
    battleStats: {
      currentRound: 1,
      livesLeft: 10,
      roundsWon: 0,
    },
  };
  for ( let i = 0; i < 3; i++ ) {
    const randomPlant = data.plants[Math.floor(Math.random() * data.plants.length)];
    const index = gameStartedState.player.availablePlants.findIndex((plant) => plant.name === randomPlant.name);
    if ( index !== -1 ) {
      gameStartedState.player.availablePlants[index].quantity += 1;
    } else {
      gameStartedState.player.availablePlants.push({ ...randomPlant, quantity: 1 });
    }
  }
  await updateGameState(gameStartedState);

  setInterval(handleGameTick, 1000);

  return {
    action: ReceivedWorkerActions.GAME_STARTED,
    value: gameStartedState,
  };
};

const continueGame = async (): Promise<GameStartedMessage> => {

  const gameStartedState = await getGameState();
  if ( !isStartedGameState(gameStartedState) ) {
    throw new Error('Game is not in started state');
  }
  setInterval(handleGameTick, 1000);

  return {
    action: ReceivedWorkerActions.GAME_STARTED,
    value: gameStartedState,
  };
};

const plantPlant = async (messageValue: PlantPlantMessage['value']): Promise<PlantPlantedMessage> => {
  const gameState = await getGameState();
  console.debug('Plant plant', gameState, messageValue);
  if ( gameState.status !== GameStatus.STARTED ) {
    throw new Error('Game is not started');
  }
  const cellIndex = calculateGridCellIndexForCell(messageValue.cell);
  const cell = gameState.grid.cells[cellIndex];
  if ( !cell ) {
    throw new Error('Invalid cell index');
  }
  if ( !cell.hasBeenUnlocked ) {
    throw new Error('Cell has not been unlocked');
  }

  const plantedPlant: PlantedPlant = {
    growthState: PlantGrowthState.SEED,
    plant: messageValue.plant,
    plantedAt: new Date().getTime(),
  };

  const plantedCell: PlantedGameGridCell = {
    ...cell,
    hasPlant: true,
    plant: plantedPlant,
  };
  gameState.grid.cells[cellIndex] = plantedCell;

  const plantIndex = gameState.player.availablePlants.findIndex((plant) => plant.name === messageValue.plant.name);
  if ( plantIndex === -1 ) {
    throw new Error('Plant not found');
  }
  gameState.player.availablePlants[plantIndex].quantity--;
  if ( gameState.player.availablePlants[plantIndex].quantity < 0 ) {
    throw new Error('Ain\'t nobody got plant for that');
  }

  await updateGameState(gameState);

  const allPlantsReadyMessage: BattleReadyStatusMessage = {
    action: ReceivedWorkerActions.BATTLE_READY_STATUS,
    value: false,
  };
  sendMessageToAllConnectedPorts(allPlantsReadyMessage);

  return {
    action: ReceivedWorkerActions.PLANT_PLANTED,
    value: { plantedCell, gameState },
  };
};

const buyPlant = async (messageValue: BuyPlantMessage['value']): Promise<PlantBoughtMessage> => {
  const gameState = await getGameState();
  console.debug('Buy plant', gameState, messageValue);
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game is not started');
  }
  const boughtPlant = data.plants.find(plant => plant.name === messageValue.plant.name);
  if ( !boughtPlant ) {
    throw new Error('Plant not found');
  }

  if ( gameState.player.cardboard < boughtPlant.stats.cost ) {
    throw new Error('Not enough cardboard');
  }

  const existingPlantIndex = gameState.player.availablePlants.findIndex((plant) => plant.name === boughtPlant.name);
  if ( existingPlantIndex !== -1 ) {
    gameState.player.availablePlants[existingPlantIndex].quantity++;
  } else {
    gameState.player.availablePlants.push({
      ...boughtPlant,
      quantity: 1,
    });
  }
  gameState.player.cardboard -= boughtPlant.stats.cost;

  await updateGameState(gameState);
  return {
    action: ReceivedWorkerActions.PLANT_BOUGHT,
    value: gameState,
  };
};
const sellPlant = async (messageValue: SellPlantMessage['value']): Promise<PlantSoldMessage> => {
  const gameState = await getGameState();
  console.debug('Buy plant', gameState, messageValue);
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game is not started');
  }
  const gridCell = gameState.grid.cells[messageValue.cellIndex];
  if ( !gridCell ) {
    throw new Error('Cell not found');
  }
  if ( !gridCell.hasPlant ) {
    throw new Error('Cell has no plant');
  }
  gameState.grid.cells[messageValue.cellIndex] = {
    hasPlant: false,
    canBeUnlocked: gridCell.canBeUnlocked,
    hasBeenUnlocked: gridCell.hasBeenUnlocked,
    x: gridCell.x,
    y: gridCell.y,
  };
  gameState.player.cardboard += gridCell.plant.plant.stats.harvestValue;

  removeCellAttackInterval(gridCell, true);
  await updateGameState(gameState);
  return {
    action: ReceivedWorkerActions.PLANT_SOLD,
    value: gameState,
  };
};

const findOpponent = async (): Promise<OpponentFoundMessage> => {
  const gameState = await getGameState();
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game is not in active state');
  }

  // TODO: Find opponent
  const self = gameState;

  const findOpponentRes = await fetch(import.meta.env.VITE_API_URL + '/gamestate?round=' + gameState.battleStats.currentRound);

  await fetch(import.meta.env.VITE_API_URL + '/gamestate', {
    body: JSON.stringify(self),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const opponent = ( await findOpponentRes.json() ).opponent ?? gameState;

  setOpponent(opponent);
  // setOpponent(self);
  setLocalSelf(self);

  return {
    action: ReceivedWorkerActions.OPPONENT_FOUND,
    value: {
      self,
      opponent,
    },
  };
};


export const unlockCell = async (value: UnlockCellMessage['value']): Promise<CellUnlockedMessage> => {
  const gameState = await getGameState();
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game not in started state');
  }

  if ( !gameState.grid.unlockableCellsCount ) {
    throw new Error('Cannot unlock cells atm!');
  }

  const cellIndex = calculateGridCellIndexForCell(value.cell);
  const gridCell = gameState.grid.cells[cellIndex];

  if ( !gridCell ) {
    throw new Error('Cell not found');
  }

  gridCell.hasBeenUnlocked = true;
  gameState.grid.cells[cellIndex] = gridCell;
  gameState.grid.unlockableCellsCount -= 1;

  gameState.grid = setUnlockableCells(gameState.grid);

  await updateGameState(gameState);

  return {
    action: ReceivedWorkerActions.CELL_UNLOCKED,
    value: {
      gameState,
    },
  };
};
