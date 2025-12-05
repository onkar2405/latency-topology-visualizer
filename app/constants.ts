export const EARTH_DIMENTIONS = {
  RADIUS: 2,
  WIDTH_SEGMENTS: 64,
  HEIGHT_SEGMENTS: 64,
};

export const EARTH_IMG_URL =
  "https://neo.gsfc.nasa.gov/archive/bluemarble/bmng/world_8km/world.topo.bathy.200412.3x5400x2700.jpg";

export const CAMERA_SETTINGS = {
  POSITION: [0, 0, 5] as [number, number, number],
  FOV: 45,
};

export const AMBIENT_LIGHT_INTENSITY = 0.6;
export const DIRECTIONAL_LIGHT = {
  INTENSITY: 1.2,
  POSITION: [5, 5, 5] as [number, number, number],
};

export const ORBIT_CONTROLS_SETTINGS = {
  DAMPING_FACTOR: 0.1,
  ROTATE_SPEED: 0.5,
  ZOOM_SPEED: 0.8,
  MIN_DISTANCE: 3,
  MAX_DISTANCE: 10,
  PAN_SPEED: 0.5,
};

export const REGION_DIMENSIONS = {
  RING_INNER_RADIUS: 0.22,
  RING_OUTER_RADIUS: 0.38,
  SEGMENTS: 64,
};

export const REGION_OUTER_MARK_DIMENSIONS = {
  RING_INNER_RADIUS: 0.3,
  TUBE_THICKNESS: 0.01,
  RADIAL_SENGMENTS: 4,
  TUBULAR_SEGMENTS: 16,
};
