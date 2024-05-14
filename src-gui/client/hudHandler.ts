import {
  getBattleEndedContainerElement,
  getCloseShopElement,
  getEndBattleElement,
  getGameField,
  getOpenShopElement,
  getPlantSalesButtonElement,
  getRestartElement,
  getSplashContinueElement,
  getSplashStartElement,
  getStartBattleElement,
} from './elements';
import {
  ContinueGameMessage,
  FindOpponentMessage,
  SellPlantMessage,
  StartGameMessage,
} from '../types/worker/worker';
import { HudState, SendableWorkerActions } from '../types/enums';
import { sendMessageToWorker } from './sharedWorker';
import {
  renderBattleReady,
  renderBuyableCells,
  renderCloseShop,
  renderHidePlantPickerElement,
  renderHidePlantSalesElement,
  renderOpenShop,
  renderShopShelve,
  renderSplashAnimate,
  renderSwitchHud,
} from './gameRenderer';
import { getCurrentGameState } from './gameState';
import { isStartedGameState } from './predicates';

const startGame = () => {
  const startGameMessage: StartGameMessage = {
    action: SendableWorkerActions.START_GAME,
  };
  sendMessageToWorker(startGameMessage);
};
const addStartListener = () => {
  const startGameButton = getSplashStartElement();
  startGameButton.addEventListener('click', () => {
    startGame();
    renderSwitchHud(HudState.GAME);
    renderSplashAnimate();
  });
};
const addContinueListener = () => {
  const continueButtonElement = getSplashContinueElement();
  continueButtonElement.addEventListener('click', () => {
    const continueGameMessage: ContinueGameMessage = {
      action: SendableWorkerActions.CONTINUE_GAME,
    };
    sendMessageToWorker(continueGameMessage);
    renderSwitchHud(HudState.GAME);
    renderBattleReady(true);
    renderSplashAnimate();
  });
};
const addRestartListener = () => {
  const restartGameButton = getRestartElement();
  restartGameButton.addEventListener('click', () => {
    startGame();
  });
};

const addOpenShopListener = () => {
  const shopButton = getOpenShopElement();
  shopButton.addEventListener('click', () => {
    renderOpenShop();
  });
};

const addCloseShopListener = () => {
  const shopButton = getCloseShopElement();
  shopButton.addEventListener('click', () => {
    renderCloseShop();
  });
};

const addStartBattleListener = () => {
  const battleReadyElement = getStartBattleElement();
  battleReadyElement.addEventListener('click', () => {
    console.debug('Starting battle');

    renderHidePlantPickerElement();
    renderHidePlantSalesElement();
    const startBattleMessage: FindOpponentMessage = {
      action: SendableWorkerActions.FIND_OPPONENT,
    };
    sendMessageToWorker(startBattleMessage);
  });
};

const addEndBattleListener = () => {
  const battleEndElement = getEndBattleElement();
  battleEndElement.addEventListener('click', async () => {
    console.debug('Ending battle');
    const gameState = getCurrentGameState();
    console.log(gameState);
    if ( !isStartedGameState(gameState) ) {
      throw new Error('Trying to end battle without started game state');
    }

    const battleEndedContainer = getBattleEndedContainerElement();
    battleEndedContainer.classList.add('battle-ended__container--hidden');

    renderSwitchHud(HudState.GAME);

    renderHidePlantPickerElement();
    renderHidePlantSalesElement();
    if ( gameState.battleStats.livesLeft <= 0 ) {
      return startGame();
    }
    renderShopShelve();
    renderBuyableCells(gameState);
  });
};

const addSellPlantListener = () => {
  const sellPlantButton = getPlantSalesButtonElement();
  sellPlantButton.addEventListener('click', () => {
    const cellIndex = Number(sellPlantButton.parentElement!.dataset.cellIndex);
    if ( Number.isNaN(cellIndex) ) {
      throw new Error('Invalid cell index');
    }

    renderHidePlantSalesElement();
    const sellPlantMessage: SellPlantMessage = {
      action: SendableWorkerActions.SELL_PLANT,
      value: { cellIndex },
    };
    sendMessageToWorker(sellPlantMessage);
  });
};

const addPopoversListener = () => {
  const gameField = getGameField(true);
  document.addEventListener('click', (evt) => {
    if ( evt.target === gameField.parentElement ) {
      renderHidePlantPickerElement();
      renderHidePlantSalesElement();
    }
  });
};

export const initializeHud = () => {
  addStartListener();
  addContinueListener();
  addRestartListener();
  addOpenShopListener();
  addCloseShopListener();
  addStartBattleListener();
  addEndBattleListener();
  addSellPlantListener();
  addPopoversListener();
};

