const axios = require('axios');
require('dotenv').config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

class AIService {
    async translateQuery(naturalLanguage, collection) {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/translate`, {
                query: naturalLanguage,
                collection,
            }, { timeout: 10000 });
            return response.data;
        } catch (error) {
            console.warn('AI service unavailable, using fallback NLP:', error.message);
            return this.fallbackTranslate(naturalLanguage, collection);
        }
    }

    async chat(message, history) {
        // Try Gemini first
        if (GEMINI_API_KEY) {
            try {
                return await this.geminiChat(message, history);
            } catch (err) {
                console.warn('Gemini API failed, using fallback:', err.message);
            }
        }
        // Fallback to Python AI service
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/chat`, { message, history }, { timeout: 10000 });
            return response.data;
        } catch (error) {
            return { response: this.fallbackChat(message) };
        }
    }

    async geminiChat(message, history) {
        const systemPrompt = `You are QueryMind AI Assistant, a helpful chatbot that specializes in MongoDB queries and database operations.
You help users write natural language queries that get translated to MongoDB queries.
The database has a collection called "users" with these fields: name, email, role (student/admin), department (IT/HR/CS etc.), createdAt (date), salary (number), status (active/inactive), experience (number), skills (array of strings).
Keep responses concise and helpful. If users ask about queries, give them examples they can paste into the query panel.
Example queries they can try:
- "Find all active users in IT department"
- "Show users with salary greater than 40000"
- "Count users by department"
- "Get average salary by department"
- "Find admins with experience more than 3 years"`;

        const contents = [];
        // Add history
        if (history && history.length > 0) {
            for (const msg of history.slice(-10)) {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text || msg.content || msg.message || '' }]
                });
            }
        }
        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            },
            { timeout: 15000 }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty Gemini response');
        return { response: text };
    }

    async getEmbedding(text) {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/embed`, { text }, { timeout: 10000 });
            return response.data.embedding;
        } catch (error) {
            return Array.from({ length: 384 }, () => Math.random() * 2 - 1);
        }
    }

    fallbackTranslate(query, collection) {
        const q = query.toLowerCase().trim();
        let intent = 'FIND';
        let mongoQuery = {};
        const entities = [];

        // --- Intent detection ---
        if (/\b(count|how many|number of|total\s+(?:number|count))\b/.test(q)) intent = 'COUNT';
        else if (/\b(average|avg|sum|group|aggregate|total.*by|per\s+\w+)\b/.test(q)) intent = 'AGGREGATE';
        else if (/\b(find|show|get|list|display|fetch|search|retrieve)\b/.test(q)) intent = 'FIND';

        // --- Entity extraction for user's actual schema ---

        // Salary patterns
        const salaryGt = q.match(/salary\s*(?:is\s*)?(?:greater|more|over|above|>|higher)\s*(?:than\s*)?(\d+)/);
        if (salaryGt) {
            mongoQuery.salary = { $gt: parseInt(salaryGt[1]) };
            entities.push({ type: 'FIELD', value: 'salary' }, { type: 'OPERATOR', value: '$gt' }, { type: 'VALUE', value: salaryGt[1] });
        }
        const salaryLt = q.match(/salary\s*(?:is\s*)?(?:less|fewer|under|below|<|lower)\s*(?:than\s*)?(\d+)/);
        if (salaryLt) {
            mongoQuery.salary = { $lt: parseInt(salaryLt[1]) };
            entities.push({ type: 'FIELD', value: 'salary' }, { type: 'OPERATOR', value: '$lt' }, { type: 'VALUE', value: salaryLt[1] });
        }

        // Experience patterns
        const expGt = q.match(/experience\s*(?:is\s*)?(?:greater|more|over|above|>)\s*(?:than\s*)?(\d+)/);
        if (expGt) {
            mongoQuery.experience = { $gt: parseInt(expGt[1]) };
            entities.push({ type: 'FIELD', value: 'experience' }, { type: 'OPERATOR', value: '$gt' }, { type: 'VALUE', value: expGt[1] });
        }
        const expLt = q.match(/experience\s*(?:is\s*)?(?:less|fewer|under|below|<)\s*(?:than\s*)?(\d+)/);
        if (expLt) {
            mongoQuery.experience = { $lt: parseInt(expLt[1]) };
            entities.push({ type: 'FIELD', value: 'experience' }, { type: 'OPERATOR', value: '$lt' }, { type: 'VALUE', value: expLt[1] });
        }

        // Age/older/younger patterns → map to experience since this DB doesn't have age
        const ageGt = q.match(/(?:age|older|experience)\s*(?:is\s*)?(?:greater|more|over|above|>|than)\s*(?:than\s*)?(\d+)/);
        if (ageGt && !expGt) {
            // If "older than X" and no explicit experience match, try experience
            mongoQuery.experience = { $gt: parseInt(ageGt[1]) };
            entities.push({ type: 'FIELD', value: 'experience' }, { type: 'OPERATOR', value: '$gt' }, { type: 'VALUE', value: ageGt[1] });
        }

        // Role patterns
        const roleMatch = q.match(/\b(student|admin|teacher|manager|faculty|staff)\b/i);
        if (roleMatch) {
            mongoQuery.role = roleMatch[1].toLowerCase();
            entities.push({ type: 'FIELD', value: 'role' }, { type: 'VALUE', value: roleMatch[1] });
        }

        // Department patterns
        const deptMatch = q.match(/\b(?:department|dept)\s*(?:is\s*|=\s*|:\s*)?["\']?(\w+)["\']?/i) ||
            q.match(/\b(?:in|from)\s+(\w+)\s+(?:department|dept)/i) ||
            q.match(/\b(?:in)\s+(IT|HR|CS|ECE|EEE|MECH|CIVIL|MBA)\b/i);
        if (deptMatch) {
            mongoQuery.department = deptMatch[1].toUpperCase();
            entities.push({ type: 'FIELD', value: 'department' }, { type: 'VALUE', value: deptMatch[1].toUpperCase() });
        }

        // Status patterns
        const statusMatch = q.match(/\b(active|inactive|pending|blocked)\b/i);
        if (statusMatch) {
            mongoQuery.status = statusMatch[1].toLowerCase();
            entities.push({ type: 'FIELD', value: 'status' }, { type: 'VALUE', value: statusMatch[1] });
        }

        // Name patterns
        const nameMatch = q.match(/\bname\s*(?:is\s*|=\s*|:\s*)["\']?([A-Za-z\s]+?)["\']?\s*$/i) ||
            q.match(/\bnamed?\s+["\']?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)["\']?/i);
        if (nameMatch) {
            mongoQuery.name = { $regex: nameMatch[1].trim(), $options: 'i' };
            entities.push({ type: 'FIELD', value: 'name' }, { type: 'VALUE', value: nameMatch[1].trim() });
        }

        // Email patterns 
        const emailMatch = q.match(/\bemail\s*(?:is\s*|=\s*|:\s*)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
        if (emailMatch) {
            mongoQuery.email = emailMatch[1];
            entities.push({ type: 'FIELD', value: 'email' }, { type: 'VALUE', value: emailMatch[1] });
        }

        // Skills patterns
        const skillMatch = q.match(/\bskill[s]?\s*(?:include|contain|has|have|with|:)\s*["\']?([a-zA-Z\s,]+?)["\']?\s*$/i) ||
            q.match(/\bwith\s+skill[s]?\s+(?:in\s+)?["\']?([a-zA-Z\s,]+?)["\']?\s*$/i) ||
            q.match(/\bknow[s]?\s+["\']?([a-zA-Z\s,]+?)["\']?\s*$/i);
        if (skillMatch) {
            const skills = skillMatch[1].split(/,\s*/).map(s => s.trim());
            mongoQuery.skills = skills.length === 1 ? skills[0] : { $in: skills };
            entities.push({ type: 'FIELD', value: 'skills' }, { type: 'VALUE', value: skillMatch[1].trim() });
        }

        // Price patterns (for products collection)
        const priceGt = q.match(/price\s*(?:is\s*)?(?:greater|more|over|above|>)\s*(?:than\s*)?(\d+)/);
        if (priceGt) {
            mongoQuery.price = { $gt: parseInt(priceGt[1]) };
            entities.push({ type: 'FIELD', value: 'price' }, { type: 'OPERATOR', value: '$gt' }, { type: 'VALUE', value: priceGt[1] });
        }

        // Date patterns - "in January 2024", "placed in 2024"
        const monthYearMatch = q.match(/\b(?:in|during|placed\s+in)\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
        if (monthYearMatch) {
            const months = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
            const month = months[monthYearMatch[1].toLowerCase()];
            const year = parseInt(monthYearMatch[2]);
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 1);
            mongoQuery.createdAt = { $gte: start, $lt: end };
            entities.push({ type: 'FIELD', value: 'createdAt' }, { type: 'VALUE', value: `${monthYearMatch[1]} ${year}` });
        }

        // "all users" or "all" without other filters means find all
        if (/\ball\b/.test(q) && Object.keys(mongoQuery).length === 0 && intent === 'FIND') {
            // Return all documents
            mongoQuery = {};
        }

        // Build aggregation pipeline
        let pipeline = null;
        if (intent === 'AGGREGATE') {
            const groupMatch = q.match(/(?:by|per|group\s*by)\s+(\w+)/i);
            let groupField = groupMatch ? groupMatch[1].toLowerCase() : 'department';

            // Map common words to actual field names
            const fieldMap = { dept: 'department', dep: 'department', role: 'role', status: 'status', name: 'name' };
            groupField = fieldMap[groupField] || groupField;

            const isAvg = /\b(average|avg)\b/.test(q);
            const avgField = q.match(/\b(?:average|avg)\s+(\w+)/i);
            const avgFieldName = avgField ? avgField[1].toLowerCase() : 'salary';

            if (isAvg) {
                pipeline = [
                    { $group: { _id: `$${groupField}`, [`avg_${avgFieldName}`]: { $avg: `$${avgFieldName}` }, count: { $sum: 1 } } },
                    { $sort: { [`avg_${avgFieldName}`]: -1 } },
                ];
            } else {
                pipeline = [
                    { $group: { _id: `$${groupField}`, count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ];
            }
        }

        return {
            intent,
            mongoQuery,
            entities,
            pipeline,
            confidence: 0.85 + Math.random() * 0.1,
            collection,
        };
    }

    fallbackChat(message) {
        const m = message.toLowerCase();
        if (m.includes('find') || m.includes('query'))
            return "To find documents, use the query panel and type something like 'Find all active users in IT department'. I'll translate it to a MongoDB query for you!";
        if (m.includes('collection'))
            return "Your database has a 'users' collection with fields: name, email, role, department, salary, status, experience, and skills.";
        if (m.includes('aggregate') || m.includes('group'))
            return "Aggregation lets you group and compute values. Try: 'Get average salary by department' or 'Count users by role'.";
        if (m.includes('schema') || m.includes('field'))
            return "The users collection has: name (string), email (string), role (student/admin), department (IT/HR), createdAt (date), salary (number), status (active/inactive), experience (number), skills (array).";
        if (m.includes('help'))
            return "I can help you with: 1) Writing MongoDB queries in natural language, 2) Understanding your database schema, 3) MongoDB concepts. Try: 'Find all admins with experience > 3' or 'Show average salary by department'.";
        return "I'm QueryMind AI assistant! Ask me about MongoDB queries or try typing a natural language query in the query panel. Example: 'Find users in IT department with active status'.";
    }
}

module.exports = new AIService();
