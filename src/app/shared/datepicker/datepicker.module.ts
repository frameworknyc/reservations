import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { DatepickerComponent } from './datepicker';
import {  DatelistComponent } from './datelist';
import {SwitchComponent} from './switch';
import {ViewSwitchComponent} from './view-switch';

@NgModule({
  declarations: [ DatepickerComponent, DatelistComponent, SwitchComponent, ViewSwitchComponent ],
  imports: [ CommonModule, FormsModule, NgSlimScrollModule ],
  exports: [ SwitchComponent, DatepickerComponent, DatelistComponent, CommonModule, FormsModule, NgSlimScrollModule, ViewSwitchComponent ]
})
export class NgDatepickerModule { }
