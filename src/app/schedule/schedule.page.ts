import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

	current_date:any = '';
  next_year:any = '';
  new_block_date:any = '';

  @Input() block_dates:any;

  constructor(
  	public modalController: ModalController,
  	private orderPipe: OrderPipe
  ) { }

  ngOnInit() {
  }

  addBlockDate() {
  	this.block_dates.push(this.new_block_date);
  	this.new_block_date = '';
  }

  delete(i) {
  	this.block_dates.splice(i, 1);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      block_dates: this.block_dates
    });
  }

  ionViewWillEnter() {
  	// console.log(this.settings);
  	let curday = function(sp){
      let today:any = new Date();
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; //As January is 0.
      let yyyy:any = today.getFullYear();

      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
      return (yyyy+sp+mm+sp+dd);
    };

    let nextYear = function(sp){
      let today:any = new Date();
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; //As January is 0.
      let yyyy:any = today.getFullYear()+1;

      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
      return (yyyy+sp+mm+sp+dd);
    };
    this.current_date = curday('-');
    this.next_year = nextYear('-');
  }

}
