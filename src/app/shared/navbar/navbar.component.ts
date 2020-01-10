import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  nombre:string;
  susc:Subscription = new Subscription();
  constructor(
    private store:Store<AppState>
  ) { }

  ngOnInit() {
    this.susc = this.store.select('auth')
      .pipe(
        filter(auth => auth.user!=null)
      )
      .subscribe(auth=>{
        this.nombre = auth.user.nombre;
      })
  }

  ngOnDestroy(){
    this.susc.unsubscribe();
  }

}
