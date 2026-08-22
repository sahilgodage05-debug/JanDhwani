import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './DigitalTwinMap.css';

// Hierarchical Hotspots covering National, State, District & Precise Hyper-Local Wards
const HIERARCHICAL_HOTSPOTS = [
  {
    id: 'JD-942108',
    title: 'Wagholi Main Conduit Rupture',
    summary: 'Critical 400mm drinking water main burst near Wagholi Gram Panchayat, affecting 14,000 residents.',
    department: 'Ministry of Jal Shakti / Water Supply Board',
    deptKey: 'jal_shakti',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli Taluka',
    wardOrPanchayat: 'Wagholi Gram Panchayat',
    landmark: 'Opposite Primary Health Centre, Nagar Road',
    coords: { x: -0.6, z: 0.5, lat: 18.5793, lng: 73.9814 },
    urgency: 8.9,
    baseUrgency: 7.2,
    povertyBoost: '+1.7 (Rural Deficit Weight)',
    areaType: 'Rural (Gram Panchayat)',
    routing: 'BDO Haveli, Superintending Engineer Jal Shakti & DM Pune',
    citizen: 'Sunil Deshmukh (UID: 9822998877)',
    imageVerified: true,
    imageConfidence: 97,
    status: 'Field Team Dispatched',
    timestamp: '2 mins ago',
    country: 'India'
  },
  {
    id: 'JD-942109',
    title: 'K-West Stormwater Arterial Clog',
    summary: 'High-density plastic accumulation choking subterranean drainage culvert prior to monsoon.',
    department: 'Public Works Department (PWD / MCGM)',
    deptKey: 'pwd',
    state: 'Maharashtra',
    district: 'Mumbai',
    tehsil: 'Andheri West',
    wardOrPanchayat: 'Ward No. 64 (K-West)',
    landmark: 'SV Road Junction, near Andheri Station',
    coords: { x: -1.2, z: 0.3, lat: 19.1197, lng: 72.8468 },
    urgency: 8.4,
    baseUrgency: 7.5,
    povertyBoost: '+0.9 (Flood Vulnerability Index)',
    areaType: 'Urban (Municipal Ward)',
    routing: 'Ward Officer K-West & Chief Engineer Stormwater MCGM',
    citizen: 'Kavita Mehta (UID: 9820011223)',
    imageVerified: true,
    imageConfidence: 95,
    status: 'Work Order Generated',
    timestamp: '18 mins ago',
    country: 'India'
  },
  {
    id: 'JD-811420',
    title: 'NH-31 Arterial Bridge Fissure',
    summary: 'Critical structural shear crack detected on pillar #4 of bridge connecting Purnia to Katihar.',
    department: 'Public Works Department (PWD / NHAI)',
    deptKey: 'pwd',
    state: 'Bihar',
    district: 'Purnia',
    tehsil: 'Kasba Block',
    wardOrPanchayat: 'Kasba Rural Sector 3',
    landmark: 'Kilometer Stone 42, NH-31 Bypass',
    coords: { x: 1.4, z: -0.5, lat: 25.7771, lng: 87.4753 },
    urgency: 9.4,
    baseUrgency: 8.0,
    povertyBoost: '+1.4 (High Vulnerability Index)',
    areaType: 'Rural (Block)',
    routing: 'District Magistrate Purnia & Executive Engineer NHAI',
    citizen: 'Rameshwar Yadav (UID: 9431023456)',
    imageVerified: true,
    imageConfidence: 96,
    status: 'Traffic Diverted / Urgent Inspection',
    timestamp: '14 mins ago',
    country: 'India'
  },
  {
    id: 'JD-722105',
    title: 'Tambaram PHC Oxygen Plant Voltage Dip',
    summary: 'Substation transformer overload creating severe brownouts across neonatal intensive care units.',
    department: 'Ministry of Power & Energy',
    deptKey: 'power',
    state: 'Tamil Nadu',
    district: 'Chennai',
    tehsil: 'Tambaram Taluk',
    wardOrPanchayat: 'Zone 14, Ward 172',
    landmark: 'Government Taluk Hospital Campus',
    coords: { x: 0.2, z: 1.9, lat: 12.9249, lng: 80.1478 },
    urgency: 9.2,
    baseUrgency: 8.8,
    povertyBoost: '+0.4 (Essential Healthcare Node)',
    areaType: 'Urban (Zone 14)',
    routing: 'Zonal Health Officer & TANGEDCO Superintending Engineer',
    citizen: 'Meenakshi Sundaram (UID: 9444012345)',
    imageVerified: true,
    imageConfidence: 98,
    status: 'Emergency Backup Activated',
    timestamp: '32 mins ago',
    country: 'India'
  },
  {
    id: 'JD-510022',
    title: 'Substandard Drug Batch Alert',
    summary: 'Counterfeit cephalosporin antibiotics batch intercepted in wholesale drug warehouse.',
    department: 'Food & Drugs Administration (FDA / Health)',
    deptKey: 'health_fda',
    state: 'Delhi (NCT)',
    district: 'New Delhi',
    tehsil: 'Central Delhi',
    wardOrPanchayat: 'Ward 24, Daryaganj',
    landmark: 'Wholesale Medicine Market, Netaji Subhash Marg',
    coords: { x: 0.1, z: -1.4, lat: 28.6139, lng: 77.2090 },
    urgency: 9.5,
    baseUrgency: 9.0,
    povertyBoost: '+0.5 (Public Health Hazard)',
    areaType: 'Urban Commercial',
    routing: 'Drug Controller General & Delhi State DI',
    citizen: 'Dr. Vivek Malhotra (UID: 9811099887)',
    imageVerified: true,
    imageConfidence: 99,
    status: 'Seizure Notice Issued',
    timestamp: '45 mins ago',
    country: 'India'
  },
  {
    id: 'JD-633019',
    title: 'BRICS Node: Substandard Pharmaceuticals',
    summary: 'Unregistered batch of counterfeit antibiotics intercepted in retail pharmacy.',
    department: 'Food & Drugs Administration (FDA / ANVISA BRICS)',
    deptKey: 'health_fda',
    state: 'São Paulo',
    district: 'São Paulo',
    tehsil: 'Central District',
    wardOrPanchayat: 'Distrito República',
    landmark: 'Avenida Paulista Medical Corridor',
    coords: { x: -3.2, z: 2.2, lat: -23.5505, lng: -46.6333 },
    urgency: 9.1,
    baseUrgency: 8.8,
    povertyBoost: '+0.3 (Public Health Hazard)',
    areaType: 'Urban Metropolitan',
    routing: 'Secretaria Municipal da Saúde & ANVISA Inspector',
    citizen: 'Carlos Silva (UID: +55 11 98765-4321)',
    imageVerified: true,
    imageConfidence: 99,
    status: 'Quarantine Protocol Active',
    timestamp: '1 hour ago',
    country: 'Brazil (BRICS)'
  }
];

const GOV_LEVELS = [
  { id: 'national', label: '🏛️ Central Ministry (All India)' },
  { id: 'state', label: '🏢 State Ministry (Districts)' },
  { id: 'district', label: '📍 District Magistrate / DM' },
  { id: 'precise', label: '🔍 Hyper-Local Ward / Village' }
];

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'jal_shakti', label: '💧 Jal Shakti (Water)' },
  { id: 'pwd', label: '🛣️ PWD (Roads & Bridges)' },
  { id: 'power', label: '⚡ Power & Energy' },
  { id: 'health_fda', label: '🏥 Health & FDA' }
];

const STATES = ['All States', 'Maharashtra', 'Bihar', 'Tamil Nadu', 'Delhi (NCT)', 'Brazil (BRICS)'];

function DigitalTwinMap({ latestGrievance, onBackToPortal }) {
  const mountRef = useRef(null);
  const [hotspots, setHotspots] = useState(HIERARCHICAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  
  // Hierarchical Governance Simulation Controls
  const [govLevel, setGovLevel] = useState('national'); // 'national' | 'state' | 'district' | 'precise'
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDept, setSelectedDept] = useState('all');

  const cameraRef = useRef(null);
  const targetCamPosRef = useRef(new THREE.Vector3(0, 7.5, 9));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const pillarsRef = useRef([]);

  // Integrate newly dispatched citizen grievance dynamically
  useEffect(() => {
    if (latestGrievance && !hotspots.some(h => h.id === latestGrievance.ticketId)) {
      const isWater = latestGrievance.department?.toLowerCase().includes('jal') || latestGrievance.department?.toLowerCase().includes('water');
      const isHealth = latestGrievance.department?.toLowerCase().includes('fda') || latestGrievance.department?.toLowerCase().includes('health');
      const deptKey = isWater ? 'jal_shakti' : (isHealth ? 'health_fda' : 'pwd');

      const newSpot = {
        id: latestGrievance.ticketId,
        title: latestGrievance.translatedText?.substring(0, 42) + '...' || 'Citizen Priority Grievance',
        summary: latestGrievance.translatedText || 'Citizen reported public grievance requiring immediate administrative dispatch.',
        department: latestGrievance.department,
        deptKey: deptKey,
        location: latestGrievance.confirmedLocation || 'Verified Jurisdiction',
        state: 'Maharashtra',
        district: 'Pune',
        tehsil: 'Haveli Taluka',
        wardOrPanchayat: 'Wagholi Panchayat',
        landmark: 'Near Local Water Reservoir',
        coords: { x: -0.55, z: 0.55, lat: 18.5793, lng: 73.9814 },
        urgency: parseFloat(latestGrievance.severityScore) || 8.9,
        baseUrgency: 7.5,
        povertyBoost: '+1.4 (Rural Boost)',
        areaType: 'Rural (Gram Panchayat)',
        routing: latestGrievance.routingUnit || 'District Magistrate & BDO',
        citizen: 'Verified Citizen Credential',
        imageVerified: latestGrievance.imageVerified || false,
        imageConfidence: latestGrievance.imageScore || 95,
        status: 'Newly Dispatched',
        timestamp: 'Just now (Live)',
        country: 'India'
      };
      setHotspots(prev => [newSpot, ...prev]);
      setSelectedHotspot(newSpot);
      setGovLevel('precise');
      setSelectedState('Maharashtra');
      setSelectedDistrict('Pune');
    }
  }, [latestGrievance]);

  // Handle Zoom and Camera Position depending on Governance Tier
  useEffect(() => {
    if (!cameraRef.current) return;

    if (govLevel === 'national') {
      targetCamPosRef.current.set(0, 8.0, 9.5);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (govLevel === 'state') {
      if (selectedState === 'Maharashtra') {
        targetCamPosRef.current.set(-1.0, 4.2, 4.5);
        targetLookAtRef.current.set(-0.8, 0.4, 0.4);
      } else if (selectedState === 'Bihar') {
        targetCamPosRef.current.set(1.5, 4.2, 3.5);
        targetLookAtRef.current.set(1.3, 0.4, -0.4);
      } else if (selectedState === 'Tamil Nadu') {
        targetCamPosRef.current.set(0.3, 4.2, 5.2);
        targetLookAtRef.current.set(0.2, 0.4, 1.8);
      } else {
        targetCamPosRef.current.set(0, 5.0, 6.0);
        targetLookAtRef.current.set(0, 0, 0);
      }
    } else if (govLevel === 'district') {
      targetCamPosRef.current.set(-0.7, 2.8, 2.5);
      targetLookAtRef.current.set(-0.6, 0.5, 0.5);
    } else if (govLevel === 'precise') {
      // Hyper-Local Ground Radar Zoom
      targetCamPosRef.current.set(-0.6, 1.6, 1.5);
      targetLookAtRef.current.set(-0.6, 0.8, 0.5);
    }
  }, [govLevel, selectedState, selectedDistrict]);

  // Three.js 3D Scene Initialization
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18110e);
    scene.fog = new THREE.FogExp2(0x18110e, 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(targetCamPosRef.current);
    camera.lookAt(targetLookAtRef.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
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

    // 6. India Base Plate
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

      // Top Beacon Orb
      const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(spot.coords.x, height + 0.1, spot.coords.z);
      scene.add(sphere);

      // Base Precision Halo
      const ringGeo = new THREE.RingGeometry(0.25, 0.48, 24);
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

    // 8. Raycaster for Beacon Clicking
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
        setGovLevel('precise');
        setSelectedState(clickedSpot.state);
        setSelectedDistrict(clickedSpot.district);
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 9. Interactive Dragging Controls
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

    // 10. Smooth Camera Interpolation & Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Lerping to Target Position
      camera.position.lerp(targetCamPosRef.current, 0.05);
      camera.lookAt(targetLookAtRef.current);

      // Gentle auto-rotation when in macro view
      if (!isDragging && govLevel === 'national') {
        scene.rotation.y += 0.0012;
      }

      // Beacon pulsing
      pillarMeshes.forEach((mesh, i) => {
        mesh.material.emissiveIntensity = 0.6 + Math.sin(elapsedTime * 3 + i) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

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

  // Filtered Hotspots based on Selected Level & Ministry
  const visibleHotspots = hotspots.filter(h => {
    if (selectedState !== 'All States' && h.state !== selectedState) return false;
    if (selectedDistrict !== 'All Districts' && h.district !== selectedDistrict) return false;
    if (selectedDept !== 'all' && h.deptKey !== selectedDept) return false;
    return true;
  });

  const availableDistricts = selectedState === 'Maharashtra' 
    ? ['All Districts', 'Pune', 'Mumbai', 'Nagpur', 'Nashik'] 
    : (selectedState === 'Bihar' ? ['All Districts', 'Purnia', 'Patna', 'Gaya'] 
    : (selectedState === 'Tamil Nadu' ? ['All Districts', 'Chennai', 'Coimbatore', 'Madurai'] 
    : ['All Districts']));

  return (
    <div className="digital-twin-wrapper">
      {/* Top Header: Government Body Switcher */}
      <div className="twin-top-header">
        <div className="header-left">
          <button type="button" className="twin-back-btn" onClick={onBackToPortal}>
            ⬅️ Citizen Portal
          </button>
          <div className="twin-titles">
            <h2>JanDhwani 3D Digital Twin Platform</h2>
            <p>Hierarchical Ministry & District Governance Simulator • Real-time Decision Support</p>
          </div>
        </div>

        {/* Administrative Tier Selector */}
        <div className="gov-tier-selector">
          {GOV_LEVELS.map(tier => (
            <button
              key={tier.id}
              type="button"
              className={`tier-btn ${govLevel === tier.id ? 'active' : ''}`}
              onClick={() => {
                setGovLevel(tier.id);
                if (tier.id === 'national') {
                  setSelectedState('All States');
                  setSelectedDistrict('All Districts');
                } else if (tier.id === 'state' && selectedState === 'All States') {
                  setSelectedState('Maharashtra');
                } else if (tier.id === 'district') {
                  setSelectedState('Maharashtra');
                  setSelectedDistrict('Pune');
                }
              }}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Multi-Tier Filter Toolbar */}
      <div className="twin-sub-toolbar">
        {/* State Selector */}
        <div className="toolbar-group">
          <label>State Ministry:</label>
          <select 
            value={selectedState} 
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All Districts');
              if (e.target.value !== 'All States') setGovLevel('state');
            }}
          >
            {STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>

        {/* District Selector */}
        <div className="toolbar-group">
          <label>District Unit:</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              if (e.target.value !== 'All Districts') setGovLevel('district');
            }}
          >
            {availableDistricts.map(dst => <option key={dst} value={dst}>{dst}</option>)}
          </select>
        </div>

        {/* Department Ministry Filter */}
        <div className="toolbar-group">
          <label>Concerned Ministry:</label>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>

        {/* Active Zoom Indicator */}
        <div className="zoom-indicator-pill">
          <span>🔍 Camera Zoom: <strong>{govLevel.toUpperCase()} LEVEL</strong></span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="twin-canvas-container" ref={mountRef}>
        {/* Real-Time Live Feed HUD Overlay */}
        <div className="twin-hud-overlay">
          <div className="hud-badge live-pulse">
            <span className="pulse-dot"></span>
            <strong>3D Precision Simulation:</strong> Active ({visibleHotspots.length} Active Beacons)
          </div>

          <div className="hud-legend">
            <div className="legend-item"><span className="dot critical"></span> Urgency 9-10 (Critical)</div>
            <div className="legend-item"><span className="dot high"></span> Urgency 8-9 (High)</div>
            <div className="legend-item"><span className="dot moderate"></span> Urgency 7-8 (Moderate)</div>
          </div>
        </div>

        {/* Precision Ground Radar Overlay (when in District/Precise Zoom) */}
        {(govLevel === 'district' || govLevel === 'precise') && (
          <div className="ground-radar-overlay">
            <div className="radar-header">
              <span className="radar-icon">🎯</span>
              <strong>Hyper-Local Ground Precision Radar</strong>
            </div>
            <div className="radar-body">
              <div><strong>Active Node:</strong> Wagholi Panchayat, Haveli Taluka</div>
              <div><strong>Precise GPS:</strong> 18.5793° N, 73.9814° E (±2m fix)</div>
              <div><strong>Infrastructure Deficit:</strong> 400mm Pipeline Fracture</div>
              <div><strong>DM Routing:</strong> Collector Pune & BDO Haveli</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotspots Carousel & Quick Access List at Bottom */}
      <div className="twin-bottom-beacons-list">
        <span className="beacon-list-title">⚡ High-Severity Governance Hotspots ({visibleHotspots.length}):</span>
        <div className="beacon-cards-row">
          {visibleHotspots.map((spot) => (
            <div
              key={spot.id}
              className={`beacon-mini-card ${selectedHotspot?.id === spot.id ? 'active-card' : ''}`}
              onClick={() => {
                setSelectedHotspot(spot);
                setGovLevel('precise');
                setSelectedState(spot.state);
                setSelectedDistrict(spot.district);
              }}
            >
              <div className="mini-card-top">
                <span className="mini-score">⚡ {spot.urgency}</span>
                <span className="mini-dept">{spot.department.split('/')[0]}</span>
              </div>
              <strong className="mini-title">{spot.title}</strong>
              <span className="mini-loc">📍 {spot.district}, {spot.state}</span>
            </div>
          ))}
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
                <span className="status-tag">Status: {selectedHotspot.status}</span>
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
                <small>Designated Ministry / Department</small>
                <strong>{selectedHotspot.department}</strong>
              </div>
              <div className="modal-cell">
                <small>Precise Ground Location & GPS Coordinates</small>
                <strong>{selectedHotspot.location} ({selectedHotspot.coords.lat}° N, {selectedHotspot.coords.lng}° E)</strong>
              </div>
              <div className="modal-cell">
                <small>Administrative Jurisdiction Unit</small>
                <strong>{selectedHotspot.routing}</strong>
              </div>
              <div className="modal-cell">
                <small>Poverty & Infrastructure Open-Data Weighting</small>
                <strong>Base {selectedHotspot.baseUrgency} + {selectedHotspot.povertyBoost}</strong>
              </div>
            </div>

            {selectedHotspot.imageVerified && (
              <div className="modal-evidence-banner">
                <span>📸 <strong>FDA-Style Multimodal Vision AI Verified:</strong> Visual evidence matches reported incident with {selectedHotspot.imageConfidence}% confidence.</span>
              </div>
            )}

            {/* Google Satellite Inspection View */}
            <div className="modal-gmaps-preview">
              <div className="gmaps-preview-header">
                <span>🛰️ Live Google Maps Ground Satellite Verification:</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedHotspot.coords.lat},${selectedHotspot.coords.lng}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="modal-gmaps-link"
                >
                  ↗ Full Satellite View
                </a>
              </div>
              <iframe
                title="Satellite Ground Inspection"
                className="modal-gmaps-iframe"
                src={`https://maps.google.com/maps?q=${selectedHotspot.coords.lat},${selectedHotspot.coords.lng}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              />
            </div>

            <div className="modal-footer-actions">
              <button 
                type="button" 
                className="action-dispatch-btn"
                onClick={() => alert(`Direct Budget Allocation of ₹14.5 Lakhs dispatched to ${selectedHotspot.routing} for ticket ${selectedHotspot.id}`)}
              >
                🏛️ Dispatch Budget & Work Order (Direct Allocation)
              </button>
              <button 
                type="button" 
                className="action-sms-btn" 
                onClick={() => alert(`Automated SMS tracking update dispatched to citizen ${selectedHotspot.citizen}`)}
              >
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
