// src/app/feature-modules/tour-authoring/map/map.component.ts
import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { KeyPoint } from '../keypoint.service';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

@Component({
  selector: 'app-map',
  template: `<div id="map" [style.height.px]="height" [style.width]="width"></div>`,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() keyPoints: KeyPoint[] = [];
  @Input() height: number = 400;
  @Input() width: string = '100%';
  @Input() editable: boolean = true;
  @Input() center: [number, number] = [45.2671, 19.8335]; // Novi Sad coordinates
  @Input() zoom: number = 13;

  @Output() locationSelected = new EventEmitter<{lat: number, lng: number}>();
  @Output() keyPointSelected = new EventEmitter<KeyPoint>();

  private map!: L.Map;
  private markers: Map<number, L.Marker> = new Map();

  ngAfterViewInit(): void {
    this.initMap();
    this.addKeyPointsToMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['keyPoints'] && this.map) {
      this.updateKeyPointsOnMap();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.center,
      zoom: this.zoom
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Add click handler for new key points (only in editable mode)
    if (this.editable) {
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.locationSelected.emit({ lat, lng });
      });
    }
  }

  private addKeyPointsToMap(): void {
    this.keyPoints.forEach(keyPoint => {
      this.addKeyPointMarker(keyPoint);
    });

    // Fit map to show all markers if there are key points
    if (this.keyPoints.length > 0) {
      const group = new L.FeatureGroup(Array.from(this.markers.values()));
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private updateKeyPointsOnMap(): void {
    // Clear existing markers
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers.clear();

    // Add updated markers
    this.addKeyPointsToMap();
  }

  private addKeyPointMarker(keyPoint: KeyPoint): void {
    const marker = L.marker([keyPoint.latitude, keyPoint.longitude])
      .addTo(this.map);

    // Add popup with key point info
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h4>${keyPoint.name}</h4>
        <p>${keyPoint.description}</p>
        <small>Order: ${keyPoint.order}</small>
        ${keyPoint.imageUrl ? `<br><img src="${keyPoint.imageUrl}" style="max-width: 150px; max-height: 100px; margin-top: 5px;">` : ''}
      </div>
    `);

    // Add click handler
    if (this.editable) {
      marker.on('click', () => {
        this.keyPointSelected.emit(keyPoint);
      });
    }

    this.markers.set(keyPoint.id, marker);
  }

  public addTemporaryMarker(lat: number, lng: number): L.Marker {
    const tempMarker = L.marker([lat, lng], {
      opacity: 0.7
    }).addTo(this.map);

    tempMarker.bindPopup('New Key Point Location');
    return tempMarker;
  }

  public removeTemporaryMarker(marker: L.Marker): void {
    this.map.removeLayer(marker);
  }

  public centerOnLocation(lat: number, lng: number, zoom?: number): void {
    this.map.setView([lat, lng], zoom || this.zoom);
  }
}