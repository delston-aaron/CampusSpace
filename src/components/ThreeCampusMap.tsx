import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { Venue } from '../types';
import { Compass, RotateCw, Maximize2, Layers, MapPin, Sparkles } from 'lucide-react';

interface ThreeCampusMapProps {
  onSelectVenue?: (venue: Venue) => void;
}

export const ThreeCampusMap: React.FC<ThreeCampusMapProps> = ({ onSelectVenue }) => {
  const { venues, selectedVenue, setSelectedVenue, activeView, setActiveView, bookings, queueRequests } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);

  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const isometricGroupRef = useRef<THREE.Group | null>(null);
  const venueMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Interaction dragging state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get status of a venue
  const getVenueStatus = useCallback((venueId: string) => {
    const hasQueue = queueRequests.some(q => q.venueId === venueId && q.status === 'queued');
    if (hasQueue) return 'contested';
    const isBooked = bookings.some(b => b.venueId === venueId && b.status === 'confirmed');
    if (isBooked) return 'occupied';
    return 'available';
  }, [bookings, queueRequests]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Context loss handlers
    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.8);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 2.5, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 5. Starfield / Floating Campus Dust
    const starsCount = 450;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 35;
      starPositions[i + 1] = (Math.random() - 0.5) * 25;
      starPositions[i + 2] = (Math.random() - 0.5) * 35;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // -------------------------------------------------------------
    // GROUP 1: 3D SPHERE CAMPUS MAP
    // -------------------------------------------------------------
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // Inner Core Sphere (Translucent dark glowing campus globe)
    const coreGeo = new THREE.SphereGeometry(2.3, 36, 36);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.6,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(coreSphere);

    // Outer Geodesic Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(2.32, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    sphereGroup.add(wireSphere);

    // Latitude & Orbital Rings
    const ringGeo = new THREE.RingGeometry(2.8, 2.82, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.3;
    sphereGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.y = Math.PI / 4;
    sphereGroup.add(ring2);

    // -------------------------------------------------------------
    // GROUP 2: ISOMETRIC ARCHITECTURAL CAMPUS MAP
    // -------------------------------------------------------------
    const isometricGroup = new THREE.Group();
    isometricGroupRef.current = isometricGroup;
    scene.add(isometricGroup);

    // Ground Quadrangle Grid
    const gridHelper = new THREE.GridHelper(12, 24, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -1.5;
    isometricGroup.add(gridHelper);

    // Paved quadrangle base
    const quadBaseGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.2, 32);
    const quadBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2
    });
    const quadBase = new THREE.Mesh(quadBaseGeo, quadBaseMat);
    quadBase.position.y = -1.6;
    isometricGroup.add(quadBase);

    // Toggle active view visibility
    if (activeView === 'isometric') {
      sphereGroup.visible = false;
      isometricGroup.visible = true;
    } else {
      sphereGroup.visible = true;
      isometricGroup.visible = false;
    }

    // -------------------------------------------------------------
    // SPAWN VENUE NODES ON BOTH SCENES
    // -------------------------------------------------------------
    const venueMap = new Map<string, THREE.Object3D>();

    venues.forEach((venue, index) => {
      const status = getVenueStatus(venue.id);
      const pinColor = status === 'contested' ? 0xec4899 : status === 'occupied' ? 0xf59e0b : 0x10b981;

      // 1. Sphere Pin Setup
      const phi = THREE.MathUtils.degToRad(90 - ((index * 42) % 140 - 25));
      const theta = THREE.MathUtils.degToRad((index * (360 / venues.length)) + 25);
      const r = 2.35;

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.cos(phi);
      const pz = r * Math.sin(phi) * Math.sin(theta);

      const spherePinGroup = new THREE.Group();
      spherePinGroup.position.set(px, py, pz);
      spherePinGroup.lookAt(0, 0, 0); // Orient toward center
      spherePinGroup.userData = { venue, type: 'sphere-node' };

      // Pin marker cylinder / needle
      const needleGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.4, 16);
      const needleMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.rotation.x = Math.PI / 2;
      spherePinGroup.add(needle);

      // Glowing Orb on tip
      const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.5
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.z = -0.22;
      spherePinGroup.add(orb);

      // Pulsing Ring
      const pulseGeo = new THREE.RingGeometry(0.14, 0.18, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.name = 'pulseRing';
      spherePinGroup.add(pulse);

      sphereGroup.add(spherePinGroup);
      venueMap.set(`${venue.id}-sphere`, spherePinGroup);

      // 2. Isometric Architectural Block Setup
      const isoGroup = new THREE.Group();
      // Calculate spatial ground position
      const angle = (index / venues.length) * Math.PI * 2;
      const rad = 2.4 + (index % 2) * 0.8;
      const ix = Math.cos(angle) * rad;
      const iz = Math.sin(angle) * rad;
      const heightVal = venue.capacity > 800 ? 1.4 : venue.capacity > 250 ? 0.9 : 0.6;

      isoGroup.position.set(ix, -1.5 + heightVal / 2, iz);
      isoGroup.userData = { venue, type: 'isometric-node' };

      // Building Block
      const bldgGeo = new THREE.BoxGeometry(0.7, heightVal, 0.7);
      const bldgMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 0.5
      });
      const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
      isoGroup.add(bldgMesh);

      // Top glowing roof beacon
      const beaconGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.7
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.y = heightVal / 2 + 0.04;
      isoGroup.add(beaconMesh);

      isometricGroup.add(isoGroup);
      venueMap.set(`${venue.id}-iso`, isoGroup);
    });

    venueMeshesRef.current = venueMap;

    // -------------------------------------------------------------
    // RAYCASTING & INTERACTION
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getRaycastIntersects = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const activeGroup = activeView === 'isometric' ? isometricGroup : sphereGroup;
      const intersects = raycaster.intersectObjects(activeGroup.children, true);
      
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== activeGroup) {
          if (curr.userData && curr.userData.venue) {
            return { venue: curr.userData.venue as Venue, object: curr };
          }
          curr = curr.parent;
        }
      }
      return null;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current) {
        const deltaX = clientX - previousMousePositionRef.current.x;
        const deltaY = clientY - previousMousePositionRef.current.y;

        rotationVelocityRef.current = {
          x: deltaY * 0.005,
          y: deltaX * 0.005
        };

        if (activeView === 'isometric' && isometricGroupRef.current) {
          isometricGroupRef.current.rotation.y += deltaX * 0.008;
        } else if (sphereGroupRef.current) {
          sphereGroupRef.current.rotation.y += deltaX * 0.008;
          sphereGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, sphereGroupRef.current.rotation.x + deltaY * 0.006));
        }

        previousMousePositionRef.current = { x: clientX, y: clientY };
      } else if (!('touches' in e)) {
        // Hover raycast for desktop
        const hit = getRaycastIntersects(clientX, clientY);
        if (hit) {
          setHoveredVenue(hit.venue);
          const rect = renderer.domElement.getBoundingClientRect();
          setTooltipPos({ x: clientX - rect.left, y: clientY - rect.top });
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredVenue(null);
          setTooltipPos(null);
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      const wasDragging = Math.abs(rotationVelocityRef.current.x) > 0.01 || Math.abs(rotationVelocityRef.current.y) > 0.01;
      isDraggingRef.current = false;

      // Check click/tap if user didn't perform a wide drag
      if (!wasDragging) {
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
        const hit = getRaycastIntersects(clientX, clientY);
        if (hit) {
          handleSelectVenueInternal(hit.venue);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.003;
      camera.position.z = Math.max(4.2, Math.min(11, camera.position.z + zoomDelta));
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ambient auto-rotation when user is not dragging
      if (isAutoRotating && !isDraggingRef.current) {
        if (sphereGroupRef.current && activeView !== 'isometric') {
          sphereGroupRef.current.rotation.y += 0.003;
        } else if (isometricGroupRef.current && activeView === 'isometric') {
          isometricGroupRef.current.rotation.y += 0.002;
        }
      }

      // Floating dust oscillation
      starField.rotation.y = elapsedTime * 0.02;

      // Pulse rings animation
      sphereGroup.traverse(child => {
        if (child.name === 'pulseRing') {
          const s = 1 + Math.sin(elapsedTime * 4) * 0.25;
          child.scale.set(s, s, s);
        }
      });

      // Smooth camera interpolation towards target if selected
      if (targetCamPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        camera.lookAt(targetLookAtRef.current);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [venues, activeView, getVenueStatus, isAutoRotating]);

  // Update view mode toggle
  useEffect(() => {
    if (sphereGroupRef.current && isometricGroupRef.current) {
      if (activeView === 'isometric') {
        sphereGroupRef.current.visible = false;
        isometricGroupRef.current.visible = true;
      } else {
        sphereGroupRef.current.visible = true;
        isometricGroupRef.current.visible = false;
      }
    }
  }, [activeView]);

  // Smooth zoom to venue when chosen from list or click
  const handleSelectVenueInternal = (venue: Venue) => {
    setSelectedVenue(venue);
    if (onSelectVenue) onSelectVenue(venue);

    // Zoom camera smoothly towards target coordinates
    if (cameraRef.current) {
      if (activeView === 'isometric') {
        targetCamPosRef.current = new THREE.Vector3(venue.coordinates.x * 1.5, 2.5, venue.coordinates.z * 1.5 + 4);
        targetLookAtRef.current = new THREE.Vector3(venue.coordinates.x, 0, venue.coordinates.z);
      } else {
        targetCamPosRef.current = new THREE.Vector3(0, 1.5, 5.2);
        targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      }
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current) {
      targetCamPosRef.current = new THREE.Vector3(0, 3.2, 7.5);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    }
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.set(0, 0, 0);
    }
    if (isometricGroupRef.current) {
      isometricGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-md">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

      {/* Top Left View HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-lg">
          <button
            onClick={() => setActiveView('sphere')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'sphere'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Campus Sphere</span>
          </button>
          <button
            onClick={() => setActiveView('isometric')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'isometric'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>3D Isometric Quads</span>
          </button>
        </div>

        {/* Live Legend */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-lg text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Booked</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>Contested Queue</span>
          </span>
        </div>
      </div>

      {/* Top Right HUD Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Orbit' : 'Resume Auto Orbit'}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
            isAutoRotating
              ? 'bg-slate-900/80 border-slate-700 text-amber-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 rounded-xl transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Tooltip on Hover */}
      {hoveredVenue && tooltipPos && (
        <div
          style={{
            transform: `translate(${tooltipPos.x + 12}px, ${tooltipPos.y + 12}px)`
          }}
          className="absolute top-0 left-0 pointer-events-none z-30 transition-transform duration-75"
        >
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl min-w-[210px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-amber-400 tracking-wide">{hoveredVenue.code}</span>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums">{hoveredVenue.capacity} Seats</span>
            </div>
            <h4 className="text-sm font-semibold text-white leading-snug">{hoveredVenue.name}</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{hoveredVenue.block}</p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Click to inspect calendar</span>
              <span className="text-amber-400 font-medium">Book →</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Quick Carousel of Locations */}
      <div className="absolute bottom-4 inset-x-4 z-20">
        <div className="p-2 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-xl flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="px-2 shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider text-[10px]">Campus Hubs</span>
          </div>

          {venues.map(v => {
            const isSelected = selectedVenue?.id === v.id;
            const status = getVenueStatus(v.id);
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVenueInternal(v)}
                className={`shrink-0 px-3 py-2 rounded-lg text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500/50 text-white'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30 text-slate-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === 'contested'
                      ? 'bg-pink-400 ring-2 ring-pink-500/30 animate-pulse'
                      : status === 'occupied'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-tight whitespace-nowrap">{v.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">{v.capacity} seats · {v.code}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
