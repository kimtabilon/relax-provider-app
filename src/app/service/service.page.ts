import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  user: User;  
  profile: Profile;	
  services:any;
  title:any;

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public getService: GetService,
    public router : Router,
    public activatedRoute : ActivatedRoute
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  doRefresh(event) {
    this.authService.validateApp();
    this.storage.get('hero').then((val) => {
      // console.log(val.data);
      this.user = val.data;
      this.profile = val.data.profile;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
        this.services = JSON.parse(res.value).services;
        this.title = JSON.parse(res.value).name;
    });
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present();
    this.authService.validateApp();
    this.storage.get('hero').then((val) => {
      // console.log(val.data);
      this.user = val.data;
      this.profile = val.data.profile;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
        this.services = JSON.parse(res.value).services;
        this.title = JSON.parse(res.value).name;
    });

    this.loading.dismiss();
  }

  tapService(service) {
    // console.log(this.services);
    this.loading.present();
    this.router.navigate(['/tabs/form'],{
      queryParams: {
          service : JSON.stringify(service)
      },
    });
    
    this.loading.dismiss();
  }

  tapBack() {
    // console.log(service);
    this.loading.present();
    this.router.navigate(['/tabs/category'],{
      queryParams: {},
    });
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
