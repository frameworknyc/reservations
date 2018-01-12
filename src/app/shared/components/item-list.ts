import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'item-list',
  template: `
    <div *ngFor="let item of items; index as i; odd as isOdd; even as isEven">
      <item [isOdd]="isOdd" [isEven]="isEven" [reservation]="item" [showActionButton]="showActionButton" [showUserInfo]="showUserInfo"></item>
    </div>
  `,
  styles: [`
    body {
      font-family: "GT-Walsheim", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    }
  `]
})
export class ItemListComponent implements OnInit {
  @Input() items;
  @Input() showActionButton;
  @Input() showUserInfo;

  constructor() {
  }

  ngOnInit() {
  }

}
