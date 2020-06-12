import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './posts/list/list.component';
import { CreateComponent } from './posts/create/create.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TopRatedComponent } from './top-rated/top-rated.component';
import { KeepsComponent } from './keeps/keeps.component';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'top', component: TopRatedComponent },
  { path: 'keeps', component: KeepsComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent }
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
