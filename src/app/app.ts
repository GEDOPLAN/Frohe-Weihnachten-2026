import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly anzahl = 6;
  readonly effektOffset = 1;
  readonly reihenfolge = [3, 0, 4, 1, 5, 2];
  schalter = signal<boolean[]>(Array(this.anzahl).fill(false));
  zuege = signal(0);
  geloest = computed(() => this.schalter().every(Boolean));

  druecken(i: number) {
    this.schalter.update(s => {
      const neu = [...s];
      neu[i] = !neu[i];
      const ziel = (i + this.effektOffset) % this.anzahl;
      neu[ziel] = !neu[ziel];
      return neu;
    });
    this.zuege.update(z => z + 1);
  }

  neuStart() {
    this.schalter.set(Array(this.anzahl).fill(false));
    this.zuege.set(0);
  }
}
