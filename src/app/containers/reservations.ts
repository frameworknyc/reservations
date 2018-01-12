import {Component, HostBinding, OnInit} from "@angular/core";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {ReservationsActions} from "../store/actions/res";
import {ReservationService} from "../core/service/res";
import * as RootStore from "../store";
import {getReservationStatusName} from "../core/model/index";
import {routeFadeStateTrigger} from "../app.animations";
import {Store} from "@ngrx/store";

@Component({
  selector: 'reservations',
  template: `
    <hero [background]="'assets/blue.jpg'">
      <search (searchChanged)="searchValueChanged($event)"></search>
    </hero>
    <div class="streamItem streamItem--section js-streamItem" style="padding-top: 3em">
      <section class="u-borderBox u-maxWidth1000 u-marginAuto u-marginTop30 u-marginBottom40 u-clearfix u-sm-paddingLeft20 u-sm-paddingRight20 u-xs-marginTop15">
        <nav class="u-flex heading heading--borderedTop u-textAlignCenter" style="padding-bottom: 2em">
          <ul class="heading-tabs">
            <li class="heading-tabsItem u-inlineBlock"
                [ngClass]="{'is-active': this.status === -1}">
              <a (click)="updateStatus(-1)">All</a>
            </li>
            <li class="heading-tabsItem u-inlineBlock"
                [ngClass]="{'is-active': this.status === 0}">
              <a (click)="updateStatus(0)">Booked</a>
            </li>
            <li class="heading-tabsItem u-inlineBlock"
                [ngClass]="{'is-active': this.status === 1}">
              <a (click)="updateStatus(1)">Rescheduled</a>
            </li>
            <li class="heading-tabsItem u-inlineBlock"
                [ngClass]="{'is-active': this.status === 2}">
              <a (click)="updateStatus(2)">Completed</a>
            </li>
            <li class="heading-tabsItem u-inlineBlock"
                [ngClass]="{'is-active': this.status === 3}">
              <a (click)="updateStatus(3)">Cancelled</a>
            </li>
          </ul>
        </nav>
        <item-list [items]="filtered || []" [showActionButton]="true" [showUserInfo]="true"></item-list>
      </section>
    </div>
  `,
  styleUrls: ['reservations.scss'],
  animations: [
    routeFadeStateTrigger
  ]
})
export class ReservationsComponent implements OnInit {
  @HostBinding('@routeFadeState') routeAnimation = false;
  reservations;
  filtered;
  searchString = '';
  status = -1;

  constructor(private reservationsActions: ReservationsActions,
              private reservationService: ReservationService,
              private slimLoadingBarService: SlimLoadingBarService,
              private store: Store<RootStore.AppState>) {
  }

  ngOnInit() {
    this.slimLoadingBarService.start();
    this.reservationService.loadReservations();
    this.store.select(state => state.reservationState.reservations).subscribe((reservations) => {
      this.reservations = reservations;
      this.filterReservations();
    });

    this.slimLoadingBarService.complete();
  }

  filterReservations() {
    const filtered = [];
    const searchLowercase = this.searchString.toLocaleLowerCase();
    if (this.reservations && this.reservations.length > 0) {
        this.reservations.forEach(reservation => {
          if ((this.status === -1 || reservation.reservation.status === this.status) && (this.searchString === '' || reservation.reservation.client.email.toLocaleLowerCase().includes(searchLowercase) || reservation.reservation.client.name.toLocaleLowerCase().includes(searchLowercase))) {
            filtered.push(reservation);
          }
        });
        this.filtered = filtered;
    }
  }

  searchValueChanged(event) {
    this.searchString = event ? event : '';
    this.filterReservations();
  }
  updateStatus(newStatus) {
    this.status = newStatus;
    this.filterReservations();
  }

  currentStatus() {
    return getReservationStatusName(this.status);
  }

}
