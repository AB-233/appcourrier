import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchiveComponent } from './achive.component';

describe('AchiveComponent', () => {
  let component: AchiveComponent;
  let fixture: ComponentFixture<AchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
