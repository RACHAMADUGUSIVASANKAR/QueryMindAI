class AggregationBuilder {
    build(intent, entities, collection) {
        const pipeline = [];

        switch (intent) {
            case 'COUNT':
                pipeline.push(...this.buildCount(entities));
                break;
            case 'AVERAGE':
                pipeline.push(...this.buildAverage(entities));
                break;
            case 'SUM':
                pipeline.push(...this.buildSum(entities));
                break;
            case 'GROUP':
                pipeline.push(...this.buildGroup(entities));
                break;
            default:
                pipeline.push(...this.buildDefault(entities));
        }

        return pipeline;
    }

    buildCount(entities) {
        const match = this.buildMatch(entities);
        const pipeline = [];
        if (Object.keys(match).length > 0) pipeline.push({ $match: match });
        pipeline.push({ $count: 'total' });
        return pipeline;
    }

    buildAverage(entities) {
        const field = entities.find(e => e.type === 'FIELD')?.value || 'value';
        const groupBy = entities.find(e => e.type === 'GROUP_BY')?.value;

        return [
            { $group: { _id: groupBy ? `$${groupBy}` : null, average: { $avg: `$${field}` }, count: { $sum: 1 } } },
            { $sort: { average: -1 } },
        ];
    }

    buildSum(entities) {
        const field = entities.find(e => e.type === 'FIELD')?.value || 'value';
        const groupBy = entities.find(e => e.type === 'GROUP_BY')?.value;

        return [
            { $group: { _id: groupBy ? `$${groupBy}` : null, total: { $sum: `$${field}` }, count: { $sum: 1 } } },
            { $sort: { total: -1 } },
        ];
    }

    buildGroup(entities) {
        const groupBy = entities.find(e => e.type === 'GROUP_BY')?.value || '_id';
        return [
            { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ];
    }

    buildDefault(entities) {
        const match = this.buildMatch(entities);
        const pipeline = [];
        if (Object.keys(match).length > 0) pipeline.push({ $match: match });
        pipeline.push({ $limit: 100 });
        return pipeline;
    }

    buildMatch(entities) {
        const match = {};
        const fieldEntities = entities.filter(e => e.type === 'FIELD');

        for (const field of fieldEntities) {
            const operator = entities.find(e => e.type === 'OPERATOR' && entities.indexOf(e) > entities.indexOf(field));
            const value = entities.find(e => e.type === 'VALUE' && entities.indexOf(e) > entities.indexOf(field));

            if (value) {
                const val = isNaN(value.value) ? value.value : Number(value.value);
                if (operator) {
                    match[field.value] = { [operator.value]: val };
                } else {
                    match[field.value] = val;
                }
            }
        }

        return match;
    }
}

module.exports = new AggregationBuilder();
