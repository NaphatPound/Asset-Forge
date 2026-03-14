import type { MechTemplate } from '../types/editor';

// Scale factor for mech templates - parts are ~0.5 units, mechs should be ~6 units tall
const S = 2.5;

export const mechTemplates: MechTemplate[] = [
  // ─── Template 1: Standard Gundam ───────────────────────────────────
  {
    id: 'tpl_standard_gundam',
    name: 'Standard Gundam',
    description: 'A classic Gundam-style mech with balanced loadout. White, blue, and red color scheme.',
    mechType: 'gundam',
    parts: [
      { type: 'mech_gundam_head', name: 'Gundam Head', position: [0, 5.2, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_torso', name: 'Gundam Torso', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_shoulder', name: 'Left Shoulder', position: [-1.4, 4.4, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#2244aa', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_gundam_shoulder', name: 'Right Shoulder', position: [1.4, 4.4, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#2244aa', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_gundam_arm', name: 'Left Arm', position: [-1.5, 3.0, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_arm', name: 'Right Arm', position: [1.5, 3.0, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_skirt', name: 'Waist Skirt', position: [0, 2.6, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_leg', name: 'Left Leg', position: [-0.7, 1.2, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_leg', name: 'Right Leg', position: [0.7, 1.2, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_gundam_backpack', name: 'Backpack', position: [0, 4.2, -0.8], rotation: [0, 0, 0], scale: [S, S, S], color: '#cc2233', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_gundam_shield', name: 'Shield (Left)', position: [-2.2, 3.0, 0.4], rotation: [0, 0, 0.1], scale: [S, S, S], color: '#cc2233', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_gundam_rifle', name: 'Beam Rifle (Right)', position: [2.2, 2.8, 0.6], rotation: [0, 0, -0.05], scale: [S, S, S], color: '#888888', metalness: 0.6, roughness: 0.3 },
      { type: 'mech_gundam_saber', name: 'Beam Saber (Back)', position: [0.5, 5.0, -1.0], rotation: [0.3, 0, 0], scale: [S*0.8, S*0.8, S*0.8], color: '#ffffff', metalness: 0.5, roughness: 0.3 },
    ],
  },

  // ─── Template 2: Heavy Assault ─────────────────────────────────────
  {
    id: 'tpl_heavy_assault',
    name: 'Heavy Assault',
    description: 'A massive heavily-armored mech built for sustained firepower. Dark gray and olive color scheme.',
    mechType: 'heavy',
    parts: [
      { type: 'mech_head_crest', name: 'Crest Head', position: [0, 5.6, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#4a5a3a', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_heavy_chest', name: 'Heavy Chest', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#3a3a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_shoulder', name: 'Left Heavy Shoulder', position: [-1.8, 4.6, 0], rotation: [0, 0, 0], scale: [S*1.2, S*1.2, S*1.2], color: '#4a5a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_shoulder', name: 'Right Heavy Shoulder', position: [1.8, 4.6, 0], rotation: [0, 0, 0], scale: [-S*1.2, S*1.2, S*1.2], color: '#4a5a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_arm', name: 'Left Heavy Arm', position: [-1.9, 3.0, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#3a3a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_arm', name: 'Right Heavy Arm', position: [1.9, 3.0, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#3a3a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_waist', name: 'Waist', position: [0, 2.4, 0], rotation: [0, 0, 0], scale: [S*1.2, S, S*1.2], color: '#333333', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_heavy_leg', name: 'Left Heavy Leg', position: [-0.9, 1.2, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#4a5a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_leg', name: 'Right Heavy Leg', position: [0.9, 1.2, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#4a5a3a', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_heavy_foot', name: 'Left Heavy Foot', position: [-0.9, 0.15, 0.2], rotation: [0, 0, 0], scale: [S*1.2, S, S*1.2], color: '#333333', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_heavy_foot', name: 'Right Heavy Foot', position: [0.9, 0.15, 0.2], rotation: [0, 0, 0], scale: [-S*1.2, S, S*1.2], color: '#333333', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_missile_pod', name: 'Missile Pod', position: [-1.6, 5.2, -0.5], rotation: [0, 0, 0], scale: [S, S, S], color: '#4a5a3a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_cannon', name: 'Shoulder Cannon', position: [1.0, 5.4, -0.4], rotation: [-0.2, 0, 0], scale: [S*1.2, S*1.2, S*1.2], color: '#333333', metalness: 0.7, roughness: 0.3 },
      { type: 'mech_tower_shield', name: 'Tower Shield', position: [-2.6, 2.8, 0.5], rotation: [0, 0.1, 0], scale: [S*1.3, S*1.3, S*1.3], color: '#3a3a3a', metalness: 0.7, roughness: 0.4 },
    ],
  },

  // ─── Template 3: Stealth Recon ─────────────────────────────────────
  {
    id: 'tpl_stealth_recon',
    name: 'Stealth Recon',
    description: 'A sleek stealth mech designed for reconnaissance. Dark blue and black color scheme.',
    mechType: 'stealth',
    parts: [
      { type: 'mech_stealth_head', name: 'Stealth Head', position: [0, 5.0, 0], rotation: [0, 0, 0], scale: [S*0.9, S*0.9, S*0.9], color: '#1a1a2e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_torso', name: 'Stealth Torso', position: [0, 3.6, 0], rotation: [0, 0, 0], scale: [S*0.9, S, S*0.9], color: '#16213e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_arm', name: 'Left Stealth Arm', position: [-1.2, 3.0, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#1a1a2e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_arm', name: 'Right Stealth Arm', position: [1.2, 3.0, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#1a1a2e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_leg', name: 'Left Stealth Leg', position: [-0.6, 1.2, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#16213e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_leg', name: 'Right Stealth Leg', position: [0.6, 1.2, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#16213e', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_stealth_wing', name: 'Left Stealth Wing', position: [-1.4, 4.2, -0.8], rotation: [0, -0.3, -0.2], scale: [S, S, S], color: '#0f3460', metalness: 0.4, roughness: 0.2 },
      { type: 'mech_stealth_wing', name: 'Right Stealth Wing', position: [1.4, 4.2, -0.8], rotation: [0, 0.3, 0.2], scale: [-S, S, S], color: '#0f3460', metalness: 0.4, roughness: 0.2 },
      { type: 'mech_stealth_blade', name: 'Plasma Blade', position: [1.5, 2.4, 0.4], rotation: [0, 0, -0.1], scale: [S, S, S], color: '#53d8fb', metalness: 0.2, roughness: 0.1 },
    ],
  },

  // ─── Template 4: Knight Paladin ────────────────────────────────────
  {
    id: 'tpl_knight_paladin',
    name: 'Knight Paladin',
    description: 'A medieval-themed mech with a noble bearing. Silver, gold, and blue color scheme.',
    mechType: 'knight',
    parts: [
      { type: 'mech_knight_head', name: 'Knight Helm', position: [0, 5.4, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#c0c0c0', metalness: 0.8, roughness: 0.3 },
      { type: 'mech_knight_torso', name: 'Knight Breastplate', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#c0c0c0', metalness: 0.8, roughness: 0.3 },
      { type: 'mech_knight_arm', name: 'Left Gauntlet', position: [-1.5, 2.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#d4af37', metalness: 0.7, roughness: 0.3 },
      { type: 'mech_knight_arm', name: 'Right Gauntlet', position: [1.5, 2.8, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#d4af37', metalness: 0.7, roughness: 0.3 },
      { type: 'mech_knight_leg', name: 'Left Greave', position: [-0.7, 1.1, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#c0c0c0', metalness: 0.8, roughness: 0.3 },
      { type: 'mech_knight_leg', name: 'Right Greave', position: [0.7, 1.1, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#c0c0c0', metalness: 0.8, roughness: 0.3 },
      { type: 'mech_knight_shield', name: 'Heater Shield', position: [-2.2, 3.4, 0.4], rotation: [0, 0.15, 0.05], scale: [S*1.2, S*1.4, S], color: '#2244aa', metalness: 0.6, roughness: 0.3 },
      { type: 'mech_knight_lance', name: 'Energy Lance', position: [2.2, 3.2, 1.0], rotation: [-0.3, 0, -0.05], scale: [S, S*1.3, S], color: '#d4af37', metalness: 0.7, roughness: 0.2 },
      { type: 'mech_knight_cape', name: 'Armor Cape', position: [0, 4.4, -1.0], rotation: [0.15, 0, 0], scale: [S*1.2, S*1.2, S], color: '#2244aa', metalness: 0.1, roughness: 0.8 },
    ],
  },

  // ─── Template 5: Beast Hunter ──────────────────────────────────────
  {
    id: 'tpl_beast_hunter',
    name: 'Beast Hunter',
    description: 'A quadruped beast mech built for aggressive close-range combat. Red and dark gray color scheme.',
    mechType: 'beast',
    parts: [
      { type: 'mech_beast_head', name: 'Beast Skull', position: [0, 3.2, 2.2], rotation: [-0.2, 0, 0], scale: [S, S, S], color: '#8b0000', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_torso', name: 'Beast Spine', position: [0, 3.4, 0], rotation: [0, 0, 0], scale: [S, S, S*1.3], color: '#333333', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_foreleg', name: 'Front Left Leg', position: [-1.0, 1.6, 1.4], rotation: [0.15, 0, 0], scale: [S, S, S], color: '#8b0000', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_foreleg', name: 'Front Right Leg', position: [1.0, 1.6, 1.4], rotation: [0.15, 0, 0], scale: [-S, S, S], color: '#8b0000', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_hindleg', name: 'Rear Left Leg', position: [-1.0, 1.6, -1.4], rotation: [-0.15, 0, 0], scale: [S, S, S], color: '#333333', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_hindleg', name: 'Rear Right Leg', position: [1.0, 1.6, -1.4], rotation: [-0.15, 0, 0], scale: [-S, S, S], color: '#333333', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_tail', name: 'Beast Tail', position: [0, 3.0, -2.4], rotation: [0.4, 0, 0], scale: [S, S, S*1.2], color: '#333333', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_jaw', name: 'Beast Jaw', position: [0, 2.6, 2.8], rotation: [-0.3, 0, 0], scale: [S, S, S], color: '#8b0000', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_beast_claw_foot', name: 'Left Claw', position: [-1.2, 0.2, 1.8], rotation: [0, 0, 0], scale: [S, S, S], color: '#555555', metalness: 0.6, roughness: 0.4 },
      { type: 'mech_beast_claw_foot', name: 'Right Claw', position: [1.2, 0.2, 1.8], rotation: [0, 0, 0], scale: [-S, S, S], color: '#555555', metalness: 0.6, roughness: 0.4 },
    ],
  },

  // ─── Template 6: Tank Destroyer ────────────────────────────────────
  {
    id: 'tpl_tank_destroyer',
    name: 'Tank Destroyer',
    description: 'A ground-type heavy tank mech with devastating siege capabilities. Army green and tan color scheme.',
    mechType: 'tank',
    parts: [
      { type: 'mech_tank_head', name: 'Tank Turret Head', position: [0, 4.6, 0], rotation: [0, 0, 0], scale: [S*1.1, S, S*1.1], color: '#4b5320', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_tank_torso', name: 'Tank Hull', position: [0, 3.2, 0], rotation: [0, 0, 0], scale: [S*1.3, S, S*1.3], color: '#556b2f', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_tank_arm', name: 'Left Siege Arm', position: [-1.8, 3.0, 0], rotation: [0, 0, 0], scale: [S*1.2, S*1.2, S*1.2], color: '#4b5320', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_tank_arm', name: 'Right Siege Arm', position: [1.8, 3.0, 0], rotation: [0, 0, 0], scale: [-S*1.2, S*1.2, S*1.2], color: '#4b5320', metalness: 0.6, roughness: 0.5 },
      { type: 'mech_tank_leg', name: 'Left Tread Leg', position: [-1.0, 0.9, 0], rotation: [0, 0, 0], scale: [S, S, S*1.3], color: '#333333', metalness: 0.4, roughness: 0.7 },
      { type: 'mech_tank_leg', name: 'Right Tread Leg', position: [1.0, 0.9, 0], rotation: [0, 0, 0], scale: [-S, S, S*1.3], color: '#333333', metalness: 0.4, roughness: 0.7 },
      { type: 'mech_tank_cannon_arm', name: 'Siege Cannon', position: [0, 5.2, 1.2], rotation: [-0.15, 0, 0], scale: [S*1.4, S*1.4, S*1.6], color: '#556b2f', metalness: 0.7, roughness: 0.4 },
      { type: 'mech_tank_armor_skirt', name: 'Left Side Skirt', position: [-1.5, 2.2, 0], rotation: [0, 0, 0], scale: [S, S, S*1.2], color: '#c2b280', metalness: 0.4, roughness: 0.6 },
      { type: 'mech_tank_armor_skirt', name: 'Right Side Skirt', position: [1.5, 2.2, 0], rotation: [0, 0, 0], scale: [-S, S, S*1.2], color: '#c2b280', metalness: 0.4, roughness: 0.6 },
    ],
  },

  // ─── Template 7: Super Striker ─────────────────────────────────────
  {
    id: 'tpl_super_striker',
    name: 'Super Striker',
    description: 'An over-the-top super robot with flashy design and devastating attacks. Red, yellow, and white color scheme.',
    mechType: 'super',
    parts: [
      { type: 'mech_super_head', name: 'Super Crown Head', position: [0, 5.6, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#ffcc00', metalness: 0.5, roughness: 0.3 },
      { type: 'mech_super_torso', name: 'Super Chest', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S*1.2, S*1.2, S*1.1], color: '#cc0000', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_super_shoulder', name: 'Left Super Shoulder', position: [-1.8, 4.6, 0], rotation: [0, 0, 0], scale: [S*1.3, S*1.3, S*1.3], color: '#ffcc00', metalness: 0.5, roughness: 0.3 },
      { type: 'mech_super_shoulder', name: 'Right Super Shoulder', position: [1.8, 4.6, 0], rotation: [0, 0, 0], scale: [-S*1.3, S*1.3, S*1.3], color: '#ffcc00', metalness: 0.5, roughness: 0.3 },
      { type: 'mech_super_arm', name: 'Left Rocket Punch', position: [-1.7, 3.0, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#cc0000', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_super_arm', name: 'Right Rocket Punch', position: [1.7, 3.0, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#cc0000', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_super_leg', name: 'Left Super Leg', position: [-0.8, 1.2, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_super_leg', name: 'Right Super Leg', position: [0.8, 1.2, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#ffffff', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_super_wing', name: 'Left Super Wing', position: [-1.2, 4.4, -1.0], rotation: [0, -0.2, -0.3], scale: [S*1.2, S*1.2, S*1.2], color: '#cc0000', metalness: 0.4, roughness: 0.3 },
      { type: 'mech_super_wing', name: 'Right Super Wing', position: [1.2, 4.4, -1.0], rotation: [0, 0.2, 0.3], scale: [-S*1.2, S*1.2, S*1.2], color: '#cc0000', metalness: 0.4, roughness: 0.3 },
      { type: 'mech_super_horn', name: 'Power Horn', position: [0, 6.2, 0.2], rotation: [-0.3, 0, 0], scale: [S, S*1.2, S], color: '#ffcc00', metalness: 0.6, roughness: 0.2 },
      { type: 'mech_super_fist', name: 'Left Mega Fist', position: [-1.9, 1.8, 0.2], rotation: [0, 0, 0], scale: [S*1.4, S*1.4, S*1.4], color: '#ffcc00', metalness: 0.5, roughness: 0.3 },
      { type: 'mech_super_fist', name: 'Right Mega Fist', position: [1.9, 1.8, 0.2], rotation: [0, 0, 0], scale: [-S*1.4, S*1.4, S*1.4], color: '#ffcc00', metalness: 0.5, roughness: 0.3 },
    ],
  },

  // ─── Template 8: Flight Type ───────────────────────────────────────
  {
    id: 'tpl_flight_type',
    name: 'Flight Type',
    description: 'An aerial combat mech optimized for speed and maneuverability. White and blue color scheme.',
    mechType: 'flight',
    parts: [
      { type: 'mech_head_visor', name: 'Visor Head', position: [0, 5.2, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#e0e8f0', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_cockpit_torso', name: 'Cockpit Torso', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_shoulder_pad', name: 'Left Shoulder Pad', position: [-1.3, 4.4, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_shoulder_pad', name: 'Right Shoulder Pad', position: [1.3, 4.4, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_upper_arm', name: 'Left Upper Arm', position: [-1.4, 3.5, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_upper_arm', name: 'Right Upper Arm', position: [1.4, 3.5, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_forearm', name: 'Left Forearm', position: [-1.5, 2.6, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_forearm', name: 'Right Forearm', position: [1.5, 2.6, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_waist', name: 'Waist', position: [0, 2.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#dddddd', metalness: 0.3, roughness: 0.5 },
      { type: 'mech_thigh', name: 'Left Thigh', position: [-0.6, 1.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_thigh', name: 'Right Thigh', position: [0.6, 1.8, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_shin', name: 'Left Shin', position: [-0.6, 0.9, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_shin', name: 'Right Shin', position: [0.6, 0.9, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#3366cc', metalness: 0.4, roughness: 0.4 },
      { type: 'mech_foot_heavy', name: 'Left Foot', position: [-0.6, 0.15, 0.2], rotation: [0, 0, 0], scale: [S*0.9, S*0.9, S*0.9], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_foot_heavy', name: 'Right Foot', position: [0.6, 0.15, 0.2], rotation: [0, 0, 0], scale: [-S*0.9, S*0.9, S*0.9], color: '#ffffff', metalness: 0.3, roughness: 0.4 },
      { type: 'mech_thruster_pack', name: 'Thruster Pack', position: [0, 4.0, -1.0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#3366cc', metalness: 0.5, roughness: 0.3 },
      { type: 'mech_delta_wing', name: 'Left Delta Wing', position: [-1.5, 4.2, -1.4], rotation: [0, -0.25, -0.15], scale: [S*1.2, S, S*1.2], color: '#ffffff', metalness: 0.4, roughness: 0.3 },
      { type: 'mech_delta_wing', name: 'Right Delta Wing', position: [1.5, 4.2, -1.4], rotation: [0, 0.25, 0.15], scale: [-S*1.2, S, S*1.2], color: '#ffffff', metalness: 0.4, roughness: 0.3 },
      { type: 'mech_aero_fin', name: 'Left Aero Fin', position: [-0.8, 2.6, -1.2], rotation: [0, -0.1, -0.1], scale: [S*0.8, S*0.8, S*0.8], color: '#3366cc', metalness: 0.4, roughness: 0.3 },
      { type: 'mech_aero_fin', name: 'Right Aero Fin', position: [0.8, 2.6, -1.2], rotation: [0, 0.1, 0.1], scale: [-S*0.8, S*0.8, S*0.8], color: '#3366cc', metalness: 0.4, roughness: 0.3 },
    ],
  },

  // ─── Template 9: Sniper Type ───────────────────────────────────────
  {
    id: 'tpl_sniper_type',
    name: 'Sniper Type',
    description: 'A long-range specialized mech with enhanced targeting systems. Dark green and black color scheme.',
    mechType: 'sniper',
    parts: [
      { type: 'mech_head_sensor', name: 'Sensor Head', position: [0, 5.2, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#1a3a1a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_chest_plate', name: 'Chest Plate', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_shoulder_pad', name: 'Left Shoulder Pad', position: [-1.3, 4.4, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_shoulder_pad', name: 'Right Shoulder Pad', position: [1.3, 4.4, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_upper_arm', name: 'Left Upper Arm', position: [-1.4, 3.5, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_upper_arm', name: 'Right Upper Arm', position: [1.4, 3.5, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_forearm', name: 'Left Forearm', position: [-1.5, 2.6, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#1a3a1a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_forearm', name: 'Right Forearm', position: [1.5, 2.6, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#1a3a1a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_waist', name: 'Waist', position: [0, 2.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#222222', metalness: 0.4, roughness: 0.6 },
      { type: 'mech_thigh', name: 'Left Thigh', position: [-0.6, 1.8, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_thigh', name: 'Right Thigh', position: [0.6, 1.8, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_shin', name: 'Left Shin', position: [-0.6, 0.9, 0], rotation: [0, 0, 0], scale: [S, S, S], color: '#1a3a1a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_shin', name: 'Right Shin', position: [0.6, 0.9, 0], rotation: [0, 0, 0], scale: [-S, S, S], color: '#1a3a1a', metalness: 0.4, roughness: 0.5 },
      { type: 'mech_foot_heavy', name: 'Left Foot', position: [-0.6, 0.15, 0.2], rotation: [0, 0, 0], scale: [S, S, S], color: '#222222', metalness: 0.4, roughness: 0.6 },
      { type: 'mech_foot_heavy', name: 'Right Foot', position: [0.6, 0.15, 0.2], rotation: [0, 0, 0], scale: [-S, S, S], color: '#222222', metalness: 0.4, roughness: 0.6 },
      { type: 'mech_beam_rifle', name: 'Sniper Rifle', position: [2.0, 3.0, 1.2], rotation: [-0.1, 0, -0.05], scale: [S*1.5, S*1.3, S*1.8], color: '#1a1a1a', metalness: 0.6, roughness: 0.3 },
      { type: 'mech_stabilizer', name: 'Stabilizer', position: [0, 3.8, -1.0], rotation: [0, 0, 0], scale: [S, S, S], color: '#2a4a2a', metalness: 0.4, roughness: 0.5 },
    ],
  },

  // ─── Template 10: Berserker ────────────────────────────────────────
  {
    id: 'tpl_berserker',
    name: 'Berserker',
    description: 'A close-combat focused mech built for raw aggression. Red and black color scheme.',
    mechType: 'berserker',
    parts: [
      { type: 'mech_head_horn', name: 'Horn Head', position: [0, 5.4, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_heavy_chest', name: 'Heavy Chest', position: [0, 3.8, 0], rotation: [0, 0, 0], scale: [S*1.15, S*1.15, S*1.1], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_heavy_shoulder', name: 'Left Heavy Shoulder', position: [-1.7, 4.6, 0], rotation: [0, 0, 0], scale: [S*1.2, S*1.2, S*1.2], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_heavy_shoulder', name: 'Right Heavy Shoulder', position: [1.7, 4.6, 0], rotation: [0, 0, 0], scale: [-S*1.2, S*1.2, S*1.2], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_heavy_arm', name: 'Left Heavy Arm', position: [-1.7, 3.0, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_heavy_arm', name: 'Right Heavy Arm', position: [1.7, 3.0, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_fist', name: 'Left Fist', position: [-1.8, 2.0, 0.2], rotation: [0, 0, 0], scale: [S*1.3, S*1.3, S*1.3], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_fist', name: 'Right Fist', position: [1.8, 2.0, 0.2], rotation: [0, 0, 0], scale: [-S*1.3, S*1.3, S*1.3], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_waist', name: 'Waist', position: [0, 2.8, 0], rotation: [0, 0, 0], scale: [S*1.1, S, S*1.1], color: '#111111', metalness: 0.4, roughness: 0.6 },
      { type: 'mech_thigh', name: 'Left Thigh', position: [-0.7, 1.8, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_thigh', name: 'Right Thigh', position: [0.7, 1.8, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
      { type: 'mech_shin', name: 'Left Shin', position: [-0.7, 0.9, 0], rotation: [0, 0, 0], scale: [S*1.1, S*1.1, S*1.1], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_shin', name: 'Right Shin', position: [0.7, 0.9, 0], rotation: [0, 0, 0], scale: [-S*1.1, S*1.1, S*1.1], color: '#aa0000', metalness: 0.5, roughness: 0.4 },
      { type: 'mech_heavy_foot', name: 'Left Stomper', position: [-0.7, 0.15, 0.2], rotation: [0, 0, 0], scale: [S*1.2, S*1.1, S*1.2], color: '#111111', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_heavy_foot', name: 'Right Stomper', position: [0.7, 0.15, 0.2], rotation: [0, 0, 0], scale: [-S*1.2, S*1.1, S*1.2], color: '#111111', metalness: 0.5, roughness: 0.6 },
      { type: 'mech_blade', name: 'Left Heat Blade', position: [-2.2, 2.8, 0.6], rotation: [0, 0, -0.15], scale: [S*1.1, S*1.2, S*1.1], color: '#ff4400', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_blade', name: 'Right Heat Blade', position: [2.2, 2.8, 0.6], rotation: [0, 0, 0.15], scale: [-S*1.1, S*1.2, S*1.1], color: '#ff4400', metalness: 0.3, roughness: 0.2 },
      { type: 'mech_back_thruster', name: 'Back Thruster', position: [0, 4.0, -0.9], rotation: [0, 0, 0], scale: [S*1.2, S*1.2, S*1.2], color: '#1a1a1a', metalness: 0.5, roughness: 0.5 },
    ],
  },
];

// ─── Utility Functions ─────────────────────────────────────────────

export function getMechTypes(): { id: string; name: string }[] {
  return [
    { id: 'gundam', name: 'Gundam Type' },
    { id: 'heavy', name: 'Heavy Armor' },
    { id: 'stealth', name: 'Stealth Frame' },
    { id: 'knight', name: 'Knight Frame' },
    { id: 'beast', name: 'Beast Frame' },
    { id: 'tank', name: 'Tank Frame' },
    { id: 'super', name: 'Super Robot' },
    { id: 'flight', name: 'Flight Type' },
    { id: 'sniper', name: 'Sniper Type' },
    { id: 'berserker', name: 'Berserker' },
  ];
}

export function getTemplatesByType(type: string): MechTemplate[] {
  return mechTemplates.filter((t) => t.mechType === type);
}
