import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import { UsernameValidator } from '../validators/username.validator';
import { PhoneValidator } from '../validators/phone.validator';
import { PasswordValidator } from '../validators/password.validator';
import { CountryPhone } from './country-phone.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  countries: Array<CountryPhone>;
  genders: Array<string>;

  constructor(
    private http: HttpClient,
  	private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    public loading: LoadingService,
    private env: EnvService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.countries = [
      new CountryPhone('PH', 'Philippines')
    ];

    this.genders = [
      "Male",
      "Female"
    ];

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.validations_form = this.formBuilder.group({
      // username: new FormControl('', Validators.compose([
      //   UsernameValidator.validUsername,
      //   Validators.maxLength(25),
      //   Validators.minLength(5),
      //   Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      //   Validators.required
      // ])),
      first_name: new FormControl('', Validators.required),
      middle_name: new FormControl(''),
      last_name: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      birthyear: new FormControl('', Validators.required),
      birthmonth: new FormControl('', Validators.required),
      gender: new FormControl(this.genders[0], Validators.required),
      country_phone: this.country_phone_group,
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),

      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validation_messages = {
    // 'username': [
    //   { type: 'required', message: 'Username is required.' },
    //   { type: 'minlength', message: 'Username must be at least 5 characters long.' },
    //   { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
    //   { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
    //   { type: 'validUsername', message: 'Your username has already been taken.' }
    // ],
    'first_name': [
      { type: 'required', message: 'First name is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'birthday': [
      { type: 'required', message: 'Birthday is required.' }
    ],
    'birthyear': [
      { type: 'required', message: 'Year is required.' }
    ],
    'birthmonth': [
      { type: 'required', message: 'Month is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'The phone is incorrect.' }
    ],
    'street': [
      { type: 'required', message: 'Street is required.' }
    ],
    'city': [
      { type: 'required', message: 'City is required.' }
    ],
    'province': [
      { type: 'required', message: 'Province is required.' }
    ],
    'country': [
      { type: 'required', message: 'Country is required.' }
    ],
    'zip': [
      { type: 'required', message: 'Zip is required.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch.' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  onSubmit(values) {
    this.loading.present();
    if(this.validations_form.valid) {
      console.log(values);
      this.authService.register(
          values.first_name, 
          values.middle_name, 
          values.last_name, 
          
          values.street, 
          values.city, 
          values.province, 
          values.country, 
          values.zip, 

          values.birthmonth, 
          values.birthday, 
          values.birthyear, 
          values.gender, 
          values.country_phone.phone,   

          values.email, 
          values.matching_passwords.password,
          values.matching_passwords.confirm_password
        ).subscribe(
        data => {
          this.loading.dismiss();
          this.alertService.presentToast('You are now registered! Check your email to activate account.');
          this.navCtrl.navigateRoot('/login');
          console.log(data);
        },
        error => {
          this.loading.dismiss();
          this.alertService.presentToast('Email already exist.');
          console.log(error);
        },
        () => {
          
        }
      );
    } else {
      this.loading.dismiss();
      this.alertService.presentToast('Input all required fields');
    }
  }

  ionViewWillEnter() {
    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  

    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/tabs/home');
      }
    });
    
  }

}
