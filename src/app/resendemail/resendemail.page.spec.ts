import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendemailPage } from './resendemail.page';

describe('ResendemailPage', () => {
  let component: ResendemailPage;
  let fixture: ComponentFixture<ResendemailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendemailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendemailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
