import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { EnvService } from 'src/app/services/env.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

	@Input() job:any;

	ratings:any = 1;
	reviews:any = '';
	job_id:any;

  constructor(
  	public modalController: ModalController,
    public alertController: AlertController,
    private env: EnvService,
    private http: HttpClient,
    public loading: LoadingService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  	console.log(this.job);
  }

  writeReview(form: NgForm) {

  	if(form.value.ratings != '' && form.value.reviews != '') 
    { 
      this.http.post(this.env.HERO_API + 'reviews/create',{
      		ratings: form.value.ratings, 
      		reviews: form.value.reviews, 
      		job_id: this.job.id, 
      		customer_id: this.job.customer_id,
          customer_info: this.job.customer_info,
      		hero_id: this.job.hero_id,
          from: 'provider',
      })
	    .subscribe(data => {
	        let response:any = data;

	        this.loading.dismiss();
	        this.dismiss();
	    },error => { 
	    	this.loading.dismiss();
	    	this.alertService.presentToast("Something went wrong. Try again later.");
	    	// this.dismiss();
	    	console.log(error); 
	    });
    } else {
      this.loading.dismiss();
      this.alertService.presentToast("Please input ratings and reviews");
    }
  }

  parse(customer_info) {
    return JSON.parse(customer_info);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      input: {}
    });
  }

}
