import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    private store:Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
    ) { }

  nombre:string;
  susc:Subscription = new Subscription();
 

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

  logout(){
    this.authService.logout();
    this.ingresoEgresoService.cancelSubscriptions();
  }

}
