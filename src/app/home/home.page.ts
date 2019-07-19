import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { JobService } from 'src/app/services/job.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;  
  profile: Profile;	
  categories:any;
  app:any;
  myServices:any;

  constructor(
    private http: HttpClient,
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public getService: GetService,
    public jobService: JobService,
    public router : Router,
    private env: EnvService
  ) { 
  	this.menu.enable(true);	
  }

  ngOnInit() {
    
  }

  doRefresh(event) {
    this.authService.validateApp();

    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  

    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;    

      /*Get My Services*/
      this.http.post(this.env.HERO_API + 'hero/services',{id: this.user.id})
        .subscribe(data => {
            this.myServices = data;
            this.myServices = this.myServices.data.services;
        },error => { });

      this.storage.get('app').then((val) => {
        this.app = val.data;
      }); 
    });

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present();

    this.authService.validateApp();

    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  

    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;    

      /*Get My Services*/
      this.http.post(this.env.HERO_API + 'hero/services',{id: this.user.id})
        .subscribe(data => {
            this.myServices = data;
            this.myServices = this.myServices.data.services;
        },error => { });

      this.storage.get('app').then((val) => {
        this.app = val.data;
      }); 
    });

    this.loading.dismiss();
  }

  tapService(service) {
    this.loading.present();
    if(service.pivot.status) {
      this.router.navigate(['/tabs/form'],{
        queryParams: {
            service : JSON.stringify(service)
        },
      });
    } else {
      this.alertService.presentToast("Service not active");
    }
    this.loading.dismiss();
      
  }

  logout() {
    this.loading.present();
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
