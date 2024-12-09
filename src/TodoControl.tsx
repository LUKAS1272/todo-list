import { useState, useEffect } from "react";
import { createTask, getTasks, toggleCompletedTask } from "./DatabaseControl";

type Task = {
    id: string;
    name: string;
    due_date: string; 
    is_completed: boolean;
};

export default function Todo() {
    const [task, setTask] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchInitialTasks = async () => {
            try {
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks || []); 
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchInitialTasks();
    }, []);

    const handleAddTask = async () => {
        if (task) {
            const newTask = {
                name: task,
                due_date: new Date().toISOString(),
                is_completed: false,
            };
            await createTask(newTask.name, new Date(newTask.due_date));
            setTask("");
            const updatedTasks = await getTasks();
            setTasks(updatedTasks);
        }
    };

    const handleToggleComplete = async (id: string) => {
        await toggleCompletedTask(id);
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);
    };

    return (
        <div className="App">
            <h1>ToDo List</h1>
            <div className="task-input">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value || "")}
                />
                <button onClick={handleAddTask} id="AddBtn">
                    Add Task
                </button>
            </div>
            <ul>
                {Array.isArray(tasks) &&
                    tasks.map((task) => (
                        <li key={task.id}>
                            <span
                                style={{
                                    textDecoration: task.is_completed
                                        ? "line-through"
                                        : "none",
                                }}
                            >
                                {task.name}
                            </span>
                            <button onClick={() => handleToggleComplete(task.id)}>
                                {task.is_completed ? "Undo" : "Complete"}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
