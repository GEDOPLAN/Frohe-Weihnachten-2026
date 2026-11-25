import {
  patchState,
  signalStore, withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

interface TimeApiResponse {
  datetime: string;
}

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
    _http: inject(HttpClient),
  })),
  withProps((store) => ({
    _dateResource: rxResource({
      stream: () =>
        store._http
          .get<TimeApiResponse>(`https://aisenseapi.com/services/v1/datetime`)
          .pipe(
            map((r) => new Date(r.datetime)),
            catchError(() => of(new Date())),
          ),
    }),
  })),
  withComputed((store) => ({
    advent: computed(() => {
      const now = store._dateResource.value();
      if (!now) return 0;
      const christmas = new Date(2026, 11, 25);
      const fourth = new Date(2026, 11, 25 - (christmas.getDay() || 7));
      for (let n = 4; n >= 1; n--) {
        const sunday = new Date(fourth);
        sunday.setDate(fourth.getDate() - (4 - n) * 7);
        if (now >= sunday) return n;
      }
      return 0;
    }),
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
