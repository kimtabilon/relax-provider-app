import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-resendemail',
  templateUrl: './resendemail.page.html',
  styleUrls: ['./resendemail.page.scss'],
})
export class ResendemailPage implements OnInit {

  constructor(
  	private http: HttpClient,
  	private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
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
      this.http.post(this.env.API_URL + 'hero/mail/resendactivation',{password: form.value.password, email: form.value.email})
	    .subscribe(data => {
	        let response:any = data;
          console.log(response);

	        this.loading.dismiss();
	        this.alertService.presentToast("Check your Email for New Activation Link");
	    },error => { 
	    	this.loading.dismiss();
	    	this.alertService.presentToast("Account not Found");
	    	console.log(error); 
	    });
    } else {
      this.loading.dismiss();
      this.alertService.presentToast("Required Email and Password");
    }
      
  }

  ionViewWillEnter() {
    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  
  }

}
