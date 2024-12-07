import { useState } from "react";

export default function Todo() {
    const [task, setTask] = useState<string>('');
    const [tasks, setTasks] = useState<string[]>([]);

    const handleAddTask = () => {
        if (task != null) {
            setTasks([...tasks, task]);
            setTask('');
        }
    };

    const handleRemoveTask = (index: number) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div className="App">
            <h1>ToDo List</h1>
            <div className="task-input">
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={handleAddTask} id='AddBtn'>Add Task</button>
            </div>
            <ul>
            {tasks.map((task, index) => (
                <li key={index}>
                    {task} <button onClick={() => handleRemoveTask(index)}>Delete</button>
                </li>
            ))}
            </ul>
        </div>
    );
}