/**
 * LazyEye Central Game Registry & Configuration
 * Single Source of Truth for Game Metadata, Modern Vector Mascots, Clinical Descriptions, and Routes.
 */

export const GAMES_CONFIG = [
  {
    id: 'Snake',
    aliases: ['snake', 'game1snake'],
    title: 'Snake',
    route: '/game1snake',
    icon: '/images/snake-mascot.svg',
    tag: 'Binocular Fusion',
    tagIcon: 'fa-eye',
    badgeClass: 'badge-emerald',
    time: '20 mins',
    desc: 'Guide the snake to hunt moving targets. Red and cyan filtering splits the snake and food between eyes, stimulating binocular cortical fusion and reducing amblyopic suppression.',
    bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(5, 150, 105, 0.28) 100%)',
    clinicalType: 'Binocular Suppression Therapy'
  },
  {
    id: 'Flappy Bird',
    aliases: ['flappy bird', 'flappybird', 'flappy', 'game2flappybird'],
    title: 'Flappy Bird',
    route: '/game2flappybird',
    icon: '/images/flappy-mascot.svg',
    tag: 'Visual Timing',
    tagIcon: 'fa-plane-departure',
    badgeClass: 'badge-sky',
    time: '15 mins',
    desc: 'Navigate altitude obstacles requiring rapid saccadic eye movements. Color separation ensures both eyes coordinate in real time to judge clearances.',
    bg: 'linear-gradient(135deg, #075985 0%, #0284c7 50%, #0369a1 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.16) 0%, rgba(2, 132, 199, 0.28) 100%)',
    clinicalType: 'Saccadic Coordination Therapy'
  },
  {
    id: 'Sticky Holds',
    aliases: ['sticky holds', 'stickyholds', 'stick hero', 'stickhero', 'game11stickyholds'],
    title: 'Sticky Holds',
    route: '/game11stickyholds',
    icon: '/images/stickyholds-mascot.svg',
    tag: 'Distance & Depth Estimation',
    tagIcon: 'fa-ruler-combined',
    badgeClass: 'badge-slate',
    time: '15 mins',
    desc: 'Hold down the screen to stretch out a bridge stick across rectangular pillars. Release to drop the ladder across the chasm to the next wall. If too short or too long, the hero falls! Trains stereoscopic depth perception, distance judgment, and visual-motor timing under dichoptic viewing.',
    bg: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.16) 0%, rgba(71, 85, 105, 0.28) 100%)',
    clinicalType: 'Stereoscopic Distance Estimation'
  },
  {
    id: 'Menja',
    aliases: ['menja', 'game12menja'],
    title: 'Menja',
    route: '/game12menja',
    icon: '/images/menja-mascot.svg',
    tag: 'Visual Reflexes',
    tagIcon: 'fa-bolt',
    badgeClass: 'badge-indigo',
    time: '20 mins',
    desc: 'Slice dynamic 3D blocks in rapid succession as they fly toward you. Sharpens reaction velocity, stereoscopic depth judgment, and contrast sensitivity.',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(79, 70, 229, 0.28) 100%)',
    clinicalType: 'Reaction Velocity Therapy'
  },
  {
    id: 'Tetris',
    aliases: ['tetris', 'game8tetris'],
    title: 'Tetris',
    route: '/game8tetris',
    icon: '/images/tetris-mascot.svg',
    tag: 'Pattern Synthesis',
    tagIcon: 'fa-cubes',
    badgeClass: 'badge-purple',
    time: '20 mins',
    desc: 'Rotate and place color-filtered falling tetrominoes. Board boundaries and falling shapes are split between eyes, demanding simultaneous cortical vision.',
    bg: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7e22ce 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(147, 51, 234, 0.28) 100%)',
    clinicalType: 'Cortical Pattern Synthesis'
  },
  {
    id: 'Bubble Shooter',
    aliases: ['bubble shooter', 'bubbleshooter', 'bubble', 'game9bubbleshooter'],
    title: 'Bubble Shooter',
    route: '/game9bubbleshooter',
    icon: '/images/bubbles-mascot.svg',
    tag: 'Spatial Targeting',
    tagIcon: 'fa-bullseye',
    badgeClass: 'badge-amber',
    time: '15 mins',
    desc: 'Aim and pop matching bubble clusters to stimulate foveal fixation, peripheral vision, and active engagement in the amblyopic eye.',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.16) 0%, rgba(234, 88, 12, 0.28) 100%)',
    clinicalType: 'Foveal Fixation Therapy'
  },
  {
    id: 'Ping Pong',
    aliases: ['ping pong', 'pingpong', 'game10pingpong'],
    title: 'Ping Pong',
    route: '/game10pingpong',
    icon: '/images/pingpong-mascot.svg',
    tag: 'Speed Tracking',
    tagIcon: 'fa-table-tennis-paddle-ball',
    badgeClass: 'badge-teal',
    time: '15 mins',
    desc: 'Defend your table with rapid paddle tracking. High-velocity returns challenge binocular alignment and dynamic stereoscopic motion tracking.',
    bg: 'linear-gradient(135deg, #042f2e 0%, #0f766e 50%, #0d9488 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.16) 0%, rgba(13, 148, 136, 0.28) 100%)',
    clinicalType: 'Dynamic Stereoscopic Tracking'
  },
  {
    id: 'Maze',
    aliases: ['maze', 'game5maze'],
    title: 'Maze',
    route: '/game5maze',
    icon: '/images/maze-mascot.svg',
    tag: 'Spatial Search',
    tagIcon: 'fa-route',
    badgeClass: 'badge-yellow',
    time: '15 mins',
    desc: 'Solve intricate labyrinths with split visual cues, boosting visual search efficiency, spatial mapping, and neuro-visual pathway activation.',
    bg: 'linear-gradient(135deg, #451a03 0%, #854d0e 50%, #b45309 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.16) 0%, rgba(202, 138, 4, 0.28) 100%)',
    clinicalType: 'Visual Search & Mapping'
  },
  {
    id: 'Ball Catcher',
    aliases: ['ball catcher', 'ballcatcher', 'game3ballcatcher'],
    title: 'Ball Catcher',
    route: '/game3ballcatcher',
    icon: '/images/ballcatcher-mascot.svg',
    tag: 'Hand-Eye Sync',
    tagIcon: 'fa-hand-pointer',
    badgeClass: 'badge-rose',
    time: '15 mins',
    desc: 'Track and catch falling targets across visual fields to improve saccadic eye movements and visual-motor integration.',
    bg: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(225, 29, 72, 0.28) 100%)',
    clinicalType: 'Visual-Motor Integration'
  },
  {
    id: 'Bouncing Ball',
    aliases: ['bouncing ball', 'bouncingball', 'game7test'],
    title: 'Bouncing Ball',
    route: '/game7test',
    icon: '/images/bouncingball-mascot.svg',
    tag: 'Trajectory Tracking',
    tagIcon: 'fa-volleyball',
    badgeClass: 'badge-blue',
    time: '15 mins',
    desc: 'Anticipate dynamic rebounds and speed variations under dichoptic viewing to enhance depth perception and tracking agility.',
    bg: 'linear-gradient(135deg, #172554 0%, #1e40af 50%, #2563eb 100%)',
    bannerBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.16) 0%, rgba(37, 99, 235, 0.28) 100%)',
    clinicalType: 'Trajectory Anticipation'
  }
];

/**
 * Returns complete configuration for a given game name or alias.
 */
export function getGameConfig(gameName) {
  if (!gameName) return null;
  const clean = String(gameName).toLowerCase().trim().replace(/[-_]/g, ' ');
  for (const g of GAMES_CONFIG) {
    if (g.id.toLowerCase() === clean || g.title.toLowerCase() === clean) {
      return g;
    }
    if (g.aliases && g.aliases.some(a => a.toLowerCase().replace(/[-_]/g, ' ') === clean)) {
      return g;
    }
  }
  return null;
}

/**
 * Single source of truth for game icons across all dashboard and report components.
 */
export function getGameIcon(gameName) {
  const conf = getGameConfig(gameName);
  return conf ? conf.icon : '/images/lazyeye-icon.svg';
}

/**
 * Returns all active game configurations.
 */
export function getAllGames() {
  return GAMES_CONFIG;
}

export default GAMES_CONFIG;

