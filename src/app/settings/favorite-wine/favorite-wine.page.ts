import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RadioGroupComponent } from 'src/app/components/wines-radio-group/wines-radio-group.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WineType } from 'src/app/core/types/WineType';

@Component({
  selector: 'app-favorite-wine',
  standalone: true,
  templateUrl: './favorite-wine.page.html',
  styleUrls: ['./favorite-wine.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    ReactiveFormsModule,
    RadioGroupComponent
  ],
})
export class FavoriteWinePage implements OnInit {
  wineForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private transloco: TranslocoService
  ) {
    this.wineForm = this.fb.group({
      selectedType: [null as WineType | null, Validators.required],
    });
  }

  ngOnInit() {
  }

  get favoriteWine(): WineType | null {
    return history.state.favoriteWine || null;
  }

  async updateFavoriteWine() {
    this.loading = true;
    if (this.wineForm.valid) {
      const selectedType: WineType = this.wineForm.get('selectedType')?.value;

      await this.authService.updateFavoriteWine(selectedType).then(() => {
        this.toastService.success(this.transloco.translate('SETTINGS.FAVORITE_WINE.UPDATE_SUCCESS'));
        this.goBack();
      }).catch(err => {
        this.toastService.error(this.transloco.translate('SETTINGS.FAVORITE_WINE.UPDATE_ERROR', { error: err.message }));
      })
      .finally(() => this.loading = false);
    }
  }

  goBack() {
    this.location.back();
  }
}
