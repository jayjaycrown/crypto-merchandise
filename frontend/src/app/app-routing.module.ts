import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './auth/login/login.component';
import { VerifyMailComponent } from './auth/verify-mail/verify-mail.component';


const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: '/authentication',
    pathMatch: 'full'
  },
  {
    path: 'auth//verify_email/:token',
    component: VerifyMailComponent
  }
  // {
  //   path: '**',
  //   redirectTo: 'auth',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
