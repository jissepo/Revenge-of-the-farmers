import { ExceptionMessage, ReceivedWorkerMessage } from '../../../types/client/worker';
import { ReceivedWorkerActions } from '../../../types/enums';

/**
 * Set to store all the connected ports in.
 */
const connectedPorts = new Set<MessagePort>();

export const addPortToConnectedPorts = (port: MessagePort) => {
  connectedPorts.add(port);
};

export const removePortFromConnectedPorts = (port: MessagePort) => {
  connectedPorts.delete(port);
};

export const sendErrorToAllConnectedPorts = (error: Error) => {
  console.error(error);
  const message: ExceptionMessage = {
    action: ReceivedWorkerActions.ERROR,
    value: {
      message: error.message,
      name: error.name,
    },
  };
  sendMessageToAllConnectedPorts(message);
};
export const sendMessageToAllConnectedPorts = (message: ReceivedWorkerMessage | void) => {
  if ( !message ) {
    return;
  }
  console.debug('Sending message to all connected ports: ', message);
  connectedPorts.forEach(port => {
    port.postMessage(message);
  });
};
