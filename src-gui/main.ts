import './style.css';
import { addWorkerMessageListener, initializeSharedWorker } from './client/sharedWorker';
import {
  isBattleEndedMessageEvent,
  isBattleReadyMessageEvent,
  isCellUnlockedMessageEvent,
  isContinuableGameMessageEvent,
  isDamageDealtMessageEvent,
  isGameStartedMessageEvent,
  isOpponentFoundMessageEvent,
  isPlantBoughtMessageEvent,
  isPlantPlantedMessageEvent,
  isPlantSoldMessageEvent,
  isPlantStateChangeMessageEvent,
  isStartedGameState,
} from './shared/predicates';
import { HudState } from './types/enums';
import {
  renderBattle,
  renderBattleEnded,
  renderBattleReady,
  renderBattleStats,
  renderBuyableCells,
  renderCardboard,
  renderCountdown,
  renderDamageDealt,
  renderEnableContinueGameButton,
  renderField,
  renderHidePlantSalesElement,
  renderPlantedGameGridCell,
  renderPlantPicker,
  renderShopInventory,
  renderShopShelve,
  renderSwitchHud,
} from './client/gameRenderer';
import { getCurrentGameState, setGameState, updateGridCell } from './client/gameState';
import { initializeHud } from './client/hudHandler';
import { registerSW } from 'virtual:pwa-register';


const intervalMS = 60 * 1000;

const updateSw = registerSW({
  immediate: true,
  onRegisteredSW: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => {
    console.debug('Registered SW', registration);
    registration && setInterval(async () => {
      console.debug('Sw checking for updates');
      if ( !( !registration.installing && navigator ) ) {
        console.debug('no SW installed');
        return;
      }

      if ( ( 'connection' in navigator ) && !navigator.onLine ) {
        console.debug('no connection');
        return;
      }

      const resp = await fetch(swScriptUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      });

      if ( resp?.status === 200 ) {
        await registration.update();
      }
    }, intervalMS);
  },
  onNeedRefresh: async () => {
    console.debug('SW needs refresh');
    await updateSw();
  },
});

initializeSharedWorker();
addWorkerMessageListener((event) => {
  console.debug('Received message from worker', event.data);
  if ( isGameStartedMessageEvent(event) ) {
    console.debug('Game started');
    setGameState(event.data.value);
    renderSwitchHud(HudState.GAME);
    requestAnimationFrame(() => {
      renderField(event.data.value.grid, true);
      renderBuyableCells(event.data.value);
      if ( isStartedGameState(event.data.value) ) {
        renderCardboard(event.data.value.player.cardboard);
        renderPlantPicker(event.data.value.player.availablePlants);
        renderShopShelve();
        renderShopInventory(event.data.value.player.availablePlants);
      }
    });
  } else if ( isContinuableGameMessageEvent(event) ) {
    console.debug('Game started');
    renderEnableContinueGameButton();
  } else if ( isPlantPlantedMessageEvent(event) ) {
    console.debug('Plant planted');
    setGameState(event.data.value.gameState);
    renderPlantedGameGridCell(event.data.value.plantedCell, true);
    renderPlantPicker(event.data.value.gameState.player.availablePlants);
  } else if ( isPlantStateChangeMessageEvent(event) ) {
    console.debug('Plant state changed');
    updateGridCell(event.data.value);
    renderPlantedGameGridCell(event.data.value, true);
  } else if ( isPlantBoughtMessageEvent(event) ) {
    console.debug('Plant bought');
    setGameState(event.data.value);
    renderCardboard(event.data.value.player.cardboard);
    renderPlantPicker(event.data.value.player.availablePlants);
    renderShopInventory(event.data.value.player.availablePlants);
  } else if ( isPlantSoldMessageEvent(event) ) {
    console.debug('Plant sold');
    const currBattleState = getCurrentGameState();
    if ( !isStartedGameState(currBattleState) ) {
      throw new Error('Game is not in active state');
    }
    setGameState(event.data.value);
    renderCardboard(event.data.value.player.cardboard);
    renderBattle({
      ...event.data.value, player: {
        ...event.data.value.player,
        health: currBattleState.player.health,
      },
    }, true);
  } else if ( isBattleReadyMessageEvent(event) ) {
    console.debug('Battle ready');
    renderBattleReady(event.data.value);
  } else if ( isOpponentFoundMessageEvent(event) ) {
    console.debug('Opponent found');
    renderSwitchHud(HudState.BATTLE);

    renderBattle(event.data.value.self, true);
    renderBattle(event.data.value.opponent, false);

    renderCountdown();
  } else if ( isDamageDealtMessageEvent(event) ) {
    console.debug('Damage dealt');
    renderDamageDealt(event.data.value);
  } else if ( isBattleEndedMessageEvent(event) ) {
    console.debug('Battle ended');
    setGameState(event.data.value.gameState);
    renderBattleEnded(event.data.value.outcome, event.data.value.cellsUnlocked);
    renderBattleStats(true, event.data.value.gameState);
    renderHidePlantSalesElement();
  } else if ( isCellUnlockedMessageEvent(event) ) {
    console.debug('Battle ended');
    setGameState(event.data.value.gameState);
    renderField(event.data.value.gameState.grid, true);
    if ( event.data.value.gameState.grid.unlockableCellsCount > 0 ) {
      renderBuyableCells(event.data.value.gameState);
    }
  }
});


initializeHud();
renderSwitchHud(HudState.MENU);

// try {
//   screen.orientation.lock('landscape-primary');
// } catch ( e ) {
//   console.error('Failed to lock orientation', e);
// }
console.debug('Main thread loaded');
