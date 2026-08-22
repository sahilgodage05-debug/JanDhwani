import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MapControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3-geo';

// A dummy array of complaints with lat, lng, and urgency score (1-10)
const dummyComplaints = [
  { id: 1, title: 'पानी की लाइन टूटी है', lat: 28.6139, lng: 77.2090, urgency: 8, location: 'New Delhi' },
  { id: 2, title: 'सड़क पर गड्ढा है', lat: 19.0760, lng: 72.8777, urgency: 5, location: 'Mumbai' },
  { id: 3, title: 'अस्पताल में डॉक्टर नहीं हैं', lat: 25.5941, lng: 85.1376, urgency: 10, location: 'Patna' },
  { id: 4, title: 'बिजली का खंभा गिर गया', lat: 13.0827, lng: 80.2707, urgency: 9, location: 'Chennai' },
  { id: 5, title: 'कूड़े का ढेर', lat: 22.5726, lng: 88.3639, urgency: 4, location: 'Kolkata' },
];

function MarkerTooltip({ complaint, color }) {
  const tooltipRef = useRef();
  
  useFrame(({ camera }) => {
    if (tooltipRef.current) {
      // Calculate how zoomed in the camera is (distance to target)
      const dist = camera.position.length();
      // If zoomed in closer than 40 units, show the tooltip
      if (dist < 35) {
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.transform = 'translate(-50%, -100%) scale(1)';
      } else {
        tooltipRef.current.style.opacity = '0';
        tooltipRef.current.style.transform = 'translate(-50%, -100%) scale(0.8)';
      }
    }
  });

  return (
    <Html position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
      <div 
        ref={tooltipRef} 
        className="friendly-tooltip" 
        style={{ opacity: 0, transition: 'all 0.3s ease-out' }}
      >
        <div className="friendly-header">{complaint.location}</div>
        <div className="friendly-body">
          <span className="friendly-score" style={{backgroundColor: color}}>Score: {complaint.urgency}/10</span>
          <p>{complaint.title}</p>
        </div>
      </div>
    </Html>
  );
}

function IndiaMap() {
  const [geoData, setGeoData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const { camera } = useThree();
  const [showDistricts, setShowDistricts] = useState(false);

  useEffect(() => {
    fetch('/india.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading state map data:", err));
      
    fetch('/india_district.json')
      .then(res => res.json())
      .then(data => setDistrictData(data))
      .catch(err => console.log("District map data not found or loading..."));
  }, []);

  useFrame(() => {
    // Show districts if camera is zoomed in closer than 25 units
    if (camera.position.length() < 25) {
      if (!showDistricts) setShowDistricts(true);
    } else {
      if (showDistricts) setShowDistricts(false);
    }
  });

  const { statePaths, stateShapes, districtPaths, projection } = useMemo(() => {
    if (!geoData) return { statePaths: [], stateShapes: [], districtPaths: [], projection: null };
    
    const projection = d3.geoMercator().center([80, 22]).scale(25).translate([0, 0]);

    const createGeometries = (features, createShape = false) => {
      const paths = [];
      const shapes = [];
      if (!features) return { paths, shapes };

      features.forEach((feature) => {
        const processPolygon = (polygon) => {
          const points = [];
          let shape = createShape ? new THREE.Shape() : null;
          
          polygon.forEach((coord, i) => {
            const [x, y] = projection(coord);
            // Draw on XY plane, we will rotate the whole group later
            points.push(new THREE.Vector3(x, -y, 0)); 
            if (createShape) {
              if (i === 0) shape.moveTo(x, -y);
              else shape.lineTo(x, -y);
            }
          });
          
          paths.push(points);
          if (createShape) shapes.push(shape);
        };
        
        if (feature.geometry.type === 'Polygon') feature.geometry.coordinates.forEach(processPolygon);
        else if (feature.geometry.type === 'MultiPolygon') feature.geometry.coordinates.forEach(poly => poly.forEach(processPolygon));
      });
      return { paths, shapes };
    };

    const stateGeom = createGeometries(geoData.features, true);
    const districtGeom = createGeometries(districtData ? districtData.features : [], false);

    return { 
      statePaths: stateGeom.paths, 
      stateShapes: stateGeom.shapes,
      districtPaths: districtGeom.paths,
      projection 
    };
  }, [geoData, districtData]);

  if (!geoData) {
    return (
      <Html center>
        <div style={{ color: '#5d4037', fontWeight: 'bold', fontSize: '18px' }}>
          नक्शा लोड हो रहा है (Loading Map)...
        </div>
      </Html>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      
      {/* Rotate everything to lie flat on the ground (XZ plane) */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        
        {/* Ocean Floor */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#81d4fa" transparent opacity={0.5} />
        </mesh>

        {/* Solid Land (States) */}
        {stateShapes.map((shape, index) => (
          <mesh key={`land-${index}`} position={[0, 0, -0.05]}>
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial color="#fcf8f5" />
          </mesh>
        ))}

        {/* Dark State Borders */}
        {statePaths.map((points, index) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`state-${index}`} geometry={geometry} position={[0, 0, 0]}>
              <lineBasicMaterial color="#4e342e" linewidth={2} transparent opacity={1} />
            </line>
          );
        })}

        {/* Dynamic District Borders (Faded and thinner) */}
        {showDistricts && districtPaths.map((points, index) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`dist-${index}`} geometry={geometry} position={[0, 0, 0]}>
              <lineBasicMaterial color="#a1887f" transparent opacity={0.6} />
            </line>
          );
        })}
      </group>

      {/* Render Horizontal Rectangular Markers for complaints */}
      {dummyComplaints.map(complaint => {
        const [x, y] = projection([complaint.lng, complaint.lat]);
        const color = complaint.urgency >= 8 ? '#d32f2f' : (complaint.urgency >= 5 ? '#f57c00' : '#388e3c');
        
        return (
          <group key={complaint.id} position={[x, 0.3, y]}>
            {/* Slim Marker */}
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={0.5} 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Tooltip shown only on zoom */}
            <MarkerTooltip complaint={complaint} color={color} />
          </group>
        );
      })}

      {/* Light Grid Floor for a clean look */}
      <gridHelper args={[100, 50, '#e0e0e0', '#f5f5f5']} position={[0, -0.25, 0]} />
    </group>
  );
}

export default function Map3D() {
  return (
    <div className="map-container">
      <div className="map-header">
        <h2>📍 लाइव शिकायत मैप (Live Grievance Map)</h2>
        <p>देशभर से आ रही समस्याओं का सीधा नज़ारा</p>
      </div>
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
          {/* Brighter lighting for a realistic, user-friendly feel */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 20, 15]} intensity={1.5} color="#ffffff" />
          <MapControls 
            enablePan={true}
            enableZoom={true}
            minDistance={5} 
            maxDistance={60} 
            enableRotate={true}
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 3} 
          />
          <IndiaMap />
        </Canvas>
      </div>
    </div>
  );
}
