import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class JobService {

  jobs:any;

  constructor(
  	private http: HttpClient,
    private storage: Storage,
    private env: EnvService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  myJobs(id, app_id) {
    this.http.post(this.env.HERO_API + 'job/myjobs',
      {id: id, app: app_id}
    ).subscribe(
        data => {
          console.log(data);
          this.storage.set('myjobs', data);
        },
        error => {
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }

  myQuotation(id, app_id) {
    this.http.post(this.env.HERO_API + 'job/myquotes',
      {id: id, app: app_id}
    ).subscribe(
        data => {
          console.log(data);
          this.storage.set('myquotes', data);
        },
        error => {
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }

  forQuotation(app_id) {
    this.http.post(this.env.HERO_API + 'job/forquote',
      {app: app_id}
    ).subscribe(
        data => {
          console.log(data);
          this.storage.set('forquotation', data);
        },
        error => {
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }
}
