// ═══ fabrics.js — Fabric specifications ═══

export const FABRIC_SPECS = {
    jersey_150: {
        label:          'Jersey 150 g/m²',
        weight:         150,
        composition:    '100% Cotton',
        width:          150,
        shrinkage:      { length: 5, width: 3 },
        knit_type:      'knit',
        stretch:        'low',
        tags:           ['lightweight', 'breathable'],
        recommended_for: ['Lightweight tees', 'Summer basics']
    },
    jersey_180: {
        label:          'Jersey 180 g/m²',
        weight:         180,
        composition:    '95% Cotton, 5% Elastane',
        width:          160,
        shrinkage:      { length: 5, width: 3 },
        knit_type:      'knit',
        stretch:        'low',
        tags:           ['standard'],
        recommended_for: ['Standard tees', 'Year-round basics']
    },
    jersey_200: {
        label:          'Jersey 200 g/m²',
        weight:         200,
        composition:    '100% Cotton',
        width:          150,
        shrinkage:      { length: 3, width: 2 },
        knit_type:      'knit',
        stretch:        'low',
        tags:           ['heavyweight', 'premium'],
        recommended_for: ['Premium tees', 'Heavyweight basics']
    },
    rib_1x1: {
        label:          'Rib 1×1',
        weight:         220,
        composition:    '95% Cotton, 5% Elastane',
        width:          80,
        shrinkage:      { length: 5, width: 5 },
        knit_type:      'knit',
        stretch:        'high',
        tags:           ['ribbed', 'trim'],
        recommended_for: ['Neckbands', 'Cuffs', 'Hem bands']
    }
};
