


import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendingMachineItemsAttribute, HashTagsAttribute, VendingMachineItemHashTagsAttribute } from 'src/app/types/schema.types';
import { Router } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';



@Component({
    selector: 'app-vending-machine-cider',
    templateUrl: 'vending_machine.cider.component.html',
    styleUrls: ['vending_machine.cider.component.scss']
})

export class VendingMachineCiderComponent implements OnInit {
    isMobile;

    itemHashTags: VendingMachineItemHashTagsAttribute[] = [];
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    @ViewChild('pPaginator') pPaginator: Paginator
    totalRecords: number = 0;

    items: VendingMachineItemsAttribute[] = [];



    selectedItemTag: VendingMachineItemHashTagsAttribute = { tag_id: -1 };


    tagListOffset: number = 0;





    constructor(
        private http: HttpClient,
        private router: Router

    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })




    }

    ngOnInit() {




        this.getHashTagList();


        this.getVendingMachineItem()

    }

    onPage($event) {
        if ($event) {
            // this.currFirst = $event.first + ''
            // localStorage.setItem('currentFirst', this.currFirst);
            // this.router.navigateByUrl('/refuge-detail/' + this.itemId)
            window.scrollTo(0, 0);
            // this.loadData($event);

            if (this.selectedItemTag) {
                if (this.selectedItemTag.tag_id == -1) {
                    this.getVendingMachineItem($event.page)
                    // 전체 태그 클릭
                } else {
                    this.getVendingMachineItem($event.page, this.selectedItemTag.tag_id)
                    // 세부 태크 클릭
                }
            } else {
                this.getVendingMachineItem($event.page)
            }




        } else {
        }
    }


    classifyItemsWithTag(itemTag: VendingMachineItemHashTagsAttribute) {
        this.pPaginator._first = 0;
        this.items.length = 0;
        this.selectedItemTag = itemTag;
        if (this.selectedItemTag.tag_id == -1) {
            this.getVendingMachineItem()
            // 전체 태그 클릭
        } else {
            this.getVendingMachineItem(0, this.selectedItemTag.tag_id)
            // 세부 태크 클릭
        }
    }


    plusAdditionalTags() {
        this.tagListOffset++;
        this.getHashTagList(this.tagListOffset);
    }

    getVendingMachineItem(i = 0, tag_id?) {
        this.http
            .get('vendingmachine/items/1', {
                params: {
                    limit: 12 + '',
                    offset: (12 * i) + '',
                    tag_id: tag_id ? tag_id : 'no'
                }
            })
            .toPromise()
            .then((r: any) => {
                this.items = r.items;
                this.totalRecords = r.totalRecords;



                // console.log(this.items)
            })
            .catch(e => {
                console.log(e)
            })
    }


    getHashTagList(i = 0) {

        this.http
            .get('vendingmachine/hashtag/list/1', {
                params: {
                    limit: 9 + '',
                    offset: (9 * i) + ''
                }
            })
            .toPromise()
            .then((r: any) => {
                if (r.length == 0) {
                    alert('더 이상 가져올 태그가 없습니다.')
                    return
                }


                let _newTags = [];
                r.forEach(tag => {
                    let found = this.itemHashTags.findIndex(itemTag => {
                        return itemTag.HashTag.name == tag.HashTag.name
                    })
                    if (found < 0) {
                        _newTags.push(tag)
                    }

                })
                this.itemHashTags = this.itemHashTags.concat((_newTags) as any);
            })
            .catch(e => {
                console.log(e)
            })


    }


}