export function formatQuery(query) {
    if (typeof query === 'string') {
        try {
            return JSON.stringify(JSON.parse(query), null, 2);
        } catch {
            return query;
        }
    }
    return JSON.stringify(query, null, 2);
}

export function formatExecutionTime(ms) {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}
