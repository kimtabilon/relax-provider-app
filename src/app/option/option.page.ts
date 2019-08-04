import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
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
  photo:any = '';
  options:any;
  title:any;
  backTitle:any;
  services:any;
  heroes:any;
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public router : Router,
    private env: EnvService,
    public activatedRoute : ActivatedRoute
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
        this.heroes = JSON.parse(res.service).heroes;
        this.options = JSON.parse(res.service).options;
        this.title = JSON.parse(res.service).name;
        this.services = JSON.parse(res.services);
        this.backTitle = res.backTitle;
    });

    this.loading.dismiss();

  }

  tapOption(option) {
    this.loading.present();
    // console.log(option.form.length);
    if(option.form !== null) {
      this.router.navigate(['/tabs/form'],{
        queryParams: {
            option : JSON.stringify(option),
            heroes : JSON.stringify(this.heroes)
        },
      });
    } else {
      // this.alertService.presentToast("No Form Available");
    }  
    this.loading.dismiss(); 
  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/service'],{
      queryParams: {
          value : JSON.stringify({
            services : this.services,
            name: this.backTitle
          })
      },
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
