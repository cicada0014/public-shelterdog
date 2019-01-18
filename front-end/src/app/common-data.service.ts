
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { RefugesAttribute } from './types/schema.types';

// @Injectable()
// export class CommonDataService {




//     private refugesList: RefugesAttribute[] = [];
//     public getRefugesList() {
//         return this.refugesList
//     }


//     constructor(
//         private http: HttpClient
//     ) {
//     }


//     readyRefugesList() {
//         if (this.refugesList.length === 0) {
//             return this.http
//                 .get('refuges/list')
//                 .toPromise()
//                 .then((data) => {
//                     this.refugesList = data as any
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 })
//         }




//     }




// }