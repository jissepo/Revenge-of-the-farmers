import { GameGrid, GameGridCell, PlantedGameGridCell } from '../types/worker/grid';
import {
  getAppElement,
  getBattleDamageElement,
  getBattleEndedContainerElement,
  getBattleEndedSlotsElement,
  getCardboardTracker,
  getCountdownContainerElement,
  getGameField,
  getGameFieldCellTemplate,
  getPlantIconTemplate,
  getPlantPickerElement,
  getPlantPickerSeparatorTemplate,
  getPlantSalesElement,
  getPlayerHealthIndicatorElement,
  getPlayerHeartsElement,
  getPlayerTrophyElement,
  getShopElement,
  getShopInventoryElement,
  getShopItemAttributeElement,
  getShopItemStatElement,
  getShopItemTypeElement,
  getShopShelveElement,
  getShopShelveItemElement,
  getSplashContinueElement,
  getSplashElement,
  getStartBattleElement,
} from './elements';
import { handleCellClick, handlePlantPlant } from './cellHandler';
import { GameOutcome, HudState, PlantGrowthState, SendableWorkerActions } from '../types/enums';
import { calculateGridCellIndexForCell, GRID_MAX_WIDTH } from '../shared/grid';
import { Plant } from '../types/plant';
import { handleBuyPlant } from './shopHandler';
import { AvailablePlant, GamePlayer } from '../types/player';
import data from '../data';
import { isAvailablePlant, isStartedGameState } from '../shared/predicates';
import { StartedGameState } from '../types/worker/gameState';
import { sendMessageToWorker } from './sharedWorker';
import { StartBattleMessage } from '../types/worker/worker';
import { DamageDealtMessage } from '../types/client/worker';
import { getCurrentGameState } from './gameState';

const clearField = (isSelf: boolean): void => {
  // Clear the game field
  console.debug('Clearing game field');
  const gameField = getGameField(isSelf);
  while ( gameField.firstChild ) {
    gameField.removeChild(gameField.firstChild);
  }
};

export const renderField = (gameGrid: GameGrid, isSelf: boolean): void => {
  // Render the game field
  clearField(isSelf);
  console.debug('Rendering game field', gameGrid);
  const gameField = getGameField(isSelf);
  const cellTemplate = getGameFieldCellTemplate();
  Object.values(gameGrid.cells).forEach((cell) => {
    const cellElement = cellTemplate.cloneNode(true) as HTMLDivElement;

    if ( cell.hasBeenUnlocked ) {
      cellElement.classList.add('cell--unlocked');
    }

    const cellButtonElement = cellElement.querySelector<HTMLButtonElement>('[data-cell-button]')!;
    // Set up the singular cell
    cellButtonElement.disabled = !cell.hasBeenUnlocked;

    const cellIndex = calculateGridCellIndexForCell(cell);

    cellElement.dataset.cellIndex = cellIndex.toString();
    cellElement.style.setProperty(
      '--jj-cell-column',
      ( cell.x ).toString(),
    );
    cellElement.style.setProperty(
      '--jj-cell-z-index',
      ( cell.y + ( cell.x % 2 ? 0 : 1 ) ).toString(),
    );

    if ( isSelf ) {
      cellButtonElement.addEventListener('click', (evt) => handleCellClick(evt));
    }

    gameField.appendChild(cellElement);
    if ( cell.hasPlant ) {
      renderPlantedGameGridCell(cell, isSelf);
    }
  });
  gameField.style.gridTemplateColumns = `repeat(${ GRID_MAX_WIDTH }, var(--jj-cell-width))`;
};

export const renderSplashAnimate = (): void => {
  const splash = getSplashElement();
  splash.classList.add('splash--animating');
  const fadeSpeed = 3.5;
  splash.style.setProperty('--jj-splash-fade-speed', `${ fadeSpeed }s`);
  setTimeout(() => {
    splash.classList.remove('splash--displayed');
    splash.classList.remove('splash--animating');
  }, fadeSpeed * 1000);
};

export const renderCardboard = (cardboard: number): void => {
  const cardboardTracker = getCardboardTracker();
  cardboardTracker.textContent = cardboard.toString();

};

const getCellElementFromCell = (cell: GameGridCell, isSelf: boolean): HTMLDivElement => {
  const cellIndex = calculateGridCellIndexForCell(cell);
  const gameField = getGameField(isSelf);
  const cellElement = gameField.querySelector<HTMLDivElement>(`[data-cell-index="${ cellIndex }"]`);

  if ( !cellElement ) {
    throw new Error(`Could not find cell element with index ${ cellIndex }`);
  }
  return cellElement;
};

const cellIntervals: Record<number, NodeJS.Timeout> = {};
const renderTimer = (plantedCell: PlantedGameGridCell, cellIndex: number, cellTimerElement: HTMLSpanElement) => {
  const timePassed = new Date().getTime() - plantedCell.plant.plantedAt;
  const timeRemaining = plantedCell.plant.plant.stats.growthTime - Math.floor(timePassed / 1000);
  if ( timeRemaining <= 0 ) {
    clearInterval(cellIntervals[cellIndex]);
    cellTimerElement.classList.add('cell__timer--hidden');
    return;
  }
  cellTimerElement.textContent = `${
    Math.floor(timeRemaining / 60)
  }:${
    ( timeRemaining % 60 ).toString().padStart(2, '0')
  }`;
};

export const renderPlantedGameGridCell = (plantedCell: PlantedGameGridCell, isSelf: boolean): void => {
  const cellIndex = calculateGridCellIndexForCell(plantedCell);
  const cellElement = getCellElementFromCell(plantedCell, isSelf);

  const cellImageElement = cellElement.querySelector<HTMLImageElement>('[data-cell-image]')!;
  cellImageElement.src = `${ plantedCell.plant.plant.cellImagesFolder }/${ plantedCell.plant.growthState }.svg`;

  const cellTimerElement = cellElement.querySelector<HTMLSpanElement>('[data-cell-timer]')!;
  // if ( cellIntervals[cellIndex] ) {
  //   clearInterval(cellIntervals[cellIndex]);
  // }
  if ( plantedCell.plant.growthState !== PlantGrowthState.READY ) {
    cellTimerElement.classList.remove('cell__timer--hidden');
    cellIntervals[cellIndex] = setInterval(() => renderTimer(plantedCell, cellIndex, cellTimerElement), 1000);
    renderTimer(plantedCell, cellIndex, cellTimerElement);
  }
  if ( plantedCell.plant.growthState === PlantGrowthState.READY ) {
    cellImageElement.classList.add('cell__image--ready');
    cellTimerElement.classList.add('cell__timer--hidden');
  }
};

const renderPlantIcon = (plant: AvailablePlant | Plant): HTMLButtonElement => {
  const plantIconTemplate = getPlantIconTemplate();

  const plantIconElement = plantIconTemplate.cloneNode(true) as HTMLButtonElement;

  const plantImage = plantIconElement.querySelector<HTMLImageElement>('[data-plant-icon-image]')!;
  plantImage.src = plant.icon;

  if ( isAvailablePlant(plant) ) {
    const plantQuantity = plantIconElement.querySelector<HTMLSpanElement>('[data-plant-icon-quantity]')!;
    plantQuantity.textContent = plant.quantity.toString();
  }

  return plantIconElement;
};

export const renderPlantPicker = (availablePlants: AvailablePlant[]): void => {
  console.debug('Updating available plants render in picker');
  const pickerContainerElement = getPlantPickerElement();
  while ( pickerContainerElement.firstChild ) {
    pickerContainerElement.removeChild(pickerContainerElement.firstChild);
  }

  if ( availablePlants.length === 0 ) {
    // No plants available
    // Do nothing
    return;
  }

  const plantPickerSeparator = getPlantPickerSeparatorTemplate();

  for ( let i = 0; i < availablePlants.length; i++ ) {
    let plantPickerSeparatorElement: HTMLDivElement;
    if ( i % 3 === 0 || i % 3 === 1 ) {
      plantPickerSeparatorElement = plantPickerSeparator.cloneNode(true) as HTMLDivElement;
      pickerContainerElement.appendChild(plantPickerSeparatorElement);
    } else {
      plantPickerSeparatorElement = pickerContainerElement.lastElementChild as HTMLDivElement;
    }
    const selectedPlant = availablePlants[i];

    const plantPickerButtonElement = renderPlantIcon(selectedPlant);

    plantPickerButtonElement.addEventListener('click', (evt) => {
      if ( !pickerContainerElement.dataset.currentCellIndex || Number.isNaN(Number(pickerContainerElement.dataset.currentCellIndex)) ) {
        throw new Error('No cell index on plant picker');
      }
      handlePlantPlant(evt, Number(pickerContainerElement.dataset.currentCellIndex), selectedPlant.name);
      pickerContainerElement.classList.add('plant-picker__container--hidden');
    });

    plantPickerSeparatorElement.appendChild(plantPickerButtonElement);
  }
};


export const renderShopShelve = (): void => {
  console.debug('Updating available plants render in shop');
  const shopPlants: Plant[] = [];
  const gameState = getCurrentGameState();

  if ( !isStartedGameState(gameState) ) {
    throw new Error('Game is not in active state');
  }

  for ( let i = 0; i < Math.max(2, Math.floor(Math.random() * gameState.battleStats.currentRound / 3 * 2)); i++ ) {
    shopPlants.push(
      data.plants[Math.floor(Math.random() * data.plants.length)],
    );
  }
  const shopShelveElement = getShopShelveElement();
  while ( shopShelveElement.firstChild ) {
    shopShelveElement.removeChild(shopShelveElement.firstChild);
  }

  const shelveItemTemplate = getShopShelveItemElement();

  const itemAttributeTemplate = getShopItemAttributeElement();
  const itemTypeAttributeTemplate = getShopItemTypeElement();
  const itemStatTemplate = getShopItemStatElement();

  shopPlants.forEach((plant) => {
    const plantPickerButtonElement = renderPlantIcon(plant);

    const shelveItemElement = shelveItemTemplate.cloneNode(true) as HTMLDivElement;

    shelveItemElement.prepend(plantPickerButtonElement);

    const itemInfoButtonElement = shelveItemElement.querySelector<HTMLButtonElement>('[data-shop-shelve-item-description-button]')!;
    itemInfoButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.debug('Showing plant info', plant);
      itemInfoButtonElement.parentElement!.classList.toggle('item__description-container--expanded');
    });

    const itemNameElement = shelveItemElement.querySelector<HTMLParagraphElement>('[data-shop-item-name]')!;
    itemNameElement.textContent = plant.name;

    const itemDescriptionElement = shelveItemElement.querySelector<HTMLParagraphElement>('[data-shop-item-description]')!;
    itemDescriptionElement.textContent = plant.description;


    const itemStatsElement = shelveItemElement.querySelector<HTMLDivElement>('[data-shop-item-stats]')!;

    Object.entries(plant.stats).forEach(([key, value]) => {
      const itemStatElement = itemStatTemplate.cloneNode(true) as HTMLParagraphElement;
      itemStatElement.textContent = `${ key }: ${ value }`;
      itemStatsElement.appendChild(itemStatElement);
    });

    const itemAttributesElement = shelveItemElement.querySelector<HTMLDivElement>('[data-shop-item-attributes]')!;

    const itemTypeElement = itemTypeAttributeTemplate.cloneNode(true) as HTMLParagraphElement;
    itemTypeElement.textContent = plant.type;
    itemAttributesElement.appendChild(itemTypeElement);

    plant.attributes.forEach((attribute) => {
      const attributeElement = itemAttributeTemplate.cloneNode(true) as HTMLParagraphElement;
      attributeElement.textContent = attribute;
      itemAttributesElement.appendChild(attributeElement);
    });


    const itemPriceElement = shelveItemElement.querySelector<HTMLSpanElement>('[data-shop-item-price]')!;
    itemPriceElement.textContent = plant.stats.cost.toString();

    const buyButtonElement = shelveItemElement.querySelector<HTMLButtonElement>('[data-shop-shelve-item-buy-button]')!;

    buyButtonElement.addEventListener('click', (evt) => handleBuyPlant(evt, plant));

    shopShelveElement.appendChild(shelveItemElement);
  });
};

export const renderShopInventory = (availablePlants: AvailablePlant[]): void => {
  console.debug('Updating available plants render in inventory');
  const shopInventoryElement = getShopInventoryElement();
  while ( shopInventoryElement.firstChild ) {
    shopInventoryElement.removeChild(shopInventoryElement.firstChild);
  }

  availablePlants.forEach((plant) => {
    const plantPickerButtonElement = renderPlantIcon(plant);

    shopInventoryElement.appendChild(plantPickerButtonElement);
  });
};

export const renderOpenShop = (): void => {
  console.debug('Opening shop');
  const shopElement = getShopElement();
  shopElement.classList.remove('shop--hidden');
};

export const renderCloseShop = (): void => {
  console.debug('Closing shop');
  const shopElement = getShopElement();
  shopElement.classList.add('shop--hidden');
};

export const renderSwitchHud = (newHud: HudState): void => {
  console.debug(`Switching hud to ${ newHud }`);
  const appElement = getAppElement();
  appElement.classList.forEach((className) => {
    if ( className.startsWith('app--hud-') ) {
      appElement.classList.remove(className);
    }
  });
  appElement.classList.add(`app--hud-${ newHud }`);
};

export const renderEnableContinueGameButton = (): void => {
  console.debug(`Enabling continue game button`);
  const continueElement = getSplashContinueElement();
  continueElement.classList.remove('splash__button--disabled');
};

export const renderBattleReady = (isReady: boolean): void => {
  console.debug('Updating battle ready status', isReady);
  const battleReadyElement = getStartBattleElement();
  battleReadyElement.disabled = !isReady;
};

function renderHealthIndicator(player: GamePlayer, isSelf: boolean): void {
  const playerHealthIndicatorElement = getPlayerHealthIndicatorElement(isSelf);

  playerHealthIndicatorElement.value = player.health;
  playerHealthIndicatorElement.max = player.maxHealth;
}

export const renderBattle = (participant: StartedGameState, isSelf: boolean): void => {
  console.debug('Creating battlefield');
  renderHealthIndicator(participant.player, isSelf);
  renderField(participant.grid, isSelf);
  renderBattleStats(isSelf, participant);
};

export const renderCountdown = (): void => {
  const countDownContainer = getCountdownContainerElement();
  countDownContainer.classList.remove('hud__countdown--hidden');
  let countDownElement = countDownContainer.firstElementChild as ( HTMLDivElement | null );
  const countDownSpeed = 1000;
  const interval = setInterval(() => {
    if ( !countDownElement ) {
      clearInterval(interval);
      countDownContainer.classList.add('hud__countdown--hidden');

      const startBattleMessage: StartBattleMessage = {
        action: SendableWorkerActions.START_BATTLE,
      };
      sendMessageToWorker(startBattleMessage);
      return;
    }
    countDownElement.classList.add('hud__countdown-text--animating');
    countDownElement.style.setProperty('--jj-countdown-animation-speed', `${ countDownSpeed }ms`);

    const currCountDownElement = countDownElement;
    setTimeout(() => {
      currCountDownElement.classList.remove('hud__countdown-text--animating');
    }, countDownSpeed);
    countDownElement = countDownElement.nextElementSibling as ( HTMLDivElement | null );
  }, countDownSpeed);
};
export const renderHidePlantSalesElement = (): void => {
  const plantSalesElement = getPlantSalesElement();
  plantSalesElement.classList.add('plant-sales__container--hidden');
};
export const renderHidePlantPickerElement = (): void => {
  const plantPickerElement = getPlantPickerElement();
  plantPickerElement.classList.add('plant-picker__container--hidden');
};
export const renderDamageDealt = (data: DamageDealtMessage['value']): void => {
  const damageTemplate = getBattleDamageElement();
  const damageElement = damageTemplate.cloneNode(true) as HTMLDivElement;
  const otherPlayerField = getGameField(!data.isSelf);
  const otherPlayerHealthIndicatorElement = getPlayerHealthIndicatorElement(!data.isSelf);

  otherPlayerHealthIndicatorElement.value = data.newHealth;

  damageElement.textContent = `-${ data.damage }`;
  damageElement.style.setProperty('--jj-damage-offset-x', `${ Math.random() * 10 - 5 }rem`);
  damageElement.style.setProperty('--jj-damage-offset-y', `${ Math.random() * 10 - 5 }rem`);

  const duration = 1.7;
  damageElement.style.setProperty('--jj-damage-animation-duration', `${ duration }s`);
  setTimeout(() => {
    damageElement.classList.add('battle__damage--animated');
    setTimeout(() => {
      damageElement.remove();
    }, duration * 1000);
  });

  otherPlayerField.appendChild(damageElement);

  const cellElement = getCellElementFromCell(data.cell, data.isSelf);
  cellElement.classList.add('cell--attacking');
  setTimeout(() => {
    cellElement.classList.remove('cell--attacking');
  }, 500);
};

export const renderBattleEnded = (outcome: GameOutcome, cellsUnlocked: number): void => {
  const battleEndedContainer = getBattleEndedContainerElement();
  battleEndedContainer.classList.remove('battle-ended__container--hidden');
  if ( outcome === GameOutcome.WIN ) {
    battleEndedContainer.classList.add('battle-ended__container--won');

    const battleEndedSlots = getBattleEndedSlotsElement();
    battleEndedSlots.textContent = cellsUnlocked.toString();
    battleEndedContainer.classList.remove('battle-ended__container--lost');
  } else {
    battleEndedContainer.classList.add('battle-ended__container--lost');
    battleEndedContainer.classList.remove('battle-ended__container--won');
  }
};

export const renderBattleStats = (isSelf: boolean, gameState: StartedGameState): void => {
  console.debug('Updating battle stats');
  const selfTrophyElement = getPlayerTrophyElement(isSelf);
  const selfHeartElement = getPlayerHeartsElement(isSelf);
  selfTrophyElement.textContent = gameState.battleStats.roundsWon.toString();
  selfHeartElement.textContent = gameState.battleStats.livesLeft.toString();
};

export const renderBuyableCells = (gameState: StartedGameState): void => {
  console.debug('Rendering buyable cells');
  if ( gameState.grid.unlockableCellsCount === 0 ) {
    return;
  }
  Object.values(gameState.grid.cells).forEach((cell) => {
    if ( cell.hasBeenUnlocked || !cell.canBeUnlocked ) {
      return;
    }

    const cellElement = getCellElementFromCell(cell, true);
    cellElement.classList.add('cell--buyable');

    const cellButtonElement = cellElement.querySelector<HTMLButtonElement>('[data-cell-button]')!;
    // Set up the singular cell
    cellButtonElement.disabled = !cell.canBeUnlocked;
  });
};
