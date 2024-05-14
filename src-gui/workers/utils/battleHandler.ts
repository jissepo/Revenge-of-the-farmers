import { StartedGameState } from '../../types/worker/gameState';
import { getGameState, updateGameState } from './helpers/gameState';
import { GameGridCell, PlantedGameGridCell } from '../../types/worker/grid';
import { isStartedGameState } from '../../client/predicates';
import { sendMessageToAllConnectedPorts } from './helpers/messenger';
import { GameOutcome, ReceivedWorkerActions } from '../../types/enums';
import { BattleEndedMessage, DamageDealtMessage } from '../../types/client/worker';
import { calculateGridCellIndexForCell } from '../../shared/grid';

let opponent: StartedGameState | null = null;
let localSelf: StartedGameState | null = null;
let isFighting = false;

export const setOpponent = (opponentState: StartedGameState) => {
  opponent = { ...opponentState };
};

export const setLocalSelf = (selfState: StartedGameState) => {
  localSelf = { ...selfState };
};

const cellIntervals: Record<'self' | 'opponent', Record<number, NodeJS.Timeout>> = {
  self: {},
  opponent: {},
};

const addCellAttackInterval = (cell: PlantedGameGridCell, interval: NodeJS.Timeout, isSelf: boolean) => {
  const cellIndex = calculateGridCellIndexForCell(cell);
  cellIntervals[isSelf ? 'self' : 'opponent'][cellIndex] = interval;
};
export const removeCellAttackInterval = (cell: GameGridCell, isSelf: boolean) => {
  const cellIndex = calculateGridCellIndexForCell(cell);
  const objectKey = isSelf ? 'self' : 'opponent';
  console.log('remove', objectKey, cellIndex, cellIntervals[objectKey]);
  if ( cellIntervals[objectKey][cellIndex] ) {
    clearInterval(cellIntervals[objectKey][cellIndex]);
    delete cellIntervals[objectKey][cellIndex];
  }
};

export const startBattle = async () => {
  if ( !opponent ) {
    throw new Error('Trying to start battle without opponent');
  }

  if ( !isStartedGameState(localSelf) || !isStartedGameState(opponent) ) {
    throw new Error('Trying to start battle with invalid game state');
  }
  isFighting = true;
  const cellHandler = (cell: PlantedGameGridCell, isSelf: boolean) => {
    const battleCellInterval = setInterval(
      async () => {
        if ( !isFighting ) {
          return;
        }
        const otherPlayer = isSelf ? opponent : localSelf;
        console.log('Interval', cell, isSelf, localSelf.player.health, otherPlayer.player.health);
        await handleDealDamage(cell, isSelf, otherPlayer);
      },
      cell.plant.plant.stats.speed,
    );
    addCellAttackInterval(cell, battleCellInterval, isSelf);
  };
  // Start battle intervals
  localSelf.grid.cells.forEach((cell) => {
    if ( cell.hasPlant ) {
      cellHandler(cell, true);
    }
  });
  opponent.grid.cells.forEach((cell) => {
    if ( cell.hasPlant ) {
      cellHandler(cell, false);
    }
  });
};

const clearAllIntervals = () => {
  localSelf.grid.cells.forEach((cell) => {
    removeCellAttackInterval(cell, true);
  });
  opponent.grid.cells.forEach((cell) => {
    removeCellAttackInterval(cell, false);
  });
};

const handleDealDamage = async (cell: PlantedGameGridCell, isSelf: boolean, otherPlayer: StartedGameState) => {

  if ( !isFighting ) {
    return;
  }
  const damage = cell.plant.plant.stats.attack;
  otherPlayer.player.health -= damage;
  console.debug(`Dealt ${ damage } damage to ${ otherPlayer.player.health }`);

  if ( !isSelf ) {
    setLocalSelf(otherPlayer);
  } else {
    setOpponent(otherPlayer);
  }

  const dealDamageMessage: DamageDealtMessage = {
    action: ReceivedWorkerActions.DEAL_DAMAGE,
    value: {
      cell,
      damage,
      isSelf,
      newHealth: otherPlayer.player.health,
    },
  };
  sendMessageToAllConnectedPorts(dealDamageMessage);


  if ( otherPlayer.player.health <= 0 ) {
    console.debug('Player is dead', isSelf);
    clearAllIntervals();
    isFighting = false;
    opponent = null;

    const self = await getGameState();
    if ( !isStartedGameState(self) ) {
      throw new Error('Game is not in active state');
    }
    self.player.health = self.player.maxHealth;
    const cellsUnlocked = Math.max(
      1,
      Math.floor(Math.random() * localSelf.battleStats.currentRound * 2),
    );
    self.battleStats.currentRound += 1;
    if ( isSelf ) {
      self.battleStats.roundsWon += 1;
      self.grid.unlockableCellsCount += cellsUnlocked;
    } else {
      self.battleStats.livesLeft -= 1;
    }

    await updateGameState(self);

    const battleEndedMessage: BattleEndedMessage = {
      action: ReceivedWorkerActions.BATTLE_ENDED,
      value: {
        cellsUnlocked: isSelf ? cellsUnlocked : 0,
        outcome: isSelf ? GameOutcome.WIN : GameOutcome.LOSE,
        gameState: self,
      },
    };
    sendMessageToAllConnectedPorts(battleEndedMessage);
  }
};
