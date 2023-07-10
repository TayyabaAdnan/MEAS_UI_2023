import { Routes } from '@angular/router';

export const content: Routes = [
  
  {
    path: 'ums',
    loadChildren: () => import('../../components/ums/ums.module').then(m => m.UmsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('../../components/categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'indicator',
    loadChildren: () => import('../../components/indicator/indicator.module').then(m => m.IndicatorModule)
  },
  {
    path: 'set',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: 'evaluation',
    loadChildren: () => import('../../components/monitoring/monitoring.module').then(m => m.MonitoringModule)
  },
  
];