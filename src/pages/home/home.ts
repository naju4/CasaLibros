import {Component} from "@angular/core";
import {NavController, PopoverController, App,AlertController} from "ionic-angular";
import {Storage} from '@ionic/storage';

import {NotificationsPage} from "../notifications/notifications";
import {SettingsPage} from "../settings/settings";
import {TripsPage} from "../trips/trips";
import {SearchLocationPage} from "../search-location/search-location";
import { RestProvider } from '../../services/rest/rest';
import { CommonProvider } from "../../services/common/common";
import { LoginPage } from "../../pages/login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  userDetails : any;
  responseData: any;
  dataSet : any;
  rootPage: any = LoginPage;
  // search condition
  public search = {
    name: "Sin Cazar",
    date: new Date().toISOString()
  }

  userPostData = {"user_id":"","token":"","feed": "","feed_id":""};
  constructor(public common: CommonProvider,private alertCtrl: AlertController,private storage: Storage, public app: App,public nav: NavController, public popoverCtrl: PopoverController,public restProvider:RestProvider) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.getFeed();
  }

  getFeed() {
    this.restProvider.postData(this.userPostData, 'feed')
      .then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.feedData) {
          this.dataSet = this.responseData.feedData;
        } else {}
      }, (err) => {

      });
  }

  feedUpdate() {
    if (this.userPostData.feed) {
      this.common.presentLoading();
      this.restProvider.postData(this.userPostData, "feedUpdate")
      .then((result) => {
        this.responseData = result;
        if (this.responseData.feedData) {
          this.common.closeLoading();
          this.dataSet.unshift(this.responseData.feedData);
          this.userPostData.feed = "";
        } else {
          console.log("No access");
        }
      }, (err) => {
        //Connection failed message
      });
    }
}

feedDelete(feed_id, msgIndex) {
  if (feed_id > 0) {
    let alert = this.alertCtrl.create({
      title: 'Borrar la publicación',
      message: 'Esta seguro de borrar la publicación?',
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: () => {
          this.userPostData.feed_id = feed_id;
          this.restProvider.postData(this.userPostData, "feedDelete")
          .then((result) => {
            this.responseData = result;
            if (this.responseData.success) {
              this.dataSet.splice(msgIndex, 1);
            } else {
              console.log("No access");
            }
          }, (err) => {
            //Connection failed message
          });
        }
      }
      ]
    });
    alert.present();
  }
}

  convertTime(created) {
    let date = new Date(created * 1000);
    return date;
  }

  ionViewWillEnter() {
    // this.search.pickup = "Rio de Janeiro, Brazil";
    // this.search.dropOff = "Same as pickup";
    this.storage.get('pickup').then((val) => {
      if (val === null) {
        this.search.name = "Sin Cazar"
      } else {
        this.search.name = val;
      }
    }).catch((err) => {
      console.log(err)
    });
  }

  // go to result page
  doSearch() {
    this.nav.push(TripsPage);
  }

  // choose place
  choosePlace(from) {
    this.nav.push(SearchLocationPage, from);
  }

  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

  backToWelcome(){
    //const root = this.app.getRootNav();
    //root.popToRoot();
    this.nav.setRoot(LoginPage);
   }

  logout(){
    // Remove API token
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

}

//
