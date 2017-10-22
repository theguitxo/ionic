import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SkuDetailPage } from '../pages/sku-detail/sku-detail';

// providers
import { DataProvider } from '../providers/data/data';
import { SafeNgZone } from '../providers/safe-ng-zone/safe-ng-zone';
import { TransactionsProvider } from '../providers/transactions/transactions';
import { RatesProvider } from '../providers/rates/rates';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SkuDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SkuDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SafeNgZone,
    TransactionsProvider,
    RatesProvider
  ]
})
export class AppModule {}
