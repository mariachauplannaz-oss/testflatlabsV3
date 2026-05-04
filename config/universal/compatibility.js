// ═══ compatibility.js — Rule engine for material compatibility checks ═══

export const COMPATIBILITY_RULES = [
    {
        id:    'needle_too_fine_for_fabric',
        level: 'warning',
        check: (ctx) => {
            if (!ctx.fabric || !ctx.needle) return false;
            return ctx.fabric.weight > ctx.needle.for_weight.max;
        },
        message: (ctx) =>
            `Needle ${ctx.needle.label} is too fine for ${ctx.fabric.label} ` +
            `(${ctx.fabric.weight} g/m²). Risk of needle breakage. ` +
            `Recommended: a needle rated for at least ${ctx.fabric.weight} g/m².`
    },
    {
        id:    'sharp_needle_on_knit',
        level: 'warning',
        check: (ctx) => {
            if (!ctx.fabric || !ctx.needle) return false;
            return ctx.fabric.knit_type === 'knit' && ctx.needle.point_type === 'sharp';
        },
        message: (ctx) =>
            `Sharp needles can damage knit fabrics like ${ctx.fabric.label} by ` +
            `cutting fibers. Use a ballpoint needle for knits.`
    },
    {
        id:    'thread_too_thick_for_needle',
        level: 'warning',
        check: (ctx) => {
            if (!ctx.thread || !ctx.needle) return false;
            return ctx.thread.for_needle_min_size > ctx.needle.size;
        },
        message: (ctx) =>
            `Thread ${ctx.thread.label} requires a needle size of at least ` +
            `${ctx.thread.for_needle_min_size}. Selected needle is ${ctx.needle.size}.`
    }
];

/**
 * Runs all rules against a selection context.
 * @param {Object} ctx - { fabric, needle, thread, stitch, careLabel, brandLabel }
 * @returns {Array} of { id, level, message } for each triggered rule
 */
export function checkCompatibility(ctx) {
    const triggered = [];
    for (const rule of COMPATIBILITY_RULES) {
        if (rule.check(ctx)) {
            triggered.push({
                id:      rule.id,
                level:   rule.level,
                message: typeof rule.message === 'function' ? rule.message(ctx) : rule.message
            });
        }
    }
    return triggered;
}
