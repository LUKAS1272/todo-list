import { useState, useEffect } from "react";
import { createTask, deleteTask, getTasks, toggleCompletedTask } from "./DatabaseControl";

type Task = {
    id: string;
    name: string;
    due_date: string; 
    is_completed: number;
};

export default function Todo() {
    const [task, setTask] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (filter) {
            updateTasks();
        }
        const fetchInitialTasks = async () => {
            try {
                const fetchedTasks = await getTasks('', true, filter);
                setTasks(fetchedTasks || []); 
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchInitialTasks();
    }, [filter]);

    const updateTasks = async () => {
        const updatedTasks = await getTasks('', true, filter);
        setTasks(updatedTasks);
    };

    const handleAddTask = async () => {
        if (task) {
            await createTask(task, new Date(date));
            setTask("");
            setDate("");
            updateTasks();
        }
    };

    const handleRemoveTask = async (id: string) => {
        await deleteTask(id);
        updateTasks();
    };

    const handleToggleComplete = async (id: string) => {
        await toggleCompletedTask(id);
        updateTasks();
    };

    return (
        <div className={'mt-10 w-1/2 m-auto'}>
            <h1 className={'text-4xl font-black text-center'}>ToDo List</h1>
            <div className={'flex flex-col justify-start items-start mt-5'}>
                <form className={'w-full'}>
                    <label htmlFor="">Task name</label>
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value || "")}
                        className={'border border-gray-700 border-solid px-1 py-1 rounded mb-1 w-full'}
                        required
                    />

                    <label htmlFor="">Due date</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value || "")}
                        className={'border border-gray-700 border-solid px-1 py-1 rounded mb-1 w-full'}
                        required
                    />
                    <button onClick={handleAddTask}
                            className={'font-bold bg-gray-700 text-white px-5 py-2 rounded-md mt-1 w-full'}>
                        Add Task
                    </button>
                </form>

                <h3 className="mt-5 font-medium">Filter</h3>
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="radioBtn"
                      id="all"
                      value=""
                      className="form-radio"
                      onChange={(e) => setFilter(e.target.value)}
                      defaultChecked
                    />
                    <label htmlFor="all" className="text-gray-700">
                      Vše
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="radioBtn"
                      id="completed"
                      value="1"
                      onChange={(e) => setFilter(e.target.value)}
                      className="form-radio"
                    />
                    <label htmlFor="completed" className="text-gray-700">
                      Dokončené
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="radioBtn"
                      id="incomplete"
                      value="0"
                      onChange={(e) => setFilter(e.target.value)}
                      className="form-radio"
                    />
                    <label htmlFor="incomplete" className="text-gray-700 ml-1">
                      Nedokončené
                    </label>
                  </div>
                </div>
            </div>

            <hr className='my-5' />

            <h2 className='font-semibold text-2xl mb-1'>Tasks</h2>
            {tasks.length === 0 ? (
                <>
                    <p>No task available</p>
                    {filter !== '' ? (
                        <p>Try changing the filters</p>
                    ) : (
                        <p>Try adding one</p>
                    )}
                </>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className={'flex justify-between items-end mb-2'}>
                            <div className={`flex flex-col ${task.is_completed ? 'line-through opacity-50' : ''}`}>
                            <span className={'text-xl font-medium mr-0.5'}>
                                {task.name}
                            </span>
                                <span className={'text-xs mr-3'}>
                                {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                    .format(new Date(task.due_date))}
                            </span>
                            </div>

                            <div>
                                <button onClick={() => handleToggleComplete(task.id)}
                                        className={`font-bold text-white px-5 py-2 rounded-md mr-1 ${task.is_completed === 1 ? 'bg-gray-400' : 'bg-green-700'}`}>
                                    {task.is_completed ? 'Uncomplete' : 'Complete'}
                                </button>

                                <button onClick={() => handleRemoveTask(task.id)}
                                        className={'font-bold bg-red-700 text-white px-5 py-2 rounded-md'}>
                                    Remove Task
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
