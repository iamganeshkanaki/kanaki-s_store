import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Check,
  Plus,
  Play,
  Pause,
  Layers,
  Compass,
  Maximize2,
  ShieldCheck,
  Info,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GroceryItem } from '../types';

interface Dairy3DViewerProps {
  onAddToList?: (item: Omit<GroceryItem, 'id'>) => void;
  selectedModel?: 'paneer' | 'curd' | 'milk';
  compactMode?: boolean;
}

interface Product3DConfig {
  id: 'paneer' | 'curd' | 'milk';
  name: string;
  marathiName: string;
  weight: string;
  unit: string;
  defaultQty: number;
  description: string;
  highlights: string[];
  hotspots: { title: string; desc: string; pos: [number, number, number] }[];
}

const PRODUCTS_3D: Record<'paneer' | 'curd' | 'milk', Product3DConfig> = {
  paneer: {
    id: 'paneer',
    name: 'Fresh Soft Artisanal Paneer',
    marathiName: 'ताजे मऊ पनीर',
    weight: '500g',
    unit: 'g',
    defaultQty: 500,
    description:
      'Handcrafted daily in Solapur from 100% pure whole buffalo and cow milk. Pressed in traditional muslin cloth for ultra-soft, spongy melt-in-mouth texture without starch or chemicals.',
    highlights: ['100% Malai Rich', 'Spongy & Non-Rubbery', 'Zero Preservatives', 'Fresh Morning Batch'],
    hotspots: [
      {
        title: 'Muslin Cloth Texture',
        desc: 'Traditional fabric weave pattern from slow gentle pressing.',
        pos: [0, 0.7, 0.8],
      },
      {
        title: 'High Moisture Core',
        desc: 'Retains natural sweet whey milk for maximum softness.',
        pos: [0.9, 0.4, 0.4],
      },
      {
        title: 'Diced Fresh Cubes',
        desc: 'Dense, clean cutting with no crumbling when fried or simmered.',
        pos: [-1.1, 0.25, 0.7],
      },
    ],
  },
  curd: {
    id: 'curd',
    name: 'Fresh Thick Pot Curd (Dahi)',
    marathiName: 'गावरान मलाईदार दही',
    weight: '1 kg',
    unit: 'kg',
    defaultQty: 1,
    description:
      'Cultured overnight in natural earthen handi. Sets naturally with a thick golden-cream malai crust and mild, refreshing traditional aroma.',
    highlights: ['Natural Clay Pot Setting', 'Thick Malai Top Layer', 'Probiotic Rich', 'Never Sour'],
    hotspots: [
      {
        title: 'Golden Malai Crust',
        desc: 'Naturally rising thick cream layer set on top.',
        pos: [0, 0.75, 0],
      },
      {
        title: 'Terracotta Handi',
        desc: 'Porous clay absorbs excess water, making curd velvety thick.',
        pos: [0.7, 0.1, 0.5],
      },
    ],
  },
  milk: {
    id: 'milk',
    name: 'Pure Whole Farm Milk',
    marathiName: 'शुद्ध ताजे दूध',
    weight: '1 Litre',
    unit: 'litre',
    defaultQty: 1,
    description:
      'Unadulterated morning milk tested with high fat and SNF solids. Chilled immediately and bottled fresh for direct delivery in Solapur.',
    highlights: ['Full Cream (6.5%+ Fat)', 'Chilled at 4°C', 'No Added Water', 'Glass Bottled'],
    hotspots: [
      {
        title: 'Glass Sealed Purity',
        desc: 'Eco-friendly bottle keeping natural aroma fresh.',
        pos: [0, 0.8, 0.4],
      },
      {
        title: 'Cream Top Rise',
        desc: 'Natural fat cluster visible at the neck line.',
        pos: [0, 1.2, 0],
      },
    ],
  },
};

export const Dairy3DViewer: React.FC<Dairy3DViewerProps> = ({
  onAddToList,
  selectedModel = 'paneer',
  compactMode = false,
}) => {
  const [activeModel, setActiveModel] = useState<'paneer' | 'curd' | 'milk'>(selectedModel);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [cameraAngle, setCameraAngle] = useState<'iso' | 'top' | 'front' | 'side'>('iso');
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cubesGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction tracking for manual 360-degree rotation
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.35, y: 0.6 });

  const currentProduct = PRODUCTS_3D[activeModel];

  // Helper: create procedural canvas texture with realistic cheese/curd texture
  const createPaneerTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm soft off-white background
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle muslin weave pattern
    ctx.strokeStyle = 'rgba(215, 205, 190, 0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Organic pores / dairy flecks
    for (let j = 0; j < 600; j++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const r = Math.random() * 2 + 0.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(225, 215, 195, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Helper: create cutting board wood texture
  const createWoodTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm acacia honey wood
    ctx.fillStyle = '#C89D6C';
    ctx.fillRect(0, 0, 512, 512);

    // Wood rings / grain streaks
    for (let i = 0; i < 70; i++) {
      const y = Math.random() * 512;
      const h = Math.random() * 10 + 2;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(165, 120, 80, 0.22)' : 'rgba(195, 150, 105, 0.25)';
      ctx.fillRect(0, y, 512, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Helper: create clay terracotta texture
  const createClayTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#B85D36'; // Terracotta clay
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 500; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(140, 60, 30, 0.25)' : 'rgba(220, 120, 80, 0.2)';
      ctx.fillRect(px, py, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }

    return new THREE.CanvasTexture(canvas);
  };

  // Build the 3D scene objects based on model
  const rebuildModelObjects = useCallback(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;

    // Remove old children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
    }

    const paneerTexture = createPaneerTexture();
    const woodTexture = createWoodTexture();
    const clayTexture = createClayTexture();

    if (activeModel === 'paneer') {
      // 1. Wooden Cutting Board Platter
      const boardGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.18, 48);
      const boardMat = new THREE.MeshStandardMaterial({
        map: woodTexture,
        roughness: 0.6,
        metalness: 0.05,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = -0.1;
      board.receiveShadow = true;
      group.add(board);

      // Board handle detail
      const handleGeo = new THREE.BoxGeometry(0.8, 0.15, 0.4);
      const handle = new THREE.Mesh(handleGeo, boardMat);
      handle.position.set(-2.5, -0.1, 0);
      group.add(handle);

      // 2. Main Artisanal Paneer Block
      const paneerMat = new THREE.MeshStandardMaterial({
        map: paneerTexture,
        color: 0xfffdf7,
        roughness: 0.85,
        metalness: 0.02,
      });

      // Main Block Geometry with chamfered look
      const blockGeo = new THREE.BoxGeometry(1.6, 0.85, 1.4);
      const mainBlock = new THREE.Mesh(blockGeo, paneerMat);
      mainBlock.position.set(0.2, 0.42, -0.1);
      mainBlock.castShadow = true;
      mainBlock.receiveShadow = true;
      group.add(mainBlock);

      // Subtle textured cheesecloth indentation lines on top
      const clothLineMat = new THREE.MeshBasicMaterial({
        color: 0xe0d6c3,
        transparent: true,
        opacity: 0.35,
      });
      for (let i = -0.6; i <= 0.6; i += 0.25) {
        const lineGeo = new THREE.PlaneGeometry(1.55, 0.02);
        const line = new THREE.Mesh(lineGeo, clothLineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(0.2, 0.85, -0.1 + i);
        group.add(line);
      }

      // 3. Cut Paneer Cubes Group
      const cubesGroup = new THREE.Group();
      cubesGroupRef.current = cubesGroup;

      const cubeGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
      const cubePositions: [number, number, number, number][] = [
        [-0.95, 0.22, 0.7, 0.15],
        [-0.55, 0.22, 0.85, -0.2],
        [-1.0, 0.22, 0.2, 0.3],
        [-0.6, 0.22, 0.35, 0.05],
        [-0.75, 0.64, 0.55, 0.1], // Stacked cube on top
      ];

      cubePositions.forEach(([x, y, z, rot]) => {
        const cube = new THREE.Mesh(cubeGeo, paneerMat);
        cube.position.set(x, y, z);
        cube.rotation.y = rot;
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.userData = { originalX: x, originalY: y, originalZ: z };
        cubesGroup.add(cube);
      });

      group.add(cubesGroup);

      // 4. Fresh Mint / Coriander Garnish Leaves
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2d6a4f,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const leafGeo = new THREE.SphereGeometry(0.18, 8, 8);
      leafGeo.scale(1, 0.1, 2.2);

      const leaf1 = new THREE.Mesh(leafGeo, leafMat);
      leaf1.position.set(0.35, 0.87, -0.1);
      leaf1.rotation.set(0.1, 0.4, 0.1);
      group.add(leaf1);

      const leaf2 = new THREE.Mesh(leafGeo, leafMat);
      leaf2.position.set(0.15, 0.87, -0.15);
      leaf2.rotation.set(-0.1, -0.5, 0.1);
      group.add(leaf2);

      // Center stem bud
      const budMat = new THREE.MeshStandardMaterial({ color: 0x52b788 });
      const budGeo = new THREE.SphereGeometry(0.06, 6, 6);
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.position.set(0.25, 0.89, -0.12);
      group.add(bud);
    } else if (activeModel === 'curd') {
      // 1. Handi Pot Body (Earthen Pot)
      const potMat = new THREE.MeshStandardMaterial({
        map: clayTexture,
        roughness: 0.9,
        metalness: 0.05,
      });

      // Pot base & belly
      const potBellyGeo = new THREE.SphereGeometry(1.35, 32, 24);
      potBellyGeo.scale(1, 0.9, 1);
      const potBelly = new THREE.Mesh(potBellyGeo, potMat);
      potBelly.position.y = 0.5;
      potBelly.castShadow = true;
      group.add(potBelly);

      // Pot rim collar
      const rimGeo = new THREE.TorusGeometry(0.85, 0.12, 16, 32);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 1.25;
      group.add(rim);

      // Curd surface inside handi
      const curdGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.08, 32);
      const curdMat = new THREE.MeshStandardMaterial({
        color: 0xfffaf0,
        roughness: 0.4,
        metalness: 0.05,
      });
      const curdSurface = new THREE.Mesh(curdGeo, curdMat);
      curdSurface.position.y = 1.22;
      group.add(curdSurface);

      // Malai layer ripples
      const malaiGeo = new THREE.SphereGeometry(0.35, 12, 8);
      malaiGeo.scale(1.5, 0.15, 1);
      const malaiMat = new THREE.MeshStandardMaterial({
        color: 0xfef5d1,
        roughness: 0.3,
      });
      const malai = new THREE.Mesh(malaiGeo, malaiMat);
      malai.position.set(0.1, 1.26, 0.1);
      group.add(malai);

      // Traditional Jute tie rope around neck
      const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8a6240, roughness: 0.95 });
      const ropeGeo = new THREE.TorusGeometry(0.87, 0.04, 8, 32);
      ropeGeo.rotateX(Math.PI / 2);
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.position.y = 1.15;
      group.add(rope);
    } else if (activeModel === 'milk') {
      // Glass Milk Bottle
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.7,
        ior: 1.5,
      });

      const milkMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.05,
      });

      // Glass Bottle Body
      const bottleGeo = new THREE.CylinderGeometry(0.85, 0.9, 2.2, 32);
      const bottle = new THREE.Mesh(bottleGeo, glassMat);
      bottle.position.y = 1.1;
      group.add(bottle);

      // Milk Inside
      const milkGeo = new THREE.CylinderGeometry(0.82, 0.87, 2.05, 32);
      const milkMesh = new THREE.Mesh(milkGeo, milkMat);
      milkMesh.position.y = 1.05;
      group.add(milkMesh);

      // Bottle neck & lip
      const neckGeo = new THREE.CylinderGeometry(0.42, 0.85, 0.7, 32);
      const neck = new THREE.Mesh(neckGeo, glassMat);
      neck.position.y = 2.45;
      group.add(neck);

      // Gold cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
      const capGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.18, 32);
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 2.85;
      group.add(cap);

      // Store Dairy label
      const labelGeo = new THREE.CylinderGeometry(0.86, 0.86, 1.0, 32, 1, true, 0, Math.PI * 1.2);
      const labelMat = new THREE.MeshStandardMaterial({
        color: 0x1b4332,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.y = 1.1;
      group.add(label);
    }

    // Soft contact shadow circle on ground
    const shadowGeo = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x101a14,
      transparent: true,
      opacity: 0.14,
    });
    shadowGeo.rotateX(-Math.PI / 2);
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.position.y = -0.22;
    group.add(groundShadow);
  }, [activeModel]);

  // Exploded cubes animation
  useEffect(() => {
    if (!cubesGroupRef.current) return;
    const cubes = cubesGroupRef.current.children;

    cubes.forEach((cube) => {
      const orig = cube.userData;
      if (!orig) return;

      if (explodedView) {
        // Expand outwards
        const dirX = orig.originalX < 0 ? -0.4 : 0.4;
        const dirZ = orig.originalZ > 0.5 ? 0.35 : -0.2;
        cube.position.x = orig.originalX + dirX;
        cube.position.z = orig.originalZ + dirZ;
        cube.position.y = orig.originalY + 0.15;
      } else {
        cube.position.x = orig.originalX;
        cube.position.y = orig.originalY;
        cube.position.z = orig.originalZ;
      }
    });
  }, [explodedView]);

  // Main Three.js Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 2.2);
    mainSun.position.set(4, 8, 5);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    // Warm soft fill light
    const fillLight = new THREE.DirectionalLight(0xffeedb, 1.0);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Fresh rim light (cool emerald glow)
    const rimLight = new THREE.PointLight(0x74c69d, 1.5, 12);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Master Group for 360-degree rotation
    const group = new THREE.Group();
    groupRef.current = group;
    group.rotation.x = rotationTargetRef.current.x;
    group.rotation.y = rotationTargetRef.current.y;
    scene.add(group);

    rebuildModelObjects();

    // Responsive Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (groupRef.current) {
        // Auto-rotation when not user-dragging
        if (isAutoRotating && !isDraggingRef.current) {
          rotationTargetRef.current.y += delta * 0.65; // ~37° per sec smooth turn
        }

        // Apply smooth damping / inertia
        if (!isDraggingRef.current) {
          rotationVelocityRef.current.x *= 0.92;
          rotationVelocityRef.current.y *= 0.92;
          rotationTargetRef.current.x += rotationVelocityRef.current.x;
          rotationTargetRef.current.y += rotationVelocityRef.current.y;

          // Clamp vertical pitch so user doesn't turn upside down
          rotationTargetRef.current.x = Math.max(-0.2, Math.min(1.1, rotationTargetRef.current.x));
        }

        groupRef.current.rotation.x = rotationTargetRef.current.x;
        groupRef.current.rotation.y = rotationTargetRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [rebuildModelObjects, isAutoRotating]);

  // Re-build objects whenever activeModel changes
  useEffect(() => {
    rebuildModelObjects();
  }, [activeModel, rebuildModelObjects]);

  // Mouse & Touch Drag Event Handlers for 360 Rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    // Direct angular responsiveness
    const rotSpeed = 0.007;
    rotationTargetRef.current.y += deltaX * rotSpeed;
    rotationTargetRef.current.x += deltaY * rotSpeed;

    // Clamp pitch
    rotationTargetRef.current.x = Math.max(-0.2, Math.min(1.1, rotationTargetRef.current.x));

    rotationVelocityRef.current = {
      x: deltaY * rotSpeed * 0.2,
      y: deltaX * rotSpeed * 0.2,
    };

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }
  };

  // Camera presets
  const setPresetAngle = (preset: 'iso' | 'top' | 'front' | 'side') => {
    setCameraAngle(preset);
    setIsAutoRotating(false);

    if (preset === 'iso') {
      rotationTargetRef.current = { x: 0.35, y: 0.6 };
    } else if (preset === 'top') {
      rotationTargetRef.current = { x: 1.1, y: 0.0 };
    } else if (preset === 'front') {
      rotationTargetRef.current = { x: 0.05, y: 0.0 };
    } else if (preset === 'side') {
      rotationTargetRef.current = { x: 0.08, y: Math.PI / 2 };
    }
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    const newZoom = direction === 'in' ? Math.min(1.6, zoomLevel + 0.2) : Math.max(0.7, zoomLevel - 0.2);
    setZoomLevel(newZoom);
    cam.position.set(0, 3.2 / newZoom, 5.5 / newZoom);
    cam.updateProjectionMatrix();
  };

  const resetView = () => {
    rotationTargetRef.current = { x: 0.35, y: 0.6 };
    rotationVelocityRef.current = { x: 0, y: 0 };
    setCameraAngle('iso');
    setZoomLevel(1);
    setIsAutoRotating(true);
    setExplodedView(false);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 3.2, 5.5);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleAddToCart = () => {
    if (onAddToList) {
      onAddToList({
        name: currentProduct.name,
        quantity: currentProduct.defaultQty,
        unit: currentProduct.unit,
        notes: `3D Inspected Fresh Daily Batch (${currentProduct.weight})`,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2200);
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl bg-gradient-to-b from-[#F5F2EB] via-white to-[#F8F5EE] border border-[#E3DCcf] shadow-xl overflow-hidden ${
        compactMode ? 'p-4 sm:p-6' : 'p-6 sm:p-8 lg:p-10'
      }`}
      id="paneer-3d-showcase"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D8F3DC]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9] relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EE] border border-[#B7E4C7] text-[#1B4332] text-xs font-bold tracking-wide uppercase shadow-2xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Interactive 360° Dairy Inspector</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight font-display flex items-center gap-2.5">
            <span>{currentProduct.name}</span>
            <span className="text-base sm:text-lg font-normal text-stone-500 font-sans">
              ({currentProduct.marathiName})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Drag with your finger or mouse to rotate full 360 degrees. Inspect the texture, cut cubes, and freshness
            layers.
          </p>
        </div>

        {/* Model Switcher Tabs: Paneer (Featured) / Curd / Milk */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#DCD5C8] self-start md:self-auto shadow-2xs">
          <button
            onClick={() => {
              setActiveModel('paneer');
              setActiveHotspot(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeModel === 'paneer'
                ? 'bg-[#2D6A4F] text-white shadow-sm'
                : 'text-stone-700 hover:text-[#1B4332] hover:bg-white'
            }`}
          >
            <span>🧀</span>
            <span>Fresh Paneer</span>
            <span className="text-[10px] bg-[#52B788]/30 text-white px-1.5 py-0.2 rounded-full font-semibold">
              3D
            </span>
          </button>

          <button
            onClick={() => {
              setActiveModel('curd');
              setActiveHotspot(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeModel === 'curd'
                ? 'bg-[#2D6A4F] text-white shadow-sm'
                : 'text-stone-700 hover:text-[#1B4332] hover:bg-white'
            }`}
          >
            <span>🥣</span>
            <span>Pot Curd</span>
          </button>

          <button
            onClick={() => {
              setActiveModel('milk');
              setActiveHotspot(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeModel === 'milk'
                ? 'bg-[#2D6A4F] text-white shadow-sm'
                : 'text-stone-700 hover:text-[#1B4332] hover:bg-white'
            }`}
          >
            <span>🥛</span>
            <span>Pure Milk</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage + Control Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 relative z-10 items-center">
        {/* Left / Center 3D Stage Area */}
        <div className="lg:col-span-8 relative">
          <div
            className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-3xl bg-gradient-to-b from-[#FDFCFA] to-[#F1EDE4] border border-[#D8CFBF] shadow-inner overflow-hidden cursor-grab active:cursor-grabbing select-none group"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Three.js DOM container */}
            <div ref={mountRef} className="w-full h-full" />

            {/* Hint Overlay: 360 Degree Drag gesture */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-stone-200/80 shadow-xs text-xs font-semibold text-stone-700">
              <Compass className="w-4 h-4 text-[#2D6A4F] animate-spin-slow" />
              <span>360° Drag to Orbit</span>
            </div>

            {/* Quick Angle Presets Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200/80 shadow-xs">
              <button
                onClick={() => setPresetAngle('iso')}
                title="Isometric View"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  cameraAngle === 'iso' ? 'bg-[#1B4332] text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                3D Iso
              </button>
              <button
                onClick={() => setPresetAngle('top')}
                title="Top View"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  cameraAngle === 'top' ? 'bg-[#1B4332] text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setPresetAngle('front')}
                title="Front View"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  cameraAngle === 'front' ? 'bg-[#1B4332] text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setPresetAngle('side')}
                title="Side View"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  cameraAngle === 'side' ? 'bg-[#1B4332] text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Side
              </button>
            </div>

            {/* Interactive Bottom Control Toolbar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              {/* Left group: Auto-spin, Reset, Explode */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isAutoRotating
                      ? 'bg-[#2D6A4F] text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                  }`}
                  title={isAutoRotating ? 'Pause 360° Auto-Spin' : 'Start 360° Auto-Spin'}
                >
                  {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isAutoRotating ? 'Spinning 360°' : 'Auto Rotate'}</span>
                </button>

                {activeModel === 'paneer' && (
                  <button
                    onClick={() => setExplodedView(!explodedView)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      explodedView
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                    }`}
                    title="Separate cut cubes to inspect texture"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{explodedView ? 'Joined Block' : 'Inspect Cut Cubes'}</span>
                  </button>
                )}

                <button
                  onClick={resetView}
                  className="p-2 rounded-xl bg-white text-stone-600 hover:bg-stone-50 border border-stone-200 shadow-sm transition-all"
                  title="Reset Camera & Angle"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right group: Zoom In / Out */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 shadow-sm pointer-events-auto">
                <button
                  onClick={() => handleZoom('in')}
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-stone-600 px-1 select-none">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => handleZoom('out')}
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Live Inspection Badge in corner */}
            <div className="absolute bottom-16 left-4 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-stone-600 bg-white/75 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200/60">
              <Eye className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Studio 3D Mesh • Real-time WebGL</span>
            </div>
          </div>
        </div>

        {/* Right Info & Action Panel */}
        <div className="lg:col-span-4 space-y-5">
          {/* Freshness Specs Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
                  Solapur Store Batch
                </span>
                <p className="text-base font-bold text-[#1B4332]">Farm Fresh Guarantee</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-xl shadow-2xs">
                {activeModel === 'paneer' ? '🧀' : activeModel === 'curd' ? '🥣' : '🥛'}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{currentProduct.description}</p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentProduct.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF9F5] border border-stone-100 text-xs font-semibold text-stone-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Interactive Feature Hotspots */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Key 3D Structural Insights
              </span>
              <div className="space-y-1.5">
                {currentProduct.hotspots.map((hotspot, idx) => {
                  const isExpanded = activeHotspot === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveHotspot(isExpanded ? null : idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isExpanded
                          ? 'bg-[#EAF5EE] border-[#B7E4C7] shadow-2xs'
                          : 'bg-white border-stone-200/80 hover:border-[#2D6A4F]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#1B4332]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{hotspot.title}</span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                            isExpanded ? 'rotate-90 text-[#2D6A4F]' : ''
                          }`}
                        />
                      </div>
                      {isExpanded && (
                        <p className="text-xs text-stone-600 mt-1.5 pl-5.5 leading-relaxed">{hotspot.desc}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Add to Grocery List Action */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  justAdded
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] hover:from-[#1B4332] hover:to-[#081C15] shadow-[#2D6A4F]/25'
                }`}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added {currentProduct.weight} to Grocery List!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add {currentProduct.weight} {currentProduct.name}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <p className="text-[11px] text-center text-stone-500 mt-2">
                Adds directly to your active grocery order at Kanaki's Store & Dairy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
