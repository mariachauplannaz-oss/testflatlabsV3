// ═══ app.js — Main entry point, connects all modules ═══

import { MANNEQUIN_CFG } from './config.js';
import { parseSVG } from './parser.js';
import { generate } from './generator.js';
import { initCategories, goStep, updateButton, buildStep1, buildStep2, initToggles, toggleSidebar, closeSidebar, setIsoMode } from './ui.js';
import { downloadSVG, triggerDownload, handleEmailSubmit, skipEmail } from './download.js';
import { exportSpecSheet } from './specsheet.js';
import { showTooltip, hideTooltip, openInfoPanel, closeInfoPanel } from './infoPanel.js';

window.showTooltip   = showTooltip;
window.hideTooltip   = hideTooltip;
window.openInfoPanel = openInfoPanel;
window.closeInfoPanel = closeInfoPanel;

// ═══ STATE ═══
const state = {
    currentStep: 0,
    selectedCategory: null,
    currentMannequin: 'iso',
    svgData: null,
    selections: { torso: null, neck: null, sleeve: null },
    emailCaptured: false,
    fabric: 'jersey_180',
    stitchType: 'overlock_4t'
};
const svgCache = {};

// ═══ LOGGER (console only, no UI) ═══
function log(m, t='info') {
    const prefix = t === 'ok' ? '✓' : t === 'err' ? '✗' : t === 'warn' ? '⚠' : 'ℹ';
    console.log(`[FlatLabs ${prefix}] ${m}`);
}

// ═══ LOAD SVG ═══
async function loadSVG() {
    const cfg = MANNEQUIN_CFG[state.currentMannequin];
    const file = cfg.file;

    if (svgCache[file]) {
        state.svgData = parseSVG(svgCache[file]);
        log(`Loaded ${state.currentMannequin} (cached): F=${Object.keys(state.svgData.front.torsos).length}T ${Object.keys(state.svgData.front.necks).length}N ${Object.keys(state.svgData.front.sleeves).length}S | B=${Object.keys(state.svgData.back.torsos).length}T`, 'ok');
        return;
    }

    try {
        const resp = await fetch(file);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const svgText = await resp.text();
        svgCache[file] = svgText;
        state.svgData = parseSVG(svgText);
        log(`Loaded ${state.currentMannequin}: F=${Object.keys(state.svgData.front.torsos).length}T ${Object.keys(state.svgData.front.necks).length}N ${Object.keys(state.svgData.front.sleeves).length}S | B=${Object.keys(state.svgData.back.torsos).length}T`, 'ok');
    } catch(err) {
        log(`Failed to load ${file}: ${err.message}`, 'err');
    }
}

// ═══ NAVIGATION ═══
function doUpdateButton() { updateButton(state); }

function nextAction() {
    if (state.currentStep === 0) {
        goStep(1, state, doUpdateButton);
        buildStep1(state);
    } else if (state.currentStep === 1 && state.currentMannequin === 'iso') {
        goStep(2, state, doUpdateButton);
        buildStep2(state);
    } else {
        // Validar selecciones obligatorias
        const missing = [];
        if (!state.selections.torso) missing.push('Torso');
        if (!state.selections.neck)  missing.push('Neckline');
        if (missing.length > 0) {
            alert(`⚠ Please select: ${missing.join(' and ')}`);
            return;
        }
        generate(state, log);
        if (window.innerWidth <= 800) closeSidebar();
    }
}

// ═══ DOWNLOAD WRAPPERS ═══
function doDownload() { downloadSVG(state, log); }
function doTriggerDownload() { triggerDownload(state, log); }
function doEmailSubmit(e) { handleEmailSubmit(e, state, doTriggerDownload); }
function doSkipEmail() { skipEmail(state, doTriggerDownload); }
function doExportTechPack() {
    document.getElementById('techPackModal').classList.add('show');
}

async function doConfirmTechPack() {
    const brand   = document.getElementById('tpBrand').value.trim()   || 'FlatLabs';
    const name    = document.getElementById('tpProject').value.trim() || 'My Collection';
    const sku     = document.getElementById('tpSku').value.trim()     || 'FL-TS-001';
    const season  = document.getElementById('tpSeason').value.trim()  || 'SS26';

    document.getElementById('techPackModal').classList.remove('show');

    await exportSpecSheet(state, { brand, name, sku, season });
}

// ═══ INIT ═══
async function init() {
    initCategories(state, doUpdateButton);
    initToggles();
    setIsoMode(true);
    await loadSVG();
    goStep(0, state, doUpdateButton);
    
    // Event listeners (ES6 modules don't work with inline onclick)
    document.getElementById('burgerBtn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebarBackdrop')?.addEventListener('click', closeSidebar);
    document.getElementById('mobileDownload')?.addEventListener('click', doDownload);
    document.getElementById('btnDownload')?.addEventListener('click', doDownload);
    document.getElementById('btnTechPack')?.addEventListener('click', doExportTechPack);
    document.getElementById('btnBack')?.addEventListener('click', () => {
    const prev = state.currentStep - 1;
    goStep(prev, state, doUpdateButton);
    if (prev === 1) buildStep1(state);});
    document.getElementById('fabCreate')?.addEventListener('click', () => {toggleSidebar(); });
    document.getElementById('btnNext')?.addEventListener('click', nextAction);
    document.getElementById('btnConfirmTechPack')?.addEventListener('click', doConfirmTechPack);
    document.getElementById('btnCloseTechPackModal')?.addEventListener('click', () => {
    document.getElementById('techPackModal').classList.remove('show');
    });
    
    // Modal listeners
    document.getElementById('leadForm')?.addEventListener('submit', doEmailSubmit);
    document.getElementById('btnSkipEmail')?.addEventListener('click', doSkipEmail);
    document.getElementById('btnCloseEmailModal')?.addEventListener('click', () => {
        document.getElementById('emailModal').classList.remove('show');
    });
    document.getElementById('btnCloseProModal')?.addEventListener('click', () => {
        document.getElementById('proModal').classList.remove('show');
    });

    // Email input focus/blur styles
    const emailInput = document.getElementById('emailInput');
    emailInput?.addEventListener('focus', function() { this.style.borderColor = 'var(--accent)'; });
    emailInput?.addEventListener('blur', function() { this.style.borderColor = 'var(--gray3)'; });

    // Skip email hover
    const btnSkip = document.getElementById('btnSkipEmail');
    btnSkip?.addEventListener('mouseover', function() { this.style.opacity = '1'; });
    btnSkip?.addEventListener('mouseout', function() { this.style.opacity = '.6'; });
}

init();
window.state = state;
