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

interface SlidingStore {
  tiles: Tile[];
}

interface Tile {
  value: string;
  placeholder: boolean;
}

const baseTiles = [
  'gedxmas_01.png',
  'gedxmas_02.png',
  'gedxmas_03.png',
  'gedxmas_04.png',
  'gedxmas_05.png',
  'gedxmas_06.png',
  'gedxmas_07.png',
  'gedxmas_08.png',
  'gedxmas_09.png',
  'gedxmas_10.png',
  'gedxmas_11.png',
  'gedxmas_12.png',
  'gedxmas_13.png',
  'gedxmas_14.png',
  'gedxmas_15.png',
];

const gridSize = 4;

const isNeighbour = (a: number, b: number) =>
  Math.abs(Math.floor(a / gridSize) - Math.floor(b / gridSize)) +
    Math.abs((a % gridSize) - (b % gridSize)) ===
  1;

const shuffleByMoves = (tiles: Tile[], moves: number): Tile[] => {
  const result = [...tiles];
  let placeholderIndex = result.findIndex((t) => t.placeholder);
  let previousIndex = -1;

  for (let i = 0; i < moves; i++) {
    const candidates = _.range(result.length).filter(
      (index) => index !== previousIndex && isNeighbour(placeholderIndex, index),
    );
    const movingIndex = _.sample(candidates)!;

    [result[placeholderIndex], result[movingIndex]] = [result[movingIndex], result[placeholderIndex]];
    previousIndex = placeholderIndex;
    placeholderIndex = movingIndex;
  }

  return result;
};

const initialState: SlidingStore = {
  tiles: shuffleByMoves(
    [
      ...baseTiles.map((value) => ({ value, placeholder: false })),
      { value: 'gedxmas_placeholder.png', placeholder: true },
    ],
    100,
  ),
};

export const SlidingStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    finished: () => {
      return store
        .tiles()
        .every((t, i) => (i === baseTiles.length ? t.placeholder : t.value === baseTiles[i]));
    },
  })),
  withMethods((store) => ({
    toggle: (tile: string) => {
      let tiles =[...store.tiles()];
      const placeholderIndex = tiles.findIndex((t) => t.placeholder);
      const movingIndex = tiles.findIndex((t) => t.value === tile);

      if (!isNeighbour(placeholderIndex, movingIndex)) {
        return;
      }

      [tiles[placeholderIndex], tiles[movingIndex]] = [tiles[movingIndex], tiles[placeholderIndex]];

      patchState(store, {
        tiles,
      });
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
