// "use client";

// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { useState } from "react";
// // import type { LeafletMouseEvent } from "leaflet";

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// export function MapPicker({ value, onChange }: { value: Location | null; onChange: (val: Location) => void }) {
//   const [position, setPosition] = useState<[number, number] | null>(
//     value ? [value.latitude, value.longitude] : null
//   );

//   // useMapEvents must be used in a component that is a descendant of MapContainer.
//   // Create an inner component that's rendered inside MapContainer so it has access to the map context.
//   function MapClickHandler() {
//     useMapEvents({
//       click(e: any) {
//         const newPos = { latitude: e.latlng.lat, longitude: e.latlng.lng };
//         setPosition([e.latlng.lat, e.latlng.lng]);
//         onChange(newPos);
//       },
//     });
//     return null;
//   }

//   return (
//     <>
//       {/* MapClickHandler is a child so it can use useMapEvents safely */}
//       <MapContainer center={[31.5, 34.47] as any} zoom={13} style={{ height: "300px", width: "100%" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <MapClickHandler />
//         {position && <Marker position={position} />}
//       </MapContainer>
//     </>
//   );
// }
