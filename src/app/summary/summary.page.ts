import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  user: User;  
  profile: Profile;	
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
    });

  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
