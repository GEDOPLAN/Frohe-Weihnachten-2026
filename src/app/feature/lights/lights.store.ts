import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { AppStore } from '../../app.store';

interface LightsStore {
  switches: boolean[];
  moves: number;
  copiedPrompt: string | null;
}

const switchCount = 6;
const effectOffset = 1;

export const switchOrder = [3, 0, 4, 1, 5, 2];

const initialState: LightsStore = {
  switches: Array(switchCount).fill(false),
  moves: 0,
  copiedPrompt: null,
};

export const LightsStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    finished: computed(() => store.switches().every(Boolean)),
  })),
  withMethods((store) => ({
    press: (index: number) => {
      if (store.finished()) {
        return;
      }
      const switches = [...store.switches()];
      const target = (index + effectOffset) % switchCount;
      switches[index] = !switches[index];
      switches[target] = !switches[target];

      patchState(store, { switches, moves: store.moves() + 1 });
    },
    restart: () => {
      patchState(store, { switches: Array(switchCount).fill(false), moves: 0 });
    },
    copyPrompt: async (prompt: string) => {
      await navigator.clipboard.writeText(prompt);
      patchState(store, { copiedPrompt: prompt });
      setTimeout(() => patchState(store, { copiedPrompt: null }), 2000);
    },
  })),
  withHooks({
    onInit: (store) => {
      effect(() => {
        store._appStore.setFinished(store.finished());
      });
    },
  }),
);
