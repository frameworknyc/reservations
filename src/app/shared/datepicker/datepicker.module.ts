import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlimScrollDirective } from './slimscroll';
import { DatepickerComponent } from './datepicker';
import {  DatelistComponent } from './datelist';
import {SwitchComponent} from './switch';
import {ViewSwitchComponent} from './view-switch';

@NgModule({
  declarations: [ SlimScrollDirective, DatepickerComponent, DatelistComponent, SwitchComponent, ViewSwitchComponent ],
  imports: [ CommonModule, FormsModule ],
  exports: [ SlimScrollDirective, SwitchComponent, DatepickerComponent, DatelistComponent, CommonModule, FormsModule, ViewSwitchComponent ]
})
export class NgDatepickerModule { }
