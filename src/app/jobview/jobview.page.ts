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
  selector: 'app-jobview',
  templateUrl: './jobview.page.html',
  styleUrls: ['./jobview.page.scss'],
})
export class JobviewPage implements OnInit {

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
  job:any = [];
  attributes:any = [];
  form:any = [];
  status:any = '';
  title:any = 'Please wait...';
  customer_info:any = [];
  formExist:any = false;
  hero:any = [];
  heroExist:any = false;
  noti_id:any = '';

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
    public alertCtrl: AlertController
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
      let job_id:any = res.job_id;
      this.noti_id = res.noti_id;

      this.http.post(this.env.HERO_API + 'jobs/byID',{id: job_id})
        .subscribe(data => {
            let response:any = data;
            this.job = response.data;
            this.attributes = JSON.parse(this.job.form_value);
            this.customer_info = JSON.parse(this.job.customer_info);
            this.status = this.job.status;

            if(this.job.form !== null) {
              this.form = this.job.form;
              this.formExist = true;
            }else{
              this.formExist = false;
            }

            if(this.job.hero !== null) {
              this.hero = this.job.hero;
              this.heroExist = true;
            } else {
              this.heroExist = false;
            }

            if(this.job.status == 'For Confirmation') {
              this.title = 'Confirm Job';
            } else {
              this.title = 'Job Info';
            }
            this.loading.dismiss();
        },error => { this.title = 'Back'; this.loading.dismiss(); });

          
    });

  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/job'],{
      queryParams: {},
    }); 
    this.loading.dismiss();  
  }

  async tapConfirm() {

    let alert = await this.alertCtrl.create({
      header: '',
      message: 'Confirm Job?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.loading.present();
            /*Confirm Jobs*/
            this.http.post(this.env.HERO_API + 'jobs/confirm',{id: this.job.id, noti_id: this.noti_id})
              .subscribe(data => {
                this.loading.dismiss();
              },error => { 
                this.alertService.presentToast("Server not responding!");
                this.loading.dismiss();
                console.log(error);
              },
              () => { this.navCtrl.navigateRoot('/tabs/job'); }
            );  
          }
        }
      ]
    });
    await alert.present();
  }

  async tapDeny() {

    let alert = await this.alertCtrl.create({
      header: '',
      message: 'Deny Job?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Deny',
          handler: () => {
            this.loading.present();
            /*Confirm Jobs*/
            this.http.post(this.env.HERO_API + 'jobs/deny',{id: this.job.id, noti_id: this.noti_id})
              .subscribe(data => {
                this.loading.dismiss();
              },error => { 
                console.log(error);
                this.alertService.presentToast("Server not responding!");
                this.loading.dismiss();
              },
              () => { this.navCtrl.navigateRoot('/tabs/job'); }
            );  
          }
        }
      ]
    });
    await alert.present();
  }

  tapDone() {
    this.loading.present();

    /*Confirm Jobs*/
    this.http.post(this.env.HERO_API + 'jobs/done',{id: this.job.id})
      .subscribe(data => {
      },error => { this.alertService.presentToast("Server not responding!");
    },() => { this.navCtrl.navigateRoot('/tabs/job'); });  

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
