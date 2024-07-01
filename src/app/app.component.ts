import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AppState } from './store/app.store';
import { Store } from '@ngrx/store';
import * as AuthStore from './store/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'sports-app';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // console.log("INITIAL APP LOAD");
    this.store.dispatch(AuthStore.autoLogin());
  }
}
