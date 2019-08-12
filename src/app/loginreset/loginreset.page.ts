import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-loginreset',
  templateUrl: './loginreset.page.html',
  styleUrls: ['./loginreset.page.scss'],
})
export class LoginresetPage implements OnInit {

  hero:any;

  constructor(
    private http: HttpClient,
  	private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    public getService: GetService,
    public loading: LoadingService,
    private env: EnvService
  ) { }

  ngOnInit() {
  }

  reset(form: NgForm) {
    this.loading.present();

    if(form.value.name != '' && form.value.email != '') 
    { 
      console.log(form.value);	
      this.http.post(this.env.HERO_API + 'hero/mail/resetpassword',{name: form.value.name, email: form.value.email})
	    .subscribe(data => {
	        let response:any = data;
	        this.loading.dismiss();
	        this.alertService.presentToast("Check your email for new password");
	    },error => { 
	    	this.loading.dismiss();
	    	this.alertService.presentToast("Account not found.");
	    	console.log(error); 
	    });
    } else {
      this.loading.dismiss();
      this.alertService.presentToast("Required name and email");
    }
      
  }

  ionViewWillEnter() {
    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  

    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/tabs/home');
      }
    });
  }

}
