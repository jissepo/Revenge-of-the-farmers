import { getDbConnection } from './db';
import { GAME_STATE_KEY, GAME_STATE_OBJECT_STORE_KEY } from '../../config/game';
import { GameState } from '../../../types/worker/gameState';
import { getDefaultGameState } from '../../../shared/gameState';

export const updateGameState = async (gameState: GameState): Promise<void> => {

  const db = await getDbConnection();
  const transaction = db.transaction([GAME_STATE_OBJECT_STORE_KEY], 'readwrite', {
    durability: 'relaxed',
  });

  const objectStore = transaction.objectStore(GAME_STATE_OBJECT_STORE_KEY);
  objectStore.put(gameState, GAME_STATE_KEY);
};

export const getGameState = async (): Promise<GameState> => {
  const db = await getDbConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([GAME_STATE_OBJECT_STORE_KEY], 'readonly', {
      durability: 'relaxed',
    });
    const objectStore = transaction.objectStore(GAME_STATE_OBJECT_STORE_KEY);
    const request = objectStore.get(GAME_STATE_KEY);

    request.addEventListener('success', () => {
      const dbGameState = request.result;
      if ( dbGameState ) {
        resolve(dbGameState);
        return;
      }
      const defaultGameState = getDefaultGameState();
      resolve(defaultGameState);
      objectStore.put(defaultGameState, GAME_STATE_KEY);
    });

    request.addEventListener('error', () => {
      reject(request.error);
    });
  });
};
