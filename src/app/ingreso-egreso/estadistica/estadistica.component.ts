import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Label,MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {
  
  ingresos: number;
  egresos: number;
  ingresosCount: number;
  egresosCount: number;

  susc: Subscription = new Subscription();
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];
  
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.susc = this.store.select('ingresoEgreso')
      .subscribe(ingresoEgreso =>{
        this.contarIngresoEgreso(ingresoEgreso.items);
      })
  }

  contarIngresoEgreso(items: IngresoEgreso[]){
    this.ingresos=0;
    this.egresos=0;
    this.ingresosCount=0;
    this.egresosCount=0;

    items.forEach(item =>{
      if(item.tipo==='ingreso'){
        this.ingresosCount++;
        this.ingresos+= item.monto;
      }else {
        this.egresosCount++;
        this.egresos += item.monto;
      }
    });
    this.doughnutChartData = [this.ingresos,this.egresos];
  }

}
