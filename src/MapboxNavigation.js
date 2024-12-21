import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2gwMjA2IiwiYSI6ImNtNHdrYnNlYzA2MXQyaXIweDZuNHQwdHcifQ.4tvQbS4zqZM7egVxeQyv2w';
const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const directionsContainer = useRef(null);
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.current.setCenter([longitude, latitude]);
        map.current.setZoom(12);
      },
      (error) => {
        console.error('Error getting location: ', error);
      },
      { enableHighAccuracy: true }
    );

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    });
    map.current.addControl(geolocateControl, 'top-right'); 

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, 
      mapboxgl: mapboxgl, 
      placeholder: 'Search for a place', 
    });
    map.current.addControl(geocoder, 'top-left');

    const geocoderElement = document.querySelector('.mapboxgl-ctrl-geocoder');
    if (geocoderElement) {
      const icon = geocoderElement.querySelector('.mapboxgl-ctrl-geocoder--icon');
      if (icon) {
        icon.style.display = 'none'; 
      }

      const input = geocoderElement.querySelector('input');
      input.style.paddingRight = '10px'; 
    }

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken, 
      unit: 'metric', 
      profile: 'mapbox/driving', 
      alternatives: true, 
      geometries: 'geojson', 
    });
    directionsContainer.current.appendChild(directions.onAdd(map.current)); 

  }, []); 

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={directionsContainer} style={{ position: 'absolute', top: 40, right: 10, zIndex: 2, width: '350px' }} />
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;
