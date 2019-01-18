

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-game-index',
    templateUrl: 'game.index.component.html',
    styleUrls: ['game.index.component.scss']
})

export class GameIndexComponent implements OnInit {



    isMobile: boolean;
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    items = [
        { new: true, krtitle: '비매너와의 전쟁', title: 'defence', img: '/assets/game/defence/defence-thumbnail.png', description: '비호감들을 혼내주는 디펜스 게임' },
        { krtitle: '죄수번호 5275', title: 'runner', img: '/assets/game/imgs/k-vs-villain.jpeg', description: '세상의 편견에 맞서고자 한 청년 이야기' },
        { krtitle: '사이다 톡', title: 'cider', img: '/assets/imgs/cider-thumbnail.png', description: '당신을 짜증나게 한 사람이 있다면 지금 바로 톡해보세요!' },
        { krtitle: '새로운 게임', title: 'next', img: '/assets/imgs/next-game.jpg', description: '다음 게임은 준비 중 입니다.' }
    ]

    constructor(
        private router: Router,
        private titleService: Title

    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
    }

    ngOnInit() {
        this.titleService.setTitle('Shelter Dog(쉘터독) - 게임')


    }

    goToItem(item) {
        if (item.title !== 'next') {
            this.router.navigateByUrl(`game/${item.title}`)
        }
    }
}