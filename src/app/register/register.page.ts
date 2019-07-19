import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

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

  register(form: NgForm) {
    this.loading.present();
    this.authService.register(
        form.value.first_name, 
        form.value.middle_name, 
    		form.value.last_name, 
    		
        form.value.street, 
        form.value.city, 
        form.value.province, 
        form.value.country, 
    		form.value.zip, 

    		form.value.birthmonth, 
    		form.value.birthday, 
    		form.value.birthyear, 
    		form.value.phone_number,   

        form.value.email, 
    		form.value.password,
    		form.value.password_confirm
    	).subscribe(
      data => {
        // console.log(data);
        this.authService.login(form.value.email, form.value.password).subscribe(
          data => {
            console.log(data);
            this.storage.set('hero', data);
          },
          error => {
            this.alertService.presentToast(error.message);
            console.log(error);
          },
          () => {
            this.navCtrl.navigateRoot('/tabs/home');
          }
        );
        this.alertService.presentToast('You are now registered!');
      },
      error => {
        this.alertService.presentToast(error.message);
        console.log(error);
      },
      () => {
        
      }
    );
    this.loading.dismiss();
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
