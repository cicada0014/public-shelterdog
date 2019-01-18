



import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from '../../redux/root.reducer';
import { wideDisplay } from '../../redux/event/event.action';
import { Observable } from 'rxjs';
import { DeviceAttribute } from '../../redux/device/device.action';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-about',
    templateUrl: 'about.component.html'
})

export class AboutComponent implements OnInit {

    isMobile: boolean;



    aboutImageUrl: string = '';


    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    constructor(


        private http: HttpClient,
        private ngRedux: NgRedux<AppState>,
        private titleService: Title,
        private metaService: Meta

    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
            this.getImage();
        })


    }

    setMeta() {
        this.titleService.setTitle(`Shelter Dog(쉘터 독)란?`);
        this.metaService.removeTag('keywords')
        this.metaService.addTag({ name: 'keywords', content: '쉘터독에 대하여' });
        this.metaService.updateTag({ property: 'og:title', content: `Shelter Dog(쉘터 독)란? - 싫어하는 것을 이야기하는 커뮤니티` });
        this.metaService.updateTag({ property: 'og:image', content: 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f' });
        this.metaService.updateTag({ property: 'og:description', content: `싫어하는 것을 이야기하는 커뮤니티입니다. 오늘 당신에게 스트레스를 준 것에 대해 이야기 해보세요. 이야기하고 소통하는 것만으로도 조금은 해소가 될거에요.` });
        this.metaService.updateTag({ name: 'description', content: `싫어하는 것을 이야기하는 커뮤니티입니다. 오늘 당신에게 스트레스를 준 것에 대해 이야기 해보세요. 이야기하고 소통하는 것만으로도 조금은 해소가 될거에요.` });
    }



    getImage() {
        this.http
            .get('banner/area', { params: { areaKey: this.isMobile ? 'about-mobile' : 'about' } })
            .toPromise()
            .then((r: any) => {
                console.log(r);
                if (r) {
                    this.aboutImageUrl = r.BannerItems[0].image_url;
                }
            })
            .catch(e => {
                console.log(e)
            })


    }

    ngOnInit() {

        // if (!this.aboutImageUrl) {
        //     this.getImage();
        // }
        this.setMeta()
        this.ngRedux.dispatch(wideDisplay(true));
    }
    ngOnDestroy() {
        this.ngRedux.dispatch(wideDisplay(false));
    }
}