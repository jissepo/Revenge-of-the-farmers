import { GAME_DB_NAME, GAME_DB_VERSION, GAME_STATE_OBJECT_STORE_KEY } from '../../config/game';

let db: IDBDatabase;

export const getDbConnection = async (): Promise<IDBDatabase> => {
  if ( db ) {
    return db;
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(GAME_DB_NAME, GAME_DB_VERSION);

    // This event handles the event whereby a new version of
    // the database needs to be created Either one has not
    // been created before, or a new version number has been
    // submitted via the window.indexedDB.open line above
    // it is only implemented in recent browsers
    // Basically this is your migration runner
    request.onupgradeneeded = () => {
      const db = request.result;
      if ( !db.objectStoreNames.contains(GAME_STATE_OBJECT_STORE_KEY) ) {
        db.createObjectStore(
          GAME_STATE_OBJECT_STORE_KEY,
        );
      } else {
        db.deleteObjectStore(GAME_STATE_OBJECT_STORE_KEY);
        db.createObjectStore(
          GAME_STATE_OBJECT_STORE_KEY,
        );
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
