import { Plant } from '../types/plant';
import { isStartedGameState, targetIsHTMLElement } from './predicates';
import { BuyPlantMessage } from '../types/worker/worker';
import { SendableWorkerActions } from '../types/enums';
import { sendMessageToWorker } from './sharedWorker';
import { getCurrentGameState } from './gameState';

export const handleBuyPlant = (evt: MouseEvent, plant: Plant) => {
  console.debug('Buying plant', plant);
  evt.preventDefault();
  if ( !targetIsHTMLElement(evt.target) ) {
    throw new Error('This is a dom event listener. Please dear lord all-mighty tell me what black magic is this');
  }

  const gameState = getCurrentGameState();
  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game not started');
  }

  if ( gameState.player.cardboard < plant.stats.cost ) {
    throw new Error('Not enough cardboard');
  }

  evt.target.parentElement!.classList.add('shop__shelve-item--bought');
  const plantBoughtMessage: BuyPlantMessage = {
    action: SendableWorkerActions.BUY_PLANT,
    value: {
      plant,
    },
  };

  sendMessageToWorker(plantBoughtMessage);
};
