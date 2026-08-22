import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './DigitalTwinMap.css';

// Pre-seeded Pan-India + BRICS Governance Hotspots
const INITIAL_HOTSPOTS = [
  {
    id: 'JD-942108',
    title: 'Critical Jal Shakti Pipeline Rupture',
    summary: 'Major drinking water supply conduit ruptured near Wagholi, affecting 14,000 households.',
    department: 'Ministry of Jal Shakti / Water Supply Board',
    location: 'Wagholi Panchayat, Haveli, Pune, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    coords: { x: -0.8, z: 0.6, lat: 18.5204, lng: 73.8567 },
    urgency: 8.9,
    baseUrgency: 7.2,
    povertyBoost: '+1.7 (Rural Deficit Weight)',
    areaType: 'Rural (Gram Panchayat)',
    routing: 'BDO Haveli & District Collector Pune',
    citizen: 'Sunil Deshmukh (UID: 9822998877)',
    imageVerified: true,
    imageConfidence: 97,
    timestamp: '2 mins ago',
    country: 'India'
  },
  {
    id: 'JD-811420',
    title: 'NH-31 Critical Bridge Crack',
    summary: 'Structural fracture detected on arterial highway bridge connecting Purnia to Katihar.',
    department: 'Public Works Department (PWD / NHAI)',
    location: 'Kasba Block, Purnia, Bihar',
    state: 'Bihar',
    district: 'Purnia',
    coords: { x: 1.2, z: -0.4, lat: 25.7771, lng: 87.4753 },
    urgency: 9.4,
    baseUrgency: 8.0,
    povertyBoost: '+1.4 (High Vulnerability Index)',
    areaType: 'Rural (Block)',
    routing: 'District Magistrate Purnia & Executive Engineer PWD',
    citizen: 'Rameshwar Yadav (UID: 9431023456)',
    imageVerified: true,
    imageConfidence: 96,
    timestamp: '14 mins ago',
    country: 'India'
  },
  {
    id: 'JD-722105',
    title: 'Hospital Oxygen Plant Voltage Fluctuation',
    summary: 'Substation transformer overheating causing severe power dips at Primary Health Centre.',
    department: 'Ministry of Power & Energy',
    location: 'Tambaram Zone, Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    district: 'Chennai',
    coords: { x: 0.3, z: 1.8, lat: 13.0827, lng: 80.2707 },
    urgency: 8.7,
    baseUrgency: 8.5,
    povertyBoost: '+0.2 (Urban Health Facility)',
    areaType: 'Urban (Zone 14)',
    routing: 'Zonal Health Officer & TANGEDCO Superintending Engineer',
    citizen: 'Meenakshi Sundaram (UID: 9444012345)',
    imageVerified: true,
    imageConfidence: 98,
    timestamp: '32 mins ago',
    country: 'India'
  },
  {
    id: 'JD-633019',
    title: 'BRICS Scalability Node: Substandard Pharmaceuticals',
    summary: 'Unregistered batch of counterfeit antibiotics intercepted in retail pharmacy.',
    department: 'Food & Drugs Administration (FDA / ANVISA BRICS)',
    location: 'São Paulo Central District, Brazil',
    state: 'São Paulo',
    district: 'São Paulo',
    coords: { x: -3.2, z: 2.2, lat: -23.5505, lng: -46.6333 },
    urgency: 9.1,
    baseUrgency: 8.8,
    povertyBoost: '+0.3 (Public Health Hazard)',
    areaType: 'Urban Metropolitan',
    routing: 'Secretaria Municipal da Saúde & Federal Inspector',
    citizen: 'Carlos Silva (UID: +55 11 98765-4321)',
    imageVerified: true,
    imageConfidence: 99,
    timestamp: '1 hour ago',
    country: 'Brazil (BRICS)'
  }
];

function DigitalTwinMap({ latestGrievance, onBackToPortal }) {
  const mountRef = useRef(null);
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapMode, setMapMode] = useState('india'); // 'india' | 'brics'
  const sceneRef = useRef(null);
  const pillarsRef = useRef([]);

  // Integrate newly dispatched citizen grievance dynamically
  useEffect(() => {
    if (latestGrievance && !hotspots.some(h => h.id === latestGrievance.ticketId)) {
      const newSpot = {
        id: latestGrievance.ticketId,
        title: latestGrievance.department || 'Citizen Priority Grievance',
        summary: latestGrievance.translatedText || 'Citizen reported public grievance requiring immediate administrative dispatch.',
        department: latestGrievance.department,
        location: latestGrievance.confirmedLocation || 'Verified Jurisdiction',
        state: latestGrievance.confirmedLocation?.includes('Bihar') ? 'Bihar' : 'Maharashtra',
        district: 'District Jurisdiction',
        coords: { 
          x: (Math.random() - 0.5) * 2.5, 
          z: (Math.random() - 0.5) * 2.5, 
          lat: 19.0, 
          lng: 75.0 
        },
        urgency: parseFloat(latestGrievance.severityScore) || 8.8,
        baseUrgency: 7.5,
        povertyBoost: '+1.3 (Open-Data Weighted Boost)',
        areaType: 'Rural Priority Jurisdiction',
        routing: latestGrievance.routingUnit || 'District Magistrate & BDO',
        citizen: 'Verified Citizen Credential',
        imageVerified: latestGrievance.imageVerified || false,
        imageConfidence: latestGrievance.imageScore || 95,
        timestamp: 'Just now (Live)',
        country: 'India'
      };
      setHotspots(prev => [newSpot, ...prev]);
      setSelectedHotspot(newSpot);
    }
  }, [latestGrievance]);

  // Three.js 3D Scene Initialization
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Dark Cyber Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18110e);
    scene.fog = new THREE.FogExp2(0x18110e, 0.08);
    sceneRef.current = scene;

    // 2. Perspective Camera (SimCity Isometric Angle)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 7.5, 9);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting (Sci-Fi Ambient & Directional Sun)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 12, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff7744, 2, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // 5. 3D Cyber Terrain Grid
    const gridHelper = new THREE.GridHelper(16, 32, 0x8d6e63, 0x3e2723);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // 6. India / BRICS Base Landplate
    const plateGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.2, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x2d1e18,
      roughness: 0.8,
      metalness: 0.2
    });
    const landplate = new THREE.Mesh(plateGeo, plateMat);
    landplate.position.y = -0.15;
    scene.add(landplate);

    // 7. Glowing Beacons (Pillars)
    const pillarMeshes = [];
    pillarsRef.current = pillarMeshes;

    hotspots.forEach((spot, idx) => {
      const height = (spot.urgency / 10) * 3.5;
      const pillarGeo = new THREE.CylinderGeometry(0.12, 0.16, height, 16);
      
      // Dynamic color gradient based on urgency
      const color = spot.urgency > 9.0 ? 0xff2244 : (spot.urgency > 8.0 ? 0xff6622 : 0xffaa00);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.92
      });

      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(spot.coords.x, height / 2, spot.coords.z);
      pillar.userData = { hotspot: spot, index: idx };
      scene.add(pillar);
      pillarMeshes.push(pillar);

      // Top Radiant Light Sphere
      const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(spot.coords.x, height + 0.1, spot.coords.z);
      scene.add(sphere);

      // Base Halo Ring
      const ringGeo = new THREE.RingGeometry(0.25, 0.45, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(spot.coords.x, 0.01, spot.coords.z);
      scene.add(ring);
    });

    // 8. Raycaster for Pillar Clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pillarMeshes);

      if (intersects.length > 0) {
        const clickedSpot = intersects[0].object.userData.hotspot;
        setSelectedHotspot(clickedSpot);
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 9. Interactive Rotation & Gentle Orbit Animation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      scene.rotation.y += deltaX * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when not interacting
      if (!isDragging) {
        scene.rotation.y += 0.0015;
      }

      // Pillar beacon pulsing
      pillarMeshes.forEach((mesh, i) => {
        mesh.material.emissiveIntensity = 0.6 + Math.sin(elapsedTime * 3 + i) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hotspots]);

  const filteredHotspots = hotspots.filter(h => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return h.urgency >= 9.0;
    if (activeFilter === 'rural') return h.areaType.includes('Rural');
    if (activeFilter === 'brics') return h.country.includes('Brazil') || h.country.includes('BRICS');
    return true;
  });

  return (
    <div className="digital-twin-wrapper">
      {/* 3D Map Header Controls */}
      <div className="twin-top-header">
        <div className="header-left">
          <button type="button" className="twin-back-btn" onClick={onBackToPortal}>
            ⬅️ Citizen Portal
          </button>
          <div className="twin-titles">
            <h2>JanDhwani 3D Digital Twin Platform</h2>
            <p>Step 4: Gamified 3D Governance & Infrastructure Allocation Dashboard</p>
          </div>
        </div>

        <div className="header-right">
          <div className="brics-mode-toggle">
            <button 
              type="button" 
              className={`mode-btn ${mapMode === 'india' ? 'active' : ''}`}
              onClick={() => setMapMode('india')}
            >
              🇮🇳 India (DPI)
            </button>
            <button 
              type="button" 
              className={`mode-btn ${mapMode === 'brics' ? 'active' : ''}`}
              onClick={() => setMapMode('brics')}
            >
              🌐 BRICS Nations
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="twin-canvas-container" ref={mountRef}>
        {/* Real-Time Live Feed HUD Overlay */}
        <div className="twin-hud-overlay">
          <div className="hud-badge live-pulse">
            <span className="pulse-dot"></span>
            <strong>Firebase Realtime Sync:</strong> Active (3D Beacons Live)
          </div>

          <div className="hud-legend">
            <div className="legend-item"><span className="dot critical"></span> Urgency 9-10 (Critical)</div>
            <div className="legend-item"><span className="dot high"></span> Urgency 8-9 (High)</div>
            <div className="legend-item"><span className="dot moderate"></span> Urgency 7-8 (Moderate)</div>
          </div>
        </div>

        {/* Hotspots Quick Filter Bar */}
        <div className="twin-filter-bar">
          <button 
            type="button" 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Beacons ({hotspots.length})
          </button>
          <button 
            type="button" 
            className={`filter-btn ${activeFilter === 'high' ? 'active' : ''}`}
            onClick={() => setActiveFilter('high')}
          >
            🔥 Critical (≥ 9.0)
          </button>
          <button 
            type="button" 
            className={`filter-btn ${activeFilter === 'rural' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rural')}
          >
            🌾 Rural Priority Boost
          </button>
          <button 
            type="button" 
            className={`filter-btn ${activeFilter === 'brics' ? 'active' : ''}`}
            onClick={() => setActiveFilter('brics')}
          >
            🌐 BRICS Nodes
          </button>
        </div>
      </div>

      {/* Sci-Fi Game-Style Pillar Inspector Modal */}
      {selectedHotspot && (
        <div className="sci-fi-modal-overlay" onClick={() => setSelectedHotspot(null)}>
          <div className="sci-fi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-badge-row">
                <span className="ticket-id-tag">🎫 {selectedHotspot.id}</span>
                <span className="urgency-tag">⚡ Urgency: {selectedHotspot.urgency} / 10</span>
                <span className="area-type-tag">🏛️ {selectedHotspot.areaType}</span>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedHotspot(null)}>✕</button>
            </div>

            <h3 className="modal-title">{selectedHotspot.title}</h3>

            <div className="gemini-ai-summary-box">
              <div className="ai-summary-header">
                <span>🤖 Google Gemini 1.5 Flash (1-Line Executive Summary):</span>
              </div>
              <p className="ai-summary-text">"{selectedHotspot.summary}"</p>
            </div>

            <div className="modal-grid-details">
              <div className="modal-cell">
                <small>Designated Department</small>
                <strong>{selectedHotspot.department}</strong>
              </div>
              <div className="modal-cell">
                <small>Incident Location & Geography</small>
                <strong>{selectedHotspot.location}</strong>
              </div>
              <div className="modal-cell">
                <small>Administrative Routing Unit</small>
                <strong>{selectedHotspot.routing}</strong>
              </div>
              <div className="modal-cell">
                <small>Open-Data Poverty & Infrastructure Weighting</small>
                <strong>Base {selectedHotspot.baseUrgency} + {selectedHotspot.povertyBoost}</strong>
              </div>
            </div>

            {selectedHotspot.imageVerified && (
              <div className="modal-evidence-banner">
                <span>📸 <strong>FDA-Style Multimodal Vision AI Verified:</strong> Visual evidence matches reported incident with {selectedHotspot.imageConfidence}% confidence.</span>
              </div>
            )}

            <div className="modal-footer-actions">
              <button type="button" className="action-dispatch-btn">
                🏛️ Dispatch Budget & Work Order (Direct Allocation)
              </button>
              <button type="button" className="action-sms-btn" onClick={() => alert(`SMS update sent to citizen ${selectedHotspot.citizen}`)}>
                📲 Send SMS Tracking Alert to Citizen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalTwinMap;
