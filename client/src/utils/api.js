const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function translateQuery(naturalLanguage, collection) {
    const res = await fetch(`${API_BASE}/query/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: naturalLanguage, collection }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || 'Failed to translate query');
    }
    return res.json();
}

export async function executeQuery(mongoQuery, collection) {
    const res = await fetch(`${API_BASE}/query/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mongoQuery, collection }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || 'Failed to execute query');
    }
    return res.json();
}

export async function sendChatMessage(message, history = []) {
    const res = await fetch(`${API_BASE}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || 'Chat request failed');
    }
    return res.json();
}

export async function getCollections() {
    const res = await fetch(`${API_BASE}/query/collections`);
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
}

export async function vectorSearch(query, collection, limit = 10) {
    const res = await fetch(`${API_BASE}/query/vector-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, collection, limit }),
    });
    if (!res.ok) throw new Error('Vector search failed');
    return res.json();
}
