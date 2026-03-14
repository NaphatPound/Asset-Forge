import * as THREE from 'three';
import type { BlockDefinition } from '../types/editor';

export const blockDefinitions: BlockDefinition[] = [
  // Primitives
  { id: 'box', name: 'Box', category: 'Primitives', geometry: 'box', params: { width: 1, height: 1, depth: 1 } },
  { id: 'cylinder', name: 'Cylinder', category: 'Primitives', geometry: 'cylinder', params: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 16 } },
  { id: 'sphere', name: 'Sphere', category: 'Primitives', geometry: 'sphere', params: { radius: 0.5, widthSegments: 16, heightSegments: 16 } },
  { id: 'cone', name: 'Cone', category: 'Primitives', geometry: 'cone', params: { radius: 0.5, height: 1, radialSegments: 16 } },
  { id: 'torus', name: 'Torus', category: 'Primitives', geometry: 'torus', params: { radius: 0.4, tube: 0.15, radialSegments: 12, tubularSegments: 24 } },
  { id: 'plane', name: 'Plane', category: 'Primitives', geometry: 'box', params: { width: 2, height: 0.05, depth: 2 } },
  { id: 'capsule', name: 'Capsule', category: 'Primitives', geometry: 'capsule', params: { radius: 0.3, length: 0.6, capSegments: 8, radialSegments: 12 } },
  { id: 'wedge', name: 'Wedge', category: 'Primitives', geometry: 'extrude', params: { size: 1 } },

  // Buildings
  { id: 'wall', name: 'Wall', category: 'Buildings', geometry: 'box', params: { width: 2, height: 2, depth: 0.2 } },
  { id: 'floor', name: 'Floor', category: 'Buildings', geometry: 'box', params: { width: 2, height: 0.1, depth: 2 } },
  { id: 'roof', name: 'Roof', category: 'Buildings', geometry: 'extrude', params: { size: 2 } },
  { id: 'door', name: 'Door', category: 'Buildings', geometry: 'box', params: { width: 0.8, height: 1.8, depth: 0.1 } },
  { id: 'window', name: 'Window', category: 'Buildings', geometry: 'box', params: { width: 0.8, height: 0.8, depth: 0.05 } },
  { id: 'stairs', name: 'Stairs', category: 'Buildings', geometry: 'composed', params: { steps: 5, width: 1, stepHeight: 0.2, stepDepth: 0.3 } },
  { id: 'pillar', name: 'Pillar', category: 'Buildings', geometry: 'cylinder', params: { radiusTop: 0.15, radiusBottom: 0.15, height: 2, radialSegments: 8 } },
  { id: 'arch', name: 'Arch', category: 'Buildings', geometry: 'lathe', params: { segments: 16 } },

  // Vehicles
  { id: 'wheel', name: 'Wheel', category: 'Vehicles', geometry: 'torus', params: { radius: 0.35, tube: 0.1, radialSegments: 8, tubularSegments: 16 } },
  { id: 'chassis', name: 'Chassis', category: 'Vehicles', geometry: 'box', params: { width: 1.5, height: 0.3, depth: 3 } },
  { id: 'cockpit', name: 'Cockpit', category: 'Vehicles', geometry: 'sphere', params: { radius: 0.5, widthSegments: 12, heightSegments: 8 } },
  { id: 'wing', name: 'Wing', category: 'Vehicles', geometry: 'box', params: { width: 3, height: 0.05, depth: 0.8 } },
  { id: 'engine', name: 'Engine', category: 'Vehicles', geometry: 'cylinder', params: { radiusTop: 0.3, radiusBottom: 0.3, height: 0.8, radialSegments: 12 } },
  { id: 'bumper', name: 'Bumper', category: 'Vehicles', geometry: 'box', params: { width: 1.4, height: 0.2, depth: 0.15 } },

  // Furniture
  { id: 'table_top', name: 'Table Top', category: 'Furniture', geometry: 'box', params: { width: 1.5, height: 0.08, depth: 0.8 } },
  { id: 'chair_seat', name: 'Chair Seat', category: 'Furniture', geometry: 'box', params: { width: 0.5, height: 0.06, depth: 0.5 } },
  { id: 'shelf', name: 'Shelf', category: 'Furniture', geometry: 'box', params: { width: 1.2, height: 0.05, depth: 0.3 } },
  { id: 'lamp_shade', name: 'Lamp Shade', category: 'Furniture', geometry: 'cone', params: { radius: 0.3, height: 0.3, radialSegments: 12 } },
  { id: 'bed', name: 'Bed', category: 'Furniture', geometry: 'box', params: { width: 1, height: 0.3, depth: 2 } },
  { id: 'cabinet', name: 'Cabinet', category: 'Furniture', geometry: 'box', params: { width: 0.8, height: 1.2, depth: 0.4 } },

  // Characters
  { id: 'head', name: 'Head', category: 'Characters', geometry: 'sphere', params: { radius: 0.25, widthSegments: 12, heightSegments: 12 } },
  { id: 'torso', name: 'Torso', category: 'Characters', geometry: 'box', params: { width: 0.5, height: 0.7, depth: 0.3 } },
  { id: 'arm', name: 'Arm', category: 'Characters', geometry: 'box', params: { width: 0.15, height: 0.6, depth: 0.15 } },
  { id: 'leg', name: 'Leg', category: 'Characters', geometry: 'box', params: { width: 0.18, height: 0.7, depth: 0.18 } },
  { id: 'hand', name: 'Hand', category: 'Characters', geometry: 'sphere', params: { radius: 0.1, widthSegments: 8, heightSegments: 8 } },
  { id: 'foot', name: 'Foot', category: 'Characters', geometry: 'box', params: { width: 0.2, height: 0.1, depth: 0.3 } },

  // Foliage
  { id: 'tree_trunk', name: 'Tree Trunk', category: 'Foliage', geometry: 'cylinder', params: { radiusTop: 0.08, radiusBottom: 0.12, height: 1, radialSegments: 6 } },
  { id: 'tree_crown', name: 'Tree Crown', category: 'Foliage', geometry: 'sphere', params: { radius: 0.6, widthSegments: 8, heightSegments: 8 } },
  { id: 'bush', name: 'Bush', category: 'Foliage', geometry: 'sphere', params: { radius: 0.4, widthSegments: 8, heightSegments: 6 } },
  { id: 'rock', name: 'Rock', category: 'Foliage', geometry: 'sphere', params: { radius: 0.35, widthSegments: 6, heightSegments: 5 } },
  { id: 'grass_patch', name: 'Grass Patch', category: 'Foliage', geometry: 'box', params: { width: 1, height: 0.05, depth: 1 } },

  // Mechanical
  { id: 'gear', name: 'Gear', category: 'Mechanical', geometry: 'torus', params: { radius: 0.4, tube: 0.08, radialSegments: 6, tubularSegments: 20 } },
  { id: 'pipe', name: 'Pipe', category: 'Mechanical', geometry: 'cylinder', params: { radiusTop: 0.12, radiusBottom: 0.12, height: 2, radialSegments: 12 } },
  { id: 'valve', name: 'Valve', category: 'Mechanical', geometry: 'torus', params: { radius: 0.2, tube: 0.05, radialSegments: 8, tubularSegments: 16 } },
  { id: 'lever', name: 'Lever', category: 'Mechanical', geometry: 'box', params: { width: 0.06, height: 0.6, depth: 0.06 } },
  { id: 'piston', name: 'Piston', category: 'Mechanical', geometry: 'cylinder', params: { radiusTop: 0.2, radiusBottom: 0.2, height: 0.6, radialSegments: 12 } },
  { id: 'bolt', name: 'Bolt', category: 'Mechanical', geometry: 'cylinder', params: { radiusTop: 0.05, radiusBottom: 0.05, height: 0.3, radialSegments: 6 } },

  // City
  { id: 'road', name: 'Road', category: 'City', geometry: 'box', params: { width: 2, height: 0.05, depth: 4 } },
  { id: 'sidewalk', name: 'Sidewalk', category: 'City', geometry: 'box', params: { width: 1, height: 0.1, depth: 4 } },
  { id: 'streetlight', name: 'Streetlight', category: 'City', geometry: 'cylinder', params: { radiusTop: 0.03, radiusBottom: 0.04, height: 3, radialSegments: 6 } },
  { id: 'bench', name: 'Bench', category: 'City', geometry: 'box', params: { width: 1.2, height: 0.5, depth: 0.4 } },
  { id: 'hydrant', name: 'Hydrant', category: 'City', geometry: 'cylinder', params: { radiusTop: 0.1, radiusBottom: 0.12, height: 0.5, radialSegments: 8 } },
  { id: 'mailbox', name: 'Mailbox', category: 'City', geometry: 'box', params: { width: 0.3, height: 0.5, depth: 0.25 } },

  // Mech - Head
  { id: 'mech_head_visor', name: 'Visor Head', category: 'Mech - Head', geometry: 'composed', params: { subtype: 1 } },
  { id: 'mech_head_horn', name: 'Horn Head', category: 'Mech - Head', geometry: 'composed', params: { subtype: 2 } },
  { id: 'mech_head_sensor', name: 'Sensor Head', category: 'Mech - Head', geometry: 'composed', params: { subtype: 3 } },
  { id: 'mech_head_crest', name: 'Crest Head', category: 'Mech - Head', geometry: 'composed', params: { subtype: 4 } },
  { id: 'mech_antenna', name: 'Antenna', category: 'Mech - Head', geometry: 'composed', params: { subtype: 5 } },

  // Mech - Torso
  { id: 'mech_chest_plate', name: 'Chest Plate', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 10 } },
  { id: 'mech_cockpit_torso', name: 'Cockpit Torso', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 11 } },
  { id: 'mech_reactor_core', name: 'Reactor Core', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 12 } },
  { id: 'mech_back_thruster', name: 'Back Thruster', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 13 } },
  { id: 'mech_waist', name: 'Waist Joint', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 14 } },
  { id: 'mech_shoulder_pad', name: 'Shoulder Pad', category: 'Mech - Torso', geometry: 'composed', params: { subtype: 15 } },

  // Mech - Arms
  { id: 'mech_upper_arm', name: 'Upper Arm', category: 'Mech - Arms', geometry: 'composed', params: { subtype: 20 } },
  { id: 'mech_forearm', name: 'Forearm', category: 'Mech - Arms', geometry: 'composed', params: { subtype: 21 } },
  { id: 'mech_fist', name: 'Mech Fist', category: 'Mech - Arms', geometry: 'composed', params: { subtype: 22 } },
  { id: 'mech_claw', name: 'Claw Hand', category: 'Mech - Arms', geometry: 'composed', params: { subtype: 23 } },
  { id: 'mech_shield', name: 'Arm Shield', category: 'Mech - Arms', geometry: 'composed', params: { subtype: 24 } },

  // Mech - Legs
  { id: 'mech_thigh', name: 'Thigh Armor', category: 'Mech - Legs', geometry: 'composed', params: { subtype: 30 } },
  { id: 'mech_shin', name: 'Shin Guard', category: 'Mech - Legs', geometry: 'composed', params: { subtype: 31 } },
  { id: 'mech_foot_heavy', name: 'Heavy Foot', category: 'Mech - Legs', geometry: 'composed', params: { subtype: 32 } },
  { id: 'mech_knee_joint', name: 'Knee Joint', category: 'Mech - Legs', geometry: 'composed', params: { subtype: 33 } },
  { id: 'mech_thruster_leg', name: 'Leg Thruster', category: 'Mech - Legs', geometry: 'composed', params: { subtype: 34 } },

  // Mech - Weapons
  { id: 'mech_beam_rifle', name: 'Beam Rifle', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 40 } },
  { id: 'mech_beam_saber', name: 'Beam Saber', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 41 } },
  { id: 'mech_cannon', name: 'Shoulder Cannon', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 42 } },
  { id: 'mech_gatling', name: 'Gatling Gun', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 43 } },
  { id: 'mech_missile_pod', name: 'Missile Pod', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 44 } },
  { id: 'mech_blade', name: 'Heat Blade', category: 'Mech - Weapons', geometry: 'composed', params: { subtype: 45 } },

  // Mech - Wings & Packs
  { id: 'mech_wing_fin', name: 'Wing Fin', category: 'Mech - Wings', geometry: 'composed', params: { subtype: 50 } },
  { id: 'mech_booster', name: 'Booster Pack', category: 'Mech - Wings', geometry: 'composed', params: { subtype: 51 } },
  { id: 'mech_wing_blade', name: 'Wing Blade', category: 'Mech - Wings', geometry: 'composed', params: { subtype: 52 } },
  { id: 'mech_backpack', name: 'Backpack Unit', category: 'Mech - Wings', geometry: 'composed', params: { subtype: 53 } },
  { id: 'mech_stabilizer', name: 'Stabilizer', category: 'Mech - Wings', geometry: 'composed', params: { subtype: 54 } },

  // Mech - Accessories
  { id: 'mech_v_fin', name: 'V-Fin Crest', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 60 } },
  { id: 'mech_scope_eye', name: 'Mono-Eye Scope', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 61 } },
  { id: 'mech_exhaust_vent', name: 'Exhaust Vent', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 62 } },
  { id: 'mech_hip_skirt', name: 'Hip Skirt Armor', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 63 } },
  { id: 'mech_cable_bundle', name: 'Cable Bundle', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 64 } },
  { id: 'mech_radar_dish', name: 'Radar Dish', category: 'Mech - Accessories', geometry: 'composed', params: { subtype: 65 } },

  // Mech - Heavy Armor
  { id: 'mech_heavy_chest', name: 'Heavy Chest Armor', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 70 } },
  { id: 'mech_heavy_shoulder', name: 'Heavy Shoulder Plate', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 71 } },
  { id: 'mech_heavy_leg', name: 'Heavy Leg Armor', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 72 } },
  { id: 'mech_heavy_arm', name: 'Heavy Arm Guard', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 73 } },
  { id: 'mech_tower_shield', name: 'Tower Shield', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 74 } },
  { id: 'mech_heavy_foot', name: 'Stomper Foot', category: 'Mech - Heavy Armor', geometry: 'composed', params: { subtype: 75 } },

  // Mech - Flight Systems
  { id: 'mech_delta_wing', name: 'Delta Wing', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 80 } },
  { id: 'mech_thruster_pack', name: 'Thruster Pack', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 81 } },
  { id: 'mech_aero_fin', name: 'Aero Fin', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 82 } },
  { id: 'mech_hover_pod', name: 'Hover Pod', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 83 } },
  { id: 'mech_intake_nacelle', name: 'Intake Nacelle', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 84 } },
  { id: 'mech_tail_rudder', name: 'Tail Rudder', category: 'Mech - Flight Systems', geometry: 'composed', params: { subtype: 85 } },

  // Mech - Stealth Frame (sleek, angular stealth mech parts)
  { id: 'mech_stealth_head', name: 'Stealth Visor Head', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 100 } },
  { id: 'mech_stealth_torso', name: 'Stealth Chest', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 101 } },
  { id: 'mech_stealth_arm', name: 'Stealth Arm', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 102 } },
  { id: 'mech_stealth_leg', name: 'Stealth Leg', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 103 } },
  { id: 'mech_stealth_wing', name: 'Stealth Wing', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 104 } },
  { id: 'mech_stealth_blade', name: 'Plasma Blade', category: 'Mech - Stealth Frame', geometry: 'composed', params: { subtype: 105 } },

  // Mech - Knight Frame (medieval-style mech, ornate heavy armor)
  { id: 'mech_knight_head', name: 'Knight Helm', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 110 } },
  { id: 'mech_knight_torso', name: 'Knight Breastplate', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 111 } },
  { id: 'mech_knight_arm', name: 'Knight Gauntlet', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 112 } },
  { id: 'mech_knight_leg', name: 'Knight Greave', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 113 } },
  { id: 'mech_knight_shield', name: 'Heater Shield', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 114 } },
  { id: 'mech_knight_lance', name: 'Energy Lance', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 115 } },
  { id: 'mech_knight_cape', name: 'Armor Cape', category: 'Mech - Knight Frame', geometry: 'composed', params: { subtype: 116 } },

  // Mech - Beast Frame (animal-like mech, quadruped parts)
  { id: 'mech_beast_head', name: 'Beast Skull', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 120 } },
  { id: 'mech_beast_torso', name: 'Beast Spine', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 121 } },
  { id: 'mech_beast_foreleg', name: 'Beast Foreleg', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 122 } },
  { id: 'mech_beast_hindleg', name: 'Beast Hindleg', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 123 } },
  { id: 'mech_beast_tail', name: 'Beast Tail', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 124 } },
  { id: 'mech_beast_jaw', name: 'Beast Jaw', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 125 } },
  { id: 'mech_beast_claw_foot', name: 'Beast Claw', category: 'Mech - Beast Frame', geometry: 'composed', params: { subtype: 126 } },

  // Mech - Tank Frame (bulky ground-type mech with tank treads)
  { id: 'mech_tank_head', name: 'Tank Turret Head', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 130 } },
  { id: 'mech_tank_torso', name: 'Tank Hull', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 131 } },
  { id: 'mech_tank_arm', name: 'Tank Siege Arm', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 132 } },
  { id: 'mech_tank_leg', name: 'Tank Tread Leg', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 133 } },
  { id: 'mech_tank_cannon_arm', name: 'Siege Cannon', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 134 } },
  { id: 'mech_tank_armor_skirt', name: 'Side Skirt Armor', category: 'Mech - Tank Frame', geometry: 'composed', params: { subtype: 135 } },

  // Mech - Gundam Frame (classic Gundam-style, iconic proportions)
  { id: 'mech_gundam_head', name: 'Gundam V-Fin Head', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 140 } },
  { id: 'mech_gundam_torso', name: 'Gundam Core Chest', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 141 } },
  { id: 'mech_gundam_shoulder', name: 'Gundam Shoulder', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 142 } },
  { id: 'mech_gundam_arm', name: 'Gundam Arm', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 143 } },
  { id: 'mech_gundam_leg', name: 'Gundam Leg', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 144 } },
  { id: 'mech_gundam_skirt', name: 'Gundam Waist Skirt', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 145 } },
  { id: 'mech_gundam_backpack', name: 'Gundam Backpack', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 146 } },
  { id: 'mech_gundam_shield', name: 'Gundam Shield', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 147 } },
  { id: 'mech_gundam_rifle', name: 'Gundam Beam Rifle', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 148 } },
  { id: 'mech_gundam_saber', name: 'Gundam Beam Saber', category: 'Mech - Gundam Frame', geometry: 'composed', params: { subtype: 149 } },

  // Mech - Super Robot (over-the-top super robot parts, large & dramatic)
  { id: 'mech_super_head', name: 'Super Crown Head', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 150 } },
  { id: 'mech_super_torso', name: 'Super Chest', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 151 } },
  { id: 'mech_super_shoulder', name: 'Super Shoulder', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 152 } },
  { id: 'mech_super_arm', name: 'Rocket Punch Arm', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 153 } },
  { id: 'mech_super_leg', name: 'Super Leg', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 154 } },
  { id: 'mech_super_wing', name: 'Super Wing', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 155 } },
  { id: 'mech_super_horn', name: 'Power Horn', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 156 } },
  { id: 'mech_super_fist', name: 'Mega Fist', category: 'Mech - Super Robot', geometry: 'composed', params: { subtype: 157 } },
];

const geometryCache = new Map<string, THREE.BufferGeometry>();

function createWedgeGeometry(size: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(size, 0);
  shape.lineTo(0, size);
  shape.lineTo(0, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: size,
    bevelEnabled: false,
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

function createRoofGeometry(size: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const half = size / 2;
  shape.moveTo(-half, 0);
  shape.lineTo(half, 0);
  shape.lineTo(0, half * 0.8);
  shape.lineTo(-half, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: size,
    bevelEnabled: false,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.translate(0, 0, -half);
  return geo;
}

function createArchGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const angle = (i / 12) * Math.PI;
    points.push(new THREE.Vector2(Math.cos(angle) * 0.5 + 0.5, Math.sin(angle) * 1));
  }
  return new THREE.LatheGeometry(points, 16);
}

// ---- Mech Geometry Factories ----

function createMechHeadVisor(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main head box with angled front
  const head = new THREE.BoxGeometry(0.5, 0.4, 0.45);
  geos.push(head);
  // Visor strip
  const visor = new THREE.BoxGeometry(0.48, 0.1, 0.1);
  visor.translate(0, 0.02, 0.23);
  geos.push(visor);
  // Chin plate
  const chin = new THREE.BoxGeometry(0.3, 0.08, 0.15);
  chin.translate(0, -0.18, 0.15);
  geos.push(chin);
  // Cheek vents (left + right)
  for (const side of [-1, 1]) {
    const vent = new THREE.BoxGeometry(0.06, 0.12, 0.2);
    vent.translate(side * 0.28, -0.05, 0.08);
    geos.push(vent);
  }
  return mergeGeometries(geos);
}

function createMechHeadHorn(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const head = new THREE.BoxGeometry(0.45, 0.4, 0.4);
  geos.push(head);
  // V-fin horns
  for (const side of [-1, 1]) {
    const horn = new THREE.ConeGeometry(0.03, 0.35, 4);
    horn.rotateZ(side * -0.5);
    horn.translate(side * 0.18, 0.35, 0.05);
    geos.push(horn);
  }
  // Central crest
  const crest = new THREE.BoxGeometry(0.04, 0.15, 0.12);
  crest.translate(0, 0.25, 0.08);
  geos.push(crest);
  // Eyes
  const visor = new THREE.BoxGeometry(0.4, 0.06, 0.08);
  visor.translate(0, 0.04, 0.22);
  geos.push(visor);
  return mergeGeometries(geos);
}

function createMechHeadSensor(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Rounded head
  const head = new THREE.SphereGeometry(0.25, 8, 8);
  head.scale(1, 0.9, 0.9);
  geos.push(head);
  // Sensor eye (single)
  const sensor = new THREE.CylinderGeometry(0.08, 0.1, 0.08, 8);
  sensor.rotateX(Math.PI / 2);
  sensor.translate(0, 0.02, 0.22);
  geos.push(sensor);
  // Side panels
  for (const side of [-1, 1]) {
    const panel = new THREE.BoxGeometry(0.08, 0.2, 0.22);
    panel.translate(side * 0.24, 0, 0);
    geos.push(panel);
  }
  return mergeGeometries(geos);
}

function createMechHeadCrest(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const head = new THREE.BoxGeometry(0.5, 0.45, 0.42);
  geos.push(head);
  // Large samurai-style crest
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.3, 0.3);
  shape.lineTo(0.25, 0.35);
  shape.lineTo(-0.25, 0.35);
  shape.lineTo(-0.3, 0.3);
  shape.closePath();
  const crestGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
  crestGeo.translate(0, 0.2, -0.02);
  geos.push(crestGeo);
  // Face plate
  const face = new THREE.BoxGeometry(0.35, 0.15, 0.06);
  face.translate(0, -0.05, 0.24);
  geos.push(face);
  return mergeGeometries(geos);
}

function createMechAntenna(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Base mount
  const base = new THREE.CylinderGeometry(0.06, 0.08, 0.08, 6);
  geos.push(base);
  // Antenna rod
  const rod = new THREE.CylinderGeometry(0.015, 0.02, 0.5, 6);
  rod.translate(0, 0.29, 0);
  geos.push(rod);
  // Tip
  const tip = new THREE.SphereGeometry(0.03, 6, 6);
  tip.translate(0, 0.55, 0);
  geos.push(tip);
  return mergeGeometries(geos);
}

function createMechChestPlate(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main chest
  const chest = new THREE.BoxGeometry(0.9, 0.7, 0.5);
  geos.push(chest);
  // Raised center plate
  const center = new THREE.BoxGeometry(0.4, 0.35, 0.12);
  center.translate(0, 0.05, 0.3);
  geos.push(center);
  // Side intake vents
  for (const side of [-1, 1]) {
    const vent = new THREE.BoxGeometry(0.15, 0.25, 0.1);
    vent.translate(side * 0.38, -0.05, 0.28);
    geos.push(vent);
    // Vent slats
    for (let i = 0; i < 3; i++) {
      const slat = new THREE.BoxGeometry(0.13, 0.02, 0.12);
      slat.translate(side * 0.38, -0.12 + i * 0.08, 0.3);
      geos.push(slat);
    }
  }
  // Collar
  const collar = new THREE.BoxGeometry(0.6, 0.08, 0.35);
  collar.translate(0, 0.38, 0.05);
  geos.push(collar);
  return mergeGeometries(geos);
}

function createMechCockpitTorso(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main body
  const body = new THREE.BoxGeometry(0.85, 0.65, 0.55);
  geos.push(body);
  // Cockpit hatch (rounded)
  const cockpit = new THREE.SphereGeometry(0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  cockpit.rotateX(-Math.PI / 2);
  cockpit.translate(0, 0, 0.3);
  geos.push(cockpit);
  // Armor ridges
  for (let i = -1; i <= 1; i += 2) {
    const ridge = new THREE.BoxGeometry(0.08, 0.5, 0.55);
    ridge.translate(i * 0.46, 0, 0);
    geos.push(ridge);
  }
  return mergeGeometries(geos);
}

function createMechReactorCore(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Housing
  const housing = new THREE.CylinderGeometry(0.3, 0.28, 0.35, 8);
  geos.push(housing);
  // Core glow ring
  const ring = new THREE.TorusGeometry(0.22, 0.04, 6, 12);
  ring.translate(0, 0.05, 0);
  geos.push(ring);
  // Top cap
  const cap = new THREE.CylinderGeometry(0.2, 0.3, 0.06, 8);
  cap.translate(0, 0.2, 0);
  geos.push(cap);
  return mergeGeometries(geos);
}

function createMechBackThruster(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main thruster housing
  const housing = new THREE.BoxGeometry(0.3, 0.4, 0.35);
  geos.push(housing);
  // Nozzle
  const nozzle = new THREE.CylinderGeometry(0.12, 0.08, 0.2, 8);
  nozzle.rotateX(Math.PI / 2);
  nozzle.translate(0, -0.05, -0.27);
  geos.push(nozzle);
  // Heat fins
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.BoxGeometry(0.32, 0.02, 0.15);
    fin.translate(0, -0.1 + i * 0.12, -0.15);
    geos.push(fin);
  }
  return mergeGeometries(geos);
}

function createMechWaist(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Central joint
  const joint = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8);
  geos.push(joint);
  // Waist armor (front/back)
  const front = new THREE.BoxGeometry(0.5, 0.18, 0.15);
  front.translate(0, 0, 0.15);
  geos.push(front);
  const back = new THREE.BoxGeometry(0.5, 0.18, 0.15);
  back.translate(0, 0, -0.15);
  geos.push(back);
  // Side skirts
  for (const side of [-1, 1]) {
    const skirt = new THREE.BoxGeometry(0.12, 0.25, 0.3);
    skirt.translate(side * 0.3, -0.05, 0);
    geos.push(skirt);
  }
  return mergeGeometries(geos);
}

function createMechShoulderPad(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main shoulder block
  const main = new THREE.BoxGeometry(0.35, 0.2, 0.35);
  geos.push(main);
  // Top dome
  const dome = new THREE.SphereGeometry(0.18, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.translate(0, 0.1, 0);
  geos.push(dome);
  // Side plate
  const plate = new THREE.BoxGeometry(0.38, 0.25, 0.04);
  plate.translate(0, 0.02, 0.19);
  geos.push(plate);
  return mergeGeometries(geos);
}

function createMechUpperArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main arm segment
  const arm = new THREE.BoxGeometry(0.22, 0.45, 0.22);
  geos.push(arm);
  // Joint ball top
  const ballTop = new THREE.SphereGeometry(0.1, 8, 8);
  ballTop.translate(0, 0.25, 0);
  geos.push(ballTop);
  // Armor plate
  const plate = new THREE.BoxGeometry(0.26, 0.2, 0.06);
  plate.translate(0, 0.05, 0.14);
  geos.push(plate);
  return mergeGeometries(geos);
}

function createMechForearm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main forearm
  const arm = new THREE.BoxGeometry(0.2, 0.4, 0.22);
  geos.push(arm);
  // Wrist guard
  const guard = new THREE.BoxGeometry(0.25, 0.1, 0.28);
  guard.translate(0, -0.18, 0);
  geos.push(guard);
  // Elbow joint
  const elbow = new THREE.CylinderGeometry(0.08, 0.08, 0.24, 8);
  elbow.rotateZ(Math.PI / 2);
  elbow.translate(0, 0.2, 0);
  geos.push(elbow);
  return mergeGeometries(geos);
}

function createMechFist(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Palm
  const palm = new THREE.BoxGeometry(0.16, 0.14, 0.18);
  geos.push(palm);
  // Fingers (4 grouped)
  const fingers = new THREE.BoxGeometry(0.14, 0.06, 0.1);
  fingers.translate(0, -0.1, 0.05);
  geos.push(fingers);
  // Thumb
  const thumb = new THREE.BoxGeometry(0.06, 0.06, 0.1);
  thumb.translate(0.1, -0.05, 0.05);
  geos.push(thumb);
  // Knuckle guards
  const guard = new THREE.BoxGeometry(0.18, 0.04, 0.12);
  guard.translate(0, -0.06, 0.04);
  geos.push(guard);
  return mergeGeometries(geos);
}

function createMechClaw(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Base
  const base = new THREE.BoxGeometry(0.15, 0.12, 0.12);
  geos.push(base);
  // Three claw fingers
  for (let i = -1; i <= 1; i++) {
    const claw = new THREE.BoxGeometry(0.03, 0.04, 0.25);
    claw.translate(i * 0.06, -0.04, 0.17);
    geos.push(claw);
    // Claw tip
    const tip = new THREE.ConeGeometry(0.025, 0.08, 4);
    tip.rotateX(Math.PI / 2);
    tip.translate(i * 0.06, -0.04, 0.33);
    geos.push(tip);
  }
  return mergeGeometries(geos);
}

function createMechShield(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main shield panel
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.5);
  shape.lineTo(0.3, -0.35);
  shape.lineTo(0.35, 0.1);
  shape.lineTo(0.2, 0.5);
  shape.lineTo(-0.2, 0.5);
  shape.lineTo(-0.35, 0.1);
  shape.lineTo(-0.3, -0.35);
  shape.closePath();
  const panel = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  panel.translate(0, 0, -0.03);
  geos.push(panel);
  // Handle on back
  const handle = new THREE.BoxGeometry(0.06, 0.25, 0.06);
  handle.translate(0, 0, -0.06);
  geos.push(handle);
  return mergeGeometries(geos);
}

function createMechThigh(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main thigh
  const thigh = new THREE.BoxGeometry(0.28, 0.45, 0.28);
  geos.push(thigh);
  // Front armor plate (angled)
  const plate = new THREE.BoxGeometry(0.25, 0.3, 0.06);
  plate.translate(0, 0.02, 0.17);
  geos.push(plate);
  // Hip joint
  const hip = new THREE.SphereGeometry(0.12, 8, 8);
  hip.translate(0, 0.25, 0);
  geos.push(hip);
  return mergeGeometries(geos);
}

function createMechShin(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main shin
  const shin = new THREE.BoxGeometry(0.25, 0.5, 0.3);
  geos.push(shin);
  // Front armor (tapered)
  const shape = new THREE.Shape();
  shape.moveTo(-0.12, -0.25);
  shape.lineTo(0.12, -0.25);
  shape.lineTo(0.1, 0.25);
  shape.lineTo(-0.1, 0.25);
  shape.closePath();
  const front = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
  front.translate(0, 0, 0.15);
  geos.push(front);
  // Side thruster vent
  const vent = new THREE.BoxGeometry(0.06, 0.15, 0.12);
  vent.translate(0.16, -0.1, 0);
  geos.push(vent);
  return mergeGeometries(geos);
}

function createMechFootHeavy(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Sole
  const sole = new THREE.BoxGeometry(0.35, 0.08, 0.5);
  sole.translate(0, -0.04, 0.05);
  geos.push(sole);
  // Ankle mount
  const ankle = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8);
  ankle.translate(0, 0.1, -0.05);
  geos.push(ankle);
  // Toe guard
  const toe = new THREE.BoxGeometry(0.3, 0.12, 0.15);
  toe.translate(0, 0.02, 0.22);
  geos.push(toe);
  // Heel stabilizer
  const heel = new THREE.BoxGeometry(0.2, 0.1, 0.1);
  heel.translate(0, 0.01, -0.22);
  geos.push(heel);
  return mergeGeometries(geos);
}

function createMechKneeJoint(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const joint = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 8);
  joint.rotateZ(Math.PI / 2);
  geos.push(joint);
  // Knee cap
  const cap = new THREE.SphereGeometry(0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  cap.rotateX(-Math.PI / 2);
  cap.translate(0, 0, 0.08);
  geos.push(cap);
  return mergeGeometries(geos);
}

function createMechThrusterLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Housing
  const housing = new THREE.BoxGeometry(0.2, 0.3, 0.15);
  geos.push(housing);
  // Nozzle
  const nozzle = new THREE.CylinderGeometry(0.06, 0.09, 0.12, 8);
  nozzle.translate(0, -0.2, 0);
  geos.push(nozzle);
  return mergeGeometries(geos);
}

function createMechBeamRifle(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Barrel
  const barrel = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.05, 0.5);
  geos.push(barrel);
  // Body
  const body = new THREE.BoxGeometry(0.12, 0.15, 0.5);
  body.translate(0, 0, 0.05);
  geos.push(body);
  // Grip
  const grip = new THREE.BoxGeometry(0.06, 0.18, 0.08);
  grip.translate(0, -0.15, -0.05);
  geos.push(grip);
  // Stock
  const stock = new THREE.BoxGeometry(0.08, 0.1, 0.2);
  stock.translate(0, 0.02, -0.28);
  geos.push(stock);
  // Scope
  const scope = new THREE.CylinderGeometry(0.025, 0.025, 0.15, 6);
  scope.rotateX(Math.PI / 2);
  scope.translate(0, 0.12, 0.15);
  geos.push(scope);
  return mergeGeometries(geos);
}

function createMechBeamSaber(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Handle
  const handle = new THREE.CylinderGeometry(0.025, 0.03, 0.25, 8);
  handle.translate(0, -0.05, 0);
  geos.push(handle);
  // Guard
  const guard = new THREE.TorusGeometry(0.04, 0.01, 4, 8);
  guard.translate(0, 0.08, 0);
  geos.push(guard);
  // Blade
  const blade = new THREE.CylinderGeometry(0.005, 0.02, 0.6, 6);
  blade.translate(0, 0.4, 0);
  geos.push(blade);
  return mergeGeometries(geos);
}

function createMechCannon(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Mount
  const mount = new THREE.BoxGeometry(0.2, 0.15, 0.2);
  geos.push(mount);
  // Barrel
  const barrel = new THREE.CylinderGeometry(0.08, 0.06, 0.6, 8);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.08, 0.4);
  geos.push(barrel);
  // Barrel shroud
  const shroud = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8);
  shroud.rotateX(Math.PI / 2);
  shroud.translate(0, 0.08, 0.15);
  geos.push(shroud);
  return mergeGeometries(geos);
}

function createMechGatling(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Housing
  const housing = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8);
  housing.rotateX(Math.PI / 2);
  geos.push(housing);
  // Barrels (6 barrels)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const barrel = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4);
    barrel.rotateX(Math.PI / 2);
    barrel.translate(Math.cos(angle) * 0.06, Math.sin(angle) * 0.06, 0.32);
    geos.push(barrel);
  }
  // Grip
  const grip = new THREE.BoxGeometry(0.06, 0.15, 0.06);
  grip.translate(0, -0.15, -0.05);
  geos.push(grip);
  return mergeGeometries(geos);
}

function createMechMissilePod(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Pod housing
  const housing = new THREE.BoxGeometry(0.3, 0.2, 0.35);
  geos.push(housing);
  // Missile tubes (2x3 grid)
  for (let x = -1; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      const tube = new THREE.CylinderGeometry(0.035, 0.035, 0.12, 6);
      tube.rotateX(Math.PI / 2);
      tube.translate(x * 0.08, -0.03 + y * 0.1, 0.22);
      geos.push(tube);
    }
  }
  return mergeGeometries(geos);
}

function createMechHeatBlade(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Handle
  const handle = new THREE.BoxGeometry(0.05, 0.05, 0.2);
  handle.translate(0, 0, -0.15);
  geos.push(handle);
  // Guard
  const guard = new THREE.BoxGeometry(0.15, 0.04, 0.04);
  guard.translate(0, 0, -0.04);
  geos.push(guard);
  // Blade (extruded shape)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.06, 0.5);
  shape.lineTo(0, 0.7);
  shape.lineTo(-0.06, 0.5);
  shape.closePath();
  const blade = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  blade.translate(0, 0, -0.01);
  blade.rotateX(-Math.PI / 2);
  blade.translate(0, 0, 0.35);
  geos.push(blade);
  return mergeGeometries(geos);
}

function createMechWingFin(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.6, 0.1);
  shape.lineTo(0.5, 0.5);
  shape.lineTo(0.1, 0.4);
  shape.lineTo(0, 0.3);
  shape.closePath();
  const fin = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
  geos.push(fin);
  // Mount
  const mount = new THREE.BoxGeometry(0.1, 0.12, 0.08);
  mount.translate(0.05, 0.15, 0.02);
  geos.push(mount);
  return mergeGeometries(geos);
}

function createMechBooster(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main pod
  const pod = new THREE.CylinderGeometry(0.12, 0.15, 0.45, 8);
  geos.push(pod);
  // Nozzle
  const nozzle = new THREE.CylinderGeometry(0.14, 0.1, 0.1, 8);
  nozzle.translate(0, -0.27, 0);
  geos.push(nozzle);
  // Top cap
  const cap = new THREE.SphereGeometry(0.12, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
  cap.translate(0, 0.22, 0);
  geos.push(cap);
  // Fuel lines
  for (const side of [-1, 1]) {
    const line = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 4);
    line.translate(side * 0.14, 0, 0);
    geos.push(line);
  }
  return mergeGeometries(geos);
}

function createMechWingBlade(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.8, -0.05);
  shape.lineTo(0.9, 0.15);
  shape.lineTo(0.6, 0.5);
  shape.lineTo(0, 0.35);
  shape.closePath();
  const wing = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  geos.push(wing);
  return mergeGeometries(geos);
}

function createMechBackpack(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main unit
  const main = new THREE.BoxGeometry(0.5, 0.5, 0.25);
  geos.push(main);
  // Side boosters
  for (const side of [-1, 1]) {
    const booster = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
    booster.translate(side * 0.3, -0.05, 0);
    geos.push(booster);
  }
  // Top vent
  const vent = new THREE.BoxGeometry(0.3, 0.06, 0.2);
  vent.translate(0, 0.28, 0);
  geos.push(vent);
  return mergeGeometries(geos);
}

function createMechStabilizer(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Fin
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.08, 0);
  shape.lineTo(0.04, 0.4);
  shape.lineTo(0, 0.35);
  shape.closePath();
  const fin = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  geos.push(fin);
  // Mount
  const mount = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6);
  mount.translate(0.04, 0, 0.01);
  geos.push(mount);
  return mergeGeometries(geos);
}

// ---- Mech Accessories Geometry Factories ----

function createMechVFin(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // V-shaped antenna fins (Gundam style)
  for (const side of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(side * 0.25, 0.35);
    shape.lineTo(side * 0.22, 0.38);
    shape.lineTo(side * 0.03, 0.08);
    shape.lineTo(0, 0.05);
    shape.closePath();
    const fin = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
    fin.translate(0, 0, -0.01);
    geos.push(fin);
  }
  // Center gem
  const gem = new THREE.BoxGeometry(0.06, 0.06, 0.04);
  gem.translate(0, 0.02, 0);
  geos.push(gem);
  return mergeGeometries(geos);
}

function createMechScopeEye(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Rail track
  const rail = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6);
  rail.rotateZ(Math.PI / 2);
  geos.push(rail);
  // Mono-eye sphere
  const eye = new THREE.SphereGeometry(0.06, 8, 8);
  eye.translate(0, 0, 0.02);
  geos.push(eye);
  // Lens ring
  const ring = new THREE.TorusGeometry(0.065, 0.012, 6, 12);
  ring.translate(0, 0, 0.04);
  geos.push(ring);
  // Housing plate
  const housing = new THREE.BoxGeometry(0.2, 0.08, 0.03);
  housing.translate(0, 0, -0.02);
  geos.push(housing);
  return mergeGeometries(geos);
}

function createMechExhaustVent(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Housing
  const housing = new THREE.BoxGeometry(0.25, 0.2, 0.12);
  geos.push(housing);
  // Vent slats (5 horizontal slats)
  for (let i = 0; i < 5; i++) {
    const slat = new THREE.BoxGeometry(0.22, 0.015, 0.14);
    slat.translate(0, -0.07 + i * 0.035, 0);
    geos.push(slat);
  }
  // Side bolts
  for (const side of [-1, 1]) {
    const bolt = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 6);
    bolt.rotateX(Math.PI / 2);
    bolt.translate(side * 0.11, 0, 0.07);
    geos.push(bolt);
  }
  return mergeGeometries(geos);
}

function createMechHipSkirt(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Front skirt plates (angled)
  for (const side of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(side * 0.18, 0);
    shape.lineTo(side * 0.15, -0.22);
    shape.lineTo(side * 0.03, -0.25);
    shape.lineTo(0, -0.2);
    shape.closePath();
    const plate = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
    plate.translate(0, 0, -0.02);
    geos.push(plate);
  }
  // Connection bar
  const bar = new THREE.BoxGeometry(0.36, 0.04, 0.06);
  bar.translate(0, 0.02, 0);
  geos.push(bar);
  return mergeGeometries(geos);
}

function createMechCableBundle(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Multiple cables running parallel with slight curve
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = Math.cos(angle) * 0.03;
    const z = Math.sin(angle) * 0.03;
    const cable = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 4);
    cable.translate(x, 0, z);
    geos.push(cable);
  }
  // Clamp rings
  for (let y = -0.15; y <= 0.15; y += 0.15) {
    const clamp = new THREE.TorusGeometry(0.05, 0.008, 4, 8);
    clamp.rotateX(Math.PI / 2);
    clamp.translate(0, y, 0);
    geos.push(clamp);
  }
  return mergeGeometries(geos);
}

function createMechRadarDish(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Dish (half sphere)
  const dish = new THREE.SphereGeometry(0.18, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  dish.rotateX(Math.PI / 2);
  geos.push(dish);
  // Feed horn (center antenna)
  const feed = new THREE.CylinderGeometry(0.01, 0.025, 0.15, 6);
  feed.rotateX(Math.PI / 2);
  feed.translate(0, 0, 0.1);
  geos.push(feed);
  // Mount arm
  const arm = new THREE.BoxGeometry(0.04, 0.04, 0.12);
  arm.translate(0, -0.12, -0.04);
  geos.push(arm);
  // Swivel base
  const base = new THREE.CylinderGeometry(0.05, 0.06, 0.04, 8);
  base.translate(0, -0.16, -0.04);
  geos.push(base);
  return mergeGeometries(geos);
}

// ---- Mech Heavy Armor Geometry Factories ----

function createMechHeavyChest(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive chest block
  const chest = new THREE.BoxGeometry(1.1, 0.85, 0.65);
  geos.push(chest);
  // Layered front armor plates
  const upperPlate = new THREE.BoxGeometry(0.8, 0.3, 0.12);
  upperPlate.translate(0, 0.15, 0.38);
  geos.push(upperPlate);
  const lowerPlate = new THREE.BoxGeometry(0.7, 0.25, 0.1);
  lowerPlate.translate(0, -0.15, 0.36);
  geos.push(lowerPlate);
  // Intake grills on sides
  for (const side of [-1, 1]) {
    const grill = new THREE.BoxGeometry(0.08, 0.4, 0.35);
    grill.translate(side * 0.55, 0, 0.1);
    geos.push(grill);
    for (let i = 0; i < 4; i++) {
      const slat = new THREE.BoxGeometry(0.1, 0.02, 0.3);
      slat.translate(side * 0.55, -0.12 + i * 0.08, 0.12);
      geos.push(slat);
    }
  }
  // Center reactor window
  const window = new THREE.CylinderGeometry(0.08, 0.08, 0.14, 8);
  window.rotateX(Math.PI / 2);
  window.translate(0, 0.05, 0.42);
  geos.push(window);
  return mergeGeometries(geos);
}

function createMechHeavyShoulder(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Large angular shoulder block
  const main = new THREE.BoxGeometry(0.5, 0.35, 0.45);
  geos.push(main);
  // Top ridge armor (angled upward)
  const shape = new THREE.Shape();
  shape.moveTo(-0.25, 0);
  shape.lineTo(0.25, 0);
  shape.lineTo(0.18, 0.2);
  shape.lineTo(-0.18, 0.2);
  shape.closePath();
  const ridge = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: false });
  ridge.translate(0, 0.17, -0.21);
  geos.push(ridge);
  // Side armor flaps
  const flap = new THREE.BoxGeometry(0.06, 0.3, 0.4);
  flap.translate(0.28, 0.05, 0);
  geos.push(flap);
  // Mounting bolt details
  for (let i = 0; i < 3; i++) {
    const bolt = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6);
    bolt.rotateX(Math.PI / 2);
    bolt.translate(-0.1 + i * 0.1, 0.12, 0.23);
    geos.push(bolt);
  }
  return mergeGeometries(geos);
}

function createMechHeavyLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Thick leg core
  const core = new THREE.BoxGeometry(0.38, 0.6, 0.38);
  geos.push(core);
  // Front layered armor
  const frontPlate = new THREE.BoxGeometry(0.35, 0.5, 0.08);
  frontPlate.translate(0, 0, 0.22);
  geos.push(frontPlate);
  // Side thrusters
  for (const side of [-1, 1]) {
    const thruster = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 6);
    thruster.translate(side * 0.22, -0.15, 0);
    geos.push(thruster);
  }
  // Knee cap armor
  const knee = new THREE.SphereGeometry(0.14, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  knee.rotateX(-Math.PI / 2);
  knee.translate(0, 0.2, 0.2);
  geos.push(knee);
  // Hip connector
  const hip = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
  hip.translate(0, 0.35, 0);
  geos.push(hip);
  return mergeGeometries(geos);
}

function createMechHeavyArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Thick arm core
  const core = new THREE.BoxGeometry(0.3, 0.5, 0.3);
  geos.push(core);
  // Wraparound armor
  const frontArmor = new THREE.BoxGeometry(0.32, 0.35, 0.08);
  frontArmor.translate(0, 0.02, 0.18);
  geos.push(frontArmor);
  const sideArmor = new THREE.BoxGeometry(0.08, 0.35, 0.32);
  sideArmor.translate(0.18, 0.02, 0);
  geos.push(sideArmor);
  // Joint ball
  const joint = new THREE.SphereGeometry(0.1, 8, 8);
  joint.translate(0, 0.3, 0);
  geos.push(joint);
  // Wrist cuff
  const cuff = new THREE.CylinderGeometry(0.14, 0.16, 0.08, 8);
  cuff.translate(0, -0.28, 0);
  geos.push(cuff);
  return mergeGeometries(geos);
}

function createMechTowerShield(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive shield face
  const shape = new THREE.Shape();
  shape.moveTo(-0.3, -0.6);
  shape.lineTo(0.3, -0.6);
  shape.lineTo(0.35, -0.4);
  shape.lineTo(0.35, 0.4);
  shape.lineTo(0.25, 0.6);
  shape.lineTo(-0.25, 0.6);
  shape.lineTo(-0.35, 0.4);
  shape.lineTo(-0.35, -0.4);
  shape.closePath();
  const face = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
  face.translate(0, 0, -0.04);
  geos.push(face);
  // Center ridge
  const ridge = new THREE.BoxGeometry(0.06, 1.0, 0.12);
  ridge.translate(0, 0, 0);
  geos.push(ridge);
  // Cross brace
  const brace = new THREE.BoxGeometry(0.5, 0.04, 0.1);
  brace.translate(0, 0, 0);
  geos.push(brace);
  // Handle bars on back
  const handle1 = new THREE.BoxGeometry(0.04, 0.25, 0.06);
  handle1.translate(0, 0.1, -0.08);
  geos.push(handle1);
  const handle2 = new THREE.BoxGeometry(0.04, 0.25, 0.06);
  handle2.translate(0, -0.15, -0.08);
  geos.push(handle2);
  return mergeGeometries(geos);
}

function createMechStomperFoot(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive sole
  const sole = new THREE.BoxGeometry(0.5, 0.1, 0.6);
  sole.translate(0, -0.05, 0.05);
  geos.push(sole);
  // Toe claws (3 prongs)
  for (let i = -1; i <= 1; i++) {
    const claw = new THREE.BoxGeometry(0.1, 0.08, 0.15);
    claw.translate(i * 0.15, -0.02, 0.35);
    geos.push(claw);
    const tip = new THREE.ConeGeometry(0.04, 0.1, 4);
    tip.rotateX(Math.PI / 2);
    tip.translate(i * 0.15, -0.02, 0.45);
    geos.push(tip);
  }
  // Ankle hydraulic
  const ankle = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 8);
  ankle.translate(0, 0.12, -0.05);
  geos.push(ankle);
  // Heel spike
  const heel = new THREE.ConeGeometry(0.06, 0.15, 6);
  heel.translate(0, -0.02, -0.25);
  geos.push(heel);
  return mergeGeometries(geos);
}

// ---- Mech Flight Systems Geometry Factories ----

function createMechDeltaWing(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Delta wing shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.9, -0.15);
  shape.lineTo(0.85, 0);
  shape.lineTo(0.7, 0.5);
  shape.lineTo(0.15, 0.6);
  shape.lineTo(0, 0.45);
  shape.closePath();
  const wing = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
  geos.push(wing);
  // Leading edge reinforcement
  const edge = new THREE.BoxGeometry(0.95, 0.04, 0.04);
  edge.rotateZ(-0.15);
  edge.translate(0.45, 0.16, 0.015);
  geos.push(edge);
  // Hardpoint pylons
  for (const x of [0.3, 0.55]) {
    const pylon = new THREE.BoxGeometry(0.04, 0.06, 0.08);
    pylon.translate(x, 0.25, -0.02);
    geos.push(pylon);
  }
  return mergeGeometries(geos);
}

function createMechThrusterPack(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main housing
  const housing = new THREE.BoxGeometry(0.6, 0.55, 0.3);
  geos.push(housing);
  // Twin large thrusters
  for (const side of [-1, 1]) {
    const nozzle = new THREE.CylinderGeometry(0.12, 0.09, 0.2, 8);
    nozzle.translate(side * 0.18, -0.35, 0);
    geos.push(nozzle);
    const bell = new THREE.CylinderGeometry(0.15, 0.12, 0.08, 8);
    bell.translate(side * 0.18, -0.44, 0);
    geos.push(bell);
  }
  // Fuel tanks on sides
  for (const side of [-1, 1]) {
    const tank = new THREE.CapsuleGeometry(0.06, 0.3, 4, 8);
    tank.translate(side * 0.35, 0, 0);
    geos.push(tank);
  }
  // Top vent array
  for (let i = -1; i <= 1; i++) {
    const vent = new THREE.BoxGeometry(0.08, 0.04, 0.25);
    vent.translate(i * 0.12, 0.3, 0);
    geos.push(vent);
  }
  return mergeGeometries(geos);
}

function createMechAeroFin(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Swept fin shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.06, 0);
  shape.lineTo(0.03, 0.45);
  shape.lineTo(-0.02, 0.4);
  shape.closePath();
  const fin = new THREE.ExtrudeGeometry(shape, { depth: 0.25, bevelEnabled: false });
  geos.push(fin);
  // Root fairing
  const fairing = new THREE.BoxGeometry(0.1, 0.06, 0.28);
  fairing.translate(0.02, -0.02, 0.125);
  geos.push(fairing);
  return mergeGeometries(geos);
}

function createMechHoverPod(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Pod body (flattened sphere)
  const body = new THREE.SphereGeometry(0.2, 10, 8);
  body.scale(1, 0.4, 1);
  geos.push(body);
  // Hover ring (torus on bottom)
  const ring = new THREE.TorusGeometry(0.18, 0.03, 6, 16);
  ring.translate(0, -0.06, 0);
  geos.push(ring);
  // Inner glow disc
  const disc = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 12);
  disc.translate(0, -0.08, 0);
  geos.push(disc);
  // Mount strut
  const strut = new THREE.BoxGeometry(0.06, 0.15, 0.06);
  strut.translate(0, 0.14, 0);
  geos.push(strut);
  return mergeGeometries(geos);
}

function createMechIntakeNacelle(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Outer nacelle shell
  const shell = new THREE.CylinderGeometry(0.15, 0.12, 0.5, 8);
  shell.rotateX(Math.PI / 2);
  geos.push(shell);
  // Intake lip (front ring)
  const lip = new THREE.TorusGeometry(0.14, 0.025, 6, 12);
  lip.translate(0, 0, 0.25);
  geos.push(lip);
  // Internal fan blades (simplified)
  const fan = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 8);
  fan.rotateX(Math.PI / 2);
  fan.translate(0, 0, 0.2);
  geos.push(fan);
  // Exhaust cone
  const exhaust = new THREE.ConeGeometry(0.1, 0.12, 8);
  exhaust.rotateX(-Math.PI / 2);
  exhaust.translate(0, 0, -0.3);
  geos.push(exhaust);
  // Mounting pylon
  const pylon = new THREE.BoxGeometry(0.04, 0.12, 0.3);
  pylon.translate(0, 0.18, 0);
  geos.push(pylon);
  return mergeGeometries(geos);
}

function createMechTailRudder(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Vertical fin
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.15, 0);
  shape.lineTo(0.08, 0.4);
  shape.lineTo(-0.02, 0.35);
  shape.closePath();
  const fin = new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false });
  geos.push(fin);
  // Horizontal stabilizers
  for (const side of [-1, 1]) {
    const stab = new THREE.BoxGeometry(0.25, 0.02, 0.1);
    stab.translate(side * 0.12 + 0.06, 0.05, 0.012);
    geos.push(stab);
  }
  // Hinge mount
  const hinge = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 6);
  hinge.translate(0.06, -0.02, 0.012);
  geos.push(hinge);
  return mergeGeometries(geos);
}

// ---- Stealth Frame Geometry Factories ----

function createStealthHead(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Angular faceted head shell - diamond cross-section
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.15);
  shape.lineTo(0.25, 0);
  shape.lineTo(0, -0.1);
  shape.lineTo(-0.25, 0);
  shape.closePath();
  const headGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false });
  headGeo.translate(0, 0, -0.25);
  geos.push(headGeo);
  // Narrow visor slit
  const visor = new THREE.BoxGeometry(0.44, 0.03, 0.06);
  visor.translate(0, 0.02, 0.26);
  geos.push(visor);
  // Swept-back side fins
  for (const side of [-1, 1]) {
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.18, 0.04);
    finShape.lineTo(0.22, -0.02);
    finShape.lineTo(0.05, -0.04);
    finShape.closePath();
    const fin = new THREE.ExtrudeGeometry(finShape, { depth: 0.02, bevelEnabled: false });
    fin.translate(side * 0.2, 0.06, -0.2);
    if (side === -1) fin.scale(-1, 1, 1);
    geos.push(fin);
  }
  // Top ridge
  const ridge = new THREE.BoxGeometry(0.04, 0.06, 0.35);
  ridge.translate(0, 0.16, -0.05);
  geos.push(ridge);
  return mergeGeometries(geos);
}

function createStealthTorso(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main angular torso - trapezoidal cross-section
  const torsoShape = new THREE.Shape();
  torsoShape.moveTo(-0.35, -0.3);
  torsoShape.lineTo(-0.4, 0.1);
  torsoShape.lineTo(-0.2, 0.35);
  torsoShape.lineTo(0.2, 0.35);
  torsoShape.lineTo(0.4, 0.1);
  torsoShape.lineTo(0.35, -0.3);
  torsoShape.closePath();
  const torso = new THREE.ExtrudeGeometry(torsoShape, { depth: 0.35, bevelEnabled: false });
  torso.translate(0, 0, -0.175);
  geos.push(torso);
  // Angled chest panels
  for (const side of [-1, 1]) {
    const panel = new THREE.BoxGeometry(0.18, 0.25, 0.06);
    panel.rotateY(side * 0.3);
    panel.translate(side * 0.25, 0.05, 0.2);
    geos.push(panel);
  }
  // Central seam ridge
  const seam = new THREE.BoxGeometry(0.03, 0.5, 0.04);
  seam.translate(0, 0.02, 0.18);
  geos.push(seam);
  // Dorsal spine
  const spine = new THREE.BoxGeometry(0.06, 0.08, 0.3);
  spine.translate(0, 0.38, 0);
  geos.push(spine);
  return mergeGeometries(geos);
}

function createStealthArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Upper arm - slim hexagonal profile
  const upper = new THREE.CylinderGeometry(0.1, 0.08, 0.35, 6);
  upper.translate(0, 0.15, 0);
  geos.push(upper);
  // Elbow joint
  const elbow = new THREE.SphereGeometry(0.08, 6, 6);
  elbow.translate(0, -0.02, 0);
  geos.push(elbow);
  // Forearm - angular blade-like
  const foreShape = new THREE.Shape();
  foreShape.moveTo(0, 0);
  foreShape.lineTo(0.08, -0.15);
  foreShape.lineTo(0.06, -0.35);
  foreShape.lineTo(-0.06, -0.35);
  foreShape.lineTo(-0.08, -0.15);
  foreShape.closePath();
  const forearm = new THREE.ExtrudeGeometry(foreShape, { depth: 0.12, bevelEnabled: false });
  forearm.translate(0, -0.05, -0.06);
  geos.push(forearm);
  // Wrist blade fin
  const bladeFin = new THREE.BoxGeometry(0.02, 0.12, 0.08);
  bladeFin.rotateZ(0.3);
  bladeFin.translate(0.09, -0.3, 0);
  geos.push(bladeFin);
  return mergeGeometries(geos);
}

function createStealthLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Thigh - narrow angular
  const thigh = new THREE.BoxGeometry(0.14, 0.35, 0.14);
  thigh.translate(0, 0.15, 0);
  geos.push(thigh);
  // Knee cap - faceted
  const knee = new THREE.ConeGeometry(0.09, 0.1, 4);
  knee.rotateX(Math.PI / 2);
  knee.translate(0, -0.02, 0.08);
  geos.push(knee);
  // Shin - tapered blade shape
  const shinShape = new THREE.Shape();
  shinShape.moveTo(-0.07, 0);
  shinShape.lineTo(-0.05, -0.4);
  shinShape.lineTo(0.05, -0.4);
  shinShape.lineTo(0.07, 0);
  shinShape.closePath();
  const shin = new THREE.ExtrudeGeometry(shinShape, { depth: 0.1, bevelEnabled: false });
  shin.translate(0, -0.05, -0.05);
  geos.push(shin);
  // Ankle spike
  const spike = new THREE.ConeGeometry(0.03, 0.08, 4);
  spike.translate(0, -0.45, 0.08);
  geos.push(spike);
  // Foot wedge
  const foot = new THREE.BoxGeometry(0.1, 0.04, 0.18);
  foot.translate(0, -0.47, 0.04);
  geos.push(foot);
  return mergeGeometries(geos);
}

function createStealthWing(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main swept wing surface
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(0.6, -0.1);
  wingShape.lineTo(0.7, -0.15);
  wingShape.lineTo(0.5, -0.18);
  wingShape.lineTo(0, -0.06);
  wingShape.closePath();
  const wing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.015, bevelEnabled: false });
  geos.push(wing);
  // Leading edge blade
  const edge = new THREE.BoxGeometry(0.65, 0.02, 0.03);
  edge.rotateZ(-0.15);
  edge.translate(0.32, -0.04, 0.01);
  geos.push(edge);
  // Wing root mount
  const mount = new THREE.BoxGeometry(0.08, 0.1, 0.06);
  mount.translate(0, -0.03, 0.01);
  geos.push(mount);
  // Trailing edge serrations
  for (let i = 0; i < 4; i++) {
    const tooth = new THREE.ConeGeometry(0.015, 0.05, 3);
    tooth.rotateX(Math.PI / 2);
    tooth.translate(0.12 + i * 0.1, -0.16 - i * 0.005, 0);
    geos.push(tooth);
  }
  return mergeGeometries(geos);
}

function createStealthPlasmaBlade(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Hilt
  const hilt = new THREE.CylinderGeometry(0.03, 0.035, 0.18, 6);
  geos.push(hilt);
  // Guard - angular
  const guard = new THREE.BoxGeometry(0.12, 0.02, 0.04);
  guard.translate(0, 0.1, 0);
  geos.push(guard);
  // Plasma blade - thin elongated diamond
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.025, 0.25);
  bladeShape.lineTo(0, 0.55);
  bladeShape.lineTo(-0.025, 0.25);
  bladeShape.closePath();
  const blade = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.01, bevelEnabled: false });
  blade.translate(0, 0.12, -0.005);
  geos.push(blade);
  // Energy core in hilt
  const core = new THREE.SphereGeometry(0.025, 6, 6);
  core.translate(0, 0, 0);
  geos.push(core);
  // Pommel
  const pommel = new THREE.ConeGeometry(0.03, 0.05, 6);
  pommel.rotateX(Math.PI);
  pommel.translate(0, -0.115, 0);
  geos.push(pommel);
  return mergeGeometries(geos);
}

// ---- Knight Frame Geometry Factories ----

function createKnightHelm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Rounded dome top
  const dome = new THREE.SphereGeometry(0.25, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.translate(0, 0.05, 0);
  geos.push(dome);
  // Face plate / visor
  const facePlate = new THREE.BoxGeometry(0.38, 0.25, 0.08);
  facePlate.translate(0, -0.08, 0.2);
  geos.push(facePlate);
  // Visor slit
  const visorSlit = new THREE.BoxGeometry(0.32, 0.04, 0.04);
  visorSlit.translate(0, -0.02, 0.26);
  geos.push(visorSlit);
  // Chin guard
  const chin = new THREE.BoxGeometry(0.2, 0.1, 0.15);
  chin.translate(0, -0.2, 0.12);
  geos.push(chin);
  // Plume crest on top
  const plumeShape = new THREE.Shape();
  plumeShape.moveTo(0, 0);
  plumeShape.lineTo(0.02, 0.25);
  plumeShape.lineTo(0, 0.3);
  plumeShape.lineTo(-0.02, 0.25);
  plumeShape.closePath();
  const plume = new THREE.ExtrudeGeometry(plumeShape, { depth: 0.22, bevelEnabled: false });
  plume.translate(0, 0.22, -0.11);
  geos.push(plume);
  // Cheek guards
  for (const side of [-1, 1]) {
    const cheek = new THREE.BoxGeometry(0.06, 0.2, 0.18);
    cheek.translate(side * 0.24, -0.08, 0.06);
    geos.push(cheek);
  }
  return mergeGeometries(geos);
}

function createKnightBreastplate(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main torso - barrel-like
  const torso = new THREE.CylinderGeometry(0.35, 0.3, 0.7, 8);
  torso.scale(1, 1, 0.7);
  geos.push(torso);
  // Raised chest plate with cross emblem ridge
  const chestPlate = new THREE.BoxGeometry(0.5, 0.4, 0.1);
  chestPlate.translate(0, 0.08, 0.22);
  geos.push(chestPlate);
  // Cross emblem vertical
  const crossV = new THREE.BoxGeometry(0.04, 0.2, 0.04);
  crossV.translate(0, 0.08, 0.28);
  geos.push(crossV);
  // Cross emblem horizontal
  const crossH = new THREE.BoxGeometry(0.14, 0.04, 0.04);
  crossH.translate(0, 0.12, 0.28);
  geos.push(crossH);
  // Gorget (neck guard)
  const gorget = new THREE.TorusGeometry(0.18, 0.04, 6, 12, Math.PI);
  gorget.rotateX(Math.PI / 2);
  gorget.translate(0, 0.35, 0.05);
  geos.push(gorget);
  // Waist fauld (layered skirt armor)
  for (let i = 0; i < 3; i++) {
    const fauld = new THREE.BoxGeometry(0.55 - i * 0.05, 0.06, 0.32 - i * 0.02);
    fauld.translate(0, -0.38 - i * 0.06, 0.04);
    geos.push(fauld);
  }
  return mergeGeometries(geos);
}

function createKnightGauntlet(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Upper arm tube with flared elbow
  const upper = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
  upper.translate(0, 0.15, 0);
  geos.push(upper);
  // Elbow cop (pointed)
  const elbowCop = new THREE.ConeGeometry(0.1, 0.12, 6);
  elbowCop.rotateX(-Math.PI / 2);
  elbowCop.translate(0, 0, -0.06);
  geos.push(elbowCop);
  // Forearm plate
  const forearm = new THREE.CylinderGeometry(0.09, 0.07, 0.3, 8);
  forearm.translate(0, -0.18, 0);
  geos.push(forearm);
  // Flared cuff
  const cuff = new THREE.CylinderGeometry(0.11, 0.09, 0.06, 8);
  cuff.translate(0, -0.03, 0);
  geos.push(cuff);
  // Knuckle guard
  const knuckle = new THREE.BoxGeometry(0.14, 0.05, 0.08);
  knuckle.translate(0, -0.35, 0.04);
  geos.push(knuckle);
  // Finger plates
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.BoxGeometry(0.025, 0.08, 0.04);
    finger.translate(-0.04 + i * 0.027, -0.4, 0.04);
    geos.push(finger);
  }
  return mergeGeometries(geos);
}

function createKnightGreave(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Thigh (cuisse)
  const thigh = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 8);
  thigh.translate(0, 0.2, 0);
  geos.push(thigh);
  // Knee cop (poleyn) - pointed
  const poleyn = new THREE.ConeGeometry(0.1, 0.12, 6);
  poleyn.rotateX(Math.PI / 2);
  poleyn.translate(0, 0.02, 0.08);
  geos.push(poleyn);
  // Shin (greave proper) - flared
  const shin = new THREE.CylinderGeometry(0.1, 0.12, 0.35, 8);
  shin.translate(0, -0.2, 0);
  geos.push(shin);
  // Sabaton (foot armor)
  const sabatonShape = new THREE.Shape();
  sabatonShape.moveTo(-0.08, 0);
  sabatonShape.lineTo(0.08, 0);
  sabatonShape.lineTo(0.06, 0.2);
  sabatonShape.lineTo(0, 0.25);
  sabatonShape.lineTo(-0.06, 0.2);
  sabatonShape.closePath();
  const sabaton = new THREE.ExtrudeGeometry(sabatonShape, { depth: 0.06, bevelEnabled: false });
  sabaton.rotateX(-Math.PI / 2);
  sabaton.translate(0, -0.4, 0.06);
  geos.push(sabaton);
  return mergeGeometries(geos);
}

function createKnightHeaterShield(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Classic heater shield shape
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, 0.35);
  shieldShape.lineTo(0.25, 0.3);
  shieldShape.lineTo(0.28, 0.1);
  shieldShape.lineTo(0.15, -0.25);
  shieldShape.lineTo(0, -0.35);
  shieldShape.lineTo(-0.15, -0.25);
  shieldShape.lineTo(-0.28, 0.1);
  shieldShape.lineTo(-0.25, 0.3);
  shieldShape.closePath();
  const shield = new THREE.ExtrudeGeometry(shieldShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1 });
  geos.push(shield);
  // Central boss
  const boss = new THREE.SphereGeometry(0.06, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  boss.rotateX(-Math.PI / 2);
  boss.translate(0, 0.05, 0.05);
  geos.push(boss);
  // Cross emblem vertical
  const cv = new THREE.BoxGeometry(0.03, 0.35, 0.02);
  cv.translate(0, 0.02, 0.05);
  geos.push(cv);
  // Cross emblem horizontal
  const ch = new THREE.BoxGeometry(0.2, 0.03, 0.02);
  ch.translate(0, 0.12, 0.05);
  geos.push(ch);
  // Arm strap (back)
  const strap = new THREE.TorusGeometry(0.06, 0.015, 4, 8, Math.PI);
  strap.translate(0, 0.05, -0.02);
  geos.push(strap);
  return mergeGeometries(geos);
}

function createKnightEnergyLance(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Shaft
  const shaft = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6);
  geos.push(shaft);
  // Lance head - elongated cone
  const head = new THREE.ConeGeometry(0.06, 0.35, 6);
  head.translate(0, 0.65, 0);
  geos.push(head);
  // Vamplate (hand guard disc)
  const vamplate = new THREE.CylinderGeometry(0.1, 0.08, 0.03, 8);
  vamplate.translate(0, 0.05, 0);
  geos.push(vamplate);
  // Energy coils along shaft
  for (let i = 0; i < 3; i++) {
    const coil = new THREE.TorusGeometry(0.035, 0.008, 4, 8);
    coil.translate(0, 0.2 + i * 0.12, 0);
    geos.push(coil);
  }
  // Butt cap
  const cap = new THREE.SphereGeometry(0.03, 6, 6);
  cap.translate(0, -0.52, 0);
  geos.push(cap);
  return mergeGeometries(geos);
}

function createKnightArmorCape(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Cape is a curved extruded shape hanging from shoulders
  const capeShape = new THREE.Shape();
  capeShape.moveTo(-0.3, 0.3);
  capeShape.lineTo(0.3, 0.3);
  capeShape.lineTo(0.35, -0.1);
  capeShape.lineTo(0.25, -0.45);
  capeShape.lineTo(0.1, -0.55);
  capeShape.lineTo(-0.1, -0.55);
  capeShape.lineTo(-0.25, -0.45);
  capeShape.lineTo(-0.35, -0.1);
  capeShape.closePath();
  const cape = new THREE.ExtrudeGeometry(capeShape, { depth: 0.02, bevelEnabled: false });
  cape.translate(0, 0, -0.18);
  geos.push(cape);
  // Shoulder clasps
  for (const side of [-1, 1]) {
    const clasp = new THREE.SphereGeometry(0.04, 6, 6);
    clasp.translate(side * 0.25, 0.3, -0.15);
    geos.push(clasp);
  }
  // Center chain link between clasps
  const chain = new THREE.TorusGeometry(0.03, 0.008, 4, 6);
  chain.rotateX(Math.PI / 2);
  chain.translate(0, 0.32, -0.15);
  geos.push(chain);
  return mergeGeometries(geos);
}

// ---- Beast Frame Geometry Factories ----

function createBeastSkull(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Elongated cranium
  const cranium = new THREE.SphereGeometry(0.2, 8, 8);
  cranium.scale(1, 0.8, 1.4);
  geos.push(cranium);
  // Snout - elongated box tapering forward
  const snoutShape = new THREE.Shape();
  snoutShape.moveTo(-0.12, -0.08);
  snoutShape.lineTo(0.12, -0.08);
  snoutShape.lineTo(0.06, 0.06);
  snoutShape.lineTo(-0.06, 0.06);
  snoutShape.closePath();
  const snout = new THREE.ExtrudeGeometry(snoutShape, { depth: 0.25, bevelEnabled: false });
  snout.translate(0, -0.06, 0.22);
  geos.push(snout);
  // Eye sockets
  for (const side of [-1, 1]) {
    const eye = new THREE.SphereGeometry(0.05, 6, 6);
    eye.translate(side * 0.12, 0.04, 0.18);
    geos.push(eye);
  }
  // Horns swept back
  for (const side of [-1, 1]) {
    const horn = new THREE.ConeGeometry(0.04, 0.25, 5);
    horn.rotateZ(side * 0.6);
    horn.rotateX(-0.4);
    horn.translate(side * 0.16, 0.15, -0.08);
    geos.push(horn);
  }
  // Jaw ridge
  const jawRidge = new THREE.BoxGeometry(0.18, 0.03, 0.15);
  jawRidge.translate(0, -0.14, 0.2);
  geos.push(jawRidge);
  return mergeGeometries(geos);
}

function createBeastSpine(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Long horizontal body - capsule-like
  const body = new THREE.CapsuleGeometry(0.2, 0.5, 6, 10);
  body.rotateZ(Math.PI / 2);
  geos.push(body);
  // Spinal ridge plates
  for (let i = 0; i < 5; i++) {
    const plate = new THREE.BoxGeometry(0.04, 0.08 + (2 - Math.abs(i - 2)) * 0.03, 0.06);
    plate.translate(-0.2 + i * 0.1, 0.22, 0);
    geos.push(plate);
  }
  // Rib-like side armor
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const rib = new THREE.BoxGeometry(0.12, 0.04, 0.12);
      rib.rotateZ(side * 0.2);
      rib.translate(side * 0.18, 0.05 - i * 0.08, -0.1 + i * 0.08);
      geos.push(rib);
    }
  }
  return mergeGeometries(geos);
}

function createBeastForeleg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Shoulder joint ball
  const shoulder = new THREE.SphereGeometry(0.1, 8, 8);
  shoulder.translate(0, 0.25, 0);
  geos.push(shoulder);
  // Upper leg - thick
  const upper = new THREE.CylinderGeometry(0.09, 0.07, 0.25, 8);
  upper.translate(0, 0.1, 0);
  geos.push(upper);
  // Knee joint
  const knee = new THREE.SphereGeometry(0.07, 6, 6);
  knee.translate(0, -0.02, 0);
  geos.push(knee);
  // Lower leg - digitigrade angle
  const lower = new THREE.CylinderGeometry(0.07, 0.05, 0.3, 8);
  lower.rotateX(0.3);
  lower.translate(0, -0.18, 0.05);
  geos.push(lower);
  // Paw pad
  const paw = new THREE.BoxGeometry(0.12, 0.04, 0.14);
  paw.translate(0, -0.34, 0.1);
  geos.push(paw);
  // Claws
  for (let i = 0; i < 3; i++) {
    const claw = new THREE.ConeGeometry(0.015, 0.06, 4);
    claw.rotateX(Math.PI / 2);
    claw.translate(-0.03 + i * 0.03, -0.35, 0.2);
    geos.push(claw);
  }
  return mergeGeometries(geos);
}

function createBeastHindleg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Hip socket
  const hip = new THREE.SphereGeometry(0.11, 8, 8);
  hip.translate(0, 0.3, 0);
  geos.push(hip);
  // Upper thigh - powerful
  const thigh = new THREE.CylinderGeometry(0.1, 0.08, 0.3, 8);
  thigh.translate(0, 0.12, 0);
  geos.push(thigh);
  // Reversed knee (hock)
  const hock = new THREE.SphereGeometry(0.07, 6, 6);
  hock.translate(0, -0.04, 0);
  geos.push(hock);
  // Lower leg angled back (digitigrade)
  const lower = new THREE.CylinderGeometry(0.06, 0.04, 0.35, 8);
  lower.rotateX(-0.4);
  lower.translate(0, -0.24, -0.07);
  geos.push(lower);
  // Hoof/pad
  const hoof = new THREE.CylinderGeometry(0.06, 0.07, 0.04, 6);
  hoof.translate(0, -0.42, -0.15);
  geos.push(hoof);
  return mergeGeometries(geos);
}

function createBeastTail(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Segmented tail with decreasing size
  for (let i = 0; i < 6; i++) {
    const seg = new THREE.CylinderGeometry(0.06 - i * 0.008, 0.06 - (i + 1) * 0.008, 0.1, 6);
    seg.rotateX(Math.PI / 2);
    seg.rotateX(i * 0.15);
    seg.translate(0, 0.05 * Math.sin(i * 0.15), -0.05 - i * 0.1);
    geos.push(seg);
  }
  // Tail tip blade
  const tipShape = new THREE.Shape();
  tipShape.moveTo(0, 0);
  tipShape.lineTo(0.04, -0.06);
  tipShape.lineTo(0, -0.15);
  tipShape.lineTo(-0.04, -0.06);
  tipShape.closePath();
  const tip = new THREE.ExtrudeGeometry(tipShape, { depth: 0.01, bevelEnabled: false });
  tip.rotateX(Math.PI / 2);
  tip.translate(0, 0.04, -0.65);
  geos.push(tip);
  return mergeGeometries(geos);
}

function createBeastJaw(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Lower jaw - U-shaped
  const jawShape = new THREE.Shape();
  jawShape.moveTo(-0.12, 0);
  jawShape.lineTo(-0.1, 0.18);
  jawShape.lineTo(-0.04, 0.22);
  jawShape.lineTo(0.04, 0.22);
  jawShape.lineTo(0.1, 0.18);
  jawShape.lineTo(0.12, 0);
  jawShape.lineTo(0.08, -0.02);
  jawShape.lineTo(-0.08, -0.02);
  jawShape.closePath();
  const jaw = new THREE.ExtrudeGeometry(jawShape, { depth: 0.04, bevelEnabled: false });
  jaw.rotateX(-Math.PI / 2);
  jaw.translate(0, 0, 0.02);
  geos.push(jaw);
  // Teeth - row of cones
  for (let i = 0; i < 5; i++) {
    const tooth = new THREE.ConeGeometry(0.015, 0.05, 4);
    tooth.translate(-0.06 + i * 0.03, 0.04, 0.18 + Math.abs(i - 2) * 0.01);
    geos.push(tooth);
  }
  // Jaw hinge joints
  for (const side of [-1, 1]) {
    const hinge = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 6);
    hinge.rotateZ(Math.PI / 2);
    hinge.translate(side * 0.13, 0.02, 0);
    geos.push(hinge);
  }
  return mergeGeometries(geos);
}

function createBeastClaw(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Paw base
  const pad = new THREE.BoxGeometry(0.16, 0.04, 0.12);
  geos.push(pad);
  // Toe pads
  for (let i = 0; i < 4; i++) {
    const toe = new THREE.SphereGeometry(0.025, 6, 6);
    toe.translate(-0.045 + i * 0.03, 0.01, 0.07);
    geos.push(toe);
  }
  // Retractable claws
  for (let i = 0; i < 4; i++) {
    const claw = new THREE.ConeGeometry(0.012, 0.08, 4);
    claw.rotateX(0.5);
    claw.translate(-0.045 + i * 0.03, 0.01, 0.12);
    geos.push(claw);
  }
  // Ankle joint
  const ankle = new THREE.CylinderGeometry(0.04, 0.05, 0.06, 6);
  ankle.translate(0, 0.04, -0.04);
  geos.push(ankle);
  // Dewclaw
  const dewclaw = new THREE.ConeGeometry(0.01, 0.04, 4);
  dewclaw.rotateX(-0.3);
  dewclaw.translate(0.07, 0.02, -0.02);
  geos.push(dewclaw);
  return mergeGeometries(geos);
}

// ---- Tank Frame Geometry Factories ----

function createTankTurretHead(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Flat turret base
  const base = new THREE.CylinderGeometry(0.3, 0.32, 0.15, 8);
  geos.push(base);
  // Turret dome
  const dome = new THREE.SphereGeometry(0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.translate(0, 0.07, 0);
  geos.push(dome);
  // Barrel stub from turret
  const barrel = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.04, 0.3);
  geos.push(barrel);
  // Hatch
  const hatch = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 6);
  hatch.translate(0.1, 0.18, -0.05);
  geos.push(hatch);
  // Periscope
  const periscope = new THREE.BoxGeometry(0.04, 0.08, 0.04);
  periscope.translate(-0.1, 0.2, 0.05);
  geos.push(periscope);
  // Side armor plates
  for (const side of [-1, 1]) {
    const sideArmor = new THREE.BoxGeometry(0.06, 0.12, 0.25);
    sideArmor.translate(side * 0.3, 0, 0);
    geos.push(sideArmor);
  }
  return mergeGeometries(geos);
}

function createTankHull(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main hull - big blocky
  const hull = new THREE.BoxGeometry(0.9, 0.5, 0.7);
  geos.push(hull);
  // Upper glacis plate (angled front)
  const glacisShape = new THREE.Shape();
  glacisShape.moveTo(-0.45, 0);
  glacisShape.lineTo(0.45, 0);
  glacisShape.lineTo(0.35, 0.2);
  glacisShape.lineTo(-0.35, 0.2);
  glacisShape.closePath();
  const glacis = new THREE.ExtrudeGeometry(glacisShape, { depth: 0.08, bevelEnabled: false });
  glacis.rotateX(-0.6);
  glacis.translate(0, 0.15, 0.32);
  geos.push(glacis);
  // Engine deck on back
  const engineDeck = new THREE.BoxGeometry(0.7, 0.12, 0.25);
  engineDeck.translate(0, 0.3, -0.2);
  geos.push(engineDeck);
  // Exhaust pipes
  for (const side of [-1, 1]) {
    const exhaust = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6);
    exhaust.rotateX(Math.PI / 2);
    exhaust.translate(side * 0.25, 0.32, -0.38);
    geos.push(exhaust);
  }
  // Tool box on side
  const toolbox = new THREE.BoxGeometry(0.25, 0.1, 0.12);
  toolbox.translate(0.3, 0.3, 0.1);
  geos.push(toolbox);
  return mergeGeometries(geos);
}

function createTankSiegeArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive upper arm housing
  const upper = new THREE.BoxGeometry(0.2, 0.35, 0.18);
  upper.translate(0, 0.1, 0);
  geos.push(upper);
  // Hydraulic piston
  const piston = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6);
  piston.translate(0.08, -0.05, 0.06);
  geos.push(piston);
  // Forearm - heavy rectangular
  const forearm = new THREE.BoxGeometry(0.18, 0.3, 0.16);
  forearm.translate(0, -0.2, 0);
  geos.push(forearm);
  // Wrist rotation ring
  const wrist = new THREE.TorusGeometry(0.08, 0.02, 6, 8);
  wrist.translate(0, -0.36, 0);
  geos.push(wrist);
  // Reinforced knuckle plate
  const knuckle = new THREE.BoxGeometry(0.2, 0.06, 0.12);
  knuckle.translate(0, -0.4, 0.04);
  geos.push(knuckle);
  return mergeGeometries(geos);
}

function createTankTreadLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main tread housing
  const housing = new THREE.BoxGeometry(0.15, 0.6, 0.35);
  geos.push(housing);
  // Track surface (outer) - series of tread blocks
  for (let i = 0; i < 8; i++) {
    const tread = new THREE.BoxGeometry(0.17, 0.03, 0.04);
    tread.translate(0, -0.27 + i * 0.075, 0.18);
    geos.push(tread);
  }
  // Drive sprocket (top)
  const sprocketTop = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 8);
  sprocketTop.rotateZ(Math.PI / 2);
  sprocketTop.translate(0, 0.25, 0);
  geos.push(sprocketTop);
  // Idler wheel (bottom)
  const idler = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 8);
  idler.rotateZ(Math.PI / 2);
  idler.translate(0, -0.25, 0);
  geos.push(idler);
  // Road wheels
  for (let i = 0; i < 3; i++) {
    const wheel = new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8);
    wheel.rotateZ(Math.PI / 2);
    wheel.translate(0, -0.12 + i * 0.12, 0.04);
    geos.push(wheel);
  }
  return mergeGeometries(geos);
}

function createTankSiegeCannon(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Cannon breech block
  const breech = new THREE.BoxGeometry(0.2, 0.2, 0.18);
  geos.push(breech);
  // Main barrel
  const barrel = new THREE.CylinderGeometry(0.06, 0.07, 0.8, 10);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.02, 0.5);
  geos.push(barrel);
  // Muzzle brake
  const muzzle = new THREE.CylinderGeometry(0.09, 0.07, 0.08, 10);
  muzzle.rotateX(Math.PI / 2);
  muzzle.translate(0, 0.02, 0.94);
  geos.push(muzzle);
  // Recoil cylinder on top
  const recoil = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 6);
  recoil.rotateX(Math.PI / 2);
  recoil.translate(0, 0.1, 0.25);
  geos.push(recoil);
  // Mounting bracket
  const bracket = new THREE.BoxGeometry(0.24, 0.08, 0.08);
  bracket.translate(0, -0.1, -0.04);
  geos.push(bracket);
  // Ammo feed box
  const ammo = new THREE.BoxGeometry(0.12, 0.12, 0.1);
  ammo.translate(0, -0.05, -0.12);
  geos.push(ammo);
  return mergeGeometries(geos);
}

function createTankSideSkirt(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main skirt plate
  const plate = new THREE.BoxGeometry(0.6, 0.35, 0.03);
  geos.push(plate);
  // Mounting brackets
  for (let i = 0; i < 3; i++) {
    const bracket = new THREE.BoxGeometry(0.04, 0.08, 0.05);
    bracket.translate(-0.2 + i * 0.2, 0.18, -0.02);
    geos.push(bracket);
  }
  // Reactive armor blocks
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const block = new THREE.BoxGeometry(0.12, 0.12, 0.04);
      block.translate(-0.2 + i * 0.14, 0.06 - j * 0.14, 0.03);
      geos.push(block);
    }
  }
  return mergeGeometries(geos);
}

// ---- Gundam Frame Geometry Factories ----

function createGundamHead(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Angular head unit
  const head = new THREE.BoxGeometry(0.4, 0.35, 0.35);
  geos.push(head);
  // V-Fin (iconic)
  for (const side of [-1, 1]) {
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.18, 0.2);
    finShape.lineTo(0.2, 0.18);
    finShape.lineTo(0.04, -0.02);
    finShape.closePath();
    const fin = new THREE.ExtrudeGeometry(finShape, { depth: 0.015, bevelEnabled: false });
    fin.translate(side * 0.05, 0.17, 0.1);
    if (side === -1) fin.scale(-1, 1, 1);
    geos.push(fin);
  }
  // Dual eye visor
  const visor = new THREE.BoxGeometry(0.36, 0.05, 0.06);
  visor.translate(0, 0.03, 0.19);
  geos.push(visor);
  // Chin vent
  const chinVent = new THREE.BoxGeometry(0.15, 0.06, 0.08);
  chinVent.translate(0, -0.14, 0.16);
  geos.push(chinVent);
  // Forehead gem/sensor
  const gem = new THREE.SphereGeometry(0.03, 6, 6);
  gem.translate(0, 0.13, 0.18);
  geos.push(gem);
  // Side vulcan pods
  for (const side of [-1, 1]) {
    const vulcan = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 6);
    vulcan.rotateX(Math.PI / 2);
    vulcan.translate(side * 0.18, 0.1, 0.16);
    geos.push(vulcan);
  }
  return mergeGeometries(geos);
}

function createGundamCoreChest(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main chest block
  const chest = new THREE.BoxGeometry(0.8, 0.6, 0.4);
  geos.push(chest);
  // Central vent / cockpit hatch
  const hatchShape = new THREE.Shape();
  hatchShape.moveTo(-0.12, -0.1);
  hatchShape.lineTo(0.12, -0.1);
  hatchShape.lineTo(0.08, 0.1);
  hatchShape.lineTo(-0.08, 0.1);
  hatchShape.closePath();
  const hatch = new THREE.ExtrudeGeometry(hatchShape, { depth: 0.08, bevelEnabled: false });
  hatch.translate(0, -0.05, 0.2);
  geos.push(hatch);
  // Side vents (iconic Gundam chest vents)
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const vent = new THREE.BoxGeometry(0.12, 0.025, 0.06);
      vent.translate(side * 0.28, 0.08 - i * 0.04, 0.22);
      geos.push(vent);
    }
  }
  // Collar raised section
  const collar = new THREE.BoxGeometry(0.5, 0.08, 0.3);
  collar.translate(0, 0.32, 0);
  geos.push(collar);
  // Abdominal section
  const abs = new THREE.BoxGeometry(0.35, 0.15, 0.28);
  abs.translate(0, -0.35, 0);
  geos.push(abs);
  return mergeGeometries(geos);
}

function createGundamShoulder(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main shoulder block - angular
  const main = new THREE.BoxGeometry(0.3, 0.25, 0.28);
  geos.push(main);
  // Raised top plate
  const topPlate = new THREE.BoxGeometry(0.32, 0.04, 0.3);
  topPlate.translate(0, 0.14, 0);
  geos.push(topPlate);
  // Side thruster vent
  const ventShape = new THREE.Shape();
  ventShape.moveTo(0, -0.08);
  ventShape.lineTo(0.06, -0.08);
  ventShape.lineTo(0.08, 0.08);
  ventShape.lineTo(0, 0.08);
  ventShape.closePath();
  const vent = new THREE.ExtrudeGeometry(ventShape, { depth: 0.18, bevelEnabled: false });
  vent.translate(0.12, -0.02, -0.09);
  geos.push(vent);
  // Front armor edge
  const frontEdge = new THREE.BoxGeometry(0.28, 0.2, 0.03);
  frontEdge.translate(0, 0, 0.15);
  geos.push(frontEdge);
  return mergeGeometries(geos);
}

function createGundamArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Upper arm
  const upper = new THREE.BoxGeometry(0.14, 0.3, 0.14);
  upper.translate(0, 0.12, 0);
  geos.push(upper);
  // Elbow joint
  const elbow = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8);
  elbow.rotateZ(Math.PI / 2);
  elbow.translate(0, -0.04, 0);
  geos.push(elbow);
  // Forearm - slightly larger
  const forearm = new THREE.BoxGeometry(0.15, 0.28, 0.15);
  forearm.translate(0, -0.2, 0);
  geos.push(forearm);
  // Wrist guard
  const wristGuard = new THREE.BoxGeometry(0.17, 0.06, 0.1);
  wristGuard.translate(0, -0.35, 0.03);
  geos.push(wristGuard);
  // Hand block
  const hand = new THREE.BoxGeometry(0.1, 0.1, 0.08);
  hand.translate(0, -0.4, 0);
  geos.push(hand);
  return mergeGeometries(geos);
}

function createGundamLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Thigh
  const thigh = new THREE.BoxGeometry(0.18, 0.32, 0.18);
  thigh.translate(0, 0.2, 0);
  geos.push(thigh);
  // Knee cap
  const kneeCap = new THREE.BoxGeometry(0.16, 0.08, 0.1);
  kneeCap.translate(0, 0.02, 0.1);
  geos.push(kneeCap);
  // Shin - tapered
  const shin = new THREE.BoxGeometry(0.17, 0.35, 0.2);
  shin.translate(0, -0.2, 0);
  geos.push(shin);
  // Ankle guard
  const ankleGuard = new THREE.BoxGeometry(0.2, 0.06, 0.14);
  ankleGuard.translate(0, -0.38, 0.03);
  geos.push(ankleGuard);
  // Foot
  const foot = new THREE.BoxGeometry(0.16, 0.06, 0.25);
  foot.translate(0, -0.44, 0.04);
  geos.push(foot);
  // Thruster vents on calf
  for (let i = 0; i < 2; i++) {
    const thruster = new THREE.BoxGeometry(0.1, 0.06, 0.04);
    thruster.translate(0, -0.12 - i * 0.08, -0.12);
    geos.push(thruster);
  }
  return mergeGeometries(geos);
}

function createGundamWaistSkirt(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Waist ring
  const waist = new THREE.BoxGeometry(0.55, 0.1, 0.3);
  geos.push(waist);
  // Front skirt flaps
  for (const side of [-1, 1]) {
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.08, 0);
    flapShape.lineTo(0.08, 0);
    flapShape.lineTo(0.06, -0.18);
    flapShape.lineTo(-0.06, -0.18);
    flapShape.closePath();
    const flap = new THREE.ExtrudeGeometry(flapShape, { depth: 0.03, bevelEnabled: false });
    flap.translate(side * 0.1, -0.05, 0.13);
    geos.push(flap);
  }
  // Rear skirt
  const rearSkirt = new THREE.BoxGeometry(0.35, 0.15, 0.04);
  rearSkirt.translate(0, -0.1, -0.15);
  geos.push(rearSkirt);
  // Side skirt flaps
  for (const side of [-1, 1]) {
    const sideFlap = new THREE.BoxGeometry(0.04, 0.14, 0.18);
    sideFlap.translate(side * 0.28, -0.08, 0);
    geos.push(sideFlap);
  }
  return mergeGeometries(geos);
}

function createGundamBackpack(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main pack body
  const body = new THREE.BoxGeometry(0.4, 0.35, 0.15);
  geos.push(body);
  // Thruster bells
  for (const side of [-1, 1]) {
    const thruster = new THREE.CylinderGeometry(0.05, 0.07, 0.1, 8);
    thruster.rotateX(Math.PI / 2);
    thruster.translate(side * 0.12, -0.08, -0.12);
    geos.push(thruster);
  }
  // Vernier nozzles (top)
  for (const side of [-1, 1]) {
    const vernier = new THREE.CylinderGeometry(0.03, 0.04, 0.06, 6);
    vernier.translate(side * 0.15, 0.18, -0.06);
    geos.push(vernier);
  }
  // Beam saber storage racks
  for (const side of [-1, 1]) {
    const rack = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6);
    rack.translate(side * 0.16, 0.25, -0.02);
    geos.push(rack);
  }
  // Central connector
  const connector = new THREE.BoxGeometry(0.15, 0.2, 0.06);
  connector.translate(0, 0, 0.1);
  geos.push(connector);
  return mergeGeometries(geos);
}

function createGundamShield(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Main shield body - angular
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, 0.35);
  shieldShape.lineTo(0.2, 0.25);
  shieldShape.lineTo(0.22, -0.1);
  shieldShape.lineTo(0.12, -0.35);
  shieldShape.lineTo(0, -0.4);
  shieldShape.lineTo(-0.12, -0.35);
  shieldShape.lineTo(-0.22, -0.1);
  shieldShape.lineTo(-0.2, 0.25);
  shieldShape.closePath();
  const shield = new THREE.ExtrudeGeometry(shieldShape, { depth: 0.05, bevelEnabled: false });
  geos.push(shield);
  // Cross frame
  const vBar = new THREE.BoxGeometry(0.04, 0.6, 0.03);
  vBar.translate(0, -0.02, 0.06);
  geos.push(vBar);
  const hBar = new THREE.BoxGeometry(0.3, 0.04, 0.03);
  hBar.translate(0, 0.1, 0.06);
  geos.push(hBar);
  // Arm mount (back)
  const mount = new THREE.BoxGeometry(0.08, 0.15, 0.04);
  mount.translate(0, 0.05, -0.03);
  geos.push(mount);
  return mergeGeometries(geos);
}

function createGundamBeamRifle(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Receiver body
  const receiver = new THREE.BoxGeometry(0.08, 0.1, 0.3);
  geos.push(receiver);
  // Barrel
  const barrel = new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.02, 0.35);
  geos.push(barrel);
  // Barrel shroud
  const shroud = new THREE.BoxGeometry(0.06, 0.06, 0.2);
  shroud.translate(0, 0.02, 0.2);
  geos.push(shroud);
  // Scope
  const scope = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6);
  scope.rotateX(Math.PI / 2);
  scope.translate(0, 0.06, 0.05);
  geos.push(scope);
  // Energy pack (magazine)
  const ePack = new THREE.BoxGeometry(0.06, 0.12, 0.06);
  ePack.translate(0, -0.1, -0.05);
  geos.push(ePack);
  // Grip
  const grip = new THREE.BoxGeometry(0.04, 0.1, 0.05);
  grip.rotateX(0.2);
  grip.translate(0, -0.08, 0.04);
  geos.push(grip);
  // Muzzle tip
  const muzzle = new THREE.CylinderGeometry(0.035, 0.025, 0.04, 8);
  muzzle.rotateX(Math.PI / 2);
  muzzle.translate(0, 0.02, 0.56);
  geos.push(muzzle);
  return mergeGeometries(geos);
}

function createGundamBeamSaber(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Hilt body
  const hilt = new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8);
  geos.push(hilt);
  // Emitter ring
  const emitter = new THREE.TorusGeometry(0.03, 0.008, 6, 8);
  emitter.translate(0, 0.1, 0);
  geos.push(emitter);
  // Beam blade (tapered cylinder)
  const beam = new THREE.CylinderGeometry(0.005, 0.025, 0.6, 8);
  beam.translate(0, 0.42, 0);
  geos.push(beam);
  // Activation switch
  const button = new THREE.BoxGeometry(0.015, 0.03, 0.015);
  button.translate(0.025, 0, 0);
  geos.push(button);
  // Pommel cap
  const pommel = new THREE.SphereGeometry(0.03, 6, 6);
  pommel.translate(0, -0.11, 0);
  geos.push(pommel);
  return mergeGeometries(geos);
}

// ---- Super Robot Geometry Factories ----

function createSuperCrownHead(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Blocky head base
  const head = new THREE.BoxGeometry(0.5, 0.45, 0.42);
  geos.push(head);
  // Crown/crest - tall dramatic
  const crownShape = new THREE.Shape();
  crownShape.moveTo(-0.2, 0);
  crownShape.lineTo(-0.25, 0.15);
  crownShape.lineTo(-0.15, 0.3);
  crownShape.lineTo(-0.05, 0.2);
  crownShape.lineTo(0, 0.35);
  crownShape.lineTo(0.05, 0.2);
  crownShape.lineTo(0.15, 0.3);
  crownShape.lineTo(0.25, 0.15);
  crownShape.lineTo(0.2, 0);
  crownShape.closePath();
  const crown = new THREE.ExtrudeGeometry(crownShape, { depth: 0.06, bevelEnabled: false });
  crown.translate(0, 0.22, -0.03);
  geos.push(crown);
  // Big visor eyes
  const visor = new THREE.BoxGeometry(0.46, 0.08, 0.08);
  visor.translate(0, 0.04, 0.22);
  geos.push(visor);
  // Chin guard - bold
  const chin = new THREE.BoxGeometry(0.3, 0.1, 0.15);
  chin.translate(0, -0.2, 0.14);
  geos.push(chin);
  // Ear fins
  for (const side of [-1, 1]) {
    const ear = new THREE.BoxGeometry(0.08, 0.2, 0.12);
    ear.translate(side * 0.28, 0.05, 0);
    geos.push(ear);
  }
  return mergeGeometries(geos);
}

function createSuperChest(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive chest block
  const chest = new THREE.BoxGeometry(1.0, 0.75, 0.5);
  geos.push(chest);
  // Prominent pec plates
  for (const side of [-1, 1]) {
    const pecShape = new THREE.Shape();
    pecShape.moveTo(0, 0);
    pecShape.lineTo(0.2, 0);
    pecShape.lineTo(0.22, 0.15);
    pecShape.lineTo(0.12, 0.22);
    pecShape.lineTo(0, 0.18);
    pecShape.closePath();
    const pec = new THREE.ExtrudeGeometry(pecShape, { depth: 0.1, bevelEnabled: false });
    pec.translate(side * 0.02, -0.05, 0.25);
    if (side === -1) pec.scale(-1, 1, 1);
    geos.push(pec);
  }
  // Central emblem
  const emblem = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 6);
  emblem.rotateX(Math.PI / 2);
  emblem.translate(0, 0.1, 0.28);
  geos.push(emblem);
  // Collar flares
  for (const side of [-1, 1]) {
    const collar = new THREE.BoxGeometry(0.15, 0.18, 0.12);
    collar.rotateZ(side * 0.3);
    collar.translate(side * 0.35, 0.4, 0);
    geos.push(collar);
  }
  // Abdominal segment
  const abs = new THREE.BoxGeometry(0.4, 0.2, 0.35);
  abs.translate(0, -0.45, 0);
  geos.push(abs);
  return mergeGeometries(geos);
}

function createSuperShoulder(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Oversized shoulder pad - dome-like
  const dome = new THREE.SphereGeometry(0.22, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.translate(0, 0.05, 0);
  geos.push(dome);
  // Angular outer plate
  const plate = new THREE.BoxGeometry(0.4, 0.25, 0.35);
  plate.translate(0, -0.05, 0);
  geos.push(plate);
  // Spike on top
  const spike = new THREE.ConeGeometry(0.06, 0.2, 6);
  spike.translate(0, 0.25, 0);
  geos.push(spike);
  // Front detail vent
  const vent = new THREE.BoxGeometry(0.2, 0.06, 0.04);
  vent.translate(0, -0.05, 0.19);
  geos.push(vent);
  // Side ridge
  const ridge = new THREE.BoxGeometry(0.04, 0.2, 0.25);
  ridge.translate(0.2, 0, 0);
  geos.push(ridge);
  return mergeGeometries(geos);
}

function createSuperRocketPunchArm(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Upper arm
  const upper = new THREE.CylinderGeometry(0.1, 0.12, 0.35, 8);
  upper.translate(0, 0.15, 0);
  geos.push(upper);
  // Elbow ring
  const elbow = new THREE.TorusGeometry(0.1, 0.03, 6, 10);
  elbow.translate(0, -0.02, 0);
  geos.push(elbow);
  // Forearm - cylindrical, rocket housing
  const forearm = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 10);
  forearm.translate(0, -0.22, 0);
  geos.push(forearm);
  // Rocket nozzle at elbow
  const nozzle = new THREE.ConeGeometry(0.08, 0.1, 8);
  nozzle.rotateX(Math.PI);
  nozzle.translate(0, -0.02, -0.1);
  geos.push(nozzle);
  // Wrist seam (detachment line)
  const seam = new THREE.TorusGeometry(0.12, 0.015, 6, 10);
  seam.translate(0, -0.35, 0);
  geos.push(seam);
  // Fist base
  const fist = new THREE.BoxGeometry(0.18, 0.14, 0.14);
  fist.translate(0, -0.44, 0);
  geos.push(fist);
  return mergeGeometries(geos);
}

function createSuperLeg(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive thigh
  const thigh = new THREE.BoxGeometry(0.22, 0.35, 0.22);
  thigh.translate(0, 0.2, 0);
  geos.push(thigh);
  // Knee plate - bold
  const kneePlate = new THREE.BoxGeometry(0.2, 0.1, 0.12);
  kneePlate.translate(0, 0.02, 0.12);
  geos.push(kneePlate);
  // Shin - flared at bottom
  const shinShape = new THREE.Shape();
  shinShape.moveTo(-0.1, 0);
  shinShape.lineTo(0.1, 0);
  shinShape.lineTo(0.14, -0.4);
  shinShape.lineTo(-0.14, -0.4);
  shinShape.closePath();
  const shin = new THREE.ExtrudeGeometry(shinShape, { depth: 0.2, bevelEnabled: false });
  shin.translate(0, 0, -0.1);
  geos.push(shin);
  // Foot - big and bold
  const foot = new THREE.BoxGeometry(0.22, 0.08, 0.3);
  foot.translate(0, -0.44, 0.04);
  geos.push(foot);
  // Ankle thrusters
  for (const side of [-1, 1]) {
    const thruster = new THREE.CylinderGeometry(0.03, 0.04, 0.06, 6);
    thruster.translate(side * 0.12, -0.36, -0.08);
    geos.push(thruster);
  }
  return mergeGeometries(geos);
}

function createSuperWing(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Massive wing - dramatic swept shape
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(0.15, 0.1);
  wingShape.lineTo(0.7, 0.5);
  wingShape.lineTo(0.75, 0.45);
  wingShape.lineTo(0.6, 0.2);
  wingShape.lineTo(0.8, 0.05);
  wingShape.lineTo(0.5, -0.05);
  wingShape.lineTo(0.15, -0.03);
  wingShape.closePath();
  const wing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.025, bevelEnabled: false });
  geos.push(wing);
  // Wing root mount
  const root = new THREE.BoxGeometry(0.1, 0.15, 0.08);
  root.translate(0.05, 0.03, 0.015);
  geos.push(root);
  // Leading edge blade
  const edge = new THREE.BoxGeometry(0.5, 0.015, 0.04);
  edge.rotateZ(0.6);
  edge.translate(0.4, 0.35, 0.015);
  geos.push(edge);
  // Thruster pods at wing tips
  const tipPod = new THREE.CylinderGeometry(0.03, 0.04, 0.08, 6);
  tipPod.rotateX(Math.PI / 2);
  tipPod.translate(0.75, 0.42, 0.015);
  geos.push(tipPod);
  return mergeGeometries(geos);
}

function createSuperPowerHorn(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Base mount
  const base = new THREE.CylinderGeometry(0.06, 0.08, 0.06, 6);
  geos.push(base);
  // Main horn - curved and dramatic
  const hornShape = new THREE.Shape();
  hornShape.moveTo(-0.04, 0);
  hornShape.lineTo(0.04, 0);
  hornShape.lineTo(0.02, 0.45);
  hornShape.lineTo(0, 0.5);
  hornShape.lineTo(-0.02, 0.45);
  hornShape.closePath();
  const horn = new THREE.ExtrudeGeometry(hornShape, { depth: 0.04, bevelEnabled: false });
  horn.rotateX(-0.2);
  horn.translate(0, 0.03, -0.02);
  geos.push(horn);
  // Energy ring at base
  const ring = new THREE.TorusGeometry(0.06, 0.012, 6, 8);
  ring.translate(0, 0.06, 0);
  geos.push(ring);
  // Secondary small horn
  const smallHorn = new THREE.ConeGeometry(0.025, 0.2, 5);
  smallHorn.rotateX(-0.3);
  smallHorn.translate(0, 0.12, -0.04);
  geos.push(smallHorn);
  return mergeGeometries(geos);
}

function createSuperMegaFist(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  // Oversized fist base
  const fist = new THREE.BoxGeometry(0.3, 0.25, 0.25);
  geos.push(fist);
  // Knuckle bumps
  for (let i = 0; i < 4; i++) {
    const knuckle = new THREE.SphereGeometry(0.04, 6, 6);
    knuckle.translate(-0.09 + i * 0.06, 0.1, 0.13);
    geos.push(knuckle);
  }
  // Finger segments
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.BoxGeometry(0.04, 0.08, 0.06);
    finger.translate(-0.09 + i * 0.06, 0.06, 0.18);
    geos.push(finger);
  }
  // Thumb
  const thumb = new THREE.BoxGeometry(0.05, 0.1, 0.05);
  thumb.rotateZ(0.4);
  thumb.translate(-0.17, 0.04, 0.06);
  geos.push(thumb);
  // Wrist connector
  const wrist = new THREE.CylinderGeometry(0.1, 0.12, 0.06, 8);
  wrist.translate(0, -0.14, 0);
  geos.push(wrist);
  // Rocket exhaust port on back of fist
  const exhaust = new THREE.ConeGeometry(0.06, 0.1, 8);
  exhaust.rotateX(Math.PI / 2);
  exhaust.translate(0, 0, -0.16);
  geos.push(exhaust);
  return mergeGeometries(geos);
}

function createMechGeometry(blockType: string): THREE.BufferGeometry {
  switch (blockType) {
    case 'mech_head_visor': return createMechHeadVisor();
    case 'mech_head_horn': return createMechHeadHorn();
    case 'mech_head_sensor': return createMechHeadSensor();
    case 'mech_head_crest': return createMechHeadCrest();
    case 'mech_antenna': return createMechAntenna();
    case 'mech_chest_plate': return createMechChestPlate();
    case 'mech_cockpit_torso': return createMechCockpitTorso();
    case 'mech_reactor_core': return createMechReactorCore();
    case 'mech_back_thruster': return createMechBackThruster();
    case 'mech_waist': return createMechWaist();
    case 'mech_shoulder_pad': return createMechShoulderPad();
    case 'mech_upper_arm': return createMechUpperArm();
    case 'mech_forearm': return createMechForearm();
    case 'mech_fist': return createMechFist();
    case 'mech_claw': return createMechClaw();
    case 'mech_shield': return createMechShield();
    case 'mech_thigh': return createMechThigh();
    case 'mech_shin': return createMechShin();
    case 'mech_foot_heavy': return createMechFootHeavy();
    case 'mech_knee_joint': return createMechKneeJoint();
    case 'mech_thruster_leg': return createMechThrusterLeg();
    case 'mech_beam_rifle': return createMechBeamRifle();
    case 'mech_beam_saber': return createMechBeamSaber();
    case 'mech_cannon': return createMechCannon();
    case 'mech_gatling': return createMechGatling();
    case 'mech_missile_pod': return createMechMissilePod();
    case 'mech_blade': return createMechHeatBlade();
    case 'mech_wing_fin': return createMechWingFin();
    case 'mech_booster': return createMechBooster();
    case 'mech_wing_blade': return createMechWingBlade();
    case 'mech_backpack': return createMechBackpack();
    case 'mech_stabilizer': return createMechStabilizer();
    // Accessories
    case 'mech_v_fin': return createMechVFin();
    case 'mech_scope_eye': return createMechScopeEye();
    case 'mech_exhaust_vent': return createMechExhaustVent();
    case 'mech_hip_skirt': return createMechHipSkirt();
    case 'mech_cable_bundle': return createMechCableBundle();
    case 'mech_radar_dish': return createMechRadarDish();
    // Heavy Armor
    case 'mech_heavy_chest': return createMechHeavyChest();
    case 'mech_heavy_shoulder': return createMechHeavyShoulder();
    case 'mech_heavy_leg': return createMechHeavyLeg();
    case 'mech_heavy_arm': return createMechHeavyArm();
    case 'mech_tower_shield': return createMechTowerShield();
    case 'mech_heavy_foot': return createMechStomperFoot();
    // Flight Systems
    case 'mech_delta_wing': return createMechDeltaWing();
    case 'mech_thruster_pack': return createMechThrusterPack();
    case 'mech_aero_fin': return createMechAeroFin();
    case 'mech_hover_pod': return createMechHoverPod();
    case 'mech_intake_nacelle': return createMechIntakeNacelle();
    case 'mech_tail_rudder': return createMechTailRudder();
    // Stealth Frame
    case 'mech_stealth_head': return createStealthHead();
    case 'mech_stealth_torso': return createStealthTorso();
    case 'mech_stealth_arm': return createStealthArm();
    case 'mech_stealth_leg': return createStealthLeg();
    case 'mech_stealth_wing': return createStealthWing();
    case 'mech_stealth_blade': return createStealthPlasmaBlade();
    // Knight Frame
    case 'mech_knight_head': return createKnightHelm();
    case 'mech_knight_torso': return createKnightBreastplate();
    case 'mech_knight_arm': return createKnightGauntlet();
    case 'mech_knight_leg': return createKnightGreave();
    case 'mech_knight_shield': return createKnightHeaterShield();
    case 'mech_knight_lance': return createKnightEnergyLance();
    case 'mech_knight_cape': return createKnightArmorCape();
    // Beast Frame
    case 'mech_beast_head': return createBeastSkull();
    case 'mech_beast_torso': return createBeastSpine();
    case 'mech_beast_foreleg': return createBeastForeleg();
    case 'mech_beast_hindleg': return createBeastHindleg();
    case 'mech_beast_tail': return createBeastTail();
    case 'mech_beast_jaw': return createBeastJaw();
    case 'mech_beast_claw_foot': return createBeastClaw();
    // Tank Frame
    case 'mech_tank_head': return createTankTurretHead();
    case 'mech_tank_torso': return createTankHull();
    case 'mech_tank_arm': return createTankSiegeArm();
    case 'mech_tank_leg': return createTankTreadLeg();
    case 'mech_tank_cannon_arm': return createTankSiegeCannon();
    case 'mech_tank_armor_skirt': return createTankSideSkirt();
    // Gundam Frame
    case 'mech_gundam_head': return createGundamHead();
    case 'mech_gundam_torso': return createGundamCoreChest();
    case 'mech_gundam_shoulder': return createGundamShoulder();
    case 'mech_gundam_arm': return createGundamArm();
    case 'mech_gundam_leg': return createGundamLeg();
    case 'mech_gundam_skirt': return createGundamWaistSkirt();
    case 'mech_gundam_backpack': return createGundamBackpack();
    case 'mech_gundam_shield': return createGundamShield();
    case 'mech_gundam_rifle': return createGundamBeamRifle();
    case 'mech_gundam_saber': return createGundamBeamSaber();
    // Super Robot
    case 'mech_super_head': return createSuperCrownHead();
    case 'mech_super_torso': return createSuperChest();
    case 'mech_super_shoulder': return createSuperShoulder();
    case 'mech_super_arm': return createSuperRocketPunchArm();
    case 'mech_super_leg': return createSuperLeg();
    case 'mech_super_wing': return createSuperWing();
    case 'mech_super_horn': return createSuperPowerHorn();
    case 'mech_super_fist': return createSuperMegaFist();
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

function createStairsGeometry(steps: number, width: number, stepHeight: number, stepDepth: number): THREE.BufferGeometry {
  const geometries: THREE.BoxGeometry[] = [];
  for (let i = 0; i < steps; i++) {
    const geo = new THREE.BoxGeometry(width, stepHeight, stepDepth);
    geo.translate(0, stepHeight * (i + 0.5), -stepDepth * i);
    geometries.push(geo);
  }
  return mergeGeometries(geometries);
}

function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let indexOffset = 0;

  for (const geo of geometries) {
    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');
    const uv = geo.getAttribute('uv');
    const idx = geo.getIndex();

    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (norm) normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
      if (uv) uvs.push(uv.getX(i), uv.getY(i));
    }

    if (idx) {
      for (let i = 0; i < idx.count; i++) {
        indices.push(idx.getX(i) + indexOffset);
      }
    }
    indexOffset += pos.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (normals.length) merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  if (uvs.length) merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  if (indices.length) merged.setIndex(indices);
  return merged;
}

export function getBlockGeometry(blockType: string): THREE.BufferGeometry {
  if (geometryCache.has(blockType)) {
    return geometryCache.get(blockType)!;
  }

  const def = blockDefinitions.find((b) => b.id === blockType);
  if (!def) {
    const fallback = new THREE.BoxGeometry(1, 1, 1);
    geometryCache.set(blockType, fallback);
    return fallback;
  }

  let geometry: THREE.BufferGeometry;
  const p = def.params;

  switch (def.geometry) {
    case 'box':
      geometry = new THREE.BoxGeometry(p.width, p.height, p.depth);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments || 12);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(p.radius, p.widthSegments || 12, p.heightSegments || 12);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(p.radius, p.height, p.radialSegments || 12);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments || 8, p.tubularSegments || 16);
      break;
    case 'capsule':
      geometry = new THREE.CapsuleGeometry(p.radius, p.length, p.capSegments || 8, p.radialSegments || 12);
      break;
    case 'extrude':
      if (blockType === 'roof') {
        geometry = createRoofGeometry(p.size);
      } else {
        geometry = createWedgeGeometry(p.size);
      }
      break;
    case 'lathe':
      geometry = createArchGeometry();
      break;
    case 'composed':
      if (blockType === 'stairs') {
        geometry = createStairsGeometry(p.steps, p.width, p.stepHeight, p.stepDepth);
      } else if (blockType.startsWith('mech_')) {
        geometry = createMechGeometry(blockType);
      } else {
        geometry = new THREE.BoxGeometry(1, 1, 1);
      }
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  geometryCache.set(blockType, geometry);
  return geometry;
}

export function getCategories(): string[] {
  const cats = new Set(blockDefinitions.map((b) => b.category));
  return Array.from(cats);
}

export function getBlocksByCategory(category: string): BlockDefinition[] {
  return blockDefinitions.filter((b) => b.category === category);
}
