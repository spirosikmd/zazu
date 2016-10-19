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
import {InViewportDirective} from './directives/in-viewport.directive';
import {ElasticInputModule} from 'angular2-elastic-input';
import {FocusModule} from 'angular2-focus';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HotkeyModule.forRoot(),
    ElasticInputModule.forRoot(),
    FocusModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ZazuComponent,
    ZazuItemComponent,
    InViewportDirective
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
