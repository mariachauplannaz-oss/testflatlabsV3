// ═══ generator.js — SVG garment renderer ═══

import { DICT, MANNEQUIN_CFG } from './config.js';
import { merge2 } from './pathUtils.js';

const NS = 'http://www.w3.org/2000/svg';

function mkEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    return el;
}

export function generate(state, log) {
    const { svgData, selections, currentMannequin } = state;
    const cfg = MANNEQUIN_CFG[currentMannequin];

    log('Generating...', 'info');

    const preview = document.getElementById('svg-preview');
    preview.innerHTML = '';

    const fill = document.getElementById('cFill').value;
    const showSeams = document.getElementById('togSeams').classList.contains('on');
    const showPocket = document.getElementById('togPocket').classList.contains('on');

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('viewBox', cfg.previewViewBox);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const sw = cfg.strokeWidth;
    const seamSw = cfg.seamStrokeWidth;
    const gA = { fill, stroke:'#1a1a1a', 'stroke-width':sw, 'stroke-linejoin':'round', 'stroke-linecap':'round' };
    const seamA = { fill:'none', stroke:'#1a1a1a', 'stroke-width':seamSw, 'stroke-linecap':'round' };

    // Ghost mannequin
    if (svgData.mannequin) {
        const tmp = new DOMParser().parseFromString(
            '<svg xmlns="http://www.w3.org/2000/svg">' + svgData.mannequin + '</svg>',
            'image/svg+xml'
        );
        const ghost = mkEl('g', { opacity:'0.12', id:'layer-body' });
        Array.from(tmp.documentElement.childNodes).forEach(n => {
            ghost.appendChild(document.importNode(n, true));
        });
        svg.appendChild(ghost);
    }

    // Get components
    const torso = svgData.torsos[selections.torso || Object.keys(svgData.torsos)[0]];
    const neck = selections.neck && selections.neck !== 'none' ? svgData.necks[selections.neck] : null;
    const sleeve = selections.sleeve && selections.sleeve !== 'none' ? svgData.sleeves[selections.sleeve] : null;

    // MERGE torso + neck
    let merged = null;
    if (torso && torso.main && neck && neck.main) {
        log('Merging torso + neck...', 'info');
        merged = merge2(torso.main, neck.main, log);
    }

    if (merged) {
        svg.appendChild(mkEl('path', { d:merged, ...gA }));
        log('Merge OK', 'ok');
    } else if (torso && torso.main) {
        svg.appendChild(mkEl('path', { d:torso.main, ...gA }));
        if (neck && neck.main) svg.appendChild(mkEl('path', { d:neck.main, ...gA }));
        log('Rendered separate', 'warn');
    }

    // Neck fills
    if (neck && neck.fills) {
        neck.fills.forEach(d => {
            svg.appendChild(mkEl('path', { d, fill:'#939598', stroke:'#1a1a1a', 'stroke-width': String(parseFloat(sw)*0.3), 'stroke-linejoin':'bevel' }));
        });
    }

    // Sleeves (OVERLAY)
    if (sleeve) {
        log('Adding sleeves...', 'info');
        if (sleeve.main_l) svg.appendChild(mkEl('path', { d:sleeve.main_l, ...gA }));
        if (sleeve.main_r) svg.appendChild(mkEl('path', { d:sleeve.main_r, ...gA }));
        if (sleeve.borders) {
            sleeve.borders.forEach(d => {
                svg.appendChild(mkEl('path', { d, fill:'none', stroke:'#1a1a1a', 'stroke-width':sw, 'stroke-linecap':'round', 'stroke-linejoin':'round' }));
            });
        }
    }

    // Seams
    if (showSeams) {
        const allSeams = [...(torso?.seams||[]), ...(neck?.seams||[]), ...(sleeve?.seams||[])];
        allSeams.forEach(d => {
            svg.appendChild(mkEl('path', { d, ...seamA, 'stroke-dasharray': cfg.seamDash }));
        });
        if (allSeams.length) log('Seams: ' + allSeams.length, 'ok');
    }

    // Pocket
    if (showPocket && Object.keys(svgData.pockets).length) {
        const pkt = svgData.pockets[Object.keys(svgData.pockets)[0]];
        if (pkt && pkt.main) {
            svg.appendChild(mkEl('path', { d:pkt.main, fill:'none', stroke:'#1a1a1a', 'stroke-width':sw, 'stroke-linejoin':'round', 'stroke-linecap':'round' }));
            log('Pocket added', 'ok');
        }
    }

    // Watermark for ISO (Pro)
    if (!cfg.free) {
        const vb = cfg.previewViewBox.split(' ').map(Number);
        const cx = vb[0] + vb[2]/2, cy = vb[1] + vb[3]/2;
        const wm = mkEl('g', { opacity:'0.12', 'pointer-events':'none', id:'layer-watermark' });
        for (let i = -2; i <= 2; i++) {
            const t = mkEl('text', {
                x: String(cx), y: String(cy + i * (vb[3]*0.12)),
                'text-anchor':'middle', 'font-size': String(vb[2]*0.09),
                'font-family':'-apple-system,sans-serif', 'font-weight':'800',
                fill:'#007AFF', transform: 'rotate(-35 '+cx+' '+(cy + i*(vb[3]*0.12))+')',
                'letter-spacing':'8'
            });
            t.textContent = 'FLATLABS PRO';
            wm.appendChild(t);
        }
        svg.appendChild(wm);
    }

    preview.appendChild(svg);

    // Show download button only for free mannequin
    document.getElementById('btnDownload').style.display = cfg.free ? '' : 'none';
    if (window.innerWidth <= 800) {
        const mDl = document.getElementById('mobileDownload');
        if (cfg.free) mDl.classList.add('show');
        else mDl.classList.remove('show');
    }

    document.getElementById('topbarTitle').textContent = (DICT[selections.torso]||'T-Shirt') + ' \u2014 Generated';
    log('Done!', 'ok');
}
