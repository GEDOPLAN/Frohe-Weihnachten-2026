import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import * as _ from 'underscore';
import { computed, effect, inject } from '@angular/core';
import { AppStore } from '../../app.store';

interface MemoryStore {
  tiles: Tile[];
  _currentToggleA: Tile | undefined;
  _currentToggleB: Tile | undefined;
}

interface Tile {
  id: string;
  value: string;
  part: number;
  toggled: boolean;
  matched: boolean;
}

const baseTiles = [
  '01-zuckerstange.png',
  '02-gluehwein-tasse.png',
  '03-bohne-muetze.png',
  '04-wichtel.png',
  '05-angular-kugel.png',
  '06-code-baum.png',
  '07-merge-baum.png',
  '08-lebkuchenmann.png'
];

const initialState: MemoryStore = {
  _currentToggleA: undefined,
  _currentToggleB: undefined,
  tiles: _.shuffle(
    baseTiles.flatMap((v) => [
      { value: v, part: 0, id: v + 0, matched: false, toggled: false },
      { value: v, part: 1, id: v + 1, matched: false, toggled: false },
    ]),
  ),
};

export const MemoryStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    _isMatch: () => {
      return store._currentToggleA()?.value === store._currentToggleB()?.value;
    },
    _isMatchProcessing: () => {
      return store._currentToggleA() && store._currentToggleB();
    },
  })),
  withMethods((store) => ({
    toggle: (tile: Tile) => {
      if (!store._isMatchProcessing()) {
        const currentToggleUpdate: Partial<MemoryStore> = store._currentToggleA()
          ? { _currentToggleB: tile }
          : { _currentToggleA: tile };

        const toggledTiles: Partial<MemoryStore> = {
          tiles: store.tiles().map((t) => (t.id === tile.id ? { ...t, toggled: !t.toggled } : t)),
        };

        patchState(store, currentToggleUpdate, toggledTiles);
      }
    },
  })),
  withComputed((store) => ({
    finished: computed(() => store.tiles().every((t) => t.matched)),
    // finished : computed( () => store.tiles().some(t => t.matched))
  })),
  withHooks({
    onInit: (store) => {
      effect(() => {
        store._appStore.setFinished(store.finished());
      });

      effect(() => {
        if (store._isMatchProcessing()) {
          const match = store._isMatch();
          setTimeout(
            () => {
              const currentToggleUpdate: Partial<MemoryStore> = {
                _currentToggleA: undefined,
                _currentToggleB: undefined,
              };
              let toggledTiles: Partial<MemoryStore> = {
                tiles: store.tiles().map((t) => (t.matched ? t : { ...t, toggled: false })),
              };

              if (match) {
                const currentIds = [store._currentToggleA()?.id, store._currentToggleB()?.id];
                toggledTiles.tiles = toggledTiles.tiles!.map((t) =>
                  currentIds.includes(t.id) ? { ...t, matched: true, toggled: true } : t,
                );
              }

              patchState(store, currentToggleUpdate, toggledTiles);
            },
            match ? 0 : 2000,
          );
        }
      });
    },
  }),
);
