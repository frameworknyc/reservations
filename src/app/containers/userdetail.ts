import {Component, HostBinding, OnInit} from "@angular/core";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {UserActions} from "../store/actions/user";
import {UserService} from "../core/service/user";
import * as RootStore from "../store";
import {ActivatedRoute} from "@angular/router";
import {ReservationService} from "../core/service/res";
import {routeFadeStateTrigger} from "../app.animations";
import {Store} from "@ngrx/store";

@Component({
  selector: 'user-detail',
  template: `
    <hero [background]="'assets/blue.jpg'"></hero>
      <div class="" *ngIf="user$" style="padding-top: 2em">
        <div  class="profile container u-maxWidth640 u-paddingBottom30 u-xs-paddingBottom20 u-paddingTop20 u-backgroundWhite u-borderRadiusTop4 u-xs-borderRadiusTop0">
          <div  class="u-inlineBlock ">{{user$.email}}</div>
          <header  class="hero hero--profile u-maxWidth1040">
            <div  class="hero-avatar u-floatRight u-relative">
              <div  class="avatar">
                <img  alt="profile" class="avatar-image u-size100x100 u-xs-size80x80 u-width100" [src]="user$.photoURL">
              </div>
            </div>
            <h1  class="hero-title">{{ user$.displayName }}</h1>
          </header>
          <div  class="label label--smaller u-paddingTop10 u-paddingBottom10"></div>
          <div  class="buttonSet buttonSet--profile u-noWrap">
            <a  class="button button--chromeless u-baseColor--buttonNormal" style="color: #78E0B1">
              {{ reservations$?.length }} {{ reservations$?.length >= 2 ? 'reservation2' : 'reservation'}} </a>
          </div>
        </div>
        <div>
          <div class="streamItem streamItem--section js-streamItem" style="padding-top: 3em">
            <section class="u-borderBox u-maxWidth1000 u-marginAuto u-marginTop30 u-marginBottom40 u-clearfix u-sm-paddingLeft20 u-sm-paddingRight20 u-xs-marginTop15">
              <item-list [items]="reservations$ || []" [showActionButton]="true" [showUserInfo]="false"></item-list>
            </section>
          </div>
        </div>
      </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .container {
      padding-right: 20px;
      padding-left: 20px;
      margin-right: auto;
      margin-left: auto;
    }

    .u-maxWidth1040 {
      max-width: 1040px !important;
    }
    .hero--profile {
      height: auto;
      text-align: left;
    }

    .u-relative {
      position: relative !important;
    }
    .u-floatRight {
      float: right !important;
    }

    .avatar  {
      display: block;
      white-space: nowrap;
      overflow: visible;
      text-overflow: ellipsis;
      line-height: normal;
      position: relative;
    }

    .avatar-image {
      display: inline-block;
      vertical-align: middle;
      border-radius: 100%;
    }
    .u-size100x100 {
      width: 100px !important;
      height: 100px !important;
    }
    
  `],
  animations: [
    routeFadeStateTrigger
  ]
})
export class UserDetailComponent implements OnInit {
  @HostBinding('@routeFadeState') routeAnimation = false;
  user$;
  reservations$;

  constructor(private usersActions: UserActions,
              private userService: UserService,
              private reservationService: ReservationService,
              private route: ActivatedRoute,
              private slimLoadingBarService: SlimLoadingBarService,
              private store: Store<RootStore.AppState>) {
  }

  ngOnInit() {
    this.slimLoadingBarService.start();
    const userId = this.route.params['value'].id;

    this.userService.getSingleUser(userId).take(1).subscribe((user) => {
      this.slimLoadingBarService.complete();
      if (user.$exists()) {
        this.user$ = user;
      } else {
        console.log('user does not exists');
      }
    });

    this.reservationService.loadUserReservations(userId).subscribe((reservations) => {
      this.reservations$ = reservations;
    });
  }
}
