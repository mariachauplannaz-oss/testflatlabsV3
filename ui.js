// ═══ ui.js — Navigation, steps, dynamic toggles, component builder ═══

import { DICT, GARMENT_ICONS, CATEGORIES, FABRIC_SPECS, STITCH_SPECS } from './config.js';
import { showTooltip, hideTooltip, openInfoPanel, closeInfoPanel } from './infoPanel.js';

export function initCategories(state, updateButton) {
    const grid = document.getElementById('catGrid');
    CATEGORIES.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'cat-card' + (cat.disabled ? ' disabled' : '');
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-label', cat.label + (cat.disabled ? ' - Coming soon' : ''));
        card.innerHTML = '<div class="cat-icon">' + GARMENT_ICONS[cat.icon] + '</div><div class="cat-label">' + cat.label + '</div>';
        if (!cat.disabled) {
            card.onclick = () => {
                grid.querySelectorAll('.cat-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
                card.classList.add('selected');
                card.setAttribute('aria-checked','true');
                state.selectedCategory = cat.id;
                state.selections = { torso:null, neck:null, sleeve:null };
                updateButton();
            };
        }
        grid.appendChild(card);
    });
}

export function goStep(n, state, updateButton) {
    state.currentStep = n;
    const totalSteps = state.currentMannequin === 'iso' ? 3 : 2;
    const pct = n * (100 / 3);
    document.getElementById('stepsTrack').style.transform = 'translateX(-' + pct + '%)';
    const dots = document.querySelectorAll('.step-dot');
    dots[2].style.display = totalSteps === 3 ? '' : 'none';
dots.forEach((d,i) => {
        d.className = 'step-dot' + (i<n?' done':i===n?' active':'');
        if (i < n) {
            d.style.cursor = 'pointer';
            d.onclick = () => goStep(i, state, updateButton);
        } else {
            d.style.cursor = 'default';
            d.onclick = null;
        }
    });
    document.getElementById('btnBack').style.display = n > 0 ? '' : 'none';
    updateButton(state);
}


export function updateButton(state) {
    const btn = document.getElementById('btnNext');
    if (state.currentStep === 0) {
        btn.textContent = 'Next';
        btn.disabled = !state.selectedCategory;
    } else if (state.currentStep === 1 && state.currentMannequin === 'iso') {
        btn.textContent = 'Next';
        btn.disabled = false;
    } else if (state.currentStep === 1 && state.currentMannequin === 'sty') {
        btn.textContent = 'Generate';
        btn.disabled = false;
    } else {
        btn.textContent = 'Generate';
        btn.disabled = false;
    }
}

export function buildStep1(state) {
    const { svgData, selections } = state;
    const container = document.getElementById('componentsContainer');
    container.innerHTML = '';

    function buildOptions(label, dataObj, selKey, allowNone) {
        if (Object.keys(dataObj).length === 0) return;
        const sec = document.createElement('div');
        sec.innerHTML = '<div class="sec-label">' + label + '</div>';
        const scroll = document.createElement('div');
        scroll.className = 'opt-scroll';
        scroll.setAttribute('role', 'radiogroup');
        scroll.setAttribute('aria-label', label);

        if (allowNone) {
            const none = document.createElement('div');
            none.className = 'opt-card none-card' + (selections[selKey]==='none'?' selected':'');
            none.setAttribute('role','radio');
            none.innerHTML = '<div class="opt-preview">\u2014</div><div class="opt-name">None</div>';
            none.onclick = () => {
                selections[selKey] = 'none';
                scroll.querySelectorAll('.opt-card').forEach(o=>o.classList.remove('selected'));
                none.classList.add('selected');
            };
            scroll.appendChild(none);
        }

        Object.keys(dataObj).forEach((key, idx) => {
            const opt = document.createElement('div');
            const isSelected = selections[selKey]===key || (!selections[selKey] && idx===0 && !allowNone);
            if (isSelected) selections[selKey] = key;
            opt.className = 'opt-card' + (isSelected?' selected':'');
            opt.setAttribute('role','radio');
            opt.setAttribute('aria-label', DICT[key]||key);
            opt.innerHTML = '<div class="opt-preview" style="font-size:12px;font-weight:700">' + (key.slice(0,3).toUpperCase()) + '</div><div class="opt-name">' + (DICT[key]||key) + '</div>';
            opt.onclick = () => {
                selections[selKey] = key;
                scroll.querySelectorAll('.opt-card').forEach(o=>o.classList.remove('selected'));
                opt.classList.add('selected');
            };
            scroll.appendChild(opt);
        });

        sec.appendChild(scroll);
        container.appendChild(sec);
    }

    buildOptions('Torso', svgData.front.torsos, 'torso', false);
    buildOptions('Neckline', svgData.front.necks, 'neck', false);
    buildOptions('Sleeves', svgData.front.sleeves, 'sleeve', true);

    // Dynamic toggles container
    const togContainer = document.getElementById('dynamicToggles');
    if (togContainer) togContainer.innerHTML = '';

    // Only show pocket toggle if pockets exist in SVG
    const togPocket = document.getElementById('togPocket');
    const togPocketRow = togPocket ? togPocket.closest('.tog-row') : null;
    if (togPocketRow) {
        togPocketRow.style.display = Object.keys(svgData.front.pockets).length > 0 ? '' : 'none';
    }
}

export function buildStep2(state) {
    const container = document.getElementById('manufContainer');
    container.innerHTML = '';

    // ── Fabric Weight selector ──
    const fabricSec = document.createElement('div');
    fabricSec.innerHTML = '<div class="sec-label">Fabric Weight</div>';
    const fabricScroll = document.createElement('div');
    fabricScroll.className = 'opt-scroll';
    fabricScroll.setAttribute('role', 'radiogroup');
    fabricScroll.setAttribute('aria-label', 'Fabric Weight');

    const fabricTermMap = {
    jersey_150: 'ft_tex_001',
    jersey_180: 'ft_tex_002',
    jersey_200: 'ft_tex_003',
    rib_1x1:    'ft_tex_004',
    };

        Object.entries(FABRIC_SPECS).forEach(([key, fab]) => {
            const opt = document.createElement('div');
            const isSelected = state.fabric === key;
            opt.className = 'opt-card' + (isSelected ? ' selected' : '');
            opt.setAttribute('role', 'radio');
            opt.setAttribute('aria-label', fab.label);
        
            const fabricTerm = fabricTermMap[key];
            opt.innerHTML = `
                <div class="opt-preview" style="font-size:10px;font-weight:700;line-height:1.2">
                    ${fab.weight}<br><span style="font-size:8px;font-weight:400">g/m²</span>
                </div>
                <div class="opt-name">
                    ${fab.label}
                    ${fabricTerm ? `<span class="info-icon" data-term="${fabricTerm}">?</span>` : ''}
                </div>
            `;
            if (fabricTerm) {
                const icon = opt.querySelector('.info-icon');
                icon.addEventListener('mouseenter', () => showTooltip(fabricTerm, icon));
                icon.addEventListener('mouseleave', hideTooltip);
                icon.addEventListener('click', (e) => { e.stopPropagation(); openInfoPanel(fabricTerm); });
            }
            opt.onclick = () => {
                state.fabric = key;
                fabricScroll.querySelectorAll('.opt-card').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            };
            fabricScroll.appendChild(opt);
        });

    fabricSec.appendChild(fabricScroll);
    container.appendChild(fabricSec);

    // ── Main Seam Type selector ──
    const stitchSec = document.createElement('div');
    stitchSec.innerHTML = '<div class="sec-label">Main Seam Type</div>';
    const stitchScroll = document.createElement('div');
    stitchScroll.className = 'opt-scroll';
    stitchScroll.setAttribute('role', 'radiogroup');
    stitchScroll.setAttribute('aria-label', 'Main Seam Type');

const stitchTermMap = {
    overlock_4t:  'iso_514',
    coverseam_3n: 'iso_406',
    flatlock:     null,
};

        Object.entries(STITCH_SPECS).forEach(([key, stitch]) => {
            const opt = document.createElement('div');
            const isSelected = state.stitchType === key;
            opt.className = 'opt-card' + (isSelected ? ' selected' : '');
            opt.setAttribute('role', 'radio');
            opt.setAttribute('aria-label', stitch.label);
        
            const stitchTerm = stitchTermMap[key];
            opt.innerHTML = `
                <div class="opt-preview" style="font-size:9px;font-weight:700;line-height:1.2">
                    ${stitch.iso}
                </div>
                <div class="opt-name">
                    ${stitch.label}
                    ${stitchTerm ? `<span class="info-icon" data-term="${stitchTerm}">?</span>` : ''}
                </div>
            `;
            if (stitchTerm) {
                const icon = opt.querySelector('.info-icon');
                icon.addEventListener('mouseenter', () => showTooltip(stitchTerm, icon));
                icon.addEventListener('mouseleave', hideTooltip);
                icon.addEventListener('click', (e) => { e.stopPropagation(); openInfoPanel(stitchTerm); });
            }
            opt.onclick = () => {
                state.stitchType = key;
                stitchScroll.querySelectorAll('.opt-card').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            };
            stitchScroll.appendChild(opt);
        });

    stitchSec.appendChild(stitchScroll);
    container.appendChild(stitchSec);
}

export function initToggles() {
    const togSeams = document.getElementById('togSeams');
    if (togSeams) togSeams.onclick = function() {
        this.classList.toggle('on');
        this.setAttribute('aria-checked', this.classList.contains('on'));
    };
    const togPocket = document.getElementById('togPocket');
    if (togPocket) togPocket.onclick = function() {
        this.classList.toggle('on');
        this.setAttribute('aria-checked', this.classList.contains('on'));
    };
    const cFill = document.getElementById('cFill');
    if (cFill) cFill.oninput = function() {
        document.getElementById('hFill').textContent = this.value;
    };
}

export function toggleSidebar() {
    closeInfoPanel();
    const isOpening = !document.getElementById('sidebar').classList.contains('open');
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarBackdrop').classList.toggle('show');
    const mDl = document.getElementById('mobileDownload');
    if (mDl) {
        if (isOpening) {
            mDl.dataset.wasShown = mDl.classList.contains('show');
            mDl.classList.remove('show');
        } else {
            if (mDl.dataset.wasShown === 'true') mDl.classList.add('show');
        }
    }
}

export function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
}

export function setIsoMode(isIso) {
    if (isIso) {
        document.body.classList.add('iso-mode');
    } else {
        document.body.classList.remove('iso-mode');
    }
}
