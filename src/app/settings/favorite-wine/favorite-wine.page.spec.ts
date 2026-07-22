import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteWinePage } from './favorite-wine.page';

describe('FavoriteWinePage', () => {
  let component: FavoriteWinePage;
  let fixture: ComponentFixture<FavoriteWinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteWinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
