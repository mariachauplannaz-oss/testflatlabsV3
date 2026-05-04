// ═══ config/index.js — Re-exports everything from the modular config files ═══
// Import from here if you want access to the full config tree from within /config/.

export { FABRIC_SPECS }                                              from './universal/fabrics.js';
export { STITCH_SPECS }                                              from './universal/stitches.js';
export { COMPONENT_META, collectMeasurements, collectConstruction }  from './garments/tshirt.js';
export { ISO_BODY, SIZE_EQUIV, TOLERANCES, GRADING, PANTONE_APPROX, findClosestPantone } from './measurements.js';
