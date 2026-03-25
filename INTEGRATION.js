// ═══════════════════════════════════════════════════════════════════
// INTEGRATION PATCH — How to wire specsheet.js into your existing files
// ═══════════════════════════════════════════════════════════════════

// ── 1. app.html — Add these 2 CDN scripts in <head> ─────────────────
/*
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
*/

// ── 2. app.html — Add the Export button next to your existing download button ─
/*
<button id="btnTechPack" style="display:none">
  Export Tech Pack
</button>
*/

// ── 3. config.js — Append the COMPONENT_META export ─────────────────
// Copy the full content of config_meta.js and paste at the end of config.js
// (the existing DICT, MANNEQUIN_CFG, GARMENT_ICONS, CATEGORIES stay untouched)

// ── 4. app.js — Add these lines ──────────────────────────────────────

// At the top, add import:
import { exportSpecSheet } from './specsheet.js';

// Inside init(), add event listener (same pattern as existing buttons):
document.getElementById('btnTechPack')?.addEventListener('click', doExportTechPack);

// Add this function alongside the other download wrappers:
async function doExportTechPack() {
    await exportSpecSheet(state, {
        name: 'My Collection',   // ← swap for a dynamic project name input later
        sku:  'FL-TS-001',       // ← swap for dynamic SKU input later
        season: 'SS26'
    });
}

// Inside generate() in generator.js (at the end, after log('Done!', 'ok')):
// Show the Tech Pack button only after a garment has been generated
document.getElementById('btnTechPack').style.display = '';

// ═══════════════════════════════════════════════════════════════════
// TOLERANCE QUICK REFERENCE (from techpack.js)
// ═══════════════════════════════════════════════════════════════════
// > 50 cm  →  ± 1.0 cm   (chest, hem, total length in regular fit)
// 20–50 cm →  ± 0.7 cm   (shoulder, sleeve length, bicep)
// < 20 cm  →  ± 0.5 cm   (neck width, front drop, cuff, mock neck height)
//             ± 0.5 cm shown in ORANGE in PDF for tight tolerances
