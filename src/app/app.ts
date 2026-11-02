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

  readonly netterPrompt =
    'Analysiere das Schalterrätsel auf folgender Webseite: https://gedoplan.github.io/Frohe-Weihnachten-2026/ . ' +
    'Gib mir eine Lösung für das Schalterrätsel.' +
    'Führe keine Sourcecode-Analyse durch, erreiche die Lösung durch ausprobieren. Teile mir mit wie viele Züge du gebraucht hast.';

  readonly boeserPrompt =
    'Analysiere das Schalterrätsel auf folgender Webseite: https://gedoplan.github.io/Frohe-Weihnachten-2026/ . ' +
    'Gib mir eine Lösung für das Schalterrätsel.' +
    'Führe eine Sourcecode-Analyse durch.';

  // Welcher Prompt zuletzt kopiert wurde (für die kurze "Kopiert!"-Rückmeldung)
  kopiert = signal<string | null>(null);

  chatGptUrl(prompt: string) {
    return 'https://chatgpt.com/?q=' + encodeURIComponent(prompt);
  }

  async kopieren(prompt: string) {
    await navigator.clipboard.writeText(prompt);
    this.kopiert.set(prompt);
    setTimeout(() => this.kopiert.set(null), 2000);
  }

  druecken(i: number) {
    this.schalter.update((s) => {
      const neu = [...s];
      neu[i] = !neu[i];
      const ziel = (i + this.effektOffset) % this.anzahl;
      neu[ziel] = !neu[ziel];
      return neu;
    });
    this.zuege.update((z) => z + 1);
  }

  neuStart() {
    this.schalter.set(Array(this.anzahl).fill(false));
    this.zuege.set(0);
  }
}
