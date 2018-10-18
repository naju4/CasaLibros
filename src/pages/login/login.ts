import {Component} from "@angular/core";
import {NavController, NavParams, AlertController, ToastController, MenuController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import { RestProvider } from '../../services/rest/rest';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user: any = {};
  showUser: boolean = false;
  responseData : any;
  userData = {"username": "","password": ""};
  
  constructor(public nav: NavController, public navParams: NavParams, public forgotCtrl: AlertController, public menu: MenuController, public restProvider:RestProvider, public toastCtrl: ToastController,private facebook: Facebook
    ) {
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    if(this.userData.username&&this.userData.password){
      // Your app login API web service call triggers
      this.restProvider.postData(this.userData,'login').then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      if(this.responseData.userData){
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        //this.navCtrl.push(TabsPage);
        this.nav.setRoot(HomePage);
      }else{
        this.presentToast("Use username y password validos");
      }

     }, (err) => {
       // Error log
     });
   }else{
     this.presentToast("username y password se encuentran vacios");
   }    
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Perdiste tú contraseña?',
      message: "Ingresa tu email y te enviamos el link para que resetees tu contraseña.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email enviado correctamente',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  loginFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      console.log(rta.status);
      if(rta.status == 'connected'){
        this.getInfo();
      };
    })
    .catch(error =>{
      console.error( error );
    });
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data=>{
      console.log(data);
      this.showUser = true; 
      this.user = data;
    })
    .catch(error =>{
      console.error( error );
    });
  }
}
