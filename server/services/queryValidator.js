const DESTRUCTIVE_PATTERNS = [
    /\$drop/i, /\.drop\s*\(/i, /dropDatabase/i, /dropCollection/i,
    /\$delete/i, /deleteMany\s*\(\s*\{\s*\}\s*\)/i,
    /\$remove/i, /remove\s*\(\s*\{\s*\}\s*\)/i,
    /\$rename/i,
    /db\s*\.\s*dropDatabase/i,
    /\$out/i,
    /\$merge/i,
];

const INJECTION_PATTERNS = [
    /\$where/i,
    /\$expr.*\$function/i,
    /javascript:/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /setTimeout/i, /setInterval/i,
    /process\s*\.\s*exit/i,
    /require\s*\(/i,
];

class QueryValidator {
    validate(query) {
        const queryStr = typeof query === 'string' ? query : JSON.stringify(query);

        // Check destructive patterns
        for (const pattern of DESTRUCTIVE_PATTERNS) {
            if (pattern.test(queryStr)) {
                return {
                    safe: false,
                    reason: `Destructive operation detected: ${pattern.toString()}. This query has been blocked for safety.`,
                    severity: 'critical',
                };
            }
        }

        // Check injection patterns
        for (const pattern of INJECTION_PATTERNS) {
            if (pattern.test(queryStr)) {
                return {
                    safe: false,
                    reason: `Potential injection detected: ${pattern.toString()}. Query blocked.`,
                    severity: 'high',
                };
            }
        }

        // Validate query structure
        if (typeof query === 'object' && query !== null) {
            const deepCheck = this.deepValidate(query);
            if (!deepCheck.safe) return deepCheck;
        }

        return { safe: true, reason: null, severity: null };
    }

    deepValidate(obj, depth = 0) {
        if (depth > 10) {
            return { safe: false, reason: 'Query nesting too deep (max 10 levels)', severity: 'medium' };
        }

        if (Array.isArray(obj)) {
            for (const item of obj) {
                if (typeof item === 'object' && item !== null) {
                    const check = this.deepValidate(item, depth + 1);
                    if (!check.safe) return check;
                }
            }
        } else if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                // Block dangerous operators
                if (['$where', '$accumulator', '$function'].includes(key)) {
                    return { safe: false, reason: `Operator '${key}' is not allowed`, severity: 'high' };
                }
                if (typeof value === 'object' && value !== null) {
                    const check = this.deepValidate(value, depth + 1);
                    if (!check.safe) return check;
                }
            }
        }

        return { safe: true, reason: null, severity: null };
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        // Remove null bytes and control characters
        return input.replace(/[\x00-\x1f\x7f]/g, '').trim();
    }
}

module.exports = new QueryValidator();
