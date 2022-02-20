import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { ConfettiService } from 'src/app/services/confetti.service';

import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-confetti',
  templateUrl: './app-confetti.component.html',
  styleUrls: ['./app-confetti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppConfettiComponent implements OnInit, OnDestroy {

  @ViewChild('confetticanvas', { static: true })
  confettiCanvas: ElementRef;
  
  private destroy = new Subject();
	destroy$ = this.destroy.asObservable();

  constructor(private confettiService: ConfettiService) {}

  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngOnInit(): void {
    this.confettiService.celebrate$.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => this.celebrate());
  }

  celebrate() {
    var myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
			resize: true,
			useWorker: true
    });
    
		myConfetti({
			particleCount: 100,
			spread: 160
			// any other options from the global
			// confetti function
		});
  }
}
