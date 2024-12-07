export const fetchDB = (sublink: string, method: string, body: object = {}) => {
    return fetch(`http://localhost:3000/${sublink}`, getRequestObject(method, body))
    .then((response) => response.json())
    .catch((error) => console.error('Error:', error));
}

const getRequestObject = (method: string, body: object) => {
    if (!["head", "get"].includes(method.toLowerCase())) {
        return {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        };
    } else {
        return {
            method: method,
            headers: { 'Content-Type': 'application/json' },
        };
    }
}