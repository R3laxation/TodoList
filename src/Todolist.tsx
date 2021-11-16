import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType} from "./App";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: string, todoListID: string) => void
    changeFilter: (newFilter: FilterValueType, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    filter: FilterValueType
    changeTaskStatus: (taskID: string, newTaskStatus: boolean, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
}

export function Todolist(props: PropsType) {

    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<boolean>(false)

    const mappedTasks = props.tasks.map(t => {
        return (
            <li key={t.id} className={t.isDone ? "completed-tasks" : ""}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={(e) => onChangeTaskStatus(t.id, e.currentTarget.checked)}/>
                <span>{t.title}</span>
                <button onClick={() => removeTaskHandler(t.id)}>X</button>
            </li>
        )
    })

    const removeTaskHandler = (taskID: string) => {
        props.removeTask(taskID, props.id)
    }
    const changeFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.changeFilter(e.currentTarget.name as FilterValueType, props.id)
    }
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }
    const addPost = () => {
        const trimmedTitle = inputValue.trim();
        if (trimmedTitle) {
            props.addTask(inputValue, props.id)
        } else {
            setError(true)
        }
        setInputValue("")
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(false)
        if (e.charCode === 13) {
            addPost()
        }
    }
    const onChangeTaskStatus = (taskID: string, newTaskStatus: boolean) => {
        props.changeTaskStatus(taskID, newTaskStatus, props.id)
    }
    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }

    const errorMessage = error ? <div className={"error-message"}>Title Is Required!</div> : "";

    return (
        <div>
            <h3>{props.title}</h3>
            <button style={{height: '10px'}} onClick={removeTodoList}></button>
            <div>
                <input
                    className={error ? "error-border" : ""}
                    value={inputValue}
                    onChange={onChangeInputHandler}
                    onKeyPress={onKeyPressHandler}
                />
                <button onClick={addPost}>+</button>
                {errorMessage}
            </div>
            <ul>
                {mappedTasks}
            </ul>
            <div>
                <button className={props.filter === "all" ? "active-button" : ""} onClick={changeFilter}
                        name='all'>All
                </button>
                <button className={props.filter === "active" ? "active-button" : ""} onClick={changeFilter}
                        name='active'>Active
                </button>
                <button className={props.filter === "completed" ? "active-button" : ""} onClick={changeFilter}
                        name='completed'>Completed
                </button>
            </div>
        </div>
    )
}
