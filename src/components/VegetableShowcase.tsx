import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Leaf,
  Info,
  Rotate3d,
  Maximize2,
  Minimize2,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GroceryItem } from '../types';

export interface VegetableInfo {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  emoji: string;
  category: 'leafy' | 'immunity' | 'fiber' | 'energy';
  defaultQty: number;
  unit: string;
  headlineRole: string;
  keyNutrients: string[];
  healthImportance: string;
  dailyBenefits: string[];
  culinaryTip: string;
  seasonalStatus: string;
  themeColor: string;
  colorGradient: string;
  borderAccent: string;
}

export const VEGETABLES_DATA: VegetableInfo[] = [
  {
    id: 'veg-palak',
    name: 'Fresh Farm Spinach (Palak)',
    marathiName: 'ताजी हिरवीगार पालक',
    hindiName: 'पालक',
    emoji: '🥬',
    category: 'leafy',
    defaultQty: 1,
    unit: 'bunch',
    headlineRole: 'Iron & Cellular Oxygenation Powerhouse',
    keyNutrients: ['Iron (Fe)', 'Vitamin K1', 'Folate (B9)', 'Lutein', 'Chlorophyll'],
    healthImportance:
      'Spinach is supreme for restoring hemoglobin, fighting fatigue, and strengthening bone matrix through natural Vitamin K. Its high lutein and zeaxanthin protect eyes from UV and blue-screen radiation.',
    dailyBenefits: [
      'Boosts active red blood cell count and stamina',
      'Protects eyesight against macular strain',
      'Alkalizing greens that reduce bodily acidity',
    ],
    culinaryTip: 'Lightly blanch with a pinch of cumin; pairs miraculously with Solapur fresh paneer or yellow moong dal.',
    seasonalStatus: 'Harvested Daily at Dawn',
    themeColor: '#2D6A4F',
    colorGradient: 'from-[#2D6A4F]/15 via-[#52B788]/10 to-transparent',
    borderAccent: '#2D6A4F',
  },
  {
    id: 'veg-tamatar',
    name: 'Vine-Ripe Red Tomatoes (Tamatar)',
    marathiName: 'रसरशीत लाल टोमॅटो',
    hindiName: 'लाल टमाटर',
    emoji: '🍅',
    category: 'immunity',
    defaultQty: 1,
    unit: 'kg',
    headlineRole: 'Lycopene Shield for Heart & Radiant Skin',
    keyNutrients: ['Lycopene', 'Vitamin C', 'Potassium', 'Biotin', 'Flavonoids'],
    healthImportance:
      'Tomatoes are the world’s richest source of Lycopene, a clinically proven antioxidant that lowers arterial stiffness and protects skin cells from cellular photo-aging. Cooking tomatoes in cold-pressed oil triples lycopene bio-availability.',
    dailyBenefits: [
      'Lowers LDL oxidation and promotes healthy blood pressure',
      'Boosts natural dermal collagen and skin radiance',
      'Supports prostate and cardiovascular longevity',
    ],
    culinaryTip: 'Slow-simmer into garlic-cumin rasam or tomato curry to release concentrated fat-soluble lycopene.',
    seasonalStatus: 'Solapur Vine Harvest',
    themeColor: '#E63946',
    colorGradient: 'from-rose-500/15 via-red-500/10 to-transparent',
    borderAccent: '#E63946',
  },
  {
    id: 'veg-kanda',
    name: 'Crisp Solapur Red Onion (Kanda)',
    marathiName: 'सोलापुरी गावरान कांदा',
    hindiName: 'लाल प्याज',
    emoji: '🧅',
    category: 'fiber',
    defaultQty: 2,
    unit: 'kg',
    headlineRole: 'Quercetin Booster & Natural Gut Prebiotic',
    keyNutrients: ['Quercetin', 'Organosulfur', 'Inulin Prebiotic', 'Vitamin B6', 'Chromium'],
    healthImportance:
      'The pungent Solapur red onion is world-famous for its concentrated quercetin—a bioflavonoid that acts as a natural antihistamine, boosts immunity, and stabilizes fasting blood sugar. Its inulin fiber feeds beneficial gut bacteria.',
    dailyBenefits: [
      'Provides daily inulin to nourish friendly microbiome',
      'Natural body coolant during hot sunny weather',
      'Reduces systemic bronchial inflammation',
    ],
    culinaryTip: 'Slice raw with a squeeze of fresh lemon and pinch of rock salt beside Jowar Bhakri for instant digestive vigor.',
    seasonalStatus: 'Native Solapur Crop',
    themeColor: '#7209B7',
    colorGradient: 'from-purple-600/15 via-pink-500/10 to-transparent',
    borderAccent: '#7209B7',
  },
  {
    id: 'veg-bhendi',
    name: 'Tender Green Okra / Lady’s Finger (Bhendi)',
    marathiName: 'कोवळी ताजी भेंडी',
    hindiName: 'भिंडी',
    emoji: '🥢',
    category: 'fiber',
    defaultQty: 500,
    unit: 'g',
    headlineRole: 'Mucilage for Blood Sugar & Gut Lining Healing',
    keyNutrients: ['Pectin Mucilage', 'Dietary Fiber', 'Folate', 'Magnesium', 'Vitamin C'],
    healthImportance:
      'Okra’s soluble mucilage creates a soothing protective film along the stomach and intestinal mucosa, preventing acid irritation while slowing down glucose uptake into the bloodstream after meals.',
    dailyBenefits: [
      'Prevents post-prandial blood sugar spikes',
      'Binds to bile acids to naturally sweep out excess cholesterol',
      'Eases digestive transit without irritation',
    ],
    culinaryTip: 'Wipe completely dry before chopping and stir-fry on high heat with mustard seeds and roasted peanut powder.',
    seasonalStatus: 'Farm Fresh Picked',
    themeColor: '#2A9D8F',
    colorGradient: 'from-emerald-600/15 via-teal-500/10 to-transparent',
    borderAccent: '#2A9D8F',
  },
  {
    id: 'veg-methi',
    name: 'Fragrant Fenugreek Greens (Methi)',
    marathiName: 'सुवासिक गावरान मेथी',
    hindiName: 'ताजा मेथी',
    emoji: '🌱',
    category: 'leafy',
    defaultQty: 1,
    unit: 'bunch',
    headlineRole: 'Ancient Ayurvedic Glycemic Balancer',
    keyNutrients: ['4-Hydroxyisoleucine', 'Galactomannan', 'Iron', 'Vitamin A', 'Saponins'],
    healthImportance:
      'Methi leaves stimulate insulin secretion through the unique amino acid 4-hydroxyisoleucine. Its galactomannan fiber delays carbohydrate digestion and keeps lipid profiles in optimal balance.',
    dailyBenefits: [
      'Clinically recognized support for normal HbA1c levels',
      'Improves sluggish digestion and relieves bloating',
      'Excellent iron tonic for growing children & mothers',
    ],
    culinaryTip: 'Knead into whole wheat Theplas or toss into garlic-tempered potato-methi for comforting daily meals.',
    seasonalStatus: 'Cold-Dew Fresh Morning Pick',
    themeColor: '#38B000',
    colorGradient: 'from-green-600/15 via-lime-500/10 to-transparent',
    borderAccent: '#38B000',
  },
  {
    id: 'veg-gajar',
    name: 'Crunchy Farm Carrots (Gajar)',
    marathiName: 'गोड रसरशीत गावरान गाजर',
    hindiName: 'लाल / नारंगी गाजर',
    emoji: '🥕',
    category: 'energy',
    defaultQty: 500,
    unit: 'g',
    headlineRole: 'Beta-Carotene Vision Shield & Liver Detox',
    keyNutrients: ['Beta-Carotene', 'Vitamin A', 'Biotin', 'Potassium', 'Soluble Pectin'],
    healthImportance:
      'Carrots convert rapidly into bioactive Vitamin A (retinol), vital for dark adaptation of the eyes and fortifying mucous membranes against airborne respiratory pathogens.',
    dailyBenefits: [
      'Maintains sharp optical acuity and relieves dry eyes',
      'Supports natural liver phase-II enzymatic detoxification',
      'Naturally sweet, low-glycemic energizing crunch',
    ],
    culinaryTip: 'Enjoy crunchy raw batons with hummus, or grate into traditional halwa with Kanaki pure whole milk.',
    seasonalStatus: 'Crisp Field Harvest',
    themeColor: '#F77F00',
    colorGradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    borderAccent: '#F77F00',
  },
  {
    id: 'veg-matar',
    name: 'Sweet Green Peas (Vatana / Matar)',
    marathiName: 'गोड ताजे हिरवे मटार',
    hindiName: 'हरी मटर',
    emoji: '🫛',
    category: 'energy',
    defaultQty: 500,
    unit: 'g',
    headlineRole: 'Plant Protein, Fiber & Youthful Vitality',
    keyNutrients: ['Plant Protein', 'Coumestrol', 'Vitamin K', 'Thiamine (B1)', 'Zinc'],
    healthImportance:
      'Green peas are one of the most protein-dense fresh vegetables, offering slow-digesting complex carbs and coumestrol—a polyphenol studied for cellular longevity and inflammation reduction.',
    dailyBenefits: [
      'Provides clean vegetarian protein for muscle repair',
      'Sustains satiety and steady mental focus',
      'High in Vitamin K for arterial elasticity and strong bones',
    ],
    culinaryTip: 'Steam lightly for 3 minutes to preserve bright chlorophyll color and sweet crunch in Matar Paneer.',
    seasonalStatus: 'Tender Sweet Pods',
    themeColor: '#40916C',
    colorGradient: 'from-[#52B788]/20 via-[#2D6A4F]/10 to-transparent',
    borderAccent: '#40916C',
  },
  {
    id: 'veg-adrak-mirch',
    name: 'Native Ginger & Green Chilli Trio (Aale & Mirchi)',
    marathiName: 'ताजे आले आणि लवंगी मिरची',
    hindiName: 'अदरक और हरी मिर्च',
    emoji: '🫚',
    category: 'immunity',
    defaultQty: 250,
    unit: 'g',
    headlineRole: 'Digestive Agni Ignite & Bio-Availability Spark',
    keyNutrients: ['Gingerol', 'Capsaicin', 'Vitamin C (300% RDA)', 'Shogaols', 'Essential Oils'],
    healthImportance:
      'In traditional Indian culinary wisdom, Ginger and Green Chilli ignite the digestive fire (Jatharagni). Gingerol eliminates nausea and joint stiffness, while capsaicin supercharges basal metabolic rate and doubles nutrient absorption.',
    dailyBenefits: [
      'Accelerates natural calorie burn and metabolic rate',
      'Immediate relief from nasal congestion and digestive sluggishness',
      'Immunity shield against seasonal flu and throat irritation',
    ],
    culinaryTip: 'Crush fresh into hot morning ginger chai or prepare daily Maharashtrian Thecha with garlic and roasted peanuts.',
    seasonalStatus: 'Solapur Spice Garden',
    themeColor: '#D90429',
    colorGradient: 'from-amber-600/15 via-red-600/10 to-transparent',
    borderAccent: '#D90429',
  },
];

interface VegetableShowcaseProps {
  onAddToList?: (item: Omit<GroceryItem, 'id'>) => void;
}

// -------------------------------------------------------------
// 3D Procedural Mesh Generators for Each Vegetable in Three.js
// -------------------------------------------------------------
function createSpinachMesh(): THREE.Group {
  const group = new THREE.Group();

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2d6a4f,
    roughness: 0.38,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  const ribMat = new THREE.MeshStandardMaterial({
    color: 0x95d5b2,
    roughness: 0.5,
  });

  // Multiple undulating curled leaf fans
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const leafGeom = new THREE.PlaneGeometry(0.7, 1.4, 6, 8);
    // Displace vertices to create organic leaf cup/curl
    const pos = leafGeom.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j);
      const y = pos.getY(j);
      const curl = Math.sin((y + 0.7) * 2.2) * 0.25 - (x * x) * 0.4;
      pos.setZ(j, curl);
    }
    leafGeom.computeVertexNormals();

    const leafMesh = new THREE.Mesh(leafGeom, leafMat);
    leafMesh.position.set(Math.cos(angle) * 0.25, 0.4 + (i % 2) * 0.15, Math.sin(angle) * 0.25);
    leafMesh.rotation.y = angle + Math.PI / 2;
    leafMesh.rotation.x = 0.25 + (i % 3) * 0.1;
    leafMesh.rotation.z = Math.sin(angle) * 0.2;
    group.add(leafMesh);

    // Center pale stem vein
    const stemGeom = new THREE.CylinderGeometry(0.02, 0.04, 1.2, 8);
    const stemMesh = new THREE.Mesh(stemGeom, ribMat);
    stemMesh.position.set(Math.cos(angle) * 0.15, 0.2, Math.sin(angle) * 0.15);
    stemMesh.rotation.x = leafMesh.rotation.x;
    stemMesh.rotation.y = leafMesh.rotation.y;
    group.add(stemMesh);
  }

  // Bound bunch base
  const bunchBaseGeom = new THREE.CylinderGeometry(0.14, 0.08, 0.35, 12);
  const bunchMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.6 });
  const bunchMesh = new THREE.Mesh(bunchBaseGeom, bunchMat);
  bunchMesh.position.y = -0.3;
  group.add(bunchMesh);

  group.scale.set(1.1, 1.1, 1.1);
  return group;
}

function createTomatoMesh(): THREE.Group {
  const group = new THREE.Group();

  // Vibrant glossy tomato body with subtle top and bottom dimples
  const tomatoGeom = new THREE.SphereGeometry(0.72, 32, 24);
  const pos = tomatoGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    // Slightly compress vertically (oblate spheroid) like a real heirloom tomato
    pos.setY(i, y * 0.82);
  }
  tomatoGeom.computeVertexNormals();

  const tomatoMat = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    roughness: 0.18,
    metalness: 0.12,
  });
  const tomatoMesh = new THREE.Mesh(tomatoGeom, tomatoMat);
  tomatoMesh.position.y = 0.1;
  group.add(tomatoMesh);

  // 5-pointed green star calyx on top
  const calyxMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.4 });
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const sepalGeom = new THREE.ConeGeometry(0.1, 0.38, 5);
    sepalGeom.translate(0, 0.19, 0);
    const sepal = new THREE.Mesh(sepalGeom, calyxMat);
    sepal.position.set(Math.cos(angle) * 0.12, 0.62, Math.sin(angle) * 0.12);
    sepal.rotation.z = Math.PI / 2 + 0.3;
    sepal.rotation.y = angle;
    group.add(sepal);
  }

  // Curved green stem
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.65, 0),
    new THREE.Vector3(0.04, 0.85, 0.03),
    new THREE.Vector3(0.12, 0.95, -0.04),
  ]);
  const stemGeom = new THREE.TubeGeometry(stemCurve, 12, 0.035, 8, false);
  const stemMesh = new THREE.Mesh(stemGeom, calyxMat);
  group.add(stemMesh);

  return group;
}

function createOnionMesh(): THREE.Group {
  const group = new THREE.Group();

  // Papery purple-red bulb
  const bulbGeom = new THREE.SphereGeometry(0.68, 32, 24);
  const pos = bulbGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i);
    let x = pos.getX(i);
    let z = pos.getZ(i);
    // Taper into neck at top and flatter at bottom
    if (y > 0.1) {
      const taper = 1.0 - (y - 0.1) * 0.4;
      pos.setX(i, x * taper);
      pos.setZ(i, z * taper);
    }
  }
  bulbGeom.computeVertexNormals();

  const onionMat = new THREE.MeshStandardMaterial({
    color: 0x7209b7,
    roughness: 0.28,
    metalness: 0.18,
  });
  const bulb = new THREE.Mesh(bulbGeom, onionMat);
  bulb.position.y = 0.1;
  group.add(bulb);

  // Top dried neck spout
  const neckGeom = new THREE.CylinderGeometry(0.04, 0.14, 0.38, 12);
  const neckMat = new THREE.MeshStandardMaterial({ color: 0x9b5de5, roughness: 0.5 });
  const neck = new THREE.Mesh(neckGeom, neckMat);
  neck.position.set(0, 0.72, 0);
  neck.rotation.z = 0.08;
  group.add(neck);

  // Bottom root disc
  const rootGeom = new THREE.CylinderGeometry(0.12, 0.05, 0.1, 10);
  const rootMat = new THREE.MeshStandardMaterial({ color: 0xcca47c, roughness: 0.8 });
  const root = new THREE.Mesh(rootGeom, rootMat);
  root.position.set(0, -0.48, 0);
  group.add(root);

  return group;
}

function createOkraMesh(): THREE.Group {
  const group = new THREE.Group();

  const okraMat = new THREE.MeshStandardMaterial({
    color: 0x2a9d8f,
    roughness: 0.35,
    metalness: 0.05,
    flatShading: true, // Highlights the 5 sharp ridges of fresh tender bhendi
  });

  // 5-sided slender faceted pod
  const podGeom = new THREE.CylinderGeometry(0.12, 0.24, 1.8, 5);
  const pod = new THREE.Mesh(podGeom, okraMat);
  pod.position.y = 0.2;
  group.add(pod);

  // Tapered hooked tip
  const tipGeom = new THREE.ConeGeometry(0.12, 0.45, 5);
  const tip = new THREE.Mesh(tipGeom, okraMat);
  tip.position.y = -0.85;
  tip.rotation.x = Math.PI;
  group.add(tip);

  // Hexagonal cap at top
  const capGeom = new THREE.CylinderGeometry(0.18, 0.24, 0.22, 6);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.5 });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = 1.15;
  group.add(cap);

  // Little stem handle
  const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8);
  const stem = new THREE.Mesh(stemGeom, capMat);
  stem.position.set(0, 1.35, 0);
  stem.rotation.z = 0.15;
  group.add(stem);

  group.rotation.z = -0.2;
  return group;
}

function createMethiMesh(): THREE.Group {
  const group = new THREE.Group();

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x38b000,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x70e000,
    roughness: 0.45,
  });

  // Delicate cluster of stems with triple leaflets
  for (let s = 0; s < 8; s++) {
    const sAngle = (s / 8) * Math.PI * 2;
    const stemHeight = 1.1 + (s % 3) * 0.15;
    const stemGeom = new THREE.CylinderGeometry(0.018, 0.025, stemHeight, 6);
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.set(Math.cos(sAngle) * 0.2, stemHeight / 2 - 0.3, Math.sin(sAngle) * 0.2);
    stem.rotation.x = Math.sin(sAngle) * 0.15;
    stem.rotation.z = Math.cos(sAngle) * 0.15;
    group.add(stem);

    // 3 small clover leaflets on top of each stem
    for (let l = 0; l < 3; l++) {
      const lAngle = (l / 3) * Math.PI * 2;
      const leafGeom = new THREE.CircleGeometry(0.12, 10);
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.set(
        stem.position.x + Math.cos(lAngle) * 0.08,
        stem.position.y + stemHeight / 2,
        stem.position.z + Math.sin(lAngle) * 0.08
      );
      leaf.rotation.x = -Math.PI / 3;
      leaf.rotation.y = lAngle;
      group.add(leaf);
    }
  }

  // Tie band at base
  const tieGeom = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
  const tieMat = new THREE.MeshStandardMaterial({ color: 0xcc8b3c, roughness: 0.6 });
  const tie = new THREE.Mesh(tieGeom, tieMat);
  tie.rotation.x = Math.PI / 2;
  tie.position.y = -0.15;
  group.add(tie);

  return group;
}

function createCarrotMesh(): THREE.Group {
  const group = new THREE.Group();

  // Tapered carrot root
  const rootGeom = new THREE.CylinderGeometry(0.32, 0.06, 2.1, 18);
  const pos = rootGeom.attributes.position;
  // Add subtle organic horizontal ridge bumpiness
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const wave = 1.0 + Math.sin(y * 18) * 0.035;
    pos.setX(i, pos.getX(i) * wave);
    pos.setZ(i, pos.getZ(i) * wave);
  }
  rootGeom.computeVertexNormals();

  const carrotMat = new THREE.MeshStandardMaterial({
    color: 0xf77f00,
    roughness: 0.32,
    metalness: 0.05,
  });
  const root = new THREE.Mesh(rootGeom, carrotMat);
  root.position.y = 0.1;
  group.add(root);

  // Feathery green top foliage
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.4 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const sprigGeom = new THREE.CylinderGeometry(0.015, 0.03, 0.8, 6);
    const sprig = new THREE.Mesh(sprigGeom, foliageMat);
    sprig.position.set(Math.cos(angle) * 0.08, 1.45, Math.sin(angle) * 0.08);
    sprig.rotation.z = 0.35;
    sprig.rotation.y = angle;
    group.add(sprig);

    // Tiny leaves along sprig
    for (let j = 0; j < 3; j++) {
      const leafG = new THREE.ConeGeometry(0.04, 0.18, 4);
      const leafM = new THREE.Mesh(leafG, foliageMat);
      leafM.position.set(sprig.position.x, 1.35 + j * 0.18, sprig.position.z);
      leafM.rotation.x = Math.PI / 4;
      group.add(leafM);
    }
  }

  group.rotation.z = -0.15;
  return group;
}

function createPeasMesh(): THREE.Group {
  const group = new THREE.Group();

  // Curved emerald pea pod envelope
  const podCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.9, 0.4, 0),
    new THREE.Vector3(-0.4, 0.1, 0.15),
    new THREE.Vector3(0.2, 0.05, 0.15),
    new THREE.Vector3(0.8, 0.35, 0),
  ]);
  const podGeom = new THREE.TubeGeometry(podCurve, 24, 0.28, 12, false);
  const podMat = new THREE.MeshStandardMaterial({
    color: 0x40916c,
    roughness: 0.35,
  });
  const pod = new THREE.Mesh(podGeom, podMat);
  pod.scale.set(1, 0.8, 0.5);
  group.add(pod);

  // 5 Glossy sweet green peas inside the open seam
  const peaMat = new THREE.MeshStandardMaterial({
    color: 0x52b788,
    roughness: 0.2,
    metalness: 0.08,
  });

  const peaPositions = [-0.65, -0.32, 0.0, 0.32, 0.65];
  peaPositions.forEach((x, idx) => {
    const peaGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const pea = new THREE.Mesh(peaGeom, peaMat);
    const yOffset = Math.sin((idx / 4) * Math.PI) * 0.05 + 0.15;
    pea.position.set(x, yOffset, 0.08);
    group.add(pea);
  });

  // Little stem leaf at end
  const stemGeom = new THREE.CylinderGeometry(0.03, 0.04, 0.3, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.5 });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  stem.position.set(-0.95, 0.55, 0);
  stem.rotation.z = 0.6;
  group.add(stem);

  group.rotation.z = 0.2;
  return group;
}

function createGingerMirchiMesh(): THREE.Group {
  const group = new THREE.Group();

  // Knobby golden-tan Ginger rhizome
  const gingerMat = new THREE.MeshStandardMaterial({
    color: 0xc89666,
    roughness: 0.6,
    bumpScale: 0.05,
  });

  // Multiple inter-connected organic nodules
  const nodules = [
    { pos: [0.2, -0.1, 0], scale: [0.5, 0.4, 0.45] },
    { pos: [0.55, 0.15, 0.1], scale: [0.35, 0.4, 0.3] },
    { pos: [0.0, 0.3, -0.1], scale: [0.38, 0.45, 0.35] },
    { pos: [0.65, -0.2, -0.1], scale: [0.28, 0.28, 0.3] },
  ];

  nodules.forEach((n) => {
    const nodGeom = new THREE.SphereGeometry(0.5, 14, 14);
    const nodMesh = new THREE.Mesh(nodGeom, gingerMat);
    nodMesh.position.set(n.pos[0] as number, n.pos[1] as number, n.pos[2] as number);
    nodMesh.scale.set(n.scale[0] as number, n.scale[1] as number, n.scale[2] as number);
    group.add(nodMesh);
  });

  // Pair with a glossy spicy green chilli
  const chilliCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.8, 0.2),
    new THREE.Vector3(-0.55, 0.4, 0.25),
    new THREE.Vector3(-0.48, -0.1, 0.15),
    new THREE.Vector3(-0.25, -0.55, 0.05),
  ]);
  const chilliGeom = new THREE.TubeGeometry(chilliCurve, 20, 0.12, 10, false);
  const chilliMat = new THREE.MeshStandardMaterial({
    color: 0x38b000,
    roughness: 0.18,
    metalness: 0.15,
  });
  const chilli = new THREE.Mesh(chilliGeom, chilliMat);
  group.add(chilli);

  // Chilli stem
  const stemGeom = new THREE.CylinderGeometry(0.025, 0.04, 0.25, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.5 });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  stem.position.set(-0.35, 0.95, 0.18);
  stem.rotation.z = -0.3;
  group.add(stem);

  return group;
}

// -------------------------------------------------------------
// Main 3D Vegetable Showcase Component
// -------------------------------------------------------------
export const VegetableShowcase: React.FC<VegetableShowcaseProps> = ({ onAddToList }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active vegetable state
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'leafy' | 'immunity' | 'fiber' | 'energy'>('all');
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Three.js refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carouselGroupRef = useRef<THREE.Group | null>(null);
  const pedestalMeshesRef = useRef<THREE.Mesh[]>([]);
  const auraGlowRef = useRef<THREE.Mesh | null>(null);
  const vegGroupsRef = useRef<THREE.Group[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Rotational physics
  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragLastXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Inspect mode manual rotation
  const inspectRotXRef = useRef<number>(0);
  const inspectRotYRef = useRef<number>(0);
  const inspectDragRef = useRef<boolean>(false);

  const activeVeg = VEGETABLES_DATA[selectedIndex] || VEGETABLES_DATA[0];

  // Rotate carousel to index
  const rotateToVegIndex = useCallback((index: number) => {
    setSelectedIndex(index);
    const numItems = VEGETABLES_DATA.length;
    const step = (Math.PI * 2) / numItems;
    // Calculate target angle to bring this index exactly to the front (angle = 0)
    targetRotationRef.current = -index * step;
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (selectedIndex + 1) % VEGETABLES_DATA.length;
    rotateToVegIndex(nextIdx);
  }, [selectedIndex, rotateToVegIndex]);

  const handlePrev = useCallback(() => {
    const prevIdx = (selectedIndex - 1 + VEGETABLES_DATA.length) % VEGETABLES_DATA.length;
    rotateToVegIndex(prevIdx);
  }, [selectedIndex, rotateToVegIndex]);

  // Handle Add to List
  const handleAddCurrentVeg = () => {
    if (onAddToList) {
      onAddToList({
        name: activeVeg.name,
        quantity: activeVeg.defaultQty,
        unit: activeVeg.unit,
        notes: `3D Inspected Fresh Farm Harvest (${activeVeg.headlineRole})`,
      });
      setAddedItem(true);
      setTimeout(() => setAddedItem(false), 2200);
    }
  };

  // -------------------------------------------------------------
  // Three.js Scene Setup & Render Loop
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 8.8);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer with high DPR and transparent canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting (Warm studio sunlight + soft ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(6, 9, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0x52b788, 2.0, 15);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const warmFillLight = new THREE.PointLight(0xfef08a, 1.2, 12);
    warmFillLight.position.set(4, 2, -2);
    scene.add(warmFillLight);

    // 5. Main 3D Carousel Group
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);
    carouselGroupRef.current = carouselGroup;

    // Central circular stage floor (warm stone-wood farm podium)
    const podiumGeom = new THREE.CylinderGeometry(4.8, 5.0, 0.2, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.65,
      metalness: 0.05,
    });
    const podium = new THREE.Mesh(podiumGeom, podiumMat);
    podium.position.y = -1.2;
    podium.receiveShadow = true;
    scene.add(podium);

    // Podium outer golden rim ring
    const rimRingGeom = new THREE.TorusGeometry(4.9, 0.05, 12, 64);
    const rimRingMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.6 });
    const rimRing = new THREE.Mesh(rimRingGeom, rimRingMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -1.1;
    scene.add(rimRing);

    // Active spotlight aura disc on the front podium position (Z = 3.6, X = 0)
    const auraGeom = new THREE.RingGeometry(0.7, 1.2, 36);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x52b788,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    const auraMesh = new THREE.Mesh(auraGeom, auraMat);
    auraMesh.rotation.x = Math.PI / 2;
    auraMesh.position.set(0, -1.08, 3.6);
    scene.add(auraMesh);
    auraGlowRef.current = auraMesh;

    // 6. Build the 8 3D Vegetable Items on the Carousel
    const numItems = VEGETABLES_DATA.length;
    const radius = 3.6;
    const vegGroups: THREE.Group[] = [];
    const pedestals: THREE.Mesh[] = [];

    VEGETABLES_DATA.forEach((veg, index) => {
      const angle = (index / numItems) * Math.PI * 2;
      const vegContainer = new THREE.Group();

      // Individual vegetable pedestal
      const pedGeom = new THREE.CylinderGeometry(0.7, 0.78, 0.18, 24);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.1,
      });
      const pedestal = new THREE.Mesh(pedGeom, pedMat);
      pedestal.position.y = -0.9;
      pedestal.receiveShadow = true;
      vegContainer.add(pedestal);
      pedestals.push(pedestal);

      // Procedural 3D model according to vegetable
      let modelGroup: THREE.Group;
      switch (veg.id) {
        case 'veg-palak':
          modelGroup = createSpinachMesh();
          break;
        case 'veg-tamatar':
          modelGroup = createTomatoMesh();
          break;
        case 'veg-kanda':
          modelGroup = createOnionMesh();
          break;
        case 'veg-bhendi':
          modelGroup = createOkraMesh();
          break;
        case 'veg-methi':
          modelGroup = createMethiMesh();
          break;
        case 'veg-gajar':
          modelGroup = createCarrotMesh();
          break;
        case 'veg-matar':
          modelGroup = createPeasMesh();
          break;
        case 'veg-adrak-mirch':
          modelGroup = createGingerMirchiMesh();
          break;
        default:
          modelGroup = createTomatoMesh();
      }

      modelGroup.position.y = 0.2;
      vegContainer.add(modelGroup);

      // Position along carousel perimeter
      vegContainer.position.set(
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
      );

      carouselGroup.add(vegContainer);
      vegGroups.push(vegContainer);
    });

    vegGroupsRef.current = vegGroups;
    pedestalMeshesRef.current = pedestals;

    // 7. Ambient Golden Dew & Sun Pollen 3D Particles
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = Math.random() * 7 - 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. Animation & Physics Loop
    let animFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Continuous Auto-Orbit when not dragging
      if (isAutoOrbit && !isDraggingRef.current && !inspectMode) {
        targetRotationRef.current -= delta * 0.18;
      }

      // Smooth Inertia Damping
      if (!isDraggingRef.current) {
        currentRotationRef.current = THREE.MathUtils.lerp(
          currentRotationRef.current,
          targetRotationRef.current,
          0.08
        );
      }

      // Update Carousel Rotation
      if (carouselGroupRef.current) {
        carouselGroupRef.current.rotation.y = currentRotationRef.current;
      }

      // Determine which vegetable is currently closest to the front (angle ~ 0)
      const numV = VEGETABLES_DATA.length;
      const step = (Math.PI * 2) / numV;
      // Normalize angle to find active index
      let normAngle = (-currentRotationRef.current) % (Math.PI * 2);
      if (normAngle < 0) normAngle += Math.PI * 2;
      const computedActiveIndex = Math.round(normAngle / step) % numV;

      // Update individual vegetable behavior (front one bobs & rotates gently)
      vegGroups.forEach((group, idx) => {
        // Compute world position angle relative to viewer
        const baseAngle = (idx / numV) * Math.PI * 2 + currentRotationRef.current;
        const distFromFront = Math.cos(baseAngle); // 1 = front, -1 = back

        // Dynamic depth scaling: front is large & bright
        const targetScale = THREE.MathUtils.mapLinear(distFromFront, -1, 1, 0.72, 1.32);
        group.scale.set(targetScale, targetScale, targetScale);

        // Subtle gentle levitation & spin for front active item
        if (distFromFront > 0.85) {
          group.position.y = Math.sin(elapsedTime * 2.5) * 0.12 + 0.1;
          // Rotate vegetable model inside group
          const model = group.children[1];
          if (model) {
            if (inspectMode) {
              model.rotation.y = inspectRotYRef.current;
              model.rotation.x = inspectRotXRef.current;
            } else {
              model.rotation.y = elapsedTime * 0.75;
              model.rotation.x = Math.sin(elapsedTime * 1.5) * 0.08;
            }
          }
        } else {
          group.position.y = 0;
          const model = group.children[1];
          if (model) {
            model.rotation.y = 0;
            model.rotation.x = 0;
          }
        }
      });

      // Synchronize UI active index when stopped or settled
      if (!isDraggingRef.current && computedActiveIndex !== selectedIndex) {
        setSelectedIndex(computedActiveIndex);
      }

      // Pulse the active spotlight aura
      if (auraGlowRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
        auraGlowRef.current.scale.set(pulse, pulse, 1);
      }

      // Gently float ambient dust/pollen particles
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 1; i < posAttr.count * 3; i += 3) {
          let y = posAttr.getY(i / 3);
          y += delta * 0.25;
          if (y > 6) y = -1;
          posAttr.setY(i / 3, y);
        }
        posAttr.needsUpdate = true;
      }

      // Camera zoom interpolation
      if (cameraRef.current) {
        const targetZ = 8.8 / zoomLevel;
        cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoOrbit, inspectMode, zoomLevel, selectedIndex]);

  // -------------------------------------------------------------
  // Pointer / Mouse Drag Events for True 3D Rotational Orbit
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    if (inspectMode) {
      inspectDragRef.current = true;
      dragStartXRef.current = e.clientX;
      dragLastXRef.current = e.clientY;
    } else {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragLastXRef.current = e.clientX;
      velocityRef.current = 0;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (inspectMode && inspectDragRef.current) {
      const deltaX = (e.clientX - dragStartXRef.current) * 0.01;
      const deltaY = (e.clientY - dragLastXRef.current) * 0.01;
      inspectRotYRef.current += deltaX;
      inspectRotXRef.current = Math.max(-0.6, Math.min(0.6, inspectRotXRef.current + deltaY));
      dragStartXRef.current = e.clientX;
      dragLastXRef.current = e.clientY;
    } else if (isDraggingRef.current) {
      const deltaX = e.clientX - dragLastXRef.current;
      dragLastXRef.current = e.clientX;
      const sensitivity = 0.006;
      currentRotationRef.current += deltaX * sensitivity;
      targetRotationRef.current = currentRotationRef.current;
      velocityRef.current = deltaX * sensitivity;
    }
  };

  const handlePointerUp = () => {
    if (inspectMode) {
      inspectDragRef.current = false;
    } else if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // Add inertial coasting
      targetRotationRef.current += velocityRef.current * 12;

      // Snap gently to the nearest vegetable
      const numV = VEGETABLES_DATA.length;
      const step = (Math.PI * 2) / numV;
      const nearestSlot = Math.round(targetRotationRef.current / step);
      targetRotationRef.current = nearestSlot * step;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 15) {
      handleNext();
    } else if (e.deltaY < -15) {
      handlePrev();
    }
  };

  return (
    <section
      id="vegetables-importance-showcase"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
    >
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EE] border border-[#B7E4C7] text-[#1B4332] text-xs font-bold uppercase tracking-wider">
            <Rotate3d className="w-4 h-4 text-[#2D6A4F] animate-spin-slow" />
            <span>Interactive 3D Three.js Farm Showcase • Solapur Harvest</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight font-display">
            The Vital Importance of Fresh Daily Vegetables
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Experience our 8 staple vegetables rendered in true 360° Three.js 3D space. Drag to orbit the carousel,
            inspect cellular bio-active nutrients, and discover how daily farm greens fortify your family's health.
          </p>
        </div>

        {/* Top 3D Control Bar */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {/* Auto Orbit Toggle */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs border cursor-pointer ${
              isAutoOrbit
                ? 'bg-[#EAF5EE] text-[#1B4332] border-[#B7E4C7]'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title={isAutoOrbit ? 'Pause 3D Auto-Orbit' : 'Start 3D Auto-Orbit'}
          >
            {isAutoOrbit ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>3D Auto-Orbit Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-stone-500" />
                <span>Play 3D Orbit</span>
              </>
            )}
          </button>

          {/* Inspect in 360 Mode */}
          <button
            onClick={() => setInspectMode(!inspectMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs border cursor-pointer ${
              inspectMode
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title="Inspect front vegetable in free 360° 3D angles"
          >
            <Rotate3d className="w-3.5 h-3.5 text-amber-700" />
            <span>{inspectMode ? 'Exit Inspect' : 'Inspect 360°'}</span>
          </button>

          {/* Step Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#1B4332] hover:bg-[#EAF5EE] hover:border-[#B7E4C7] transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Previous 3D Vegetable"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#1B4332] hover:bg-[#EAF5EE] hover:border-[#B7E4C7] transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Next 3D Vegetable"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Stage & Nutrition HUD Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ============================================================== */}
        {/* LEFT / CENTER: WebGL 3D Three.js Canvas Stage (7 Cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#FBF9F5] via-[#F4F1EA] to-[#EAE6DD] rounded-3xl border border-[#E8E2D9] shadow-inner relative flex flex-col justify-between overflow-hidden min-h-[440px] sm:min-h-[500px]">
          {/* Top Canvas Overlay Hints */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              <span className="text-[11px] font-bold text-[#1B4332]">
                Three.js 3D WebGL • Real-time Shaders
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-2xs pointer-events-auto">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
                className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold px-1 text-stone-500">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
                className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Three.js WebGL Mount Viewport */}
          <div
            ref={mountRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            className="w-full h-full flex-1 touch-none cursor-grab active:cursor-grabbing relative"
            style={{ minHeight: '380px' }}
          >
            {/* Overlay instruction pill on bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
                <Compass className="w-3 h-3 text-[#52B788] animate-spin" />
                <span>
                  {inspectMode
                    ? '360° Inspect: Drag in any direction to rotate front item'
                    : 'Drag left/right to orbit 3D carousel • Scroll wheel to step'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Vegetable Index Indicator Bar */}
          <div className="p-3 bg-white/70 backdrop-blur-xs border-t border-stone-200/80 flex items-center justify-between gap-2 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeVeg.emoji}</span>
              <div className="leading-tight">
                <span className="text-xs font-bold text-[#1B4332] block">
                  {activeVeg.name}
                </span>
                <span className="text-[10px] font-semibold text-stone-500">
                  {activeVeg.marathiName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {VEGETABLES_DATA.map((veg, i) => (
                <button
                  key={veg.id}
                  onClick={() => rotateToVegIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    selectedIndex === i
                      ? 'bg-[#2D6A4F] scale-125 ring-2 ring-[#B7E4C7]'
                      : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  title={`Rotate to ${veg.name}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: Synchronized Dynamic Nutrition & Importance HUD (5 Cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 sm:p-7 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVeg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EAF5EE] border border-[#B7E4C7] px-3 py-1 rounded-full">
                    {activeVeg.seasonalStatus}
                  </span>
                  <span className="text-xs font-bold text-stone-400">
                    Vegetable #{selectedIndex + 1} of {VEGETABLES_DATA.length}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-display">
                      {activeVeg.name}
                    </h3>
                    <p className="text-sm font-bold text-[#2D6A4F] mt-0.5">
                      {activeVeg.marathiName} • {activeVeg.hindiName}
                    </p>
                  </div>
                  <span className="text-4xl p-2 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 shadow-2xs">
                    {activeVeg.emoji}
                  </span>
                </div>

                {/* Headline Role Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-[#1B4332] shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{activeVeg.headlineRole}</span>
                </div>
              </div>

              {/* Health Importance Paragraph */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Nutritional & Cellular Science:
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/70">
                  {activeVeg.healthImportance}
                </p>
              </div>

              {/* Bio-Active Nutrients Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Bio-Active Nutrients:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeVeg.keyNutrients.map((nutrient, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#1B4332] border border-[#B7E4C7]"
                    >
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3 Daily Proven Benefits */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Daily Proven Health Impacts:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {activeVeg.dailyBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Culinary Tip */}
              <div className="p-3 rounded-2xl bg-[#F4F1EA]/80 border border-stone-200 text-xs text-stone-700 leading-snug">
                <span className="font-bold text-[#1B4332] block mb-0.5">
                  Traditional Solapur Culinary Tip:
                </span>
                {activeVeg.culinaryTip}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons: Add to List & Full Modal */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowDetailModal(true)}
              className="px-4 py-3 rounded-xl border border-stone-200 text-stone-700 hover:text-[#1B4332] hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Full Guide</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddCurrentVeg}
              className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                addedItem
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-[#2D6A4F]/20'
              }`}
            >
              {addedItem ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added {activeVeg.defaultQty} {activeVeg.unit} to List!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>
                    Add {activeVeg.defaultQty} {activeVeg.unit} Fresh {activeVeg.name.split(' ')[0]}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Thumbnail Quick-Selector Ribbon with 3D status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Click Any Vegetable to Rotate 3D Carousel Directly:
          </span>
          <span className="text-xs font-semibold text-[#2D6A4F]">
            {VEGETABLES_DATA.length} Solapur Staples Ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {VEGETABLES_DATA.map((veg, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={veg.id}
                onClick={() => rotateToVegIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#EAF5EE] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {veg.emoji}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] bg-[#2D6A4F] text-white px-1.5 py-0.5 rounded-full font-bold">
                      3D Focus
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B4332] truncate">
                    {veg.name.split('(')[0]}
                  </h4>
                  <p className="text-[10px] font-semibold text-stone-500 truncate">
                    {veg.marathiName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Infinite Animated Marquee Ticker */}
      <div className="overflow-hidden py-3 bg-[#EAF5EE] rounded-2xl border border-[#B7E4C7] select-none">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[
            '🌱 Three.js 3D Interactive Farm Experience',
            '🥗 Wash with Rock Salt & Warm Water for Max Purity',
            '🍅 Lycopene Bioavailability Triples with Gentle Cooking',
            '🥬 Spinach Restores Red Blood Cell Hemoglobin',
            '🧅 Solapur Red Onions Packed With Natural Quercetin',
            '🥢 Fresh Okra Pectin Balances Blood Sugar',
            '🥕 Beta-Carotene Fortifies Retina & Cellular Immunity',
            '🫛 Sweet Green Peas Full of Clean Plant Protein',
            '🫚 Ginger & Green Chilli Boost Daily Metabolism & Agni',
          ].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-bold text-[#1B4332]">
              <span>{text}</span>
              <span className="text-[#52B788]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Deep-Dive Detailed Health Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-4xl shadow-inner">
                  {activeVeg.emoji}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1B4332] font-display">
                    {activeVeg.name}
                  </h3>
                  <p className="text-sm font-bold text-[#2D6A4F]">
                    {activeVeg.marathiName} ({activeVeg.hindiName})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EAF5EE] border border-[#B7E4C7] text-xs font-bold text-[#1B4332] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeVeg.headlineRole}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>{activeVeg.healthImportance}</p>

                <div className="space-y-1.5 pt-2">
                  <h4 className="font-bold text-[#1B4332]">Nutritional Components:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVeg.keyNutrients.map((n, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h4 className="font-bold text-[#1B4332]">Daily Health Impact Summary:</h4>
                  <ul className="space-y-1 pl-1">
                    {activeVeg.dailyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200">
                  <span className="font-bold text-[#1B4332] block mb-1">
                    Traditional Culinary Tip:
                  </span>
                  <p className="text-xs text-stone-600">{activeVeg.culinaryTip}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleAddCurrentVeg();
                    setShowDetailModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#2D6A4F]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Add {activeVeg.defaultQty} {activeVeg.unit} to Grocery List
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
