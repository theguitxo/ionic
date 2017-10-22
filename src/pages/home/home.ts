import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// providers
import { SafeNgZone } from '../../providers/safe-ng-zone/safe-ng-zone';
import { TransactionsProvider } from '../../providers/transactions/transactions';
import { RatesProvider } from '../../providers/rates/rates';

// pages
import { SkuDetailPage } from '../sku-detail/sku-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private result: any;

  private dataLoaded: boolean;

  private pageDetail: any;

  constructor(
    public navCtrl: NavController,
    private _sfz: SafeNgZone,
    private _rates: RatesProvider,
    private _transactions: TransactionsProvider) {

      this.result = [];

      this.dataLoaded = false;

      this.pageDetail = SkuDetailPage;

  }

  ionViewDidEnter(): void {

    if(!this.dataLoaded) {

      this.loadRates();
      this.loadTransactions();

    }

  }

  private loadRates(): void {

    console.log('Loading rates');

    this._sfz.safeSubscribe(
      this._rates.loadRates(),
      (data) => {
        this.checkDataLoaded();
      },
      (error) => {
        console.log('Error loading rates: ', error);
      },
      () => {
        console.log('Rates loaded');
      });

  }

  private loadTransactions(): void {

    console.log('Loading transactions');

    this._sfz.safeSubscribe(
      this._transactions.loadTransactions(),
      (data) => {
        this.checkDataLoaded();
      },
      (error) => {
        console.log('Error loading transactions: ', error);
      },
      () => {
        console.log('Transactions loaded');
      });

  }

  private checkDataLoaded(): void {

    if(!this.dataLoaded && this._rates.getDataLoaded() && this._transactions.getLoadedData()) {
      this.dataLoaded = true;
    }

  }

  private showSkuList(): boolean {

    return (this._rates.getDataLoaded() && this._transactions.getLoadedData());

  }

  private getTransactionsList(): Array<string> {

    return this._transactions.getSkuNameList();

  }

  private goToDetail(item: string): void {

    console.log('Open ' + item + ' detail');

    this.navCtrl.push(this.pageDetail, {'sku': item });

  }

}
