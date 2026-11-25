import { Component, inject } from '@angular/core';

import { LightsStore, switchOrder } from './lights.store';

const fairPrompt =
  'Analysiere das Schalterrätsel auf folgender Webseite: https://gedoplan.github.io/Frohe-Weihnachten-2026/ . ' +
  'Gib mir eine Lösung für das Schalterrätsel.' +
  'Führe keine Sourcecode-Analyse durch, erreiche die Lösung durch ausprobieren. Teile mir mit wie viele Züge du gebraucht hast.';

const unfairPrompt =
  'Analysiere das Schalterrätsel auf folgender Webseite: https://gedoplan.github.io/Frohe-Weihnachten-2026/ . ' +
  'Gib mir eine Lösung für das Schalterrätsel.' +
  'Führe eine Sourcecode-Analyse durch auf Basis der JavaScript-Datei oder des öffentlichen GitHub Repositorys';

@Component({
  imports: [],
  selector: 'app-lights',
  styleUrl: './lights.scss',
  templateUrl: './lights.html',
  providers: [LightsStore],
})
export class Lights {
  lightsStore = inject(LightsStore);

  readonly switchOrder = switchOrder;
  readonly prompts = [
    { text: 'die faire Version', prompt: fairPrompt },
    { text: 'die unfaire Version', prompt: unfairPrompt },
  ];

  chatGptUrl(prompt: string) {
    return 'https://chatgpt.com/?q=' + encodeURIComponent(prompt);
  }
}
