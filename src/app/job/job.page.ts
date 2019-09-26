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
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit {

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
  app:any = [];
  jobs:any = [];
  jobpage:any = true;
  myjobstitle:any = 'Please wait..';
  completedtitle:any = 'Completed';

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
    this.ionViewWillEnter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present();

    this.jobpage = true;

    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;  
      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      } 

      /*Get My Jobs*/
      this.http.post(this.env.HERO_API + 'hero/jobs',{id: this.user.id})
        .subscribe(data => {
            let response:any = data;
            if(response !== null) {
              this.jobs = response.data;
            } else {
              this.jobs = [];
            }
            this.myjobstitle = 'My Jobs';
            this.loading.dismiss();
        },error => { 
            this.myjobstitle = 'My Jobs'; 
            this.loading.dismiss();
        });


      this.storage.get('app').then((val) => {
        this.app = val.data;
      }); 
    });
  }

  tapJob(job) {
    this.loading.present();

    switch (job.status) {
    	case "For Quotation":
    		this.router.navigate(['/tabs/quotation'],{
		        queryParams: {
		            job_id : job.id
		        },
		      });
    		break; 
    	
    	default:
        this.router.navigate(['/tabs/jobview'],{
            queryParams: {
                job_id : job.id
            },
          });
    		break;
    }
    this.loading.dismiss();
      
  }

  tapCompleted() {
    this.loading.present();
    this.jobpage = false;
    this.completedtitle = 'Please wait...';
    /*Get My Jobs*/
    this.http.post(this.env.HERO_API + 'jobs/completed',{id: this.user.id})
      .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.jobs = response.data;
          } else {
            this.jobs = [];
          }
          this.completedtitle = 'Completed';
      },error => { this.completedtitle = 'Completed'; });
    this.loading.dismiss();  
  } 

  tapMyJobs() {
    this.loading.present();
    this.jobpage = true;
    this.myjobstitle = 'Please wait...';
    /*Get My Jobs*/
    this.http.post(this.env.HERO_API + 'hero/jobs',{id: this.user.id})
      .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.jobs = response.data;
          } else {
            this.jobs = [];
          }
          this.myjobstitle = 'My Jobs';
      },error => { this.myjobstitle = 'My Jobs'; });
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
