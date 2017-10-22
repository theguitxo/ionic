import { Injectable } from '@angular/core';
import { DataProvider } from '../data/data';
import { Observable } from 'rxjs/Observable';

interface transacionItem {
  sku: string,
  currency: string,
  amount: string,
  amountInt: number,
  amountEur: number
}

@Injectable()
export class TransactionsProvider {

  private url: string;
  private dataLoaded: boolean;

  private skuData: any;
  private skuNameList: Array<string>;
  private skuDataList: Array<any>;

  constructor(private _data: DataProvider) {

    this.url = 'http://quiet-stone-2094.herokuapp.com/transactions';
    this.dataLoaded = false;

    this.skuNameList = [];
    this.skuDataList = [];

  }

  loadTransactions(): Observable<any> {

    return new Observable(observer => {

      this._data.loadData(this.url)
        .subscribe((data) => {

        this.skuData = data;
        this.dataLoaded = true;

        this.createSkuLists();

        console.log('Transactions:', this.skuDataList);

        observer.next(true);
        observer.complete();

      });

    });

  }

  getLoadedData(): boolean {

    return this.dataLoaded;

  }

  getSkuNameList(): Array<string> {

    return this.skuNameList;

  }

  getSkuDataList(): any {

    return this.skuDataList;

  }

  getSkuDataDetail(item: string): any {

    return this.skuDataList[item];

  }

  private createSkuLists(): void {

    for(let item of this.skuData) {

      if(this.skuNameList.indexOf(item.sku) === -1) {

        this.skuNameList.push(item.sku);
        this.skuDataList[item.sku] = [];

      }

      let amountInt: number = parseInt((parseFloat(item.amount) * 100).toFixed());

      let newItem: transacionItem = {
        sku: item.sku,
        currency: item.currency,
        amount: item.amount,
        amountInt: amountInt,
        amountEur: item.currency === 'EUR' ? amountInt : 0,
      }

      this.skuDataList[item.sku].push(newItem);

    }

  }

}
