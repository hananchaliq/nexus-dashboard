// ProvinceBorder.jsx
import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

export const ProvinceBorder = ({ isDaytime: isDaytimeProp, onClick, isClicked, onHoverChange }) => {
   const [geoData, setGeoData] = useState(null);

   const isDaytime = useMemo(() => {
      if (typeof isDaytimeProp === "boolean") return isDaytimeProp;
      const hours = new Date().getHours();
      return hours >= 6 && hours < 18;
   }, [isDaytimeProp]);

   const GLOBE_RADIUS = 1.005;

   const lonLatToVector3 = (lon, lat, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
   };

   useEffect(() => {
      fetch("/indonesia_border.json")
         .then(res => res.json())
         .then(data => setGeoData(data))
         .catch(err => console.error("Error loading border JSON:", err));
   }, []);

   const lines = useMemo(() => {
      if (!geoData || !geoData.features) return [];
      const generatedLines = [];

      const processPolygon = coordinates => {
         coordinates.forEach(ring => {
            const points = ring.map(coord => lonLatToVector3(coord[0], coord[1], GLOBE_RADIUS));
            if (points.length > 0) generatedLines.push(points);
         });
      };

      geoData.features.forEach(feature => {
         const { geometry } = feature;
         if (!geometry) return;

         if (geometry.type === "Polygon") {
            processPolygon(geometry.coordinates);
         } else if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach(polygonCoords => processPolygon(polygonCoords));
         }
      });

      return generatedLines;
   }, [geoData]);

   // Warna tetap natural/default tanpa terpengaruh state hover atau klik
   const lineColor = isDaytime ? "#00f6ff" : "#ffb700";

   return (
      <group>
         {/* HITBOX MESH TRANSPARAN (Pelapis Klik) */}
         <mesh
            onClick={e => {
               e.stopPropagation();
               if (onClick) onClick();
            }}
            onPointerOver={e => {
               e.stopPropagation();
               if (onHoverChange) onHoverChange(true);
               document.body.style.cursor = "pointer";
            }}
            onPointerOut={e => {
               e.stopPropagation();
               if (onHoverChange) onHoverChange(false);
               document.body.style.cursor = "auto";
            }}>
            <sphereGeometry args={[1.02, 32, 32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
         </mesh>

         {/* Line Border (Warna dan Ketebalan Konstan / Natural) */}
         {lines.map((points, index) => (
            <Line key={index} points={points} color={lineColor} lineWidth={1.0} transparent={true} opacity={isDaytime ? 0.8 : 1.0} />
         ))}
      </group>
   );
};

export default ProvinceBorder;
