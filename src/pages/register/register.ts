import {Component} from "@angular/core";
import {NavController,NavParams, ToastController,} from "ionic-angular";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";
import { RestProvider } from '../../services/rest/rest';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  responseData : any;
  userData = {"username": "sandroda","password": "12345678", "name": "juliomario","email": "jmo280@gmail.com"};
  constructor(public nav: NavController, public navParams: NavParams, public toastCtrl:ToastController, public restProvider:RestProvider) {
  }

  // register and go to home page
  register() {
    this.restProvider.saveUser(this.userData,'signup').then((res) => {
      this.presentToast("Usuario registrado con éxito");
      this.responseData = res;
      if(this.responseData.userData){
        console.log(this.responseData);
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        this.nav.setRoot(HomePage);
      }else{
        console.log("El usuario o el mail ya se encuentra registrado");
      }
    }, (err) => {
      if (err.status <= 200 || err.status >= 300) {
          //this.presentToast("Tranquilo todo esta bien");
          //this.presentToast(res.username);
      }else {
          this.presentToast(err.status);
      }
      //this.presentToast(err.status);
      //this.presentToast(err.name);
      //this.presentToast(err.message);
      //this.presentToast(err.status);
    });

    /*this.authService.saveUser(this.userData,'signup').then((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });*/
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
   }

}
