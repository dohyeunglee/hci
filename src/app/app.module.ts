import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ModalComponent } from './modal/modal.component';
import { HelpModalsComponent } from './help-modals/help-modals.component';
import { BoardComponent } from './board/board.component';
import { SvgTreeComponent } from './svg-tree/svg-tree.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { MiniBoardComponent } from './mini-board/mini-board.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    PropertyComponent,
    IncludesPipe,
    ToolbarComponent,
    NodeComponent,
    OutsideClickDirective,
    IgnoreOutsideClickDirective,
    ModalComponent,
    HelpModalsComponent,
    BoardComponent,
    SvgTreeComponent,
    InputDialogComponent,
    AlertComponent,
    MiniBoardComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
