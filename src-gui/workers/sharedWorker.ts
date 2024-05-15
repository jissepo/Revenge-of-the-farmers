import { ReceivedWorkerActions, SendableWorkerActions } from '../types/enums';
import { SendableWorkerMessage } from '../types/worker/worker';
import { handleGameEvent } from './utils/gameHandler';
import {
  addPortToConnectedPorts,
  removePortFromConnectedPorts,
  sendErrorToAllConnectedPorts,
  sendMessageToAllConnectedPorts,
} from './utils/helpers/messenger';
import { getGameState } from './utils/helpers/gameState';
import { isStartedGameState } from '../shared/predicates';
import { ContinueableGameMessage } from '../types/client/worker';


/**
 * When a new thread is connected to the shared worker,
 * start listening for messages from the new thread.
 */
self.addEventListener('connect', (event: MessageEvent) => {
  console.log('Connected to shared worker');
  const port = event.ports[0];
  // Add this new port to the list of connected ports.
  addPortToConnectedPorts(port);

  /**
   * Receive data from main thread and determine which
   * actions it should take based on the received data.
   */
  port.addEventListener('message', ({ data }: MessageEvent<SendableWorkerMessage>) => {
    console.debug('Received message: ', data);
    switch ( data.action ) {
      case SendableWorkerActions.UNLOAD:
        removePortFromConnectedPorts(port);
        break;
      default:
        handleGameEvent(data)
          .then(sendMessageToAllConnectedPorts)
          .catch(sendErrorToAllConnectedPorts);
        break;
    }
  });

  // Start the port broadcasting.
  port.start();

  // Send a message to the main thread if there exists an game in STARTED state.
  getGameState().then((gameState) => {
    if ( !isStartedGameState(gameState) ) {
      return;
    }
    const continueGameMessage: ContinueableGameMessage = {
      action: ReceivedWorkerActions.CONTINUEABLE_GAME,
      value: gameState,
    };
    sendMessageToAllConnectedPorts(continueGameMessage);
  }).catch(console.error);

});

console.log('Shared worker loaded');
