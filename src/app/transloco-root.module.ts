import {
  provideTransloco,
  TranslocoModule
} from '@jsverse/transloco';
import { NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { environment } from '../environments/environment';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';

@NgModule({
  exports: [ TranslocoModule ],
  providers: [
      provideTransloco({
        config: {
          availableLangs: ['fr', 'en', 'it', 'es'],
          defaultLang: 'fr',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: environment.production,
        },
        loader: TranslocoHttpLoader
      }),
      provideTranslocoMessageformat()
  ],
})
export class TranslocoRootModule {}
