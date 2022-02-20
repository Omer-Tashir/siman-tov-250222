import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-google-waze-navigation',
  templateUrl: './google-waze-navigation.component.html',
  styleUrls: ['./google-waze-navigation.component.scss'],
})
export class GoogleWazeNavigationComponent {

  constructor(
    public actionSheetController: ActionSheetController
  ) { }

  async presentActionSheet() {
    let actionLinks = [];

    actionLinks.push({
      text: 'Google Maps',
      icon: 'assets/google-maps.svg',
      handler: () => {
        window.open("https://maps.google.com/maps?q=אולמי פאר בראשית&t=m&z=11&output=embed&iwloc=near");
      }
    });

    actionLinks.push({
      text: 'Waze',
      icon: 'assets/waze.svg',
      handler: () => {
        window.open("waze://?place=ChIJs_9WLtxTHBUReBD8K0pgeYA&ll=32.60649100%2C35.29582950&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location");
      }
    });

    actionLinks.push({
      text: 'סגור',
      icon: 'close',
      role: 'cancel',
      handler: () => {}
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'נווט לאירוע',
      buttons: actionLinks
    });

    await actionSheet.present();
  }
}
