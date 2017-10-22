import { Injectable } from '@angular/core';
import { DataProvider } from '../data/data';
import { Observable } from 'rxjs/Observable';

interface rateItem {
  from: string,
  to: string,
  rate: string,
  rateInt?: number
}

@Injectable()
export class RatesProvider {

  private url: string;
  private dataLoaded: boolean;
  private list: Array<rateItem>;

  private toEUR: Array<string>;

  constructor(private _data: DataProvider) {

    this.url = 'http://quiet-stone-2094.herokuapp.com/rates';
    this.dataLoaded = false;

    this.toEUR = [];

  }

  loadRates(): Observable<any> {

    return new Observable(observer => {

      this._data.loadData(this.url)
        .subscribe((data) => {

          this.list = data;
          this.dataLoaded = true;

          this.operationsWithRates();

          console.log('Rates: ', this.list);

          observer.next(true);
          observer.complete();

      });

    });

  }

  getDataLoaded(): boolean {
    return this.dataLoaded;
  }

  getListData(): any {
    return this.list;
  }

  private operationsWithRates(): void {

    for(let item in this.list) {

      let value: number = parseInt((parseFloat(this.list[item].rate) * 100).toFixed());

      this.list[item].rateInt = value;

      if(this.list[item].to === 'EUR') {
        this.toEUR.push(this.list[item].from);
      }

    }

  }

  calculateRate(value: number, currency: string, checkeds: Array<string>): number {

    let rate: rateItem;

    if(this.toEUR.indexOf(currency) !== -1) {

      rate = this.getRateValue(currency, true);

      return this.roundRateHalfToEven((value * rate.rateInt) / 100);

    } else {

      checkeds.push(currency);

      rate = this.getRateValue(currency, false, checkeds);

      value = this.roundRateHalfToEven((value * rate.rateInt) / 100);

      return this.calculateRate(value, rate.to, checkeds);

    }

  }

  private getRateValue(currency: string, isEur: boolean, checkeds?: Array<string>): rateItem {

    for(let item in this.list) {

      if(this.list[item].from === currency) {

        if(isEur && this.list[item].to === 'EUR') {

          return this.list[item];

        } else if(!isEur && checkeds.indexOf(this.list[item].to) === -1) {

          return this.list[item];

        }

      }

    }

  }

  roundRateHalfToEven(value: number): number {

    var integerPart = Math.floor(value);
    var decimalPart = (value - integerPart) * 100;

    if(decimalPart < 50) {
      return integerPart;
    } else if(decimalPart > 50) {
      return integerPart + 1;
    } else {
      if(integerPart % 2 === 0) {
        return integerPart;
      } else {
        return integerPart + 1;
      }
    }

  }

}
