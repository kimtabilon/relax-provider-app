import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController } from '@ionic/angular';
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
  option:any = [];
  optionExist:any = false;
  pay_type:any = '';
  heroOption:any = {
    id: '',
    hero_id: '',
    option_id: '',
    pay_per: '',
    status: 'Disable'
  };
  title:any;

  category_id:any;
  service_id:any;

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
    private env: EnvService,
    public alertController: AlertController,
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

      this.heroOption.hero_id = this.user.id;

      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      this.service_id = res.service_id;
      this.category_id = res.category_id;
      this.option = JSON.parse(res.option);
      this.heroOption.option_id = this.option.id;
      
      this.pay_type = this.option.pay_type;
      this.title = this.option.name;

      
      if(this.option.pivot) {
        this.heroOption.pay_per = this.option.pivot.pay_per;
        this.heroOption.id = this.option.pivot.id;
        this.optionExist = true;
      } else {
        this.heroOption.id = '';
        this.heroOption.pay_per = '';
        this.optionExist = false;
      }
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.loading.present();
    if(this.service_id != null) {
      this.router.navigate(['/tabs/option'],{
        queryParams: {
          service_id : this.service_id,
          category_id : this.category_id,
        },
      }); 
    } else {
      this.router.navigate(['/tabs/home'],{
        queryParams: {},
      }); 
    }
    
    this.loading.dismiss();  
  }

  async tapNext() {
    if(this.heroOption.pay_per >= 200) {
      const alert = await this.alertController.create({
        header: 'Save '+this.option.name+'?',
        message: 'For the meantime, service will be inactive. Admin will notify you when its active. Continue if you want to save this service.',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              // console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Continue',
            handler: () => {
              
                this.http.post(this.env.HERO_API + 'hero_options/save',this.heroOption)
                .subscribe(data => { 
                  this.heroOption.pay_per = '';
                },error => { 
                  console.log(error);
                  this.alertService.presentToast("Server not responding!"); 
                },() => { this.navCtrl.navigateRoot('/tabs/home'); });
              
            }
          }
        ]
      });

      await alert.present();

    } else {
      this.alertService.presentToast("Minimun per hour is 200"); 
    }
  }

  async tapRemove() {
    const alert = await this.alertController.create({
      header: 'Remove '+this.option.name+'?',
      message: 'Continue if you want to delete this service.',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.http.post(this.env.HERO_API + 'hero_options/delete',this.heroOption)
            .subscribe(data => { this.heroOption.pay_per = '';
            },error => { this.alertService.presentToast("Server not responding!"); 
            },() => { this.navCtrl.navigateRoot('/tabs/home'); });
          }
        }
      ]
    });

    await alert.present();

    // this.loading.present();

    // console.log(this.heroService);

    /*Save Hero Service*/
    

    // this.loading.dismiss();
  }

  logout() {
    this.loading.present();
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
