import { Component, OnInit } from '@angular/core';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { LoadingController } from '@ionic/angular';

import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';

import { DataService, RSVP } from '../services/data.service';

import 'chartjs-plugin-labels';
@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  animations: [
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
        query('@items', stagger(50, animateChild()), {optional: true})
      ])
    ])
  ]
})
export class ResultsPage implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      labels: [{
        render: 'value',
        fontSize: 16,
        fontStyle: 'bold',
        fontColor: 'white',
      },
      {
        render: 'label',
        fontSize: 14,
        position: 'outside'
      }]
    }
  };

  public pieChartLabels: Label[] = ['לא מגיעים', 'אולי מגיעים', 'מגיעים'];
  public pieChartColors = [
    {
      backgroundColor: ['#cf3c4f', '#e0ac08', '#28ba62'],
    },
  ];
  
  public pieChartData: SingleDataSet = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  comming: any[] = [];
  maybeComming: any[] = [];
  notComming: any[] = [];

  commingCounter: number = 0;
  maybeCommingCounter: number = 0;
  notCommingCounter: number = 0;

  activeList: any[] = [];
  activeLabel: string = 'מגיעים';
  activeCounter: number = 0;

  isLoading = false;

  constructor(
    private data: DataService,
    public loadingController: LoadingController,
  ) {}

  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: 'רק רגע בבקשה...',
    });
    await loading.present();
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  ngOnInit() {
    this.presentLoading().then(() => {
      this.data.getRSVP().subscribe((rsvp: RSVP[]) => {

        const notComming = rsvp.filter(r=>r.isComing==='N');
        this.notCommingCounter = notComming.length;
        this.notComming = notComming.map(i => ({
          name: i.fullname,
          isComming: i.isComing,
          participants: i.participants, 
          transportation: i.transportation, 
          transportationPoint: i.transportationPoint
        }));

        const maybeComming = rsvp.filter(r=>r.isComing==='M');
        this.maybeCommingCounter = maybeComming.reduce((acc, val) => {
          return acc + val.participants;
        }, 0);
        this.maybeComming = maybeComming.map(i => ({
          name: i.fullname,
          isComming: i.isComing,
          participants: i.participants, 
          transportation: i.transportation, 
          transportationPoint: i.transportationPoint
        }));

        const comming = rsvp.filter(r=>r.isComing==='Y');
        this.commingCounter = comming.reduce((acc, val) => {
          return acc + val.participants;
        }, 0);
        this.comming = comming.map(i => ({
          name: i.fullname,
          isComming: i.isComing,
          participants: i.participants, 
          transportation: i.transportation, 
          transportationPoint: i.transportationPoint
        }));

        this.activeLabel = 'מגיעים';
        this.activeList = this.comming;
        this.activeCounter = this.commingCounter;

        this.pieChartData = [
          this.notCommingCounter,
          this.maybeCommingCounter,
          this.commingCounter
        ];

        setTimeout(() => {
          this.loadingDismiss();
        }, 1000);
      });
    });
  }

  chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        //console.log(clickedElementIndex, label, value)

        this.activeLabel = label;

        switch (this.activeLabel) {
          case 'מגיעים':
          default:
            this.activeList = this.comming;
            this.activeCounter = this.commingCounter;
            break;

          case 'אולי מגיעים':
            this.activeList = this.maybeComming;
            this.activeCounter = this.maybeCommingCounter;
            break;

          case 'לא מגיעים':
            this.activeList = this.notComming;
            this.activeCounter = this.notCommingCounter;
            break;
        }
      }
    }
  }
}