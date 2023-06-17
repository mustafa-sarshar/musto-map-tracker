import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

declare const L: any;
type MainNavCoords = { latitude: number; longitude: number };

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  // @ViewChild("map", { read: ElementRef, static: true }) mapElRef!: ElementRef;
  public map: any;
  public navCoords?: GeolocationPosition["coords"];
  public targetNavCoords = {
    latitude: 0,
    longitude: 0,
  };
  public timestamp: number = 0;
  public navError: string = "";
  private navGeoLocOptions = {
    enableHighAccuracy: true,
    timeout: 5000, // milliseconds
    maximumAge: 0,
  };

  constructor() {}

  public ngOnInit(): void {
    this.getLocation();
  }

  public getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (position) {
            this.navCoords = position.coords;
            this.timestamp = position.timestamp;
            this.initMap(this.navCoords);
            this.updateMap();
            this.addMarkerToMap(this.navCoords);
            this.watchPosition();
          }
        },
        (error: GeolocationPositionError) => {
          console.error(error);
          this.navError = error.message;
        }
      );
    } else {
      this.navError = "Geolocation is not supported by this browser.";
    }
  }

  public watchPosition(): void {
    const navId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        this.playSound();
        this.navCoords = position.coords;
        this.timestamp = position.timestamp;
        this.updateMap();
        this.addMarkerToMap(this.navCoords);
        console.log("Position:", position);

        if (
          this.targetNavCoords?.latitude === this.navCoords.latitude &&
          this.targetNavCoords?.longitude === this.navCoords.longitude
        ) {
          console.log("Congratulations, you reached the target");
          navigator.geolocation.clearWatch(navId);
        }
      },
      (err) => {
        console.log(err);
      },
      this.navGeoLocOptions
    );
  }

  private playSound(): void {
    const sndBeep = new Audio();
    sndBeep.src = "./assets/sounds/Mouse-Click-00-c-FesliyanStudios.com.mp3";
    sndBeep.play();
  }

  private initMap(navCoords: MainNavCoords, zoom: number = 19): void {
    this.map = L.map("map").setView(
      [navCoords.latitude, navCoords.longitude],
      zoom
    );
  }

  private updateMap(maxZoom: number = 19): void {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: maxZoom,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  private addMarkerToMap(navCoords: MainNavCoords): void {
    const marker = L.marker([navCoords.latitude, navCoords.longitude]).addTo(
      this.map
    );
    const circle = L.circle([navCoords.latitude, navCoords.longitude], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.1,
      radius: 10,
    }).addTo(this.map);
  }
}
