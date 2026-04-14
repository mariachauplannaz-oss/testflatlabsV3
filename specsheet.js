// ═══ specsheet.js — PDF Tech Pack generator (jsPDF + AutoTable, CDN, no build step) ═══
// Dependencies loaded via app.html <script> tags:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

import { buildTechPackState } from './techpack.js';
import { findClosestPantone } from './config.js';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
    black:      [15,  15,  15],
    white:      [255, 255, 255],
    accent:     [0,   122, 255],   // FlatLabs blue
    gray1:      [245, 245, 247],   // table header bg
    gray2:      [200, 200, 205],   // borders
    gray3:      [110, 110, 115],   // secondary text
    gray4:      [60,  60,  65],    // body text
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
        ['SKU',     header.sku],
        ['SIZE',    header.size],
        ['SEASON',  header.season],
        ['DATE',    header.date],
        ['FABRIC',  header.fabric],
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
    setColor(doc, COLORS.gray2, 'fill');
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
    const svgEl = document.querySelector('#svg-preview svg');
    if (!svgEl) return y;

    try {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = 3; // retina
                canvas.width  = 240 * scale;
                canvas.height = 280 * scale;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, 240, 280);
                URL.revokeObjectURL(url);

                const imgData = canvas.toDataURL('image/png');
                const imgW = 60;
                const imgH = 70;
                const imgX = pw / 2 - imgW / 2;
                doc.addImage(imgData, 'PNG', imgX, y, imgW, imgH);
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });

        // Light border around flat
        doc.setDrawColor(...COLORS.gray2);
        doc.setLineWidth(0.3);
        const imgW = 60, imgH = 70;
        const imgX = pw / 2 - imgW / 2;
        doc.rect(imgX, y, imgW, imgH);

        return y + imgH + 6;
    } catch (e) {
        console.warn('[FlatLabs] Could not render SVG to PDF:', e);
        return y;
    }
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
        alternateRowStyles: {
            fillColor: [250, 250, 252],
        }
    });

    return doc.lastAutoTable.finalY + 8;
}

// ─── CONSTRUCTION NOTES ───────────────────────────────────────────────────────
function drawConstructionNotes(doc, notes, y) {
    const pw = pageWidth(doc);
    const colW = pw - MARGIN.left - MARGIN.right;

    notes.forEach(({ component, norm, note }) => {
        // Check page overflow
        if (y > pageHeight(doc) - 30) {
            doc.addPage();
            y = MARGIN.top;
        }

        // Component + norm pill
        setFont(doc, 'bold', FONT.label);
        setColor(doc, COLORS.gray4);
        doc.text(component, MARGIN.left, y);

        // ISO norm badge
        setColor(doc, COLORS.accent, 'fill');
        doc.roundedRect(MARGIN.left + 60, y - 4, 22, 6, 1, 1, 'F');
        setFont(doc, 'bold', FONT.small);
        setColor(doc, COLORS.white);
        doc.text(norm, MARGIN.left + 71, y, { align: 'center' });

        // Note text
        setFont(doc, 'normal', FONT.small);
        setColor(doc, COLORS.gray3);
        const lines = doc.splitTextToSize(note, colW - 4);
        doc.text(lines, MARGIN.left, y + 5);

        y += 5 + lines.length * 4 + 5;

        // Light divider
        doc.setDrawColor(...COLORS.gray2);
        doc.setLineWidth(0.2);
        doc.line(MARGIN.left, y - 3, pw - MARGIN.right, y - 3);
    });

    return y;
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
    doc.text('Generated by FlatLabs · flatlabs.netlify.app', MARGIN.left, y);
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

    // Colorway section (uses state.fillColor — skipped gracefully if absent)
    if (state.fillColor) {
        y = drawSectionLabel(doc, '00 — Colorway', y);
        y = drawColorway(doc, state.fillColor, y);
    }

    // POM section
    y = drawSectionLabel(doc, '01 — Points of Measure (POM) · ISO 3635 · EU Size 38', y);
    y = drawPOMTable(doc, techPack.pom, y);

    // BOM section
    if (y > pageHeight(doc) - 60) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '02 — Bill of Materials (BOM)', y);
    y = drawBOMTable(doc, techPack.bom, y);

    // Construction notes section
    if (y > pageHeight(doc) - 50) { doc.addPage(); y = MARGIN.top + 10; }
    y = drawSectionLabel(doc, '03 — Construction Notes & ISO Standards', y);
    y = drawConstructionNotes(doc, techPack.constructionNotes, y);

    // Footers on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        drawFooter(doc, p, totalPages, techPack.header.date);
    }

    // Save
    const filename = `FlatLabs_TechPack_${techPack.header.sku}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
    console.log(`[FlatLabs ✓] Tech Pack exported: ${filename}`);
}
