// ═══ config.js — Dictionaries, categories, mannequin settings ═══

export const DICT = {
    reg:'Regular', mok:'Mock Neck', v:'V-Neck', rnd:'Round', scp:'Scoop', bot:'Boat',
    trt:'Turtle', vdp:'Deep V', set:'Set-in', rag:'Raglan', cap:'Cap', lon:'Long',
    low:'Drop Shoulder', crp:'Cropped', bag:'Baggy', str:'Straight', slm:'Slim', wde:'Wide'
};

export const MANNEQUIN_CFG = {
iso: {
        file: 'mannequin_iso.svg',
        previewViewBox: '134 286 3275 4174',
        backViewBox: '3677 266 3275 4171',
        exportViewBox: '204 316 3135 4114',
        exportBackViewBox: '3747 296 3135 4111',
        strokeWidth: '8',
        seamStrokeWidth: '4',
        seamDash: '12 12',
        label: 'ISO EU38',
        hasBack: true
    }
};

export const GARMENT_ICONS = {
    tshirt: '<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><path d="M32.59 41.98H12.23c-.93 0-1.81-.09-2.26-1.1l-.02-.04c-.37-.83.01-1.37.27-2.12.68-2 .93-4.2 1.12-6.29l.15-2.48c.01-.27.06-.54.06-.8l0-6.02c-.05-1.06-.26-2.11-.3-3.17-2.02-.09-1.77 2.33-3.43 2.04-2.64-.46-4.5-3.08-6.03-5.06-.35-.45-.85-.95-.99-1.51-.46-1.78 2.01-2.71 3.22-3.38l4.13-2.33c.47-.28.94-.55 1.39-.86 1.05-.73 2.07-1.59 3.4-1.71l.83-.03c1.5-.12 2.89-.68 4.33-1.06.58-.06.84.49 1.19.85 1.32 1.39 3.02 1.75 4.85 1.74 1.78-.01 3.68-.45 4.85-1.89.72-.87.49-.81 1.66-.48l2.43.65c.4.09.8.15 1.21.18 1.59.11 2.2.31 3.58 1.29l1.28.87 6.31 3.58c.61.35 1.69.92 1.8 1.71l.02.1c.18.72-.33 1.3-.75 1.81l-1.61 2.1c-1.1 1.36-2.88 3.24-4.66 3.43h-.04c-.79.08-1.04-.17-1.41-.78-.45-.74-1.15-1.6-2.08-1.09-.06.26-.06.53-.08.79l-.14 1.39c-.05.34-.04.69-.04 1.04l.01 6.11c.01.26.07.51.08.77l.03 1.3.01.26.05.78.52 3.64c.1.59.19 1.19.37 1.75.14.45.54 1.37.6 1.73 0 .03.01.06.02.09.34.94-.59 1.97-1.48 2.15l-.04 0c-.44.09-.96.04-1.41.04h-2.65z" fill="currentColor"/></svg>',
    pants: '<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><path d="M25.8 30.58l-1.77-8.57c-.14.31-.18.66-.25.99l-1.55 7.41-.76 4.14-1.06 6.74c-.2 1.13-1.34 1.07-2.17 1.07l-5.8 0c-.19 0-.39.01-.57-.03l-.03-.01c-1.22-.28-1.16-1.22-1.16-2.2l.01-8.63.11-3.91c.01-.37.07-.74.09-1.1l.01-1.84c.01-.38.08-.76.09-1.14l.02-1.94c.01-.27.06-.54.07-.81l.12-3.09.19-2.79c.09-1.07.27-2.14.48-3.2l.39-1.97c.06-.29.04-.61.04-.91l0-1.33c0-.29-.04-.68.09-.94.32-.63.73-.9 1.46-.95l19.72-.01c1.6 0 2.14.33 2.14 1.92l0 1.18c0 .39.05.77.11 1.17l.18.99.05.18.2.93c.14.74.23 1.49.3 2.23l.14 2.04c.02.25 0 .56.06.8l.03.13c.11.5.06 1.07.08 1.58.01.2.06.4.06.6l.02 1.5c.01.22.06.45.07.67l.02 1.58c.01.29.08.57.09.86l.03 1.94c.01.16.04.32.04.49l.05 2.29c.01.18.05.36.06.54l.01 1.6c.01.19.05.38.05.57l.01 8.3c0 1.12.25 2.24-1.13 2.66l-.07.02c-.14.03-.3.03-.44.03l-5.47 0c-2.02 0-2.45.21-2.77-2.11l-1.67-9.67z" fill="currentColor"/></svg>',
    jacket: '<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><path d="M24.46 42.03l-.37-.4c-1.41 1.45-2.27 1.47-4.24 1.48l-3.59 0c-2.13 0-4.12-1.14-4.69-3.3-.08-.3-.1-.61-.17-.92l-.44.23c-1.8.84-4.1.2-4.92-1.67-.18-.42-.58-2-.59-2.42l-.1-1.68 0-4.9c.01-.21.06-.42.07-.64.22-3.58.84-7.31 2.16-10.66 1.23-3.12 2.97-5.42 6.22-6.68l1.86-.64c.42-.12.84-.22 1.24-.4l-.05-.21c-.55-1.71 1.23-3.68 2.89-4.02.36-.07.72-.09 1.08-.14l.92-.09c.16-.01.32-.05.48-.05l1.02-.01 3.07.08c1.79.12 4.08.59 4.73 2.56l.08.25c.15.47.12 1.2-.07 1.67l2.37.76c2.47.8 4.69 2.41 5.95 4.72l1.23 2.76c.22.45.3.98.47 1.45l.93 4.03c.05.15.06.3.08.46l.42 3.13.07 1.13c.08.8.08 1.38.08 2.18l-.03 3.52c-.01.19-.06.37-.07.56-.02.37.01.78-.05 1.14-.07.45-.36 1.64-.51 2.04-.42 1.13-1.48 1.99-2.68 2.14-.85.11-2 0-2.7-.54l-.02-.02c-.03.2-.05.41-.09.61-.49 2.17-2.23 3.56-4.46 3.65l-4.26 0c-1.27 0-2.21-.03-3.23-.98l-.1-.1z" fill="currentColor"/></svg>'
};

export const CATEGORIES = [
    { id:'tshirt', label:'T-Shirt', icon:'tshirt' },
    { id:'pants',  label:'Pants',   icon:'pants',  disabled:true },
    { id:'jacket', label:'Jacket',  icon:'jacket', disabled:true }
];


// ═══════════════════════════════════════════════════════════════
// MEASUREMENT LIBRARY
// ═══════════════════════════════════════════════════════════════


// ─── LAYER 1: ISO Body Measurements (reference only, not garment) ──
// Source: ISO 8559-1:2017 — Size designation of clothes
// These are the BODY, not the garment. The garment adds ease on top.
// Base size: EU38 Female

export const ISO_BODY = {
    EU38: {
        label: 'EU 38',
        gender: 'female',
        body: {
            bust:             { value: 88,   unit: 'cm', type: 'circumference', description: 'Fullest part of bust' },
            waist:            { value: 72,   unit: 'cm', type: 'circumference', description: 'Natural waistline' },
            hip:              { value: 96,   unit: 'cm', type: 'circumference', description: '20 cm below waist' },
            shoulder_width:   { value: 38,   unit: 'cm', type: 'straight',      description: 'Shoulder point to shoulder point (across back)' },
            back_length:      { value: 40,   unit: 'cm', type: 'straight',      description: 'Nape to waist (center back)' },
            arm_length:       { value: 58,   unit: 'cm', type: 'straight',      description: 'Shoulder point to wrist' },
            upper_arm:        { value: 28,   unit: 'cm', type: 'circumference', description: 'Fullest part of upper arm' },
            neck_base:        { value: 36,   unit: 'cm', type: 'circumference', description: 'Base of neck' },
            armhole_depth:    { value: 20.5, unit: 'cm', type: 'straight',      description: 'HPS to underarm level' },
            front_neck_drop:  { value: 4.5,  unit: 'cm', type: 'straight',      description: 'HPS to center front neck (body landmark)' },
            body_rise:        { value: 27,   unit: 'cm', type: 'straight',      description: 'Waist to crotch' },
            inseam:           { value: 78,   unit: 'cm', type: 'straight',      description: 'Crotch to ankle bone' },
            thigh:            { value: 57,   unit: 'cm', type: 'circumference', description: 'Fullest part of thigh' },
            knee:             { value: 37,   unit: 'cm', type: 'circumference', description: 'At knee center' },
            ankle:            { value: 23,   unit: 'cm', type: 'circumference', description: 'Above ankle bone' },
            total_height:     { value: 168,  unit: 'cm', type: 'straight',      description: 'Total body height' }
        }
    }
    // Future: EU34, EU36, EU40, EU42, EU44 go here
    // Each size uses the same structure, different values
};


// ─── LAYER 2: International Size Equivalences ─────────────────
// Lookup table connecting EU sizes to other systems

export const SIZE_EQUIV = {
    EU34: { us: '2',  uk: '6',  it: '38', fr: '34', jp: '7',  au: '6'  },
    EU36: { us: '4',  uk: '8',  it: '40', fr: '36', jp: '9',  au: '8'  },
    EU38: { us: '6',  uk: '10', it: '42', fr: '38', jp: '11', au: '10' },
    EU40: { us: '8',  uk: '12', it: '44', fr: '40', jp: '13', au: '12' },
    EU42: { us: '10', uk: '14', it: '46', fr: '42', jp: '15', au: '14' },
    EU44: { us: '12', uk: '16', it: '48', fr: '44', jp: '17', au: '16' },
    EU46: { us: '14', uk: '18', it: '50', fr: '46', jp: '19', au: '18' },
    EU48: { us: '16', uk: '20', it: '52', fr: '48', jp: '21', au: '20' }
};


// ─── LAYER 3: Tolerances ──────────────────────────────────────
// Production tolerance rules based on measurement size
// Applied automatically when generating spec sheets

export const TOLERANCES = {
    // Rule: tolerance depends on the measurement value
    getRuleCm(valueCm) {
        if (valueCm >= 50) return 1.0;   // Large measurements: ±1.0 cm
        if (valueCm >= 20) return 0.5;   // Medium measurements: ±0.5 cm
        return 0.3;                       // Small measurements: ±0.3 cm
    },
    // Label for spec sheet
    formatTolerance(valueCm) {
        const tol = this.getRuleCm(valueCm);
        return `± ${tol.toFixed(1)}`;
    }
};


// ─── LAYER 4: Grading Table (structure ready, EU38 = base) ────
// Delta values in cm to add/subtract from EU38 base per size
// Positive = larger, negative = smaller
// When you add grading, fill in the deltas for each size

export const GRADING = {
    baseSize: 'EU38',
    // Deltas from EU38 for circumference measurements
    // Each step (EU36→38→40) is typically +/- 4 cm on bust/hip, +/- 4 cm on waist
    sizes: {
        EU34: { bust: -8, waist: -8, hip: -8, shoulder: -2, sleeve: -1, length: -1 },
        EU36: { bust: -4, waist: -4, hip: -4, shoulder: -1, sleeve: -0.5, length: -0.5 },
        EU38: { bust: 0,  waist: 0,  hip: 0,  shoulder: 0,  sleeve: 0,    length: 0 },
        EU40: { bust: +4, waist: +4, hip: +4, shoulder: +1, sleeve: +0.5, length: +0.5 },
        EU42: { bust: +8, waist: +8, hip: +8, shoulder: +2, sleeve: +1,   length: +1 },
        EU44: { bust: +12, waist: +12, hip: +12, shoulder: +3, sleeve: +1.5, length: +1.5 }
    },
    // Helper: get garment measurement for any size
    // Usage: getForSize('EU40', 'bust', 92) → 92 + 4 = 96
    getForSize(size, measureKey, baseValue) {
        const delta = this.sizes[size];
        if (!delta) return baseValue;
        // Map measurement keys to grading categories
        const keyMap = {
            chest: 'bust', bust: 'bust',
            waist: 'waist',
            hip: 'hip', hem: 'hip',
            shoulder: 'shoulder',
            sleeve_length: 'sleeve',
            length: 'length', body_length: 'length'
        };
        const gradingKey = keyMap[measureKey] || null;
        if (!gradingKey || delta[gradingKey] === undefined) return baseValue;
        return baseValue + delta[gradingKey];
    }
};


// ═══════════════════════════════════════════════════════════════
// COMPONENT_META — Garment measurements (EU38 base, WITH ease)
// ═══════════════════════════════════════════════════════════════
// These are GARMENT measurements, not body measurements.
// Garment = body + ease. Ease depends on fit type.
//
// How it connects:
//   User selects components → code reads COMPONENT_META for each
//   → collects all measurements → builds POM table for spec sheet
//   → applies TOLERANCES → applies GRADING for other sizes

export const COMPONENT_META = {

    // ─── TORSOS ───────────────────────────────────────────────
    torsos: {
        reg: {
            label: 'Regular Fit',
            ease: 'regular',   // 4-6 cm ease on bust
            measures: {
                chest:      { label: 'Chest (1/2)',           value: 46,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam, edge to edge' },
                waist:      { label: 'Waist (1/2)',           value: 44,   unit: 'cm', pom: 'Measured flat at natural waist, edge to edge' },
                length:     { label: 'Body Length (HPS)',     value: 62,   unit: 'cm', pom: 'From HPS seam straight down to hem edge' },
                shoulder:   { label: 'Shoulder Width',        value: 38.5, unit: 'cm', pom: 'Shoulder seam to shoulder seam, across back yoke' },
                hem:        { label: 'Hem Width (1/2)',       value: 48,   unit: 'cm', pom: 'Measured flat at hem, edge to edge' },
                armhole:    { label: 'Armhole Straight',      value: 21,   unit: 'cm', pom: 'Shoulder seam to underarm seam, straight' }
                
            },
            back_measures: {
                across_back: { label: 'Across Back (1/2)', value: 37, unit: 'cm', pom: 'Armhole seam to armhole seam, 10 cm below CB neck, measured flat' },
                back_length:  { label: 'CB Length',         value: 64, unit: 'cm', pom: 'From CB neck seam straight down to hem edge' }
            },
            construction: 'Side seams: ISO 514 (overlock 4-thread). Hem: double-needle coverseam 2 cm.',
            iso_norm: 'ISO 514'
        },
        crp: {
            label: 'Crop Fit',
            ease: 'regular',
            measures: {
                chest:      { label: 'Chest (1/2)',           value: 46,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam, edge to edge' },
                waist:      { label: 'Waist (1/2)',           value: 44,   unit: 'cm', pom: 'Measured flat at natural waist, edge to edge' },
                length:     { label: 'Body Length (HPS)',     value: 48,   unit: 'cm', pom: 'From HPS seam straight down to hem edge' },
                shoulder:   { label: 'Shoulder Width',        value: 38.5, unit: 'cm', pom: 'Shoulder seam to shoulder seam, across back yoke' },
                hem:        { label: 'Hem Width (1/2)',       value: 46,   unit: 'cm', pom: 'Measured flat at hem, edge to edge' },
                armhole:    { label: 'Armhole Straight',      value: 21,   unit: 'cm', pom: 'Shoulder seam to underarm seam, straight' }
            },
            back_measures: {
                across_back: { label: 'Across Back (1/2)', value: 37, unit: 'cm', pom: 'Armhole seam to armhole seam, 10 cm below CB neck, measured flat' },
                back_length:  { label: 'CB Length',         value: 50, unit: 'cm', pom: 'From CB neck seam straight down to hem edge' }
            },
            construction: 'Side seams: ISO 514 (overlock 4-thread). Hem: exposed raw edge or coverseam.',
            iso_norm: 'ISO 514'
        }
    },

    // ─── SLEEVES ──────────────────────────────────────────────
    sleeves: {
        lon: {
            label: 'Long Sleeve',
            measures: {
                sleeve_length:  { label: 'Sleeve Length',      value: 60,   unit: 'cm', pom: 'Shoulder seam to cuff edge, arm straight' },
                bicep:          { label: 'Bicep Width (1/2)',  value: 16,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam' },
                cuff_opening:   { label: 'Cuff Opening (1/2)', value: 10.5, unit: 'cm', pom: 'Measured flat at cuff, edge to edge' }
            },
            construction: 'Sleeve seam: ISO 514 (overlock). Cuff: coverseam ISO 406, 2 cm.',
            iso_norm: 'ISO 514'
        },
        cap: {
            label: 'Short Sleeve',
            measures: {
                sleeve_length:  { label: 'Sleeve Length',          value: 20,   unit: 'cm', pom: 'Shoulder seam to sleeve hem, arm straight' },
                bicep:          { label: 'Bicep Width (1/2)',      value: 17,   unit: 'cm', pom: 'Measured flat, 2.5 cm below armhole seam' },
                sleeve_opening: { label: 'Sleeve Opening (1/2)',   value: 15.5, unit: 'cm', pom: 'Measured flat at sleeve hem, edge to edge' }
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
                neck_width:     { label: 'Neck Width (1/2)',    value: 9,    unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { label: 'Front Neck Drop',     value: 8.5,  unit: 'cm', pom: 'From HPS to lowest point of front neckline, straight' },
                back_drop:      { label: 'Back Neck Drop',      value: 2.5,  unit: 'cm', pom: 'From HPS to lowest point of back neckline, straight' },
                binding_width:  { label: 'Rib Binding Width',   value: 1.5,  unit: 'cm', pom: 'Finished width of neck binding' }
            },
            construction: 'Rib binding 2×1 (cotton/elastane). Attached with ISO 301 flatlock stitch 0.1 cm from edge. Binding stretched 90% of neckline length.',
            iso_norm: 'ISO 301'
        },
        v: {
            label: 'V-Neck',
            measures: {
                neck_width:     { label: 'Neck Width (1/2)',    value: 9,    unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { label: 'Front Neck Drop',     value: 18,   unit: 'cm', pom: 'From HPS to V-point, straight' },
                back_drop:      { label: 'Back Neck Drop',      value: 2.5,  unit: 'cm', pom: 'From HPS to lowest point of back neckline, straight' },
                binding_width:  { label: 'Rib Binding Width',   value: 1.5,  unit: 'cm', pom: 'Finished width of neck binding' }
            },
            construction: 'Rib binding 2×1. ISO 301 flatlock stitch. V-point: mitered finish with tape reinforcement.',
            iso_norm: 'ISO 301'
        },
        mok: {
            label: 'Mock Neck',
            measures: {
                neck_width:     { label: 'Neck Width (1/2)',    value: 8.5,  unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                collar_height:  { label: 'Collar Height',       value: 4.5,  unit: 'cm', pom: 'From neckline seam to top of collar, straight' },
                front_drop:     { label: 'Front Neck Drop',     value: 1.5,  unit: 'cm', pom: 'From HPS to neckline seam at CF' },
                back_drop:      { label: 'Back Neck Drop',      value: 1.5,  unit: 'cm', pom: 'From HPS to neckline seam at CB' }
            },
            construction: 'Self-fabric mock collar. ISO 301 flatlock stitch on collar seam. Fold at 4.5 cm.',
            iso_norm: 'ISO 301'
        },
        scp: {
            label: 'Scoop Neck',
            measures: {
                neck_width:     { label: 'Neck Width (1/2)',    value: 10,   unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { label: 'Front Neck Drop',     value: 14,   unit: 'cm', pom: 'From HPS to lowest point of scoop, straight' },
                back_drop:      { label: 'Back Neck Drop',      value: 2.5,  unit: 'cm', pom: 'From HPS to lowest point of back neckline, straight' },
                binding_width:  { label: 'Rib Binding Width',   value: 1.2,  unit: 'cm', pom: 'Finished width of neck binding' }
            },
            construction: 'Rib binding 2×1 (cotton/elastane). ISO 301 flatlock stitch 0.1 cm from edge.',
            iso_norm: 'ISO 301'
        },
        bot: {
            label: 'Boat Neck',
            measures: {
                neck_width:     { label: 'Neck Width (1/2)',    value: 12,   unit: 'cm', pom: 'Measured flat at HPS, half of neck opening' },
                front_drop:     { label: 'Front Neck Drop',     value: 5,    unit: 'cm', pom: 'From HPS to lowest point of neckline at CF, straight' },
                back_drop:      { label: 'Back Neck Drop',      value: 5,    unit: 'cm', pom: 'Same as front — symmetric neckline' },
                binding_width:  { label: 'Self-Finish Width',   value: 1.5,  unit: 'cm', pom: 'Folded self-fabric edge finish' }
            },
            construction: 'Self-fabric fold finish. ISO 301 stitch at edge. No separate binding.',
            iso_norm: 'ISO 301'
        }
    },

    // ─── BOM (Bill of Materials) — default for jersey T-shirt ─
    bom: {
        tshirt: [
            { ref: 'FAB-001', description: 'Main fabric — Jersey 180g/m² (95% Cotton, 5% Elastane)', unit: 'm',   qty: '1.2' },
            { ref: 'FAB-002', description: 'Rib fabric — 1×1 rib (95% Cotton, 5% Elastane)',         unit: 'm',   qty: '0.15' },
            { ref: 'THR-001', description: 'Polyester sewing thread — Tex 27 (ISO 180/2)',            unit: 'cone', qty: '1' },
            { ref: 'THR-002', description: 'Coverseam thread — Tex 18',                              unit: 'cone', qty: '1' },
            { ref: 'LAB-001', description: 'Care label — woven (symbols per EN ISO 3758)',            unit: 'pc',   qty: '1' },
            { ref: 'LAB-002', description: 'Brand label — woven or heat transfer',                   unit: 'pc',   qty: '1' },
            { ref: 'LAB-003', description: 'Size label — woven',                                     unit: 'pc',   qty: '1' },
            { ref: 'PKG-001', description: 'Polybag 35×45 cm, recycled PE',                          unit: 'pc',   qty: '1' }
        ]
    }
};


// ═══════════════════════════════════════════════════════════════
// HELPER: Collect all measurements for a garment configuration
// ═══════════════════════════════════════════════════════════════
// Usage:
//   const selections = { torso: 'reg', neck: 'rnd', sleeve: 'cap' };
//   const pom = collectMeasurements(selections);
//  → returns flat array of { code, description, value, unit, tolerance, pom }

export function collectMeasurements(selections, size = 'EU38', view = 'front') {
    const results = [];

    // Torso measurements
    if (selections.torso && COMPONENT_META.torsos[selections.torso]) {
        const torso = COMPONENT_META.torsos[selections.torso];
        const measureSource = view === 'back' ? torso.back_measures : torso.measures;
        if (measureSource) {
            for (const [key, m] of Object.entries(measureSource)) {
                const value = GRADING.getForSize(size, key, m.value);
                const prefix = view === 'back' ? 'BCK' : 'TRS';
                results.push({
                    code:        `${prefix}-${String(results.length + 1).padStart(3, '0')}`,
                    description: m.label,
                    value:       value,
                    unit:        m.unit,
                    tolerance:   TOLERANCES.formatTolerance(value),
                    pom:         m.pom || ''
                });
            }
        }
    }

        // Neck measurements
        if (view === 'front' && selections.neck && COMPONENT_META.necks[selections.neck]) {
            const neck = COMPONENT_META.necks[selections.neck];
            for (const [key, m] of Object.entries(neck.measures)) {
                const value = GRADING.getForSize(size, key, m.value);
                results.push({
                    code:        `NCK-${String(results.length + 1).padStart(3, '0')}`,
                    description: m.label,
                    value:       value,
                    unit:        m.unit,
                    tolerance:   TOLERANCES.formatTolerance(value),
                    pom:         m.pom || ''
                });
            }
        }
        
        // Sleeve measurements — front view only (same front and back, no need to duplicate)
        if (view === 'front' && selections.sleeve && COMPONENT_META.sleeves[selections.sleeve]) {
            const sleeve = COMPONENT_META.sleeves[selections.sleeve];
            for (const [key, m] of Object.entries(sleeve.measures)) {
                const value = GRADING.getForSize(size, key, m.value);
                results.push({
                    code:        `SLV-${String(results.length + 1).padStart(3, '0')}`,
                    description: m.label,
                    value:       value,
                    unit:        m.unit,
                    tolerance:   TOLERANCES.formatTolerance(value),
                    pom:         m.pom || ''
                });
            }          
        }             
        return results;
        } 

// ═══════════════════════════════════════════════════════════════
// HELPER: Get construction notes for a garment configuration
// ═══════════════════════════════════════════════════════════════

export function collectConstruction(selections) {
    const notes = [];

    if (selections.torso && COMPONENT_META.torsos[selections.torso]) {
        notes.push({
            component: COMPONENT_META.torsos[selections.torso].label,
            note: COMPONENT_META.torsos[selections.torso].construction,
            norm: COMPONENT_META.torsos[selections.torso].iso_norm
        });
    }
    if (selections.neck && COMPONENT_META.necks[selections.neck]) {
        notes.push({
            component: COMPONENT_META.necks[selections.neck].label,
            note: COMPONENT_META.necks[selections.neck].construction,
            norm: COMPONENT_META.necks[selections.neck].iso_norm
        });
    }
    if (selections.sleeve && COMPONENT_META.sleeves[selections.sleeve]) {
        notes.push({
            component: COMPONENT_META.sleeves[selections.sleeve].label,
            note: COMPONENT_META.sleeves[selections.sleeve].construction,
            norm: COMPONENT_META.sleeves[selections.sleeve].iso_norm
        });
    }

    return notes;
}

// ═══════════════════════════════════════════════════════════════
// COLORWAY — Pantone TCX approximate matching
// ═══════════════════════════════════════════════════════════════
// Source: ~30 common fashion industry colors.
// Matching is done via Euclidean distance in RGB space.
// This is an approximation only — not a calibrated color management system.
 
export const PANTONE_APPROX = [
    { hex: '#000000', name: 'Black',        pantone: '19-0303 TCX Jet Black' },
    { hex: '#FFFFFF', name: 'White',        pantone: '11-0601 TCX Bright White' },
    { hex: '#1C1C1C', name: 'Off Black',    pantone: '19-0508 TCX Peat' },
    { hex: '#F5F5DC', name: 'Cream',        pantone: '11-0507 TCX Winter White' },
    { hex: '#C4B9A8', name: 'Sand',         pantone: '14-1012 TCX Gilded Beige' },
    { hex: '#808080', name: 'Grey',         pantone: '17-4402 TCX Neutral Gray' },
    { hex: '#D3D3D3', name: 'Light Grey',   pantone: '14-4002 TCX Glacier Gray' },
    { hex: '#4A4A4A', name: 'Charcoal',     pantone: '18-0601 TCX Charcoal Gray' },
    { hex: '#000080', name: 'Navy',         pantone: '19-3832 TCX Medieval Blue' },
    { hex: '#00008B', name: 'Dark Navy',    pantone: '19-3939 TCX Blueprint' },
    { hex: '#4169E1', name: 'Royal Blue',   pantone: '19-3955 TCX Royal Blue' },
    { hex: '#87CEEB', name: 'Sky Blue',     pantone: '14-4318 TCX Sky Blue' },
    { hex: '#B0E0E6', name: 'Powder Blue',  pantone: '13-4411 TCX Crystal Blue' },
    { hex: '#FF0000', name: 'Red',          pantone: '18-1763 TCX High Risk Red' },
    { hex: '#8B0000', name: 'Burgundy',     pantone: '19-1725 TCX Tawny Port' },
    { hex: '#DC143C', name: 'Crimson',      pantone: '19-1762 TCX Jester Red' },
    { hex: '#FF6B6B', name: 'Coral',        pantone: '16-1546 TCX Living Coral' },
    { hex: '#FFC0CB', name: 'Pink',         pantone: '13-2010 TCX Crystal Rose' },
    { hex: '#FF69B4', name: 'Hot Pink',     pantone: '17-2127 TCX Shocking Pink' },
    { hex: '#006400', name: 'Forest Green', pantone: '18-0135 TCX Treetop' },
    { hex: '#556B2F', name: 'Olive',        pantone: '18-0527 TCX Olive Drab' },
    { hex: '#90EE90', name: 'Mint',         pantone: '13-6110 TCX Misty Jade' },
    { hex: '#008080', name: 'Teal',         pantone: '18-4930 TCX Deep Lake' },
    { hex: '#FFD700', name: 'Gold',         pantone: '14-0846 TCX Yolk Yellow' },
    { hex: '#FFA500', name: 'Orange',       pantone: '16-1359 TCX Orange Peel' },
    { hex: '#F5F5F0', name: 'Off White',    pantone: '11-0602 TCX Whisper White' },
    { hex: '#A0522D', name: 'Brown',        pantone: '18-1140 TCX Mocha Bisque' },
    { hex: '#D2B48C', name: 'Tan',          pantone: '15-1225 TCX Sand' },
    { hex: '#800080', name: 'Purple',       pantone: '19-3536 TCX Grape Juice' },
    { hex: '#E6E6FA', name: 'Lavender',     pantone: '13-3820 TCX Lavender Fog' }
];
 
// ─── findClosestPantone ────────────────────────────────────────
// Returns the closest PANTONE_APPROX entry for a given HEX string.
// Uses Euclidean distance in RGB space.
// Input: '#RRGGBB' (6-char hex, with or without leading #)
// Output: { hex, name, pantone }
 
export function findClosestPantone(hex) {
    // Normalize: ensure leading #, uppercase
    const h = hex.startsWith('#') ? hex : '#' + hex;
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
 
    let closest = PANTONE_APPROX[0];
    let minDist = Infinity;
 
    for (const p of PANTONE_APPROX) {
        const pr = parseInt(p.hex.slice(1, 3), 16);
        const pg = parseInt(p.hex.slice(3, 5), 16);
        const pb = parseInt(p.hex.slice(5, 7), 16);
        const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (dist < minDist) {
            minDist = dist;
            closest = p;
        }
    }
 
    return closest;
}
// ═══════════════════════════════════════════════════════════════
// FABRIC_SPECS
// ═══════════════════════════════════════════════════════════════
export const FABRIC_SPECS = {
    jersey_150: {
        label: 'Jersey 150 g/m²',
        weight: 150,
        composition: '100% Cotton',
        width: 150,
        shrinkage: { length: 5, width: 3 },
        knit_type: 'Single Jersey',
        recommended_for: ['Lightweight tees', 'Summer basics']
    },
    jersey_180: {
        label: 'Jersey 180 g/m²',
        weight: 180,
        composition: '95% Cotton, 5% Elastane',
        width: 160,
        shrinkage: { length: 5, width: 3 },
        knit_type: 'Single Jersey',
        recommended_for: ['Standard tees', 'Year-round basics']
    },
    jersey_200: {
        label: 'Jersey 200 g/m²',
        weight: 200,
        composition: '100% Cotton',
        width: 150,
        shrinkage: { length: 3, width: 2 },
        knit_type: 'Single Jersey',
        recommended_for: ['Premium tees', 'Heavyweight basics']
    },
    rib_1x1: {
        label: 'Rib 1×1',
        weight: 220,
        composition: '95% Cotton, 5% Elastane',
        width: 80,
        shrinkage: { length: 5, width: 5 },
        knit_type: '1×1 Rib',
        recommended_for: ['Neckbands', 'Cuffs', 'Hem bands']
    }
};

// ═══════════════════════════════════════════════════════════════
// STITCH_SPECS
// ═══════════════════════════════════════════════════════════════
export const STITCH_SPECS = {
    overlock_4t: {
        label: '4-Thread Overlock',
        iso: 'ISO 514',
        spi: 12,
        needle: 'Ballpoint 80/12 (SUK)',
        tension: 'Medium — adjusted for stretch',
        use: 'Side seams, shoulder seams'
    },
    coverseam_3n: {
        label: '3-Needle Coverseam',
        iso: 'ISO 406',
        spi: 10,
        needle: 'Ballpoint 75/11 (SUK)',
        tension: 'Light — allows stretch recovery',
        use: 'Hems, sleeve hems, topstitching'
    },
    flatlock: {
        label: 'Flatlock Stitch',
        iso: 'ISO 301',
        spi: 14,
        needle: 'Ballpoint 70/10 (SUK)',
        tension: 'Light',
        use: 'Neckband attachment, decorative flat seams'
    }
};

// ═══════════════════════════════════════════════════════════════
// PACKING_SPECS
// ═══════════════════════════════════════════════════════════════
export const PACKING_SPECS = {
    standard: {
        label: 'Standard Fold Pack',
        method: 'Garment folded with tissue paper insert. Placed in individual polybag (recycled PE, 35×45 cm). Size sticker on bag.',
        carton: '60×40×30 cm export carton. Max 24 pcs per carton.',
        labels: 'Individual polybag + carton label with PO#, style, size, color, qty'
    }
};
