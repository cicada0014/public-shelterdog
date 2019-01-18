


import { Component, OnInit } from '@angular/core';
import { UserProfilesAttribute } from 'src/app/types/schema.types';
import { HttpClient } from '@angular/common/http';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';

@Component({
    selector: 'app-game-ranking',
    templateUrl: 'game.ranking.component.html',
    styleUrls: ['game.ranking.component.scss']
})

export class GameRankingComponent implements OnInit {


    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    totalRankingDisplay: boolean = false;
    isMobile: boolean = false;
    datas: {
        UserProfile: UserProfilesAttribute,
        life: number,
        deposit: number,
    }[] = []


    originLeftDatas: {
        UserProfile: UserProfilesAttribute,
        life: number,
        deposit: number,
    }[] = []
    originRightDatas: {
        UserProfile: UserProfilesAttribute,
        life: number,
        deposit: number,
    }[] = []

    topRankers: {
        UserProfile: UserProfilesAttribute,
        life: number,
        deposit: number,
    }[] = [];
    commonRankers: {
        UserProfile: UserProfilesAttribute,
        life: number,
        deposit: number,
    }[] = []

    constructor(
        private http: HttpClient

    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

        // this.datas.push({
        //     life: 3,
        //     deposit: 100,
        //     UserProfile: { nickname: '쉘터멍멍이' }
        // })
        // this.datas.push({
        //     life: 2,
        //     deposit: 100,
        //     UserProfile: { nickname: '쉘터멍멍이' }
        // });
        // this.datas.push({
        //     life: 1,
        //     deposit: 100,
        //     UserProfile: { nickname: '쉘터멍멍이' }
        // });
        // this.datas.push({
        //     life: 1,
        //     deposit: 100,
        //     UserProfile: { nickname: '쉘터멍멍이' }
        // });
        // this.datas.push({
        //     life: 1,
        //     deposit: 100,
        //     UserProfile: { nickname: '쉘터멍멍이' }
        // });
        // for (let i = 0; i < 99; i++) {
        //     this.datas.push({
        //         life: 0,
        //         deposit: i,
        //         UserProfile: { nickname: '쉘터멍멍이5' }
        //     })
        // }



        // this.originLeftDatas = this.datas.slice(0, 50);
        // this.originRightDatas = this.datas.slice(50, 100);


        // this.topRankers = this.datas.splice(0, 5)
        // this.commonRankers = this.datas.splice(0, 20)

        // console.log(this.topRankers, this.commonRankers)



    }

    ngOnInit() {

        this.http.get('game/defence/ranking')
            .toPromise()
            .then(r => {
                this.datas = r as any;

                if (this.datas.length < 5) {
                    let _l = this.datas.length
                    for (let i = 0; i < 5 - _l; i++) {
                        this.datas.push({
                            life: 0,
                            deposit: 0,
                            UserProfile: { nickname: '유저 없음' }
                        })
                    }
                }
                this.originLeftDatas = this.datas.slice(0, 50);
                this.originRightDatas = this.datas.slice(50, 100);


                this.topRankers = this.datas.splice(0, 5)
                this.commonRankers = this.datas.splice(0, 20)

            })
            .catch(e => {

            })


    }
}