import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuModelsComponent } from './menu-models.component';

describe('MenuModelsComponent', () => {
  let component: MenuModelsComponent;
  let fixture: ComponentFixture<MenuModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
