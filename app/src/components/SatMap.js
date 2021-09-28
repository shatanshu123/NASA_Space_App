import React from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

const icon = new Icon({
  iconUrl: "Satellite_icon.png",
  iconSize: [40, 40],
});

export default function SatMap(props) {
  const position = [props.location.lat, props.location.lng];
  return (
    <Map center={position} zoom={1} zoomControl={false}>
      <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
      <Marker position={position} icon={icon}></Marker>
    </Map>
  );
}
