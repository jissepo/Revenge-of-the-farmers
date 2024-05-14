const elementCache: { [key: string]: Element } = {};

export const getSplashElement = (): HTMLDivElement => {
  if ( elementCache['getSplashElement'] ) {
    return elementCache['getSplashElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('#splash')!;
  elementCache['getSplashElement'] = element;
  return element;
};

export const getSplashStartElement = (): HTMLButtonElement => {
  if ( elementCache['getSplashStartElement'] ) {
    return elementCache['getSplashStartElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#splash #startButton')!;
  elementCache['getSplashStartElement'] = element;
  return element;
};
export const getSplashContinueElement = (): HTMLButtonElement => {
  if ( elementCache['getSplashContinueElement'] ) {
    return elementCache['getSplashContinueElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#splash #continueButton')!;
  elementCache['getSplashContinueElement'] = element;
  return element;
};
export const getRestartElement = (): HTMLButtonElement => {
  if ( elementCache['getRestartElement'] ) {
    return elementCache['getRestartElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#restartButton')!;
  elementCache['getRestartElement'] = element;
  return element;
};
export const getOpenShopElement = (): HTMLButtonElement => {
  if ( elementCache['getOpenShopElement'] ) {
    return elementCache['getOpenShopElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#openShopButton')!;
  elementCache['getOpenShopElement'] = element;
  return element;
};
export const getCloseShopElement = (): HTMLButtonElement => {
  if ( elementCache['getCloseShopElement'] ) {
    return elementCache['getCloseShopElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#closeShopButton')!;
  elementCache['getCloseShopElement'] = element;
  return element;
};
export const getShopElement = (): HTMLDivElement => {
  if ( elementCache['getShopElement'] ) {
    return elementCache['getShopElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('#shop')!;
  elementCache['getShopElement'] = element;
  return element;
};
export const getAppElement = (): HTMLDivElement => {
  if ( elementCache['getAppElement'] ) {
    return elementCache['getAppElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('#app')!;
  elementCache['getAppElement'] = element;
  return element;
};
export const getShopShelveElement = (): HTMLDivElement => {
  if ( elementCache['getShopShelveElement'] ) {
    return elementCache['getShopShelveElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('#shop [data-shop-shelve]')!;
  elementCache['getShopShelveElement'] = element;
  return element;
};
export const getShopShelveItemElement = (): HTMLDivElement => {
  if ( elementCache['getShopShelveItemElement'] ) {
    return elementCache['getShopShelveItemElement'] as HTMLDivElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLDivElement>('[data-shop-shelve-item]')!;
  elementCache['getShopShelveItemElement'] = element;
  return element;
};
export const getShopItemAttributeElement = (): HTMLParagraphElement => {
  if ( elementCache['getShopItemAttributeElement'] ) {
    return elementCache['getShopItemAttributeElement'] as HTMLParagraphElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLParagraphElement>('[data-shop-item-attribute]')!;
  elementCache['getShopItemAttributeElement'] = element;
  return element;
};
export const getShopItemTypeElement = (): HTMLParagraphElement => {
  if ( elementCache['getShopItemTypeElement'] ) {
    return elementCache['getShopItemTypeElement'] as HTMLParagraphElement;
  }
  const attributeElement = getShopItemAttributeElement().cloneNode(true) as HTMLParagraphElement;
  attributeElement.classList.add('item__attribute--type');
  elementCache['getShopItemTypeElement'] = attributeElement;
  return attributeElement;
};
export const getShopItemStatElement = (): HTMLParagraphElement => {
  if ( elementCache['getShopItemStatElement'] ) {
    return elementCache['getShopItemStatElement'] as HTMLParagraphElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLParagraphElement>('[data-shop-item-stat]')!;
  elementCache['getShopItemStatElement'] = element;
  return element;
};
export const getShopInventoryElement = (): HTMLDivElement => {
  if ( elementCache['getShopInventoryElement'] ) {
    return elementCache['getShopInventoryElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('#shop [data-shop-inventory]')!;
  elementCache['getShopInventoryElement'] = element;
  return element;
};
export const getCardboardTracker = (): HTMLSpanElement => {
  if ( elementCache['cardboardTracker'] ) {
    return elementCache['cardboardTracker'] as HTMLSpanElement;
  }
  const element = document.querySelector<HTMLSpanElement>('#cardboardTracker')!;
  elementCache['cardboardTracker'] = element;
  return element;
};
export const getGameField = (isSelf = true): HTMLDivElement => {
  const fieldCacheKey = isSelf ? 'gameFieldSelf' : 'gameFieldOpponent';
  if ( elementCache[fieldCacheKey] ) {
    return elementCache[fieldCacheKey] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>(`[data-game-field-${ isSelf ? 'self' : 'opponent' }]`)!;
  elementCache[fieldCacheKey] = element;
  return element;
};
export const getGameFieldCellTemplate = (): HTMLDivElement => {
  if ( elementCache['gameFieldCellTemplate'] ) {
    return elementCache['gameFieldCellTemplate'] as HTMLDivElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLDivElement>('[data-cell]')!;
  elementCache['gameFieldCellTemplate'] = element;
  return element;
};
export const getPlantPickerElement = (): HTMLDivElement => {
  if ( elementCache['getPlantPickerElement'] ) {
    return elementCache['getPlantPickerElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('[data-plant-picker]')!;
  elementCache['getPlantPickerElement'] = element;
  return element;
};
export const getPlantIconTemplate = (): HTMLButtonElement => {
  if ( elementCache['getPlantIconTemplate'] ) {
    return elementCache['getPlantIconTemplate'] as HTMLButtonElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLButtonElement>('[data-plant-icon-button]')!;
  elementCache['getPlantIconTemplate'] = element;
  return element;
};
export const getPlantPickerSeparatorTemplate = (): HTMLDivElement => {
  if ( elementCache['getPlantPickerSeparatorTemplate'] ) {
    return elementCache['getPlantPickerSeparatorTemplate'] as HTMLDivElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLDivElement>('[data-plant-picker-separator]')!;
  elementCache['getPlantPickerSeparatorTemplate'] = element;
  return element;
};
export const getBattleDamageElement = (): HTMLDivElement => {
  if ( elementCache['getBattleDamageElement'] ) {
    return elementCache['getBattleDamageElement'] as HTMLDivElement;
  }
  const element = ( document.querySelector('#templates')! as HTMLTemplateElement ).content.querySelector<HTMLDivElement>('[data-battle-damage]')!;
  elementCache['getBattleDamageElement'] = element;
  return element;
};
export const getStartBattleElement = (): HTMLButtonElement => {
  if ( elementCache['getStartBattleElement'] ) {
    return elementCache['getStartBattleElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#startBattle')!;
  elementCache['getStartBattleElement'] = element;
  return element;
};
export const getEndBattleElement = (): HTMLButtonElement => {
  if ( elementCache['getEndBattleElement'] ) {
    return elementCache['getEndBattleElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('#endBattle')!;
  elementCache['getEndBattleElement'] = element;
  return element;
};
export const getCountdownContainerElement = (): HTMLDivElement => {
  if ( elementCache['getCountdownContainerElement'] ) {
    return elementCache['getCountdownContainerElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('[data-countdown-container]')!;
  elementCache['getCountdownContainerElement'] = element;
  return element;
};
export const getBattleEndedContainerElement = (): HTMLDivElement => {
  if ( elementCache['getBattleEndedContainerElement'] ) {
    return elementCache['getBattleEndedContainerElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('[data-battle-ended-container]')!;
  elementCache['getBattleEndedContainerElement'] = element;
  return element;
};
export const getBattleEndedSlotsElement = (): HTMLSpanElement => {
  if ( elementCache['getBattleEndedSlotsElement'] ) {
    return elementCache['getBattleEndedSlotsElement'] as HTMLSpanElement;
  }
  const element = document.querySelector<HTMLSpanElement>('[data-battle-ended-slots]')!;
  elementCache['getBattleEndedSlotsElement'] = element;
  return element;
};
export const getPlantSalesElement = (): HTMLDivElement => {
  if ( elementCache['getPlantSalesElement'] ) {
    return elementCache['getPlantSalesElement'] as HTMLDivElement;
  }
  const element = document.querySelector<HTMLDivElement>('[data-plant-sales-container]')!;
  elementCache['getPlantSalesElement'] = element;
  return element;
};
export const getPlantSalesButtonElement = (): HTMLButtonElement => {
  if ( elementCache['getPlantSalesButtonElement'] ) {
    return elementCache['getPlantSalesButtonElement'] as HTMLButtonElement;
  }
  const element = document.querySelector<HTMLButtonElement>('[data-plant-sales-button]')!;
  elementCache['getPlantSalesButtonElement'] = element;
  return element;
};

export const getPlayerHealthIndicatorElement = (isSelf = true): HTMLProgressElement => {
  const healthIndicatorCacheKey = isSelf ? 'playerHealthIndicatorSelf' : 'playerHealthIndicatorOpponent';
  if ( elementCache[healthIndicatorCacheKey] ) {
    return elementCache[healthIndicatorCacheKey] as HTMLProgressElement;
  }
  const element = document.querySelector<HTMLProgressElement>(`[data-battle-participant-${ isSelf ? 'self' : 'opponent' }-health]`)!;
  elementCache[healthIndicatorCacheKey] = element;
  return element;

};

export const getPlayerHeartsElement = (isSelf = true): HTMLProgressElement => {
  const heartsCacheKey = isSelf ? 'playerHeartsSelf' : 'playerHeartsOpponent';
  if ( elementCache[heartsCacheKey] ) {
    return elementCache[heartsCacheKey] as HTMLProgressElement;
  }
  const element = document.querySelector<HTMLProgressElement>(`[data-battle-${ isSelf ? 'self' : 'opponent' }-heart]`)!;
  elementCache[heartsCacheKey] = element;
  return element;
};

export const getPlayerTrophyElement = (isSelf = true): HTMLProgressElement => {
  const trophyCacheKey = isSelf ? 'playerTrophySelf' : 'playerTrophyOpponent';
  if ( elementCache[trophyCacheKey] ) {
    return elementCache[trophyCacheKey] as HTMLProgressElement;
  }
  const element = document.querySelector<HTMLProgressElement>(`[data-battle-${ isSelf ? 'self' : 'opponent' }-trophy]`)!;
  elementCache[trophyCacheKey] = element;
  return element;
};
