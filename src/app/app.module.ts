import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TreeComponent } from './tree/tree.component';
import { PropertyComponent } from './property/property.component';
import { IncludesPipe } from './includes.pipe';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NodeComponent } from './node/node.component';
import { OutsideClickDirective } from './outside-click.directive';
import { IgnoreOutsideClickDirective } from './ignore-outside-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    PropertyComponent,
    IncludesPipe,
    ToolbarComponent,
    NodeComponent,
    OutsideClickDirective,
    IgnoreOutsideClickDirective
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
