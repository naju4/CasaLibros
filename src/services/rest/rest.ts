import {  HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";
import 'rxjs/add/operator/map';


let apiUrl = 'http://localhost/ApiSlim/api/';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  constructor(public http: HttpClient, public toastCtrl: ToastController) {
    console.log('Hello RestProvider Provider');
  }

  postData(data,type) {
    return new Promise((resolve, reject) => {
      this.presentToast(JSON.stringify(data));
      this.http.post(apiUrl+type,JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
