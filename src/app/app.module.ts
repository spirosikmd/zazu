import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ConfigService} from './services/config.service';
import {StorageService} from './services/storage.service';
import {FlagService} from './services/flag.service';
import {ZazuService} from './services/zazu.service';
import {ZazuItemComponent} from './components/zazuItem/ZazuItemComponent';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {ZazuComponent} from './components/zazu/ZazuComponent';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    ZazuComponent,
    ZazuItemComponent
  ],
  providers: [
    ConfigService,
    StorageService,
    FlagService,
    ZazuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
