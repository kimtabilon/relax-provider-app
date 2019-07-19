import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  user: User;  
  profile: Profile;	
  service:any;
  serviceExist:any = false;
  pay_type:any = '';
  heroService:any = {
    id: '',
    hero_id: '',
    service_id: '',
    pay_per: '',
    status: '0'
  };
  title:any;

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute,
    public loading: LoadingService,
    private http: HttpClient,
    private env: EnvService
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  doRefresh(event) {
    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
      this.heroService.hero_id = this.user.id;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      this.service = JSON.parse(res.service);
      this.heroService.service_id = this.service.id;
      this.pay_type = this.service.pay_type;
      this.title = this.service.name;
      
      if(this.service.pivot) {
        this.heroService.pay_per = this.service.pivot.pay_per;
        this.heroService.id = this.service.pivot.id;
        this.serviceExist = true;
      } else {
        this.heroService.id = '';
        this.heroService.pay_per = '';
        this.serviceExist = false;
      }
    });
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present();
    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
      this.heroService.hero_id = this.user.id;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      this.service = JSON.parse(res.service);
      this.heroService.service_id = this.service.id;
      this.pay_type = this.service.pay_type;
      this.title = this.service.name;
      
      if(this.service.pivot) {
        this.heroService.pay_per = this.service.pivot.pay_per;
        this.heroService.id = this.service.pivot.id;
        this.serviceExist = true;
      } else {
        this.heroService.id = '';
        this.heroService.pay_per = '';
        this.serviceExist = false;
      }
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/home'],{
      queryParams: {},
    }); 
    this.loading.dismiss();  
  }

  tapNext() {
    this.loading.present();

    /*Save Hero Service*/
    this.http.post(this.env.HERO_API + 'hero_services/save',this.heroService)
      .subscribe(data => { this.heroService.pay_per = '';
      },error => { this.alertService.presentToast("Server not responding!"); 
      },() => { this.navCtrl.navigateRoot('/tabs/home'); });

    this.loading.dismiss();
  }

  tapRemove() {
    this.loading.present();

    // console.log(this.heroService);

    /*Save Hero Service*/
    this.http.post(this.env.HERO_API + 'hero_services/delete',this.heroService)
      .subscribe(data => { this.heroService.pay_per = '';
      },error => { this.alertService.presentToast("Server not responding!"); 
      },() => { this.navCtrl.navigateRoot('/tabs/home'); });

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
