import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// providers
import { TransactionsProvider } from '../../providers/transactions/transactions';
import { RatesProvider } from '../../providers/rates/rates';
import { SafeNgZone } from '../../providers/safe-ng-zone/safe-ng-zone';

import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-sku-detail',
  templateUrl: 'sku-detail.html'
})
export class SkuDetailPage {

  private skuSelected: string;
  private dataSkuSelected: any;

  private totalEur: number;

  private loading:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private _transactions: TransactionsProvider,
              private _rates: RatesProvider,
              private _sfz: SafeNgZone) {

    this.skuSelected = this.navParams.get('sku');
    this.dataSkuSelected = this._transactions.getSkuDataDetail(this.skuSelected);
    this.totalEur = 0;

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

  }

  getDataSkuSelected(): Array<any> {

    return this.dataSkuSelected;

  }

  ionViewWillDiDLeave(): void {

    this.skuSelected = '';
    this.dataSkuSelected = [];
    this.totalEur = 0;

  }

  ionViewDidEnter(): void {

    console.log('Data of SKU ' + this.skuSelected);

    this.loading.present();

    this._sfz.safeSubscribe(
      this.loadDetailData(),
      (data) => {
        console.log('SKU ' + this.skuSelected + ' loaded');
      },
      (error) => {
        console.log('Error loading SKU detail (' + this.skuSelected + '): ', error);
      },
      () => {
        this.loading.dismiss();
      });

  }

  private loadDetailData(): Observable<any> {

    return new Observable(observer => {

      for(let i in this.dataSkuSelected) {

        if(this.dataSkuSelected[i].currency !== 'EUR') {
          this.dataSkuSelected[i].amountEur = this._rates.calculateRate(this.dataSkuSelected[i].amountInt, this.dataSkuSelected[i].currency, []);
        }

        this.totalEur += this.dataSkuSelected[i].amountEur;

      }

      this.totalEur = this._rates.roundRateHalfToEven(this.totalEur);

      observer.next(true);
      observer.complete();

    });

  }

}
