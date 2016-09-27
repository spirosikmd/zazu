import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HotkeyModule} from 'angular2-hotkeys';
import {ConfigService} from './services/config.service';
import {StorageService} from './services/storage.service';
import {FlagService} from './services/flag.service';
import {ZazuService} from './services/zazu.service';
import {ZazuItemComponent} from './components/zazuItem/zazu-item.component';
import {AppComponent} from './app.component';
import {ZazuComponent} from './components/zazu/zazu.component';
import {FocusDirective} from './directives/focus.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HotkeyModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ZazuComponent,
    ZazuItemComponent,
    FocusDirective
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
