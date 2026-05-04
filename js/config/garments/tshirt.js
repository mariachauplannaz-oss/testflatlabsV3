// ═══ tshirt.js — T-shirt component metadata, measurements, construction ═══

import { GRADING, TOLERANCES } from '../measurements.js';

export const COMPONENT_META = {

    // ─── TORSOS ───────────────────────────────────────────────
    torsos: {
        reg: {
            label: 'Regular Fit',
            ease: 'regular',
            measures: {
                chest:      { letter: 'TS-A', label: 'Chest (1/2)',           value: 46,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam, edge to edge' },
                waist:      { letter: 'TS-B', label: 'Waist (1/2)',           value: 44,   unit: 'cm', pom: 'Measured flat at natural waist, edge to edge' },
                length:     { letter: 'TS-C', label: 'Body Length (HPS)',     value: 62,   unit: 'cm', pom: 'From HPS seam straight down to hem edge' },
                shoulder:   { letter: 'TS-D', label: 'Shoulder Width',        value: 38.5, unit: 'cm', pom: 'Shoulder seam to shoulder seam, across back yoke' },
                hem:        { letter: 'TS-E', label: 'Hem Width (1/2)',       value: 48,   unit: 'cm', pom: 'Measured flat at hem, edge to edge' },
                armhole:    { letter: 'TS-F', label: 'Armhole Straight',      value: 21,   unit: 'cm', pom: 'Shoulder seam to underarm seam, straight' }
            },
            back_measures: {
                across_back: { letter: 'TS-N', label: 'Across Back (1/2)', value: 37, unit: 'cm', pom: 'Armhole seam to armhole seam, 10 cm below CB neck, measured flat' },
                back_length: { letter: 'TS-O', label: 'CB Length',         value: 64, unit: 'cm', pom: 'From CB neck seam straight down to hem edge' }
            },
            construction: 'Side seams: ISO 514 (overlock 4-thread). Hem: double-needle coverseam 2 cm.',
            iso_norm: 'ISO 514'
        },
        crp: {
            label: 'Crop Fit',
            ease: 'regular',
            measures: {
                chest:      { letter: 'TS-A', label: 'Chest (1/2)',           value: 46,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam, edge to edge' },
                waist:      { letter: 'TS-B', label: 'Waist (1/2)',           value: 44,   unit: 'cm', pom: 'Measured flat at natural waist, edge to edge' },
                length:     { letter: 'TS-C', label: 'Body Length (HPS)',     value: 48,   unit: 'cm', pom: 'From HPS seam straight down to hem edge' },
                shoulder:   { letter: 'TS-D', label: 'Shoulder Width',        value: 38.5, unit: 'cm', pom: 'Shoulder seam to shoulder seam, across back yoke' },
                hem:        { letter: 'TS-E', label: 'Hem Width (1/2)',       value: 46,   unit: 'cm', pom: 'Measured flat at hem, edge to edge' },
                armhole:    { letter: 'TS-F', label: 'Armhole Straight',      value: 21,   unit: 'cm', pom: 'Shoulder seam to underarm seam, straight' }
            },
            back_measures: {
                across_back: { letter: 'TS-N', label: 'Across Back (1/2)', value: 37, unit: 'cm', pom: 'Armhole seam to armhole seam, 10 cm below CB neck, measured flat' },
                back_length: { letter: 'TS-O', label: 'CB Length',         value: 50, unit: 'cm', pom: 'From CB neck seam straight down to hem edge' }
            },
            construction: 'Side seams: ISO 514 (overlock 4-thread). Hem: exposed raw edge or coverseam.',
            iso_norm: 'ISO 514'
        },
        slm: {
            label: 'Slim Fit',
            ease: 'slim',
            measures: {
                chest:      { letter: 'TS-A', label: 'Chest (1/2)',       value: 44,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam, edge to edge' },
                waist:      { letter: 'TS-B', label: 'Waist (1/2)',       value: 41,   unit: 'cm', pom: 'Measured flat at natural waist, edge to edge' },
                length:     { letter: 'TS-C', label: 'Body Length (HPS)', value: 62,   unit: 'cm', pom: 'From HPS seam straight down to hem edge' },
                shoulder:   { letter: 'TS-D', label: 'Shoulder Width',    value: 37.5, unit: 'cm', pom: 'Shoulder seam to shoulder seam, across back yoke' },
                hem:        { letter: 'TS-E', label: 'Hem Width (1/2)',   value: 44,   unit: 'cm', pom: 'Measured flat at hem, edge to edge' },
                armhole:    { letter: 'TS-F', label: 'Armhole Straight',  value: 20,   unit: 'cm', pom: 'Shoulder seam to underarm seam, straight' }
            },
            back_measures: {
                across_back: { letter: 'TS-N', label: 'Across Back (1/2)', value: 36, unit: 'cm', pom: 'Armhole seam to armhole seam, 10 cm below CB neck, measured flat' },
                back_length: { letter: 'TS-O', label: 'CB Length',         value: 64, unit: 'cm', pom: 'From CB neck seam straight down to hem edge' }
            },
            construction: 'Side seams: ISO 514 (overlock 4-thread). Hem: double-needle coverseam 2 cm.',
            iso_norm: 'ISO 514'
        }
    },

    // ─── SLEEVES ──────────────────────────────────────────────
    sleeves: {
        lon: {
            label: 'Long Sleeve',
            measures: {
                sleeve_length:  { letter: 'TS-K', label: 'Sleeve Length',      value: 60,   unit: 'cm', pom: 'Shoulder seam to cuff edge, arm straight' },
                bicep:          { letter: 'TS-L', label: 'Bicep Width (1/2)',  value: 16,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam' },
                cuff_opening:   { letter: 'TS-M', label: 'Cuff Opening (1/2)', value: 10.5, unit: 'cm', pom: 'Measured flat at cuff, edge to edge' }
            },
            construction: 'Sleeve seam: ISO 514 (overlock). Cuff: coverseam ISO 406, 2 cm.',
            iso_norm: 'ISO 514'
        },
        cap: {
            label: 'Short Sleeve',
            measures: {
                sleeve_length:  { letter: 'TS-K', label: 'Sleeve Length',          value: 20,   unit: 'cm', pom: 'Shoulder seam to sleeve hem, arm straight' },
                bicep:          { letter: 'TS-L', label: 'Bicep Width (1/2)',      value: 17,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam' },
                sleeve_opening: { letter: 'TS-M', label: 'Sleeve Opening (1/2)',   value: 15.5, unit: 'cm', pom: 'Measured flat at sleeve hem, edge to edge' }
            },
            construction: 'Sleeve hem: coverseam ISO 406, 2 cm. Set-in sleeve.',
            iso_norm: 'ISO 514'
        }
    },

    // ─── NECKS ────────────────────────────────────────────────
    necks: {
        rnd: {
            label: 'Crew Neck',
            measures: {
                neck_width:     { letter: 'TS-G', label: 'Neck Width (1/2)',    value: 9,    unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { letter: 'TS-H', label: 'Front Neck Drop',     value: 8.5,  unit: 'cm', pom: 'From HPS to lowest point of front neckline, straight' },
                back_drop:      { letter: 'TS-I', label: 'Back Neck Drop',      value: 2.5,  unit: 'cm', pom: 'From HPS to lowest point of back neckline, straight' },
                binding_width:  { letter: 'TS-J', label: 'Rib Binding Width',   value: 1.5,  unit: 'cm', pom: 'Finished width of neck binding' }
            },
            construction: 'Rib binding 2×1 (cotton/elastane). Attached with ISO 301 flatlock stitch 0.1 cm from edge. Binding stretched 90% of neckline length.',
            iso_norm: 'ISO 301'
        },
        v: {
            label: 'V-Neck',
            measures: {
                neck_width:     { letter: 'TS-G', label: 'Neck Width (1/2)',    value: 9,    unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { letter: 'TS-H', label: 'Front Neck Drop',     value: 18,   unit: 'cm', pom: 'From HPS to V-point, straight' },
                back_drop:      { letter: 'TS-I', label: 'Back Neck Drop',      value: 2.5,  unit: 'cm', pom: 'From HPS to lowest point of back neckline, straight' },
                binding_width:  { letter: 'TS-J', label: 'Rib Binding Width',   value: 1.5,  unit: 'cm', pom: 'Finished width of neck binding' }
            },
            construction: 'Rib binding 2×1. ISO 301 flatlock stitch. V-point: mitered finish with tape reinforcement.',
            iso_norm: 'ISO 301'
        },
        mok: {
            label: 'Mock Neck',
            measures: {
                neck_width:     { letter: 'TS-G', label: 'Neck Width (1/2)',    value: 8.5,  unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                collar_height:  { letter: 'TS-J', label: 'Collar Height',       value: 4.5,  unit: 'cm', pom: 'From neckline seam to top of collar, straight' },
                front_drop:     { letter: 'TS-H', label: 'Front Nec
