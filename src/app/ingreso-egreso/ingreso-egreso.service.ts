import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators'
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  private ingresoEgresoListenerSubscription: Subscription = new Subscription();
  private ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(
    private afDb: AngularFirestore,
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  cancelSubscriptions(){
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${user.uid}/ingresos-egresos`).collection('items').add({...ingresoEgreso});
      
  }

  initIngresoEgresoListener(){
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
    .pipe(
      filter(auth => auth.user!=null)
    )
    .subscribe( auth => {
      this.ingresoEgresoItems(auth.user.uid)
    })
  }

  borrarIngresoEgreso(uid: string){
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete()

  }

  private ingresoEgresoItems(uid: string){
    this.ingresoEgresoItemsSubscription = this.afDb.collection(`${uid}/ingresos-egresos/items`)
             .snapshotChanges()
             .pipe(
               map(docData => {
                 return docData.map((doc:any) =>{
                   return {
                     uid: doc.payload.doc.id,
                     ...doc.payload.doc.data()
                   }
                 })
               })
             )
             .subscribe((coleccion:any) => {
              
               this.store.dispatch(new SetItemsAction(coleccion));

             })
  }



}
