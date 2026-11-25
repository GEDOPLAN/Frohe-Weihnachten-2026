import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../app.store';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.svg',
})
export class Home {
  appStore = inject(AppStore);
}
