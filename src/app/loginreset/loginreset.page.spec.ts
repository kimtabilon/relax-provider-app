import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginresetPage } from './loginreset.page';

describe('LoginresetPage', () => {
  let component: LoginresetPage;
  let fixture: ComponentFixture<LoginresetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginresetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginresetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
