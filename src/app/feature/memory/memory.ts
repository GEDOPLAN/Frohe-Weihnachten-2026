import { Component, computed, inject } from '@angular/core';

import { MemoryStore } from './memory.store';
import { Tile } from '@app/component';

@Component({
  imports: [Tile],
  selector: 'app-memory',
  styleUrl: './memory.scss',
  templateUrl: './memory.html',
  providers: [MemoryStore],
})
export class Memory {
  memoryStore = inject(MemoryStore);
}
