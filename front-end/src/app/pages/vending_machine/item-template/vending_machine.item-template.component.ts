


import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { VendingMachineItemsAttribute } from 'src/app/types/schema.types';
import { Router } from '@angular/router';

@Component({
    selector: 'app-vending-machine-item',
    templateUrl: 'vending_machine.item-template.component.html',
    styleUrls: ['vending_machine.item-template.component.scss']
})

export class VendingMachineItemTemplateComponent implements OnInit {

    @Input('item') item: VendingMachineItemsAttribute = {} as any;



    emptyStars = [];
    filledStars = [];

    constructor(
        private router: Router

    ) {


    }

    goToItem(item: VendingMachineItemsAttribute) {
        this.router.navigateByUrl('vending_machine/cider/' + item.id);
    }


    ngAfterViewInit() {
        this.setMeta();
    }
    ngOnInit() {
    }

    setMeta() {
        if (this.item.meta) {
            let _meta = JSON.parse(this.item.meta);
            this.emptyStars.length = 5 - (_meta.ciderPower ? _meta.ciderPower : 0);
            this.filledStars.length = _meta.ciderPower ? _meta.ciderPower : 0
        }
    }



}