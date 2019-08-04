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
  selector: 'app-quotation',
  templateUrl: './quotation.page.html',
  styleUrls: ['./quotation.page.scss'],
})
export class QuotationPage implements OnInit {

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
  formExist:any = false;
  status:any = '';
  customer_info:any = [];
  quote:any = {
    hero_id: '',
    job_id: '',
    amount: '0'
  };

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
      this.quote.hero_id = this.user.id;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      let job_id:any = res.job_id;
      this.http.post(this.env.HERO_API + 'jobs/byID',{id: job_id})
        .subscribe(data => {
            let response:any = data;
            this.job = response.data;
            this.attributes = JSON.parse(this.job.form_value);
            this.customer_info = JSON.parse(this.job.customer_info);
            this.quote.job_id = this.job.id;

            this.status = this.job.status;

            if(this.job.form !== null) {
              this.form = this.job.form;
              this.formExist = true;
            }else{
              this.formExist = false;
            }
        },error => { console.log(error) });
            
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/inbox'],{
      queryParams: {},
    }); 
    this.loading.dismiss();  
  }

  tapNext() {
    this.loading.present();

    /*Save Hero Service*/
    this.http.post(this.env.HERO_API + 'quotations/store',this.quote)
      .subscribe(data => { 
      },error => { this.alertService.presentToast("Server not responding!"); 
      },() => { this.navCtrl.navigateRoot('/tabs/inbox'); });

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
