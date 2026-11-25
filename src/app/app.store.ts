import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

interface AppState {
  finished: boolean;
}

const initialState: AppState = {
  finished: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _router: inject(Router),
  })),
  withMethods((store) => ({
    setFinished: (finished: boolean) => {
      patchState(store, { finished });
    },
  })),
  withHooks({
    onInit: (store) => {
      store._router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          patchState(store, { finished: false });
        }
      });
    },
  }),
);
