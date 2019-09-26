import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  user:any = {
    email: '',
    password: '',
    status: ''
  };  
  profile:any = {
    first_name: '',
    middle_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    photo: ''
  };  
  photo:any;
  services:any = [];
  title:any = 'Please wait...';

  category_id:any;

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public router : Router,
    private env: EnvService,
    public activatedRoute : ActivatedRoute,
    private http: HttpClient,
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  doRefresh(event) {
    this.ionViewWillEnter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present();
    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }
    });

    this.activatedRoute.queryParams.subscribe((res)=>{

        let category_id:any = res.category_id;

        this.http.post(this.env.HERO_API + 'categories/byID',{app_key: this.env.APP_ID, id: category_id })
          .subscribe(data => {
            let response:any = data;
            if(response !== null) {
              let category:any = response.data;
              this.services = category.services;
              this.title = category.name;  
              this.category_id = category.id;  
            }
            
          },error => { console.log(error);  
        });
    });

    this.loading.dismiss();
  }

  tapService(service) {
    // console.log(this.services);
    this.loading.present();
    
    // this.router.navigate(['/tabs/form'],{
    //   queryParams: {
    //       service : JSON.stringify(service)
    //   },
    // });

    if(service.options.length) {
      this.router.navigate(['/tabs/option'],{
        queryParams: {
            service_id : service.id,
            category_id : this.category_id
        },
      });
    }
    
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
