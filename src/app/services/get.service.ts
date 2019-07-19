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

export class GetService {

  service:any;

  constructor(
  	private http: HttpClient,
    private storage: Storage,
    private env: EnvService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  all() {
    this.http.post(this.env.HERO_API + 'categories/all',
      {key: this.env.APP_ID}
    ).subscribe(
        data => {
          this.storage.set('categories', data);
        },
        error => {
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }

  myServices(id) {
    this.http.post(this.env.HERO_API + 'hero/services',
      {id: id}
    ).subscribe(
        data => {
          this.service = data;
          console.log(this.service.data.services);
          this.storage.set('myservices', this.service.data.services);
        },
        error => {
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );

    // return this.http
    //     .post(this.env.HERO_API + 'hero/services',{id: id})
    //     .pipe(
    //       tap(data => {
    //         console.log(data);
    //         return data;
    //       })
    //     );
  }
}
