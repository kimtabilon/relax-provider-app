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
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

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
  categories:any = [];
  app:any = [];
  jobs:any = [];
  title:any = 'Please wait...';

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

    this.authService.validateApp();

    this.storage.get('hero').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;    
      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }

      /*Get My Jobs*/
      this.http.post(this.env.HERO_API + 'jobs/forquotation',{id: this.user.id})
        .subscribe(data => {
            let response:any = data;
            this.jobs = response.data;
            this.title = 'My Inbox';
        },error => { console.log(error); this.title = 'My Inbox'; });


      this.storage.get('app').then((val) => {
        this.app = val.data;
      }); 
    });
    
    this.loading.dismiss();
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

      case "For Confirmation":
        this.router.navigate(['/tabs/jobview'],{
            queryParams: {
                job_id : job.id
            },
          });
        
        break;  
    	
    	default:
    		break;
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
