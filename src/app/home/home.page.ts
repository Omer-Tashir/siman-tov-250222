import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { DataService, RSVP } from '../services/data.service';
import { ConfettiService } from '../services/confetti.service';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('homeItem', [
      transition(':enter', [
        style({ opacity: 0 }),
				animate('.5s ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('home', [
      transition('* <=> *', [
        animate(500),
        query('@*', animateChild(), { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.1)' }),
        animate('.2s .1s ease', style({ transform: 'scale(1)' }))
      ]), 
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.1)', opacity: 0 }),
        animate('.5s .1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]), 
    trigger('listAnimation', [
      transition(':enter', [
        query('@items', stagger(100, animateChild()), {optional: true})
      ])
    ])
  ],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;

  formSub: Subscription;

  weddingDateStr: string;

  isLoading = false;

  homeTpl: boolean;

  @HostBinding('@home') 
  get home() { 
    return true;
  }

  constructor(
    private data: DataService,
    private confettiService: ConfettiService,
    public loadingController: LoadingController,
    public fb: FormBuilder
  ) {}

  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: 'תודה רבה, אנו מעדכנים את תשובתכם במערכת',
    });
    await loading.present();
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  ngOnInit(): void {
    this.homeTpl = !this.isReturningUser();
    this.weddingDateStr = moment("20210531", "YYYYMMDD").fromNow();
    
    const formHistory = localStorage.getItem('form') ? JSON.parse(localStorage.getItem('form')) : undefined;

    this.form = this.fb.group({
      isComming: new FormControl(formHistory?.isComming ?? 'Y', [Validators.required]),
      fullname: new FormControl(formHistory?.fullname ?? '', [Validators.required, Validators.minLength(2)]),
      participants: new FormControl(formHistory?.participants ?? 1, [Validators.required]),
      transportation: new FormControl(formHistory?.transportation ?? false, [Validators.required]),
      transportationPoint: new FormControl(formHistory?.transportationPoint ?? 'תל אביב', [Validators.required]),
    });

    this.formSub = this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => localStorage.setItem('form', JSON.stringify(value))),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.confettiService.startCelebration();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  get isComing(): AbstractControl {
    return this.form.controls['isComming'];
  }

  get fullname(): AbstractControl {
    return this.form.controls['fullname'];
  }

  get participants(): AbstractControl {
    return this.form.controls['participants'];
  }

  get transportation(): AbstractControl {
    return this.form.controls['transportation'];
  }

  get transportationPoint(): AbstractControl {
    return this.form.controls['transportationPoint'];
  }

  submit(): void {
    let rsvp: RSVP = {
      fullname: this.fullname.value,
      isComing: this.isComing.value
    }

    if (this.isComing.value !== 'N') {
      rsvp.participants = this.participants.value;
      rsvp.transportation = this.transportation.value;

      if (!!this.transportation.value) {
        rsvp.transportationPoint = this.transportationPoint.value;
      }
    }

    this.presentLoading().then(() => {
      this.data.putRSVP(rsvp).subscribe((uid) => {
        localStorage.setItem('uid', uid);
        localStorage.setItem('returningUser', 'true');
        this.homeTpl = false;
        setTimeout(() => {
          this.loadingDismiss();
        }, 1000);
      });
    });
  }

  reset(): void {
    localStorage.removeItem('returningUser');
    window.location.reload();
  }

  isReturningUser(): boolean {
    return !!localStorage.getItem('returningUser'); 
  }
}
