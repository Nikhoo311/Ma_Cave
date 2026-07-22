import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { WINE_TYPE_CONFIG, WineTypeConfig } from '../../core/types/WineType';
import { ToastService } from 'src/app/core/services/toast.service';
import { InputComponent } from "src/app/components/input/input.component";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { User } from 'src/app/core/models/user.model';
import { CustomModalComponent } from "src/app/components/custom-modal/custom-modal.component";

type EditableField = 'firstName' | 'lastName' | 'email';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    TranslocoModule,
    InputComponent,
    CustomModalComponent
],
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
})
export class PersonalInformationPage implements OnInit {
  readonly WINE_TYPE_CONFIG = WINE_TYPE_CONFIG;
  private readonly EDITABLE_FIELDS: EditableField[] = ['firstName', 'lastName', 'email'];

  form!: FormGroup;
  passwordForm!: FormGroup;

  isPasswordModalOpen: boolean = false;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  emailChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    const user = this.user;

    this.form = this.fb.group({
      firstName: [{ value: user?.firstName ?? '', disabled: true }, Validators.required],
      lastName: [{ value: user?.lastName ?? '', disabled: true }, Validators.required],
      email: [{ value: user?.email ?? '', disabled: true }, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get user(): User | null {
    return this.auth.currentUser;
  }

  get isGoogleUser(): boolean {
    return this.user?.provider === 'google';
  }

  get fullName(): string {
    return `${this.user?.firstName ?? ''} ${this.user?.lastName ?? ''}`.trim();
  }

  get initials(): string {
    const first = this.user?.firstName?.[0] ?? '';
    const last = this.user?.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || '?';
  }

  get favoriteWineConfig(): WineTypeConfig | null {
    const type = this.user?.favoriteWineType;
    return type ? this.WINE_TYPE_CONFIG[type] : null;
  }

  goBack(): void {
    this.location.back();
  }

  goToFavoriteWine(): void {
    this.router.navigate(['/settings/favorite-wine'], {
      state: { favoriteWine: this.auth.currentUser?.favoriteWineType }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email } = this.form.getRawValue();
    const emailChanged = email !== this.user?.email;

    if (emailChanged && !this.isGoogleUser) {
      this.promptPasswordThenSave(firstName, lastName, email);
      return;
    }

    this.persistPersonalInfo(firstName, lastName, email);
  }

  private async promptPasswordThenSave(firstName: string, lastName: string, email: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.EMAIL_CHANGE_CONFIRM.HEADER'),
      message: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.EMAIL_CHANGE_CONFIRM.MESSAGE'),
      inputs: [
        { 
          name: 'password', 
          type: 'password', 
          placeholder: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.EMAIL_CHANGE_CONFIRM.PASSWORD_PLACEHOLDER') 
        }
      ],
      buttons: [
        { 
          text: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.EMAIL_CHANGE_CONFIRM.CANCEL'), 
          role: 'cancel' 
        },
        {
          text: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.EMAIL_CHANGE_CONFIRM.CONFIRM'),
          handler: (data: { password?: string }) => this.persistPersonalInfo(firstName, lastName, email, data?.password),
        },
      ],
      mode: 'ios',
    });
    await alert.present();
  }

  private persistPersonalInfo(firstName: string, lastName: string, email: string, password?: string): void {
    const emailChanged = email !== this.user?.email;

    this.auth.updatePersonalInfo({ firstName, lastName, email }, password)
      .then(() => {
        if (emailChanged) {
          this.emailChanged = true;
          this.toastService.info(this.translocoService.translate('SETTINGS.INFO_PERSONAL.EMAIL_CONFIRMATION_SENT'))
        } else {
          this.toastService.success(this.translocoService.translate('SETTINGS.INFO_PERSONAL.UPDATE_SUCCESS'));
          this.goBack();
        }
      })
      .catch((error) => {
        this.toastService.error(this.translocoService.translate('SETTINGS.INFO_PERSONAL.UPDATE_ERROR', { error: this.translocoService.translate(error.message) }));
      });
  }

  openPasswordModal(): void {
    if (this.isGoogleUser) return;
    this.passwordForm.reset();
    this.isPasswordModalOpen = true;
  }

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
  }

  submitPasswordChange(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.toastService.warning(this.translocoService.translate('SETTINGS.CHANGE_PASSWORD.MISMATCH'));
      return;
    }

    this.auth.updatePassword(oldPassword, newPassword)
      .then(() => {
        this.closePasswordModal();
        this.toastService.success(this.translocoService.translate('SETTINGS.CHANGE_PASSWORD.SUCCESS'));
      })
      .catch((err: { message?: string }) => {
        this.toastService.error(this.translocoService.translate(err.message || 'SETTINGS.CHANGE_PASSWORD.ERROR'));
      });
  }

  logout(): void {
    this.auth.logout();
  }

  async confirmDeleteAccount(): Promise<void> {
    const isGoogle = this.isGoogleUser;

    const alert = await this.alertCtrl.create({
      cssClass: 'delete-alert',
      header: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.CONFIRM_HEADER'),
      message: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.CONFIRM_MESSAGE'),
      inputs: isGoogle ? [] : [
        { 
          name: 'password', 
          type: 'password', 
          placeholder: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.PASSWORD_PLACEHOLDER') 
        }
      ],
      buttons: [
        { 
          text: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.CANCEL'), 
          role: 'cancel' 
        },
        {
          text: this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.CONFIRM'),
          role: 'destructive',
          handler: (data: { password?: string }) => this.deleteAccount(data?.password),
        },
      ],
      mode: 'ios',
    });
    await alert.present();
  }

  private deleteAccount(password?: string): void {
    this.auth.deleteAccount(password)
      .then(() => this.router.navigate(['/auth']))
      .catch(() => this.toastService.error(this.translocoService.translate('SETTINGS.ACCOUNT_PAGE.DELETE_ACCOUNT.ERROR')));
  }
}