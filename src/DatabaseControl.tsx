type Task = {
    id: string,
    name: string,
    due_date: Date,
    is_completed: boolean
}



const fetchDB = (sublink: string, method: string, body: object = {}) => {
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

export const createTask = (name: string, due_date: Date) => {
    const data = {
        "name": name,
        "due_date": due_date,
        "is_completed": false,
    }

    fetchDB("tasks", "post", data);
}

export const getTasks = (searchArgs: string = "") => {
    return fetchDB(`tasks${searchArgs}`, "get");
}

export const toggleCompletedTask = (id: string) => {
    getTasks(`/${id}`)
    .then((task: Task) => {
        if (task) {
            console.log(task);
            task.is_completed = !task.is_completed;
            fetchDB(`tasks/${id}`, "put", task);
        }
    });
}

export const updateTask = (id: string, name: string, due_date: Date) => {
    getTasks(`/${id}`)
    .then((task: Task) => {
        if (task) {
            task.name = name;
            task.due_date = due_date;
            fetchDB(`tasks/${id}`, "put", task);
        }
    });
}