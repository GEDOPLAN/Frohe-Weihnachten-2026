import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-tile',
  styleUrl: './tile.scss',
  templateUrl: './tile.html',
})
export class Tile {
  background = signal('00-rueckseite.png');
  tileContent = input.required<string>();
  toggleIn = input(false);

  toggle = output<boolean>();
}
