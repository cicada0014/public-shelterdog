

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})

export class FooterComponent implements OnInit {
    privateSecurityStrategy
    useTerm
    openSourceLisence

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    privateContents: string = ''
    termContents: string = ''

    isMobile

    openSourceLibs: { name: string, type: string, link: string }[];


    constructor(
        private http: HttpClient

    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
        this.openSourceLibs = [
            {
                name: 'angular',
                type: 'MIT',
                link: 'https://github.com/angular/angular/blob/master/LICENSE'
            },
            {
                name: 'moment.js',
                type: 'MIT',
                link: 'https://github.com/moment/momentjs.com/blob/master/LICENSE'
            },
            {
                name: 'prime ng',
                type: 'MIT',
                link: 'https://github.com/primefaces/primeng/blob/master/LICENSE.md'
            },
            {
                name: 'ngx-markdown',
                type: 'MIT',
                link: 'https://github.com/jfcere/ngx-markdown/blob/master/LICENSE'
            },
            {
                name: 'typescript',
                type: 'APACHE 2.0',
                link: 'https://github.com/Microsoft/TypeScript/blob/master/LICENSE.txt'
            },
            {
                name: 'node js',
                type: 'MIT',
                link: 'https://raw.githubusercontent.com/nodejs/node/master/LICENSE'
            },
            {
                name: 'inversify',
                type: 'MIT',
                link: 'https://github.com/inversify/InversifyJS/blob/master/LICENSE'
            },
            {
                name: 'sequelize',
                type: 'MIT',
                link: 'https://github.com/sequelize/sequelize/blob/master/LICENSE'
            },
            {
                name: 'express js',
                type: 'MIT',
                link: 'https://github.com/expressjs/express/blob/master/LICENSE'
            },
            {
                name: 'phaser',
                type: 'MIT',
                link: 'https://github.com/photonstorm/phaser/blob/master/license.txt'
            },


        ]


    }

    openModal(type) {
        if (type == 'privateSecurityStrategy') {
            if (!this.privateContents) {
                this.http
                    .get(`static-pages/private`)
                    .toPromise()
                    .then((r: any) => {
                        this.privateContents = r.content;
                        this[type] = true;
                    })
                    .catch(e => {
                        console.log(e)
                    })
            } else {
                this[type] = true;
            }
        } else if (type == 'useTerm') {
            if (!this.termContents) {
                this.http
                    .get(`static-pages/term`)
                    .toPromise()
                    .then((r: any) => {
                        this.termContents = r.content
                        this[type] = true;
                    })
                    .catch(e => {
                        console.log(e)
                    })
            } else {
                this[type] = true;
            }
        } else if (type == 'openSourceLisence') {
            this[type] = true;
        }





    }

    ngOnInit() {



    }

    ngAfterViewInit() {
        setTimeout(() => {
            try {
                (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
            } catch (e) {
                // console.error(e);
            }
        }, 2000);
    }
}