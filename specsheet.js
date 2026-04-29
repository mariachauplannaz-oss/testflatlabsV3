// ═══ specsheet.js — PDF Tech Pack generator (jsPDF + AutoTable, CDN, no build step) ═══
// Dependencies loaded via app.html <script> tags:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

import { buildTechPackState } from './techpack.js';
import { findClosestPantone, collectMeasurements, STITCH_SPECS, FABRIC_SPECS, PACKING_SPECS, SIZE_EQUIV } from './config.js';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
    black:      [33,  43,  49],
    white:      [255, 255, 255],
    accent:     [255, 154, 110],
    accentText: [33,  43,  49],
    gray1:      [250, 250, 252],
    gray2:      [220, 220, 226],
    gray3:      [95,  115, 133],
    gray4:      [33,  43,  49],
    headerMeta: [160, 168, 178],
    sectionBg:  [33,  43,  49],
};

const FONT = {
    heading:    18,
    subheading: 10,
    label:      7.5,
    body:       8.5,
    small:      7,
};

const MARGIN = { left: 14, right: 14, top: 14 };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function setColor(doc, rgb, type = 'text') {
    if (type === 'text') doc.setTextColor(...rgb);
    else doc.setFillColor(...rgb);
}

function setFont(doc, style = 'normal', size = FONT.body) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
}

function pageWidth(doc)  { return doc.internal.pageSize.getWidth();  }
function pageHeight(doc) { return doc.internal.pageSize.getHeight(); }

function hexToRgb(hex) {
    const h = hex.startsWith('#') ? hex : '#' + hex;
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

function contrastColor(r, g, b) {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 140 ? COLORS.black : COLORS.white;
}

// ─── HEADER BAND ─────────────────────────────────────────────────────────────
function drawHeader(doc, header) {
    const pw = pageWidth(doc);

    setColor(doc, COLORS.black, 'fill');
    doc.rect(0, 0, pw, 33, 'F');

    setFont(doc, 'bold', 13);
    setColor(doc, COLORS.white);
    doc.text('FlatLabs', MARGIN.left, 14);

    const badgeX = MARGIN.left + doc.getTextWidth('FlatLabs') + 4;
    const badgeW = 22;
    setColor(doc, COLORS.accent, 'fill');
    doc.roundedRect(badgeX, 8.5, badgeW, 7, 1.2, 1.2, 'F');
    setFont(doc, 'bold', 5.5);
    setColor(doc, COLORS.accentText);
    doc.text('TECH PACK', badgeX + badgeW / 2, 13.5, { align: 'center' });

    setFont(doc, 'bold', FONT.heading);
    setColor(doc, COLORS.white);
    doc.text(header.projectName.toUpperCase(), MARGIN.left, 26);

    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.headerMeta);
    doc.text(header.brand, MARGIN.left, 30.5);

    const metaItems = [
        ['SKU',    header.sku],
        ['SEASON', header.season],
        ['SIZE',   header.size],
        ['DATE',   header.date],
    ];
    const gridColW   = 28;
    const gridStartX = pw - MARGIN.right - gridColW * 2;
    metaItems.forEach(([key, val], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = gridStartX + col * gridColW;
        const y = 12 + row * 11;
        setFont(doc, 'bold', 5.5);
        setColor(doc, COLORS.accent);
        doc.text(key, x, y);
        setFont(doc, 'normal', 8);
        setColor(doc, COLORS.white);
        doc.text(val, x, y + 5);
    });

    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.2);
    doc.line(MARGIN.left, 34, pw - MARGIN.right, 34);

    const metaY = 38;
    if (header.components) {
        setFont(doc, 'italic', FONT.small);
        setColor(doc, COLORS.gray3);
        doc.text('Components: ' + header.components, MARGIN.left, metaY + 6);
    }

    return metaY + 14;
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────
function drawSectionLabel(doc, label, y) {
    setColor(doc, COLORS.accent, 'fill');
    doc.rect(MARGIN.left, y, 3, 8, 'F');

    setFont(doc, 'bold', FONT.small);
    setColor(doc, COLORS.accent);
    doc.text(label.toUpperCase(), MARGIN.left + 7, y + 5.5);

    return y + 11;
}

// ─── SVG FLAT VISUAL ─────────────────────────────────────────────────────────
async function drawFlat(doc, y) {
    const pw = pageWidth(doc);
    const svgFront = document.querySelector('#svg-preview svg');
    const svgBack  = document.querySelector('#svg-preview-back svg');

    async function svgToPng(svgEl) {
        const vb = svgEl.getAttribute('viewBox');
        let vbW = 240, vbH = 280;
        if (vb) {
            const parts = vb.trim().split(/[\s,]+/);
            if (parts.length === 4) { vbW = parseFloat(parts[2]); vbH = parseFloat(parts[3]); }
        }
        const ratio = vbW / vbH;
        const CANVAS_BASE = 600;
        const canvasW = ratio >= 1 ? CANVAS_BASE : Math.round(CANVAS_BASE * ratio);
        const canvasH = ratio >= 1 ? Math.round(CANVAS_BASE / ratio) : CANVAS_BASE;

        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url  = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = canvasW; canvas.height = canvasH;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvasW, canvasH);
                ctx.drawImage(img, 0, 0, canvasW, canvasH);
                URL.revokeObjectURL(url);
                resolve({ png: canvas.toDataURL('image/png'), ratio });
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function fitBox(ratio, maxW, maxH) {
        let w = maxW, h = w / ratio;
        if (h > maxH) { h = maxH; w = h * ratio; }
        return { w, h };
    }

    const MAX_W = 65, MAX_H = 75;

    try {
        if (svgFront && svgBack) {
            const [front, back] = await Promise.all([svgToPng(svgFront), svgToPng(svgBack)]);
            const fDim = fitBox(front.ratio, MAX_W, MAX_H);
            const bDim = fitBox(back.ratio,  MAX_W, MAX_H);
            const gap  = 6;
            const totalW = fDim.w + gap + bDim.w;
            const startX = pw / 2 - totalW / 2;
            const maxH   = Math.max(fDim.h, bDim.h);
            const fY = y + (maxH - fDim.h) / 2;
            const bY = y + (maxH - bDim.h) / 2;

            doc.addImage(front.png, 'PNG', startX, fY, fDim.w, fDim.h);
            doc.addImage(back.png,  'PNG', startX + fDim.w + gap, bY, bDim.w, bDim.h);

            doc.setDrawColor(...COLORS.gray2);
            doc.setLineWidth(0.3);
            doc.rect(startX, fY, fDim.w, fDim.h);
            doc.rect(startX + fDim.w + gap, bY, bDim.w, bDim.h);

            setFont(doc, 'bold', FONT.small);
            setColor(doc, COLORS.gray3);
            doc.text('FRONT', startX + fDim.w / 2, y + maxH + 5, { align: 'center' });
            doc.text('BACK',  startX + fDim.w + gap + bDim.w / 2, y + maxH + 5, { align: 'center' });

            return y + maxH + 10;

        } else if (svgFront) {
            const { png, ratio } = await svgToPng(svgFront);
            const { w, h } = fitBox(ratio, MAX_W, MAX_H);
            const imgX = pw / 2 - w / 2;

            doc.addImage(png, 'PNG', imgX, y, w, h);
            doc.setDrawColor(...COLORS.gray2);
            doc.setLineWidth(0.3);
            doc.rect(imgX, y, w, h);

            return y + h + 6;
        }
    } catch (e) {
        console.warn('[FlatLabs] Could not render SVG to PDF:', e);
    }

    return y;
}

// ─── COLORWAY SECTION ────────────────────────────────────────────────────────
function drawColorway(doc, fillColorHex, y) {
    if (!fillColorHex) return y;

    const pw  = pageWidth(doc);
    const hex = fillColorHex.startsWith('#') ? fillColorHex.toUpperCase() : '#' + fillColorHex.toUpperCase();
    const [r, g, b] = hexToRgb(hex);
    const pantoneMatch = findClosestPantone(hex);

    const swatchW = 28, swatchH = 18;
    const swatchX = MARGIN.left;
    const textX   = swatchX + swatchW + 6;

    doc.setFillColor(r, g, b);
    doc.rect(swatchX, y, swatchW, swatchH, 'F');
    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.3);
    doc.rect(swatchX, y, swatchW, swatchH);

    const labelRgb = contrastColor(r, g, b);
    setFont(doc, 'bold', FONT.small);
    setColor(doc, labelRgb);
    doc.text(hex, swatchX + swatchW / 2, y + swatchH / 2 + 1, { align: 'center' });

    const lineH = 5.5;
    setFont(doc, 'bold', FONT.body);
    setColor(doc, COLORS.gray4);
    doc.text(pantoneMatch.name, textX, y + 5);

    setFont(doc, 'bold', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('HEX', textX, y + 5 + lineH);
    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray4);
    doc.text(hex, textX + 10, y + 5 + lineH);

    setFont(doc, 'bold', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('PANTONE', textX, y + 5 + lineH * 2);
    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray4);
    doc.text(pantoneMatch.pantone + '  ·  approx.', textX + 18, y + 5 + lineH * 2);

    setFont(doc, 'italic', 5.5);
    setColor(doc, COLORS.gray3);
    doc.text(
        'Color matching is approximate. Verify against physical Pantone swatch before production.',
        pw - MARGIN.right, y + swatchH, { align: 'right' }
    );

    return y + swatchH + 8;
}

// ─── MEASUREMENT SPECIFICATIONS ──────────────────────────────────────────────
// Unified table replacing old drawPOMTable + drawGradingSection.
// Front measures first, then back measures (Across Back, CB Length).
// Columns: Letter | POM | Description | EU34 | EU36 | EU38 | EU40 | EU42 | EU44 | Tol.
function drawMeasurementSpecs(doc, selections, y) {
    const frontRows = collectMeasurements(selections, 'EU38', 'front', true);
    const backRows  = collectMeasurements(selections, 'EU38', 'back',  true);
    const allRows   = [...frontRows, ...backRows];

    const SIZES = ['EU34', 'EU36', 'EU38', 'EU40', 'EU42', 'EU44'];

    const head = [['Letter', 'POM', 'Description', 'EU34', 'EU36', 'EU38', 'EU40', 'EU42', 'EU44', 'Tol.']];

    const body = allRows.map(m => {
        // Short letter: 'A' from 'TS-A'
        const shortLetter = m.letter ? (m.letter.split('-')[1] || m.letter) : '—';

        const sizeValues = SIZES.map(s => {
            if (!m.hasGradingRule) {
                return s === 'EU38' ? String(m.value) + ' *' : '—';
            }
            return m.sizes ? String(m.sizes[s]) : '—';
        });

        return [shortLetter, m.letter || '—', m.description, ...sizeValues, m.tolerance + ' cm'];
    });

    doc.autoTable({
        startY: y,
        head,
        body,
        margin: { left: MARGIN.left, right: MARGIN.right },
        styles: {
            font: 'helvetica',
            fontSize: FONT.small,
            cellPadding: 2.5,
            textColor: COLORS.gray4,
            lineColor: COLORS.gray2,
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: COLORS.black,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: FONT.small,
            lineColor: COLORS.black,
        },
        columnStyles: {
            0: { cellWidth: 12, fontStyle: 'bold', textColor: COLORS.accent, halign: 'center' }, // Letter (short)
            1: { cellWidth: 16, textColor: COLORS.gray3, fontSize: FONT.small },                 // POM (full, e.g. TS-A)
            2: { cellWidth: 'auto' },                                                             // Description
            3: { cellWidth: 12, halign: 'center' },  // EU34
            4: { cellWidth: 12, halign: 'center' },  // EU36
            5: { cellWidth: 14, halign: 'center' },  // EU38 — base size, highlighted
            6: { cellWidth: 12, halign: 'center' },  // EU40
            7: { cellWidth: 12, halign: 'center' },  // EU42
            8: { cellWidth: 12, halign: 'center' },  // EU44
            9: { cellWidth: 16, halign: 'center' },  // Tol.
        },
        alternateRowStyles: { fillColor: COLORS.gray1 },
        // EU38 column (index 5): light blue background + bold
        willDrawCell: (data) => {
            if (data.column.index === 5 && data.row.section === 'body') {
                data.cell.styles.fillColor = [240, 245, 255];
                data.cell.styles.fontStyle = 'bold';
            }
        },
    });

    const noteY = doc.lastAutoTable.finalY + 4;
    setFont(doc, 'italic', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('* Grading rule pending — base value applies until validated.', MARGIN.left, noteY);

    return noteY + 8;
}

// ─── BOM TABLE ───────────────────────────────────────────────────────────────
function drawBOMTable(doc, bomRows, y) {
    const head = [['Ref', 'Description', 'Unit', 'Qty']];
    const body = bomRows.map(r => [r.ref, r.description, r.unit, r.qty]);

    doc.autoTable({
        startY: y,
        head,
        body,
        margin: { left: MARGIN.left, right: MARGIN.right },
        styles: {
            font: 'helvetica',
            fontSize: FONT.body,
            cellPadding: 3,
            textColor: COLORS.gray4,
            lineColor: COLORS.gray2,
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: COLORS.black,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: FONT.label,
            lineColor: COLORS.black,
        },
        columnStyles: {
            0: { cellWidth: 22, fontStyle: 'bold', textColor: COLORS.accent },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 14, halign: 'center' },
        },
        alternateRowStyles: { fillColor: COLORS.gray1 },
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── CONSTRUCTION NOTES ──────────────────────────────────────────────────────
function drawConstructionNotes(doc, notes, y) {
    const pw = pageWidth(doc);
    const badgeColW = 62;
    const gap = 8;
    const textColX = MARGIN.left + badgeColW + gap;
    const textColW = pw - textColX - MARGIN.right;
    const rowMinH  = 12;

    notes.forEach(({ component, norm, note }) => {
        if (y > pageHeight(doc) - 30) { doc.addPage(); y = MARGIN.top; }

        setFont(doc, 'normal', FONT.small);
        const lines = doc.splitTextToSize(note, textColW);
        const textH = lines.length * 4;
        const rowH  = Math.max(rowMinH, textH + 4);

        const pillText = component + '  ' + norm;
        setFont(doc, 'bold', FONT.small);
        const pillW = Math.min(doc.getTextWidth(pillText) + 10, badgeColW);
        const pillY = y + (rowH - 7) / 2;
        setColor(doc, COLORS.accent, 'fill');
        doc.roundedRect(MARGIN.left, pillY, pillW, 7, 1.5, 1.5, 'F');
        setColor(doc, COLORS.accentText);
        doc.text(pillText, MARGIN.left + 5, pillY + 5);

        setFont(doc, 'normal', FONT.small);
        setColor(doc, COLORS.gray3);
        const textY = y + (rowH - textH) / 2 + 4;
        doc.text(lines, textColX, textY);

        y += rowH + 3;
    });

    return y;
}

// ─── STITCH & CONSTRUCTION TABLE ─────────────────────────────────────────────
function drawStitchTable(doc, y) {
    const stitches = Object.values(STITCH_SPECS);
    const head = [['Stitch', 'ISO', 'SPI', 'Needle', 'Use']];
    const body = stitches.map(s => [s.label, s.iso, String(s.spi), s.needle, s.use]);

    doc.autoTable({
        startY: y,
        head,
        body,
        margin: { left: MARGIN.left, right: MARGIN.right },
        styles: {
            font: 'helvetica',
            fontSize: FONT.small,
            cellPadding: 2.5,
            textColor: COLORS.gray4,
            lineColor: COLORS.gray2,
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: COLORS.black,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: FONT.small,
            lineColor: COLORS.black,
        },
        columnStyles: {
            0: { cellWidth: 38, fontStyle: 'bold' },
            1: { cellWidth: 20, textColor: COLORS.accent, fontStyle: 'bold' },
            2: { cellWidth: 12, halign: 'center' },
            3: { cellWidth: 40 },
            4: { cellWidth: 'auto' },
        },
        alternateRowStyles: { fillColor: COLORS.gray1 },
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── FABRIC SPECIFICATIONS TABLE ─────────────────────────────────────────────
function drawFabricTable(doc, fabricKey, y) {
    const fabric = FABRIC_SPECS[fabricKey] || FABRIC_SPECS['jersey_180'];
    const head = [['Property', 'Value']];
    const body = [
        ['Fabric',             fabric.label],
        ['Weight',             fabric.weight + ' g/m²'],
        ['Composition',        fabric.composition],
        ['Knit Type',          fabric.knit_type],
        ['Roll Width',         fabric.width + ' cm'],
        ['Shrinkage — Length', fabric.shrinkage.length + '% (after wash)'],
        ['Shrinkage — Width',  fabric.shrinkage.width  + '% (after wash)'],
        ['Recommended For',    fabric.recommended_for.join(', ')],
    ];

    doc.autoTable({
        startY: y,
        head,
        body,
        margin: { left: MARGIN.left, right: MARGIN.right },
        styles: {
            font: 'helvetica',
            fontSize: FONT.small,
            cellPadding: 2.5,
            textColor: COLORS.gray4,
            lineColor: COLORS.gray2,
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: COLORS.black,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: FONT.small,
            lineColor: COLORS.black,
        },
        columnStyles: {
            0: { cellWidth: 55, fontStyle: 'bold', textColor: COLORS.accent },
            1: { cellWidth: 'auto' },
        },
        alternateRowStyles: { fillColor: COLORS.gray1 },
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── PACKING INSTRUCTIONS ────────────────────────────────────────────────────
function drawPackingInstructions(doc, packingKey, y) {
    const packing = PACKING_SPECS[packingKey] || PACKING_SPECS['standard'];
    const pw   = pageWidth(doc);
    const colW = pw - MARGIN.left - MARGIN.right;

    const items = [
        ['Method', packing.method],
        ['Carton', packing.carton],
        ['Labels', packing.labels],
    ];

    items.forEach(([key, val]) => {
        setFont(doc, 'bold', FONT.small);
        setColor(doc, COLORS.accent);
        doc.text(key.toUpperCase(), MARGIN.left, y);

        setFont(doc, 'normal', FONT.small);
        setColor(doc, COLORS.gray4);
        const lines = doc.splitTextToSize(val, colW - 25);
        doc.text(lines, MARGIN.left + 22, y);
        y += lines.length * 4.5 + 3;
    });

    return y + 4;
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum, totalPages, date) {
    const pw = pageWidth(doc);
    const ph = pageHeight(doc);

    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.2);
    doc.line(MARGIN.left, ph - 9, pw - MARGIN.right, ph - 9);

    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('FlatLabs · flatsgenerator.com', MARGIN.left, ph - 4);
    doc.text(`Page ${pageNum} of ${totalPages}`, pw - MARGIN.right, ph - 4, { align: 'right' });
    doc.text(date, pw / 2, ph - 4, { align: 'center' });
}

// ─── MAIN EXPORT FUNCTION ─────────────────────────────────────────────────────
export async function exportSpecSheet(state, projectMeta = {}) {
    if (typeof window.jspdf === 'undefined') {
        console.error('[FlatLabs] jsPDF not loaded. Add CDN scripts to app.html.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const techPack = buildTechPackState(state, projectMeta);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── PAGE 1 ──────────────────────────────────────────────────────────────
    let y = drawHeader(doc, techPack.header);

    y = await drawFlat(doc, y);

    if (state.colorHex) {
        y = drawSectionLabel(doc, '00 — Colorway', y);
        y = drawColorway(doc, state.colorHex, y);
    }

    // ── 01 — Unified measurement table (front + back + all sizes) ──────────
    if (y > pageHeight(doc) - 80) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '01 — Measurement Specifications · ISO 3635 · Base EU38', y);
    y = drawMeasurementSpecs(doc, state.selections, y);

    // ── 02 — Bill of Materials ──────────────────────────────────────────────
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '02 — Bill of Materials (BOM)', y);
    y = drawBOMTable(doc, techPack.bom, y);

    // ── 03 — Stitch & Construction ──────────────────────────────────────────
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '03 — Stitch & Construction Specifications', y);
    y = drawStitchTable(doc, y);

    // ── 04 — Fabric Specifications ──────────────────────────────────────────
    doc.addPage(); y = MARGIN.top + 10;
    y = drawSectionLabel(doc, '04 — Fabric Specifications', y);
    y = drawFabricTable(doc, state.fabric || 'jersey_180', y);

    // ── 05 — Packing Instructions ───────────────────────────────────────────
    if (y > pageHeight(doc) - 70) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '05 — Packing Instructions', y);
    y = drawPackingInstructions(doc, 'standard', y);

    // ── 06 — Construction Notes ─────────────────────────────────────────────
    if (y > pageHeight(doc) - 50) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '06 — Construction Notes & ISO Standards', y);
    y += 4;
    y = drawConstructionNotes(doc, techPack.constructionNotes, y);

    // Footers on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        drawFooter(doc, p, totalPages, techPack.header.date);
    }

    const filename = `FlatLabs_TechPack_${techPack.header.sku}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
    console.log(`[FlatLabs ✓] Tech Pack exported: ${filename}`);
}
