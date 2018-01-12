import { Component, Input, OnInit } from "@angular/core";
import { ReservationService } from "../../core/service/res";
import { ReservationStatus, getReservationStatusName } from '../../core/model/index';
import {animate, style, transition, trigger} from '@angular/animations'

@Component({
  selector: 'item',
  // templateUrl: 'item.html',
  template: `
    
    <div [ngClass]="{'u-paddingLeft10': this.isOdd, 'u-paddingRight10': this.isEven }" class="u-borderBox u-size6of12 u-xs-paddingLeft0 u-xs-paddingRight0 u-xs-size12of12" >
      <div [@flyInOut] class="u-flex u-sizeFullWidth u-height260 u-sm-flexWrap u-xs-heightAuto u-borderBox u-marginBottom20 u-backgroundColorWhite u-relative u-borderRadius2 u-borderBlackLightest">
        <div class="u-flex0 u-sizeFullHeight u-width200 u-sm-height100 u-sm-sizeFullWidth u-xs-height170">
          <a class="u-block u-backgroundSizeCover u-backgroundOriginBorderBox u-backgroundColorGrayLight u-sizeFullHeight" href="#" style="background-image: url('assets/eye.png'); background-position: 50% 50% !important;"></a>
        </div>
        <div class="u-borderBox u-flexColumn u-padding20 u-flex1 u-sizeFull u-sm-height160 u-xs-heightAuto">
          <div class="u-flex1 u-relative">
            <div class="u-flexColumnTop u-flexWrap u-absolute0 u-xs-relative">
              <div class="u-flex0 u-sizeFullWidth">
                <a class="" href="#">
                  <h3 class="u-contentSansBold u-lineHeightTight u-fontSize20 u-sm-lineClamp2 u-sm-maxHeight2LineHeightTight" *ngIf="showUserInfo">{{reservation?.reservation.type.type}}</h3></a>
              </div><a class="" href="#">
              <h4 class="u-textColorNormal u-fontWeightNormal u-marginTop5 u-letterSpacingNormal u-lineClamp3 u-maxHeight3LineHeightBase u-textOverflowEllipsis u-fontSize14">{{ reservation?.start | date: 'EEEE d' }} @ {{ reservation?.time | time}}</h4></a>
            </div>
          </div>
          <div class="u-flex u-paddingTop10 u-flex0">
            
            <div class="u-flex0 u-paddingRight10" *ngIf="showUserInfo">
              <a class="link avatar u-baseColor--link" href="#">
                <img class="avatar-image avatar-image--smaller" [src]="reservation?.client.avatar">
              </a>
            </div>
            
            <div class="u-flex1 u-noWrapWithEllipsis u-xs-paddingTop5">
              <div class="postMetaInline postMetaInline-authorLockup u-paddingLeft0 u-noWrapWithEllipsis">
                <a class="link u-textColorDarker u-fontSize12 u-baseColor--link" *ngIf="showUserInfo">{{
                  reservation?.client.name }}</a>
              </div>
              <div class="u-fontSize12 u-textColorNormal u-lineHeightTight u-noWrapWithEllipsis u-paddingTop2">
                {{ reservation?.client.email }}
                <span class="readingTime"></span>
              </div>
            </div>
            
          </div>
          <div class="u-flex0 u-flexCenter u-textColorNormal" *ngIf="showActionButton" style="align-self: flex-end; padding-top: 1em">
              <span class="followState js-followState buttonSet-inner">
                <div class="btn-group js-popover-inner u-width300">
                  <button data-toggle="dropdown" ngClass="{{currentStatus().toLocaleLowerCase()}}" class="button button--chromeless is-touchIconBlackPulse u-baseColor--buttonNormal button--withIcon button--withSvgIcon u-marginLeft4 js-postActionsButton">
                    {{currentStatus()}}
                    <span class="svgIcon svgIcon--arrowDown svgIcon--19px is-flushRight is-flushBottom">
                      <svg class="svgIcon-use" height="19" viewbox="0 0 19 19" width="19">
                            <path d="M3.9 6.772l5.205 5.756.427.472.427-.472 5.155-5.698-.854-.772-4.728 5.254L4.753 6z" fill-rule="evenodd"></path>
                      </svg>
                    </span>
                  </button>
                  <ul id="popup" class="dropdown-menu list list--borderless list--short u-resetSpectrum">
                    <li class="list-item"><a (click)="updateStatus(0)">Booked</a></li>
                    <li class="list-item"><a (click)="updateStatus(1)">Rescheduled</a></li>
                    <li class="list-item"><a (click)="updateStatus(2)">Completed</a></li>
                    <li class="list-item"><a (click)="updateStatus(3)">Cancelled</a></li>
                  </ul>
                </div>
              </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['item.scss'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        style({transform: 'translateY(10%',
        opacity: 0}),
        animate('500ms')
      ]),
      transition('* => void', [
        style({transform: 'translateY(-10%',
        opacity: 0}),
        animate('500ms')
      ])
    ])
  ]
})
export class ItemComponent implements OnInit {
  @Input() reservation;
  @Input() showActionButton;
  @Input() showUserInfo;
  @Input() isOdd;
  @Input() isEven;
  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    console.log(this.isOdd, this.isEven);
  }

  currentStatus() {
    return getReservationStatusName(this.reservation.reservation.status);
  }

  updateStatus(newStatus) {
    this.reservationService.updateStatus(this.reservation.reservation, newStatus);
  }

}
