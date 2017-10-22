import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';

@Injectable()
export class SafeNgZone {

    constructor(private ngZone: NgZone) {

    }

    safeSubscribe(
        observable: Observable <any> ,
        observerOrNext ? : PartialObserver <any> | ((value: any) => void),
        error ? : (error: any) => void,
        complete ? : () => void) {

        return this.ngZone.runOutsideAngular(() => {

            return observable.subscribe(
                this.callbackSubscriber(observerOrNext),
                error,
                complete);

        });

    }

    private callbackSubscriber(obs: PartialObserver <any> | ((value: any) => void)): any {

        if (typeof obs === "object") {
            let observer: PartialObserver <any> = {
                next: (value: any) => {
                    obs['next'] &&
                        this.ngZone.run(() => obs['next'](value));
                },
                error: (err: any) => {
                    obs['error'] &&
                        this.ngZone.run(() => obs['error'](err));
                },
                complete: () => {
                    obs['complete'] &&
                        this.ngZone.run(() => obs['complete']());
                }
            };

            return observer;

        } else if (typeof obs === "function") {

            return (value: any) => {
                this.ngZone.run(() => obs(value));
            }

        }

    }

}
