



import { Injectable } from '@angular/core';

@Injectable()
export class GameTimeService {


    constructor() {

    }

    async timeSleep(ms: number) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms);
        })
    }



}