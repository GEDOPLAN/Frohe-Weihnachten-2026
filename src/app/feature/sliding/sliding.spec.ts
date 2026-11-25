import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sliding } from './sliding';

describe('Sliding', () => {
  let component: Sliding;
  let fixture: ComponentFixture<Sliding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sliding],
    }).compileComponents();

    fixture = TestBed.createComponent(Sliding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
