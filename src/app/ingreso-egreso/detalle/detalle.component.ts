import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[]=[];

  suscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
    ) { }

  ngOnInit() {
    this.suscription = this.store.select('ingresoEgreso')
      .subscribe((ingresoEgreso:any) => {
        this.items = ingresoEgreso.items;
        
      })
  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

  borrarItem(item:IngresoEgreso){
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
      .then(()=>{
        Swal.fire('Eliminado',`${item.descripcion} eliminado`,'success')
      })

  }

}
