import { Component, computed, inject } from '@angular/core';

import { SlidingStore } from './sliding.store';
import { Tile } from '@app/component';
import { AppStore } from '../../app.store';

@Component({
  imports: [Tile],
  selector: 'app-sliding',
  styleUrl: './sliding.scss',
  templateUrl: './sliding.html',
  providers: [SlidingStore],
})
export class Sliding {
  slidingStore = inject(SlidingStore);
  appStore = inject(AppStore);
}
