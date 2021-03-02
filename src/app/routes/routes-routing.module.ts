import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JWTGuard } from '@delon/auth';
// layout
import { LayoutProComponent } from '@brand';
import { environment } from '@env/environment';
// single pages
import { CallbackComponent } from './callback/callback.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    canActivate: [JWTGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // 商城
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
      },
      // Exception
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule),
      }
    ],
  },
  // 单页不包裹Layout
  {
    path: '',
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
  }, 
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent }, 
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
