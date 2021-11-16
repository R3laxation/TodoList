import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValueType = "all" | "active" | "completed";
export type TodoListsType = {
    id: string
    title: string
    filter: FilterValueType
}

function App() {

    const todoListID_1 = v1();
    const todoListID_2 = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListsType>>([
        {id: todoListID_1, title: "What to Learn", filter: "all"},
        {id: todoListID_2, title: "What to Buy", filter: "all"},
    ])

    const [tasks, setTasks] = useState({
        [todoListID_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false}
        ],
        [todoListID_2]: [
            {id: v1(), title: "Apples", isDone: false},
            {id: v1(), title: "Honey", isDone: true},
            {id: v1(), title: "Meat", isDone: true}
        ]
    })


    const removeTask = (taskID: string, todoListID: string) => {
        setTasks({...tasks, [todoListID]: tasks[todoListID].filter(t => t.id !== taskID)})
    }
    const addTask = (title: string, todoListID: string) => {
        setTasks({
            ...tasks,
            [todoListID]: [...tasks[todoListID], {id: v1(), title, isDone: false}]
        })
    }

    const changeTaskStatus = (taskID: string, newTaskStatus: boolean, todoListID: string) => {
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(t => t.id === taskID ? {...t, isDone: newTaskStatus} : t)
        })
    }
    const changeFilter = (newFilter: FilterValueType, todoListID: string) => {
        setTodoLists(todoLists.map(t => t.id === todoListID ? {...t, filter: newFilter} : t))
    }
    const removeTodoList = (todoListID: string) => {
        setTodoLists(todoLists.filter(t => t.id !== todoListID))
    }

    let getTasksForTodoList = (tl: TodoListsType) => {
        switch (tl.filter) {
            case "active":
                return tasks[tl.id].filter(t => !t.isDone)
            case "completed":
                return tasks[tl.id].filter(t => t.isDone)
            default:
                return tasks[tl.id]
        }
    }


    const todoListsComponents = todoLists.map(tl => {
        return (
            <Todolist
                key={tl.id}
                id={tl.id}
                title={tl.title}
                filter={tl.filter}
                tasks={getTasksForTodoList(tl)}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                removeTodoList={removeTodoList}
            />
        )
    })

    return (
        <div className="App">
            {todoListsComponents}
        </div>

    );
}

export default App;
