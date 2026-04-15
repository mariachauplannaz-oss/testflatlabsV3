// ═══ techpack.js — POM engine, tolerance logic, construction notes ═══

import { COMPONENT_META } from './config.js';

// ─── 1. TOLERANCE FUNCTION ────────────────────────────────────────────────────
// Rules: >50cm → ±1.0 | 20–50cm → ±0.7 | <20cm → ±0.5
export function getTolerance(value) {
    if (value > 50)  return '± 1.0';
    if (value >= 20) return '± 0.7';
    return '± 0.5';
}

// ─── 2. POM CODE GENERATOR ───────────────────────────────────────────────────
// Generates a short reference code for each measure row (e.g. TRS-001)
function generatePOMCode(category, index) {
    const prefixes = {
        torso:  'TRS',
        sleeve: 'SLV',
        neck:   'NCK'
    };
    const prefix = prefixes[category] || 'GEN';
    return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

// ─── 3. BUILD POM TABLE ───────────────────────────────────────────────────────
// Takes state.selections, returns array of POM rows ready for PDF table
export function buildPOM(selections) {
    const rows = [];
    let globalIndex = 0;

    const categories = ['torso', 'neck', 'sleeve'];

    categories.forEach(cat => {
        const key = selections[cat];
        if (!key || key === 'none') return;

        // Map selection key to meta category
        const metaGroup = COMPONENT_META[cat + 's']; // 'torsos', 'necks', 'sleeves'
        if (!metaGroup) return;

        const meta = metaGroup[key];
        if (!meta || !meta.measures) return;

        Object.values(meta.measures).forEach((measure, i) => {
            rows.push({
                code:        generatePOMCode(cat, globalIndex),
                description: measure.label,
                value:       measure.value,
                unit:        measure.unit || 'cm',
                tolerance:   getTolerance(measure.value),
                source:      meta.label   // e.g. "Regular Fit", "Long Sleeve"
            });
            globalIndex++;
        });
    });

    return rows;
}

// ─── 4. BUILD CONSTRUCTION NOTES ─────────────────────────────────────────────
// Returns an array of { component, norm, note } objects
export function buildConstructionNotes(selections, garmentType = 'tshirt') {
    const notes = [];

    // Garment-level norm — jersey = ISO 514 by default
    const garmentNorm = garmentType === 'tshirt'
        ? { component: 'General Assembly', norm: 'ISO 514', note: 'All structural seams executed with jersey stitch (ISO 514). Seam allowance: 1 cm throughout.' }
        : { component: 'General Assembly', norm: 'ISO 301', note: 'All structural seams executed with lockstitch (ISO 301). Seam allowance: 1 cm throughout.' };

    notes.push(garmentNorm);

    const categories = ['torso', 'neck', 'sleeve'];
    categories.forEach(cat => {
        const key = selections[cat];
        if (!key || key === 'none') return;

        const metaGroup = COMPONENT_META[cat + 's'];
        if (!metaGroup) return;

        const meta = metaGroup[key];
        if (!meta || !meta.construction) return;

        notes.push({
            component: meta.label,
            norm:      meta.iso_norm,
            note:      meta.construction
        });
    });

    // Static notes always included
        notes.push({
            component: 'Hem — Bottom Edge',
            norm: 'ISO 406',
            note: 'Bottom hem finished with 3-needle coverseam stitch (ISO 406). Fold: 2 cm double-needle. Thread: Tex 18 coverseam thread. No raw edges permitted on finished garment.'
        });
        notes.push({
            component: 'Care Label — Center Back Neck',
            norm: 'EN ISO 3758',
            note: 'Woven care label required per EN ISO 3758. Placement: center back neck, 1 cm below neckline seam. Brand label sewn immediately above care label. Size label: separate woven label, same placement stack.'
        });
        notes.push({
            component: 'Seam Allowance — All Seams',
            norm: 'ISO 4916',
            note: 'Standard seam allowance: 1.0 cm throughout. Shoulder seams: 1.0 cm, pressed toward back. Side seams: 1.0 cm, pressed open. Armhole seams: 1.0 cm, serged together and pressed toward sleeve.'
        });

    return notes;
}

// ─── 5. BUILD FULL TECH PACK STATE ───────────────────────────────────────────
// Master function: call this before generating the PDF
// Returns everything specsheet.js needs
export function buildTechPackState(state, projectMeta = {}) {
    const { selections, selectedCategory } = state;

    const garmentType = selectedCategory || 'tshirt';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    // Active component labels for display
    const activeComponents = [];
    ['torso', 'neck', 'sleeve'].forEach(cat => {
        const key = selections[cat];
        if (!key || key === 'none') return;
        const metaGroup = COMPONENT_META[cat + 's'];
        if (metaGroup?.[key]) activeComponents.push(metaGroup[key].label);
    });

    return {
        // Header
        header: {
            projectName: projectMeta.name  || 'FlatLabs Technical Spec',
            sku:         projectMeta.sku   || `FL-${garmentType.toUpperCase()}-${now.getFullYear()}`,
            season:      projectMeta.season || `SS${String(now.getFullYear()).slice(2)}`,
            date:        dateStr,
            size:        'EU 38 (ISO 3635)',
            brand:  projectMeta.brand  || 'FlatLabs',
            fabric: 'Jersey 180g/m²',
            components:  activeComponents.join(' · ')
        },
        // POM table rows
        pom: buildPOM(selections),
        // Construction notes
        constructionNotes: buildConstructionNotes(selections, garmentType),
        // Bill of Materials
        bom: COMPONENT_META.bom[garmentType] || COMPONENT_META.bom.tshirt
    };
}
