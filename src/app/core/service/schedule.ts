import {Injectable, OnInit} from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import * as _ from 'lodash';

@Injectable()
export class ScheduleService implements OnInit {
	newTimes;

	private daySource = new BehaviorSubject<string>('monday');

  selectedDay$ = this.daySource.asObservable();

  private dateSource = new BehaviorSubject<string>(new Date(Date.now()).toString());

  selectedDate$ = this.dateSource.asObservable();
  private timePath = '/times/monday';

  private basePath = '/schedule';

  private datePath = '/blacklist';

 	times = null; //  list of objects
  time = null; //   single object

  dates = null; //  list of objects
  date = null; //   single object


	constructor(private db: AngularFireDatabase) {

   }

   ngOnInit() {
    this.times = this.db.object(this.basePath);
    this.dates = this.getBlackList();

   }

	 updateDay(day) {
		this.daySource.next(day);
		this.getDayTimes(day)
   }
   updateDate(date) {
    this.dateSource.next(date);

   }

	  getTimesList(query={}): FirebaseListObservable<any[]> {
	  this.times = this.db.list(this.basePath);
	  return this.times;
	}
		getTimesList2(query={}): FirebaseObjectObservable<any[]> {
	  this.newTimes = this.db.object(this.timePath);
	  return this.newTimes;
	}


	getDayTimes(day: string): FirebaseListObservable<any[]> {
	  const dayPath =  `${this.basePath}/${day}`;
		this.times = this.db.list(dayPath);
	  return this.times;
  }

  getBlackList(): FirebaseListObservable<any[]> {
	  this.dates = this.db.list(this.datePath, );
	  return this.dates;
  }

  // getMovies(start, end): FirebaseListObservable<any> {
  //   return this.db.list('/movies', {
  //     query: {
  //       orderByChild: 'Title',
  //       limitToFirst: 10,
  //       startAt: start,
  //       endAt: end
  //     }
  //   });
  // }

  getDate(key: string): FirebaseObjectObservable<any> {
	  const datePath =  `${this.datePath}/${key}`;
	  this.date = this.db.object(datePath)
	  return this.date;
  }

  blockDate(date: any): void  {
    console.log(date);
    this.dates.push(date)
    .catch(error => this.handleError(error))
  }

  openDate(key: string): void {
    // console.log(key);
    this.dates.remove(key)
      .catch(error => this.handleError(error))
  }



  toggle(event, day) {

  let key = event.$key;

  const dayPath =  `${this.basePath}/${day}`;
  if (event.$value) {
    this.block(event, dayPath, key);
  } else {
    this.open(event, dayPath, key);
  }

}

 block(event, day, key): void {
   this.db.object(day)
    .update({  [key] : false });
}

open(event, day, key) {
  this.db.object(day)
   .update({  [key] : true });

}

	// Return a single observable item
	getTime(key: string): FirebaseObjectObservable<any> {
	  const itemPath =  `${this.basePath}/${key}`;
	  this.time = this.db.object(itemPath)
	  return this.time;
	}

	createItem(time: any): void  {
   		this.times.push(time)
     .catch(error => this.handleError(error))
	 }
	 // Update an existing item
	 updateItem(event): void {
	   this.times.update(event.key, event.value)
	     .catch(error => this.handleError(error))
	 }
	 // Deletes a single item
	 deleteItem(key: string): void {
	     this.times.remove(key)
	       .catch(error => this.handleError(error))
	 }
	 // Deletes the entire list of times
	 deleteAll(): void {
	     this.times.remove()
	       .catch(error => this.handleError(error))
	 }
	 // Default error handling for all actions
	 private handleError(error) {
	   console.log(error)
   }

   addToBlackList(date) {
    //  this.dates.

   }
}
