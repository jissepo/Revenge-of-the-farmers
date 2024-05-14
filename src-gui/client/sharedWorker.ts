import SharedWorkerScript from '../workers/sharedWorker?sharedworker';
import { SendableWorkerMessage } from '../types/worker/worker';
import { ReceivedWorkerMessage } from '../types/client/worker';

let webSocketWorker: SharedWorker;
let identifier = Math.floor(Math.random() * 1000);
/**
 * Sends a message to the worker and passes that to the Web Socket.
 */
export const sendMessageToWorker = (message: SendableWorkerMessage) => {
  console.info('Sending message to worker', message);
  webSocketWorker.port.postMessage(message);
};

export const addWorkerMessageListener = <T extends ReceivedWorkerMessage = any>(callback: (event: MessageEvent<T>) => void) => {
  // Event to listen for incoming data from the worker and update the DOM.
  webSocketWorker.port.addEventListener('message', callback);
};

export const initializeSharedWorker = (customIdentifier?: number): SharedWorker => {
  identifier = customIdentifier || identifier;
  webSocketWorker = new SharedWorkerScript();

  // Initialize the port connection.
  webSocketWorker.port.start();

  // Remove the current worker port from the connected ports list.
  // This way your connectedPorts list stays true to the actual connected ports,
  // as they array won't get automatically updated when a port is disconnected.
  window.addEventListener('beforeunload', () => {
    webSocketWorker.port.postMessage({
      action: 'unload',
      value: null,
    });

    webSocketWorker.port.close();
  });
  return webSocketWorker;
};
