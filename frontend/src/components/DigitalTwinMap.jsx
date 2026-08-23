import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Map as MapIcon, Compass, Navigation, RefreshCcw, Layers, Search, User, Filter, Share2, ZoomIn, ZoomOut, Maximize, FileText, CheckCircle2 } from 'lucide-react';
import './DigitalTwinMap.css';

const GOV_LEVELS = [
  { id: 'national', label: 'National / Central' },
  { id: 'state', label: 'State Level' },
  { id: 'district', label: 'District Magistrate' },
  { id: 'precise', label: 'Hyper-Local Ward' }
];

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'sanitation_swm', label: 'Solid Waste & Sanitation' },
  { id: 'jal_shakti', label: 'Jal Shakti (Water)' },
  { id: 'pwd', label: 'PWD (Roads & Bridges)' },
  { id: 'power', label: 'Power & Energy' },
  { id: 'health_fda', label: 'Health & Public Safety' }
];

const STATES = ['All States', 'Maharashtra', 'Bihar', 'Tamil Nadu', 'Delhi (NCT)', 'Brazil (BRICS)'];

function DigitalTwinMap({ 
  hotspots = [], 
  onClearAllComplaints, 
  onRestoreDemo, 
  onResolveCitizen, 
  onResolveAuthority, 
  onViewArchive, 
  onBackToPortal,
  currentUser 
}) {
  const mountRef = useRef(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  
  // Resolution Action Drawer state
  const [resolutionMode, setResolutionMode] = useState(null); // null | 'citizen' | 'authority'
  const [citizenRating, setCitizenRating] = useState(5);
  const [citizenFeedback, setCitizenFeedback] = useState('');
  const [authorityAction, setAuthorityAction] = useState('');
  const [authorityOfficer, setAuthorityOfficer] = useState('');
  const [authorityBudget, setAuthorityBudget] = useState('₹2.4 Lakhs');
  const [toastMessage, setToastMessage] = useState(null);

  // Hierarchical Governance Simulation Controls
  const [govLevel, setGovLevel] = useState('national'); // 'national' | 'state' | 'district' | 'precise'
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDept, setSelectedDept] = useState('all');

  const cameraRef = useRef(null);
  const targetCamPosRef = useRef(new THREE.Vector3(0, 7.5, 9));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const pillarsRef = useRef([]);

  // Auto-fill resolution defaults when opening resolution modal
  const openResolutionForm = (mode, spot) => {
    setResolutionMode(mode);
    if (mode === 'citizen') {
      setCitizenRating(5);
      setCitizenFeedback(`The reported ${spot.coreDefect || spot.title} has been successfully remediated on ground. Satisfied with the prompt resolution.`);
    } else {
      setAuthorityAction(`Field team dispatched to ${spot.location || spot.district}. Remediation and technical inspection completed. Safety audit passed.`);
      setAuthorityOfficer(currentUser ? `${currentUser.fullName} (Zonal Officer)` : 'Er. R. Deshmukh, Executive Engineer');
      setAuthorityBudget(spot.urgency > 9 ? '₹4.5 Lakhs' : '₹1.8 Lakhs');
    }
  };

  // Submit Resolution by Citizen
  const handleConfirmCitizenResolution = () => {
    if (!selectedHotspot) return;
    if (onResolveCitizen) {
      onResolveCitizen(selectedHotspot.id, citizenFeedback, citizenRating);
    }
    const resolvedTitle = selectedHotspot.title;
    setSelectedHotspot(null);
    setResolutionMode(null);
    showToast(`"${resolvedTitle}" marked as resolved by citizen and moved to Resolved Archive.`);
  };

  // Submit Resolution by Authority
  const handleConfirmAuthorityResolution = () => {
    if (!selectedHotspot) return;
    if (onResolveAuthority) {
      onResolveAuthority(selectedHotspot.id, authorityAction, authorityOfficer, authorityBudget);
    }
    const resolvedTitle = selectedHotspot.title;
    setSelectedHotspot(null);
    setResolutionMode(null);
    showToast(`"${resolvedTitle}" completed by Govt Authority and moved to Resolved Archive.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

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

    (hotspots || []).forEach((spot, idx) => {
      const height = ((spot.urgency || 8) / 10) * 3.5;
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
      const cx = spot.coords?.x ?? (idx % 2 === 0 ? -0.5 : 0.5);
      const cz = spot.coords?.z ?? (idx % 3 === 0 ? 0.4 : -0.4);
      pillar.position.set(cx, height / 2, cz);
      pillar.userData = { hotspot: spot, index: idx };
      scene.add(pillar);
      pillarMeshes.push(pillar);

      // Top Beacon Orb
      const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(cx, height + 0.1, cz);
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
      ring.position.set(cx, 0.01, cz);
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
        setResolutionMode(null);
        setGovLevel('precise');
        if (clickedSpot.state) setSelectedState(clickedSpot.state);
        if (clickedSpot.district) setSelectedDistrict(clickedSpot.district);
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
  }, [hotspots, govLevel]);

  // Filtered Hotspots based on Selected Level & Ministry
  const visibleHotspots = (hotspots || []).filter(h => {
    if (selectedState !== 'All States' && h.state !== selectedState) return false;
    if (selectedDistrict !== 'All Districts' && h.district !== selectedDistrict) return false;
    if (selectedDept !== 'all' && h.deptKey !== selectedDept) return false;
    return true;
  });

  const availableDistricts = selectedState === 'Maharashtra' 
    ? ['All Districts', 'Pune', 'Mumbai City', 'Nagpur', 'Nashik'] 
    : (selectedState === 'Bihar' ? ['All Districts', 'Purnia', 'Patna', 'Gaya'] 
    : (selectedState === 'Tamil Nadu' ? ['All Districts', 'Chennai', 'Coimbatore', 'Madurai'] 
    : ['All Districts']));

  return (
    <div className="digital-twin-wrapper">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="twin-toast-banner">
          <span>{toastMessage}</span>
          {onViewArchive && (
            <button type="button" className="toast-action-btn" onClick={onViewArchive}>
              View in Resolved Archive ➔
            </button>
          )}
        </div>
      )}

      {/* Top Header: Government Body Switcher */}
      <div className="twin-top-header">
        <div className="header-left">
          <div className="twin-nav-actions">
            <button type="button" className="twin-back-btn" onClick={onBackToPortal}>
              ← Grievance Gateway
            </button>
            {onViewArchive && (
              <button type="button" className="twin-archive-nav-btn" onClick={onViewArchive}>
                Resolved Archive
              </button>
            )}
          </div>
          <div className="twin-titles">
            <h2>JanDhwani 3D Digital Twin Platform</h2>
            <p>Hierarchical Ministry & District Governance Simulator • Real-time Decision Support</p>
          </div>
        </div>

        {/* Administrative Tier Selector & Clear Action */}
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

      {/* Secondary Multi-Tier Filter Toolbar & Action Buttons */}
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

        {/* Department Ministry Filter */}
        <div className="toolbar-group">
          <label>Concerned Ministry:</label>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>

        {/* Clear All Complaints & Restore Action Buttons */}
        <div className="complaint-quick-actions">
          {hotspots.length > 0 ? (
            <button 
              type="button" 
              className="clear-all-complaints-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all active complaints from the 3D map?")) {
                  if (onClearAllComplaints) onClearAllComplaints();
                  setSelectedHotspot(null);
                  showToast("All active complaints cleared.");
                }
              }}
              title="Clear all active complaints to start clean"
            >
              Clear All ({hotspots.length})
            </button>
          ) : (
            <button 
              type="button" 
              className="restore-demo-btn"
              onClick={() => {
                if (onRestoreDemo) onRestoreDemo();
                showToast("Sample civic hotspots restored.");
              }}
            >
              Load Sample Hotspots
            </button>
          )}
        </div>

        {/* Active Zoom Indicator */}
        <div className="zoom-indicator-pill">
          <span>View Level: <strong>{govLevel.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="twin-canvas-container" ref={mountRef}>
        {/* Real-Time Live Feed HUD Overlay */}
        <div className="twin-hud-overlay">
          <div className="hud-badge live-pulse">
            <span className="pulse-dot"></span>
            <strong>3D Simulation:</strong> Active ({visibleHotspots.length} Active Beacons)
          </div>

          <div className="hud-legend">
            <div className="legend-item"><span className="dot critical"></span> Urgency 9-10 (Critical)</div>
            <div className="legend-item"><span className="dot high"></span> Urgency 8-9 (High)</div>
            <div className="legend-item"><span className="dot moderate"></span> Urgency 7-8 (Moderate)</div>
          </div>
        </div>

        {/* Empty State Overlay if 0 Active Hotspots */}
        {hotspots.length === 0 && (
          <div className="twin-empty-canvas-overlay">
            <div className="empty-glow-box">
              <h3>All Civic Grievances Resolved</h3>
              <p>Zero active problem beacons on the 3D map. Remediation records up to date.</p>
              <div className="empty-overlay-actions">
                <button type="button" className="empty-action-primary" onClick={onBackToPortal}>
                  File a Grievance
                </button>
                {onRestoreDemo && (
                  <button type="button" className="empty-action-secondary" onClick={onRestoreDemo}>
                    Load Sample Hotspots
                  </button>
                )}
                {onViewArchive && (
                  <button type="button" className="empty-action-secondary" onClick={onViewArchive}>
                    View Resolved Records Archive
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Precision Ground Radar Overlay (when in District/Precise Zoom & has active hotspot) */}
        {(govLevel === 'district' || govLevel === 'precise') && visibleHotspots.length > 0 && (
          <div className="ground-radar-overlay">
            <div className="radar-header">
              <strong>Hyper-Local Ground Precision Radar</strong>
            </div>
            <div className="radar-body">
              <div><strong>Active Node:</strong> {visibleHotspots[0]?.wardOrPanchayat || visibleHotspots[0]?.location || 'Jurisdiction'}</div>
              <div><strong>Precise GPS:</strong> {visibleHotspots[0]?.coords?.lat || 18.5793}° N, {visibleHotspots[0]?.coords?.lng || 73.9814}° E (±2m fix)</div>
              <div><strong>Infrastructure Deficit:</strong> {visibleHotspots[0]?.coreDefect || visibleHotspots[0]?.title}</div>
              <div><strong>DM Routing:</strong> {visibleHotspots[0]?.routing || 'District Magistrate'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotspots Carousel & Quick Access List at Bottom */}
      {visibleHotspots.length > 0 && (
        <div className="twin-bottom-beacons-list">
          <span className="beacon-list-title">Active Governance Hotspots ({visibleHotspots.length}):</span>
          <div className="beacon-cards-row">
            {visibleHotspots.map((spot) => (
              <div
                key={spot.id}
                className={`beacon-mini-card ${selectedHotspot?.id === spot.id ? 'active-card' : ''}`}
                onClick={() => {
                  setSelectedHotspot(spot);
                  setResolutionMode(null);
                  setGovLevel('precise');
                  if (spot.state) setSelectedState(spot.state);
                  if (spot.district) setSelectedDistrict(spot.district);
                }}
              >
                <div className="mini-card-top">
                  <span className="mini-score">Urgency: {spot.urgency}</span>
                  <span className="mini-dept">{spot.department?.split('/')[0]}</span>
                </div>
                <strong className="mini-title">{spot.title}</strong>
                <span className="mini-loc">{spot.district}, {spot.state}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sci-Fi Game-Style Pillar Inspector Modal */}
      {selectedHotspot && (
        <div className="sci-fi-modal-overlay" onClick={() => { setSelectedHotspot(null); setResolutionMode(null); }}>
          <div className="sci-fi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-badge-row">
                <span className="ticket-id-tag">ID: {selectedHotspot.id}</span>
                <span className="urgency-tag">Urgency: {selectedHotspot.urgency} / 10</span>
                <span className="area-type-tag">{selectedHotspot.areaType}</span>
                <span className="status-tag">Status: {selectedHotspot.status}</span>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => { setSelectedHotspot(null); setResolutionMode(null); }}>✕</button>
            </div>

            <h3 className="modal-title">{selectedHotspot.title}</h3>

            <div className="gemini-ai-summary-box">
              <div className="ai-summary-header">
                <span>Google Gemini 1.5 Flash (Executive Synthesis):</span>
              </div>
              <p className="ai-summary-text">"{selectedHotspot.summary}"</p>
            </div>

            {/* DUAL RESOLUTION & REMOVAL DRAWER SECTION */}
            <div className="resolution-action-section">
              <div className="resolution-section-header">
                <span className="res-section-title">Resolution & Removal Protocol:</span>
                <small className="res-section-hint">Both Citizen and Authority can resolve and archive this issue</small>
              </div>

              {!resolutionMode ? (
                <div className="dual-resolve-btn-row">
                  <button 
                    type="button" 
                    className="resolve-as-citizen-btn"
                    onClick={() => openResolutionForm('citizen', selectedHotspot)}
                  >
                    <div>
                      <strong>Mark as Resolved (Citizen Sign-off)</strong>
                      <small>Confirm fix, rate satisfaction & remove from map</small>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    className="resolve-as-authority-btn"
                    onClick={() => openResolutionForm('authority', selectedHotspot)}
                  >
                    <div>
                      <strong>Mark as Resolved (Govt Authority)</strong>
                      <small>Sign off work order, log budget & remove from map</small>
                    </div>
                  </button>
                </div>
              ) : resolutionMode === 'citizen' ? (
                /* Citizen Resolution Form */
                <div className="active-resolution-form citizen-form">
                  <div className="form-head">
                    <strong>Citizen Resolution Sign-off & Rating</strong>
                    <button type="button" className="cancel-res-btn" onClick={() => setResolutionMode(null)}>✕ Cancel</button>
                  </div>

                  <div className="star-rating-row">
                    <label>Satisfaction Rating:</label>
                    <div className="stars-picker">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${star <= citizenRating ? 'active-star' : ''}`}
                          onClick={() => setCitizenRating(star)}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-label">({citizenRating} / 5 Stars)</span>
                    </div>
                  </div>

                  <div className="res-input-group">
                    <label>Citizen Resolution Remarks (Short):</label>
                    <textarea 
                      rows="2" 
                      value={citizenFeedback} 
                      onChange={(e) => setCitizenFeedback(e.target.value)}
                      placeholder="e.g. Water supply restored cleanly. Problem fixed."
                    />
                  </div>

                  <div className="form-submit-row">
                    <button 
                      type="button" 
                      className="confirm-resolve-btn citizen-confirm"
                      onClick={handleConfirmCitizenResolution}
                    >
                      Confirm Resolution & Remove Grievance ➔
                    </button>
                  </div>
                </div>
              ) : (
                /* Authority Resolution Form */
                <div className="active-resolution-form authority-form">
                  <div className="form-head">
                    <strong>Government Authority / Work Order Sign-off</strong>
                    <button type="button" className="cancel-res-btn" onClick={() => setResolutionMode(null)}>✕ Cancel</button>
                  </div>

                  <div className="res-grid-inputs">
                    <div className="res-input-group">
                      <label>Signing Officer & Designation:</label>
                      <input 
                        type="text" 
                        value={authorityOfficer} 
                        onChange={(e) => setAuthorityOfficer(e.target.value)}
                      />
                    </div>
                    <div className="res-input-group">
                      <label>Budget Deployed / Utilized:</label>
                      <input 
                        type="text" 
                        value={authorityBudget} 
                        onChange={(e) => setAuthorityBudget(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="res-input-group">
                    <label>Remediation & Technical Action Logged (Short):</label>
                    <textarea 
                      rows="2" 
                      value={authorityAction} 
                      onChange={(e) => setAuthorityAction(e.target.value)}
                      placeholder="e.g. Pipeline welded, pressure calibrated, service restored."
                    />
                  </div>

                  <div className="form-submit-row">
                    <button 
                      type="button" 
                      className="confirm-resolve-btn authority-confirm"
                      onClick={handleConfirmAuthorityResolution}
                    >
                      Close Work Order, Remove from Map & Archive ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Part Problem Decomposition */}
            <div className="modal-decomposition-section">
              <span className="decomp-section-title">Structured Problem Entity Breakdown:</span>
              <div className="modal-decomp-grid">
                <div className="modal-decomp-cell">
                  <small>Core Defect</small>
                  <strong>{selectedHotspot.coreDefect || selectedHotspot.title}</strong>
                </div>
                <div className="modal-decomp-cell">
                  <small>Affected Scope</small>
                  <strong>{selectedHotspot.affectedScope || '14,000+ local citizens across sector'}</strong>
                </div>
                <div className="modal-decomp-cell">
                  <small>Risk & Hazard</small>
                  <strong>{selectedHotspot.riskLevel || 'Public safety & civic infrastructure downtime'}</strong>
                </div>
                <div className="modal-decomp-cell">
                  <small>Duration</small>
                  <strong>{selectedHotspot.duration || selectedHotspot.timestamp}</strong>
                </div>
                <div className="modal-decomp-cell modal-full-width">
                  <small>Prescribed Action</small>
                  <strong>{selectedHotspot.actionRequired || 'Emergency engineering inspection and direct budget dispatch'}</strong>
                </div>
              </div>
            </div>

            <div className="modal-grid-details">
              <div className="modal-cell">
                <small>Designated Ministry / Department</small>
                <strong>{selectedHotspot.department}</strong>
              </div>
              <div className="modal-cell">
                <small>Precise Ground Location & GPS Coordinates</small>
                <strong>{selectedHotspot.location || selectedHotspot.district} ({selectedHotspot.coords?.lat || 18.5793}° N, {selectedHotspot.coords?.lng || 73.9814}° E)</strong>
              </div>
              <div className="modal-cell">
                <small>Administrative Jurisdiction Unit</small>
                <strong>{selectedHotspot.routing}</strong>
              </div>
              <div className="modal-cell">
                <small>Poverty & Infrastructure Open-Data Weighting</small>
                <strong>Base {selectedHotspot.baseUrgency || 7.5} + {selectedHotspot.povertyBoost || '+1.2'}</strong>
              </div>
            </div>

            {selectedHotspot.imageVerified && (
              <div className="modal-evidence-banner">
                <span><strong>Google Gemini Vision AI Verified:</strong> Visual evidence matches reported incident with {selectedHotspot.imageConfidence}% confidence.</span>
              </div>
            )}

            {/* Google Satellite Inspection View */}
            <div className="modal-gmaps-preview">
              <div className="gmaps-preview-header">
                <span>Satellite & Geospatial Ground Verification:</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedHotspot.coords?.lat || 18.5793},${selectedHotspot.coords?.lng || 73.9814}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="modal-gmaps-link"
                >
                  Full Satellite View ➔
                </a>
              </div>
              <iframe
                title="Satellite Ground Inspection"
                className="modal-gmaps-iframe"
                src={`https://maps.google.com/maps?q=${selectedHotspot.coords?.lat || 18.5793},${selectedHotspot.coords?.lng || 73.9814}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              />
            </div>

            <div className="modal-footer-actions">
              <button 
                type="button" 
                className="action-dispatch-btn"
                onClick={() => alert(`Direct Budget Allocation dispatched to ${selectedHotspot.routing} for ticket ${selectedHotspot.id}`)}
              >
                Dispatch Emergency Budget Allocation
              </button>
              <button 
                type="button" 
                className="action-sms-btn" 
                onClick={() => alert(`Automated SMS tracking update dispatched to citizen ${selectedHotspot.citizen}`)}
              >
                Send SMS Notification to Citizen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalTwinMap;
