import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatPage } from '../chat/chat.page';
import { ReviewPage } from '../review/review.page';

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

  enableCancel:any = false;
  enableNoshow:any = false;

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
    public alertCtrl: AlertController,
    public modalController: ModalController,
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

            if(this.noti_id == undefined) {
              this.noti_id = this.job.noti_id;
            }

            /*NOSHOW*/
            let curday = function(sp){
              let today:any = new Date();
              let dd:any = today.getDate();
              let mm:any = today.getMonth()+1; //As January is 0.
              let yyyy:any = today.getFullYear();

              if(dd<10) dd='0'+dd;
              if(mm<10) mm='0'+mm;
              return (yyyy+sp+mm+sp+dd);
            };

            let now:any = new Date();
            now.setMinutes(now.getMinutes() + 30); 

            let curtime:any = new Date(now);

            let schedtime:any = new Date(this.job.schedule_date+ ' ' +this.job.schedule_time);

            let curdate:any = new Date(curday('-')+' '+'00:00');
            let scheddate:any = new Date(this.job.schedule_date);

            if(curdate >= scheddate && curtime >= schedtime) {
              this.enableNoshow = true;
            } else {
              this.enableNoshow = false;
            }

            if(this.job.status == 'Cancelled' || this.job.status == 'Completed') {
              this.enableCancel = false;
            } else {
              this.enableCancel = true;
            }

            if(this.job.status == 'No Show : Client' || this.job.status == 'No Show : Hero' || this.job.status == 'Cancelled' || this.job.status == 'Denied' || this.job.status == 'Completed') {
              this.enableNoshow = false;
            }

            
            this.loading.dismiss();
        },error => { 
          console.log(error);
          this.title = 'Back'; 
          this.alertService.presentToast("Client removed this job.");

          this.http.post(this.env.HERO_API + 'inboxes/hide',{id: this.noti_id})
          .subscribe(data => {
              let response:any = data;
              this.loading.dismiss();
          },error => { 
            this.loading.dismiss(); 
            console.log(error);
          },() => { 
            this.loading.dismiss();
            this.navCtrl.navigateRoot('/tabs/job'); 
          });

          this.loading.dismiss(); 
        }); 
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
      header: 'Confirm Job?',
      message: 'If you wish to accept this job, tap continue.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.loading.present();
            /*Confirm Jobs*/
            this.http.post(this.env.HERO_API + 'jobs/confirm',{id: this.job.id, noti_id: this.noti_id})
              .subscribe(data => {
                this.loading.dismiss();
              },error => { 
                this.alertService.presentToast("Client removed this job.");
                
                this.http.post(this.env.HERO_API + 'inboxes/hide',{id: this.noti_id})
                .subscribe(data => {
                    let response:any = data;
                    this.loading.dismiss();
                },error => { 
                  this.loading.dismiss(); 
                  console.log(error);
                },() => { 
                  this.loading.dismiss();
                  this.navCtrl.navigateRoot('/tabs/inbox'); 
                });

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

  async tapStartJob() {
    let alert = await this.alertCtrl.create({
      header: 'Start Job?',
      message: 'Client will receive notification for this action.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.loading.present();
            /*Confirm Jobs*/
            this.http.post(this.env.HERO_API + 'jobs/start',{id: this.job.id})
              .subscribe(data => {
                this.loading.dismiss();
              },error => { 
                this.alertService.presentToast("Client removed this job.");
                
                // this.http.post(this.env.HERO_API + 'inboxes/hide',{id: this.noti_id})
                // .subscribe(data => {
                //     let response:any = data;
                //     this.loading.dismiss();
                // },error => { 
                //   this.loading.dismiss(); 
                //   console.log(error);
                // },() => { 
                //   this.loading.dismiss();
                //   this.navCtrl.navigateRoot('/tabs/inbox'); 
                // });

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
      header: 'Deny Job?',
      message: 'By tapping continue, the job will get denied.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
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
      },error => { 
        this.alertService.presentToast("Server not responding!");
        console.log(error);
      },() => { 
        this.navCtrl.navigateRoot('/tabs/job'); 
      });  

    this.loading.dismiss();
  }

  async tapNoShow() {

    let alert = await this.alertCtrl.create({
      header: 'Client not showing?',
      message: 'By tapping continue, the job will tag as No Show.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.loading.present();
            this.http.post(this.env.HERO_API + 'jobs/noshowclient',{id: this.job.id})
              .subscribe(data => {
              },error => { 
                this.alertService.presentToast("Server no response");
                console.log(error);
              },() => { this.navCtrl.navigateRoot('/tabs/job'); }
            ); 
          }
        }
      ]
    });
    await alert.present();
  }

  async chatHero() {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { 
        job: this.job,
        customer: this.customer_info
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let response:any = data;
    });

    return await modal.present();
  }

  async tapReview() {

    const modal = await this.modalController.create({
      component: ReviewPage,
      componentProps: { 
        job: this.job
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let response:any = data;
    });

    return await modal.present();
  }

  logout() {
    this.loading.present();
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
