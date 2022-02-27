import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GlobalRoutingModule } from './global-routing.module';
import { NgHelmetModule } from 'ng-helmet';



@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    GlobalRoutingModule,
  ]
})
export class GlobalModule { }
