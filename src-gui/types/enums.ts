export enum PlantType {
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  FLOWER = 'flower',
  TREE = 'tree',
  BUSH = 'bush',
  SUCCULENT = 'succulent',
  CROP = 'crop',
}

export enum PlantAttributes {
  SHARP = 'sharp',
  EVERGREEN = 'evergreen',
  DECIDUOUS = 'deciduous',
  FRAGRANT = 'fragrant',
  TOXIC = 'toxic',
  EDIBLE = 'edible',
  POISONOUS = 'poisonous',
  SPINY = 'spiny',
  THORNY = 'thorny',
  SUCCULENT = 'succulent',
  TROPICAL = 'tropical',
  DESERT = 'desert',
  AQUATIC = 'aquatic',
  MEDICINAL = 'medicinal',
  CULINARY = 'culinary',
  TEXTILE = 'textile',
  FIBER = 'fiber',
}

export enum PlantGrowthState {
  SEED = 'seed',
  GROWING = 'growing',
  READY = 'ready',
}

/**
 * Actions that can be sent to the worker.
 */
export enum SendableWorkerActions {
  START_GAME = 'startGame',
  CONTINUE_GAME = 'continueGame',
  PLANT_PLANT = 'plantPlant',
  END_GAME = 'endGame',
  UNLOAD = 'unload',
  BUY_PLANT = 'buyPlant',
  SELL_PLANT = 'sellPlant',
  UNLOCK_CELL = 'unlockCell',
  FIND_OPPONENT = 'findOpponent',
  START_BATTLE = 'startBattle',
}

/**
 * Actions that can be received from the worker.
 */
export enum ReceivedWorkerActions {
  ERROR = 'error',
  GAME_STARTED = 'gameStarted',
  CONTINUEABLE_GAME = 'continueableGame',
  PLANT_PLANTED = 'plantPlanted',
  PLANT_BOUGHT = 'plantBought',
  PLANT_SOLD = 'plantSold',
  OPPONENT_FOUND = 'opponentFound',
  CELL_UNLOCKED = 'cellUnlocked',
  PLANT_STATE_CHANGED = 'plantStateChanged',
  BATTLE_READY_STATUS = 'battleReadyStatus',
  DEAL_DAMAGE = 'dealDamage',
  BATTLE_ENDED = 'battleEnded',
  BATTLE_STARTED = 'battleStarted',
}

export enum GameOutcome {
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export enum GameStatus {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  ENDED = 'ENDED'
}

export enum HudState {
  MENU = 'menu',
  GAME = 'game',
  BATTLE = 'battle',
  END = 'end',
}
