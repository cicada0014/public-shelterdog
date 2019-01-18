


import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'default-refuge',
    templateUrl: 'default.refuge.component.html',
    styleUrls: ['default.refuge.component.scss']
})

export class DefaultRefugeComponent implements OnInit {



    mainBannerImageUrl: string = '';

    constructor(
        private http: HttpClient,
        private titleService: Title,
        private metaService: Meta
    ) { }


    setMeta() {
        this.titleService.setTitle(`Shelter Dog(쉘터 독) - 마음속 응어리를 풀어내는 공간/커뮤니티`);
        this.metaService.removeTag('keywords')
        this.metaService.addTag({ name: 'keywords', content: 'Shelter Dog' });
        this.metaService.updateTag({ property: 'og:title', content: `Shelter Dog(쉘터 독) - 마음속 응어리를 풀어내는 공간` });
        this.metaService.updateTag({ property: 'og:image', content: 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f' });
        this.metaService.updateTag({ property: 'og:description', content: `싫어하는 것을 이야기하는 커뮤니티입니다. 오늘 당신에게 스트레스를 준 것에 대해 이야기 해보세요. ` });
        this.metaService.updateTag({ name: 'description', content: `싫어하는 것을 이야기하는 커뮤니티입니다. 오늘 당신에게 스트레스를 준 것에 대해 이야기 해보세요. ` });
    }



    ngOnInit() {
        this.getImage();
        this.setMeta()

    }

    getImage() {
        this.http
            .get('banner/area', { params: { areaKey: 'main' } })
            .toPromise()
            .then((r: any) => {
                if (r) {
                    this.mainBannerImageUrl = r.BannerItems[0].image_url;
                }
            })
            .catch(e => {
                // console.log(e)
            })


    }
}