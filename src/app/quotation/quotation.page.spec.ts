import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationPage } from './quotation.page';

describe('QuotationPage', () => {
  let component: QuotationPage;
  let fixture: ComponentFixture<QuotationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
