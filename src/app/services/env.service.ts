import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'http://heroserviceprovider.herokuapp.com/api/';
  // API_URL = 'http://127.0.0.1:8000/api/';
  
  IMAGE_URL = 'http://www.mjsitechsolutions.com/heroimages/';	
  DEFAULT_IMG = 'http://www.mjsitechsolutions.com/heroimages/uploads/1563851119067.jpg';	
  
  HERO_ADMIN = 'http://heroserviceprovider.herokuapp.com/';
  HERO_API = 'http://heroserviceprovider.herokuapp.com/api/';
  // HERO_ADMIN = 'http://127.0.0.1:8000/';	
  // HERO_API = 'http://127.0.0.1:8000/api/';  
  
  APP_ID = 'heroPROasdfr45fd';

  constructor() { }

  
}
