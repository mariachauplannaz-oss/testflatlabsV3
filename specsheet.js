// ═══ specsheet.js — PDF Tech Pack generator (jsPDF + AutoTable, CDN, no build step) ═══
// Dependencies loaded via app.html <script> tags:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

import { buildTechPackState } from './techpack.js';
import { findClosestPantone, collectMeasurements, STITCH_SPECS, FABRIC_SPECS, PACKING_SPECS, GRADING, SIZE_EQUIV } from './config.js';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
    black:      [33,  43,  49],    // --ink / --gray1
    white:      [255, 255, 255],   // --white
    accent:     [255, 154, 110],   // --accent
    accentText: [33,  43,  49],    // --accent-text
    gray1:      [248, 248, 248],   // --gray4 (table row bg)
    gray2:      [210, 210, 215],   // --gray3 (borders)
    gray3:      [95,  115, 133],   // --ink-soft (secondary text)
    gray4:      [33,  43,  49],    // --ink (body text)
};

const FONT = {
    heading:   18,
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

function pageWidth(doc) {
    return doc.internal.pageSize.getWidth();
}

function pageHeight(doc) {
    return doc.internal.pageSize.getHeight();
}

// ─── HELPER: parse HEX → [R, G, B] ──────────────────────────────────────────
function hexToRgb(hex) {
    const h = hex.startsWith('#') ? hex : '#' + hex;
    return [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
    ];
}

// ─── HELPER: decide label color (black or white) based on luminance ──────────
function contrastColor(r, g, b) {
    // Relative luminance (WCAG formula)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 140 ? COLORS.black : COLORS.white;
}

// ─── HEADER BAND ─────────────────────────────────────────────────────────────
function drawHeader(doc, header) {
    const pw = pageWidth(doc);

    // Black top band
    setColor(doc, COLORS.black, 'fill');
    doc.rect(0, 0, pw, 28, 'F');

    // FlatLabs wordmark — left
    setFont(doc, 'bold', 13);
    setColor(doc, COLORS.white);
    doc.text('FLATLABS', MARGIN.left, 12);

    // Accent dot
    setColor(doc, COLORS.accent, 'fill');
    doc.circle(MARGIN.left + 48, 9.5, 1.8, 'F');

    // "TECH PACK" label — right-aligned
    setFont(doc, 'normal', 7);
    setColor(doc, [160, 160, 170]);
    doc.text('TECH PACK', pw - MARGIN.right, 12, { align: 'right' });

    // Project name
    setFont(doc, 'bold', FONT.heading);
    setColor(doc, COLORS.white);
    doc.text(header.projectName.toUpperCase(), MARGIN.left, 22);

    // Metadata row below band
    const metaY = 34;
    const metaItems = [
        ['BRAND',   header.brand],
        ['SKU',     header.sku],
        ['SIZE',    header.size],
        ['SEASON',  header.season],
        ['DATE',    header.date],
    ];

    const colW = (pw - MARGIN.left - MARGIN.right) / metaItems.length;
    metaItems.forEach(([key, val], i) => {
        const x = MARGIN.left + i * colW;
        setFont(doc, 'bold', FONT.small);
        setColor(doc, COLORS.gray3);
        doc.text(key, x, metaY);

        setFont(doc, 'normal', FONT.label);
        setColor(doc, COLORS.gray4);
        doc.text(val, x, metaY + 4.5);
    });

    // Thin separator line
    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.3);
    doc.line(MARGIN.left, metaY + 9, pw - MARGIN.right, metaY + 9);
    
    // Components tag line
    if (header.components) {
        setFont(doc, 'italic', FONT.small);
        setColor(doc, COLORS.gray3);
        doc.text('Components: ' + header.components, MARGIN.left, metaY + 14);
    }

    return metaY + 20; // return cursor Y after header
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────
function drawSectionLabel(doc, label, y) {
    const pw = pageWidth(doc);
    setColor(doc, COLORS.gray1, 'fill');
    doc.rect(MARGIN.left, y, pw - MARGIN.left - MARGIN.right, 7, 'F');

    setFont(doc, 'bold', FONT.label);
    setColor(doc, COLORS.accent);
    doc.text(label.toUpperCase(), MARGIN.left + 3, y + 4.8);

    return y + 11;
}

// ─── SVG FLAT VISUAL ─────────────────────────────────────────────────────────
// Serializes the live SVG DOM node to a PNG data URL, injects into PDF
async function drawFlat(doc, y) {
    const pw = pageWidth(doc);
    const svgFront = document.querySelector('#svg-preview svg');
    const svgBack  = document.querySelector('#svg-preview-back svg');

    async function svgToPng(svgEl) {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = 3;
                canvas.width  = 240 * scale;
                canvas.height = 280 * scale;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, 240, 280);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    try {
        if (svgFront && svgBack) {
            // Side by side: front left, back right
            const imgW = 55, imgH = 65, gap = 6;
            const totalW = imgW * 2 + gap;
            const startX = pw / 2 - totalW / 2;

            const frontData = await svgToPng(svgFront);
            const backData  = await svgToPng(svgBack);

            doc.addImage(frontData, 'PNG', startX, y, imgW, imgH);
            doc.addImage(backData,  'PNG', startX + imgW + gap, y, imgW, imgH);

            doc.setDrawColor(...COLORS.gray2);
            doc.setLineWidth(0.3);
            doc.rect(startX, y, imgW, imgH);
            doc.rect(startX + imgW + gap, y, imgW, imgH);

            // Labels
            setFont(doc, 'normal', FONT.small);
            setColor(doc, COLORS.gray3);
            doc.text('FRONT', startX + imgW / 2, y + imgH + 4, { align: 'center' });
            doc.text('BACK',  startX + imgW + gap + imgW / 2, y + imgH + 4, { align: 'center' });

            return y + imgH + 10;
        } else if (svgFront) {
            // Single front view (original behavior)
            const imgData = await svgToPng(svgFront);
            const imgW = 60, imgH = 70;
            const imgX = pw / 2 - imgW / 2;
            doc.addImage(imgData, 'PNG', imgX, y, imgW, imgH);
            doc.setDrawColor(...COLORS.gray2);
            doc.setLineWidth(0.3);
            doc.rect(imgX, y, imgW, imgH);
            return y + imgH + 6;
        }
    } catch (e) {
        console.warn('[FlatLabs] Could not render SVG to PDF:', e);
    }

    return y;
}

// ─── COLORWAY SECTION ────────────────────────────────────────────────────────
// Renders a color swatch with Name, HEX, and closest Pantone TCX reference.
// fillColorHex: string like '#DC143C' or 'DC143C' from state.fillColor

function drawColorway(doc, fillColorHex, y) {
    if (!fillColorHex) return y;

    const pw = pageWidth(doc);

    // Normalize hex
    const hex = fillColorHex.startsWith('#') ? fillColorHex.toUpperCase() : '#' + fillColorHex.toUpperCase();
    const [r, g, b] = hexToRgb(hex);
    const pantoneMatch = findClosestPantone(hex);

    // Layout constants
    const swatchW   = 28;   // mm — width of color rectangle
    const swatchH   = 18;   // mm — height of color rectangle
    const swatchX   = MARGIN.left;
    const textX     = swatchX + swatchW + 6;  // text starts 6mm after swatch

    // ── Color swatch ──
    doc.setFillColor(r, g, b);
    doc.rect(swatchX, y, swatchW, swatchH, 'F');

    // Swatch border
    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.3);
    doc.rect(swatchX, y, swatchW, swatchH);

    // HEX label centered inside swatch (contrast-aware)
    const labelRgb = contrastColor(r, g, b);
    setFont(doc, 'bold', FONT.small);
    setColor(doc, labelRgb);
    doc.text(hex, swatchX + swatchW / 2, y + swatchH / 2 + 1, { align: 'center' });

    // ── Text block (right of swatch) ──
    const lineH = 5.5;  // mm between text lines

    // Color name
    setFont(doc, 'bold', FONT.body);
    setColor(doc, COLORS.gray4);
    doc.text(pantoneMatch.name, textX, y + 5);

    // HEX value row
    setFont(doc, 'bold', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('HEX', textX, y + 5 + lineH);
    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray4);
    doc.text(hex, textX + 10, y + 5 + lineH);

    // Pantone row
    setFont(doc, 'bold', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('PANTONE', textX, y + 5 + lineH * 2);
    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray4);
    doc.text(pantoneMatch.pantone + '  ·  approx.', textX + 18, y + 5 + lineH * 2);

    // Approx disclaimer — far right, italic, small
    setFont(doc, 'italic', 5.5);
    setColor(doc, COLORS.gray3);
    doc.text('Color matching is approximate. Verify against physical Pantone swatch before production.',
        pw - MARGIN.right, y + swatchH, { align: 'right' });

    return y + swatchH + 8;  // cursor Y after colorway block
}

// ─── POM TABLE ───────────────────────────────────────────────────────────────
function drawPOMTable(doc, pomRows, y) {
    const head = [['Code', 'Description', 'Measure (cm)', 'Tolerance']];
    const body = pomRows.map(r => [
        r.code,
        r.description,
        String(r.value),
        r.tolerance + ' cm'
    ]);

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
        },
        columnStyles: {
            0: { cellWidth: 22, fontStyle: 'bold', textColor: COLORS.accent },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 28, halign: 'center' },
            3: { cellWidth: 28, halign: 'center' },
        },
        alternateRowStyles: {
            fillColor: [250, 250, 252],
        },
        didParseCell: (data) => {
            // Highlight tolerance column value in accent if tight (<20cm measure)
            if (data.column.index === 3 && data.row.section === 'body') {
                const measureVal = parseFloat(pomRows[data.row.index]?.value);
                if (measureVal < 20) {
                    data.cell.styles.textColor = [255, 149, 0]; // orange = tight tolerance
                }
            }
        }
    });

    return doc.lastAutoTable.finalY + 8;
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
        },
        columnStyles: {
            0: { cellWidth: 22, fontStyle: 'bold', textColor: COLORS.gray3 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 14, halign: 'center' },
        },
        alternateRowStyles: { fillColor: [250, 250, 252] }
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── CONSTRUCTION NOTES ───────────────────────────────────────────────────────
function drawConstructionNotes(doc, notes, y) {
    const pw = pageWidth(doc);
    const colW = pw - MARGIN.left - MARGIN.right;

    notes.forEach(({ component, norm, note }) => {
        if (y > pageHeight(doc) - 30) {
            doc.addPage();
            y = MARGIN.top;
        }
        const pillText = component + '   ' + norm;
        const pillW = doc.getTextWidth(pillText) + 10;
        setColor(doc, COLORS.accent, 'fill');
        doc.roundedRect(MARGIN.left, y - 4.5, pillW, 7, 1.5, 1.5, 'F');
        setFont(doc, 'bold', FONT.small);
        setColor(doc, COLORS.accentText);
        doc.text(pillText, MARGIN.left + 5, y);
        setFont(doc, 'normal', FONT.small);
        setColor(doc, COLORS.gray3);
        const lines = doc.splitTextToSize(note, colW - 4);
        doc.text(lines, MARGIN.left, y + 5);
        y += 5 + lines.length * 4 + 5;
        doc.setDrawColor(...COLORS.gray2);
        doc.setLineWidth(0.2);
        doc.line(MARGIN.left, y - 3, pw - MARGIN.right, y - 3);
    });

    return y;
}

// ─── GRADING SECTION ─────────────────────────────────────────────────────────
function drawGradingSection(doc, selections, y) {
    const sizes = ['EU34', 'EU36', 'EU38', 'EU40', 'EU42', 'EU44'];
    const sizeLabels = ['XS · EU34', 'S · EU36', 'M · EU38', 'L · EU40', 'XL · EU42', 'XXL · EU44'];

    // Collect all measures from selections (front view, EU38 base)
    const baseMeasures = collectMeasurements(selections, 'EU38', 'front');

    // ── Table 1: Grading ──
    const head1 = [['Measurement', ...sizeLabels]];
    const body1 = baseMeasures.map(m => {
        const row = [m.description];
        sizes.forEach(size => {
            const val = GRADING.getForSize(size, m.key, m.value);
            const isBase = size === 'EU38';
            row.push(isBase ? String(val) : String(val));
        });
        return row;
    });

    doc.autoTable({
        startY: y,
        head: head1,
        body: body1,
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
        },
        columnStyles: {
            0: { cellWidth: 52, fontStyle: 'bold', textColor: COLORS.gray3 },
            3: { fontStyle: 'bold', textColor: COLORS.gray4 }, // EU38 base column
        },
        alternateRowStyles: { fillColor: [250, 250, 252] },
        didParseCell: (data) => {
            // Highlight EU38 column (index 3) in all rows
            if (data.column.index === 3 && data.row.section === 'body') {
                data.cell.styles.fillColor = [240, 245, 255];
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    y = doc.lastAutoTable.finalY + 6;

    // ── Table 2: Size Equivalences ──
    const regions = ['EU', 'US', 'UK', 'IT', 'FR', 'JP', 'AU'];
    const sizeKeys = ['EU34', 'EU36', 'EU38', 'EU40', 'EU42', 'EU44'];
    const labelRow = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const head2 = [['Region', ...labelRow]];
    const body2 = regions.map(region => {
        const row = [region];
        sizeKeys.forEach(size => {
            const equiv = SIZE_EQUIV[size];
            row.push(region === 'EU' ? size.replace('EU', '') : (equiv?.[region.toLowerCase()] || '—'));
        });
        return row;
    });

    doc.autoTable({
        startY: y,
        head: head2,
        body: body2,
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
        },
        columnStyles: {
            0: { cellWidth: 22, fontStyle: 'bold', textColor: COLORS.gray3 },
            3: { fillColor: [240, 245, 255], fontStyle: 'bold' }, // M = EU38
        },
        alternateRowStyles: { fillColor: [250, 250, 252] },
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── STITCH & CONSTRUCTION TABLE ─────────────────────────────────────────────
function drawStitchTable(doc, y) {
    const stitches = Object.values(STITCH_SPECS);
    const head = [['Stitch', 'ISO', 'SPI', 'Needle', 'Use']];
    const body = stitches.map(s => [
        s.label,
        s.iso,
        String(s.spi),
        s.needle,
        s.use
    ]);

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
        },
        columnStyles: {
            0: { cellWidth: 38, fontStyle: 'bold' },
            1: { cellWidth: 20, textColor: COLORS.accent, fontStyle: 'bold' },
            2: { cellWidth: 12, halign: 'center' },
            3: { cellWidth: 40 },
            4: { cellWidth: 'auto' },
        },
        alternateRowStyles: { fillColor: [250, 250, 252] }
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── FABRIC SPECIFICATIONS TABLE ─────────────────────────────────────────────
function drawFabricTable(doc, fabricKey, y) {
    // Default to jersey_180 if key not found
    const fabric = FABRIC_SPECS[fabricKey] || FABRIC_SPECS['jersey_180'];
    const head = [['Property', 'Value']];
    const body = [
        ['Fabric',        fabric.label],
        ['Weight',        fabric.weight + ' g/m²'],
        ['Composition',   fabric.composition],
        ['Knit Type',     fabric.knit_type],
        ['Roll Width',    fabric.width + ' cm'],
        ['Shrinkage — Length', fabric.shrinkage.length + '% (after wash)'],
        ['Shrinkage — Width',  fabric.shrinkage.width  + '% (after wash)'],
        ['Recommended For', fabric.recommended_for.join(', ')],
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
        },
        columnStyles: {
            0: { cellWidth: 55, fontStyle: 'bold', textColor: COLORS.gray3 },
            1: { cellWidth: 'auto' },
        },
        alternateRowStyles: { fillColor: [250, 250, 252] }
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── PACKING INSTRUCTIONS ────────────────────────────────────────────────────
function drawPackingInstructions(doc, packingKey, y) {
    const packing = PACKING_SPECS[packingKey] || PACKING_SPECS['standard'];
    const pw = pageWidth(doc);
    const colW = pw - MARGIN.left - MARGIN.right;

    const items = [
        ['Method',  packing.method],
        ['Carton',  packing.carton],
        ['Labels',  packing.labels],
    ];

    items.forEach(([key, val]) => {
        setFont(doc, 'bold', FONT.small);
        setColor(doc, COLORS.gray3);
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
    const y = ph - 10;

    doc.setDrawColor(...COLORS.gray2);
    doc.setLineWidth(0.3);
    doc.line(MARGIN.left, y - 4, pw - MARGIN.right, y - 4);

    setFont(doc, 'normal', FONT.small);
    setColor(doc, COLORS.gray3);
    doc.text('Generated by FlatLabs · flatsgenerator.com', MARGIN.left, y);
    doc.text(`Page ${pageNum} of ${totalPages}`, pw - MARGIN.right, y, { align: 'right' });
    doc.text(date, pw / 2, y, { align: 'center' });
}

// ─── MAIN EXPORT FUNCTION ─────────────────────────────────────────────────────
export async function exportSpecSheet(state, projectMeta = {}) {
    // Guard: jsPDF must be loaded
    if (typeof window.jspdf === 'undefined') {
        console.error('[FlatLabs] jsPDF not loaded. Add CDN scripts to app.html.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const techPack = buildTechPackState(state, projectMeta);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── PAGE 1 ──────────────────────────────────────────────────────────────
    let y = drawHeader(doc, techPack.header);

    // Flat visual
    y = await drawFlat(doc, y);

    // 00 — Colorway
    if (state.colorHex) {
        y = drawSectionLabel(doc, '00 — Colorway', y);
        y = drawColorway(doc, state.colorHex, y);
    }

    // 01 — POM Front
    y = drawSectionLabel(doc, '01 — Points of Measure (POM) · ISO 3635 · EU Size 38', y);
    y = drawPOMTable(doc, techPack.pom, y);

    // 02 — POM Back
    const backPom = collectMeasurements(state.selections, 'EU38', 'back');
    if (backPom.length > 0) {
        if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
        y = drawSectionLabel(doc, '02 — Back View · Points of Measure', y);
        y = drawPOMTable(doc, backPom, y);
    }

    // 03 — Grading
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '03 — Grading Table', y);
    y = drawGradingSection(doc, state.selections, y);

    // 04 — BOM
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '04 — Bill of Materials (BOM)', y);
    y = drawBOMTable(doc, techPack.bom, y);

    // 05 — Stitch
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '05 — Stitch & Construction Specifications', y);
    y = drawStitchTable(doc, y);

    // 06 — Fabric
    doc.addPage(); y = MARGIN.top + 10;
    y = drawSectionLabel(doc, '06 — Fabric Specifications', y);
    y = drawFabricTable(doc, state.fabric || 'jersey_180', y);

    // 07 — Packing
    if (y > pageHeight(doc) - 70) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '07 — Packing Instructions', y);
    y = drawPackingInstructions(doc, 'standard', y);

    // 08 — Construction Notes
    if (y > pageHeight(doc) - 50) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '08 — Construction Notes & ISO Standards', y);
    y += 4;
    y = drawConstructionNotes(doc, techPack.constructionNotes, y);

    // Save
    const filename = `FlatLabs_TechPack_${techPack.header.sku}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
    console.log(`[FlatLabs ✓] Tech Pack exported: ${filename}`);

}
