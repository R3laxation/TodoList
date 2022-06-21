import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from "axios";
import {handleServerNetworkError} from "../../utils/error-utils";


export const fetchTodolistsTC = createAsyncThunk('/todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    try {

        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (err) {
        const error = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('/todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(todolistId)

    //скажем глобально приложению, что асинхронная операция завершена
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {id: todolistId}
})

export const addTodolistTC = createAsyncThunk('/todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolist: res.data.data.item}
})

export const changeTodolistTitleTC = createAsyncThunk('/todolists/changeTodolistTitle', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    await todolistsAPI.updateTodolist(param.id, param.title)
    return {id: param.id, title: param.title}
})


// export const fetchTodolistsTC_ = () => {
//     return (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistsAC({todolists: res.data}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//     }
// }
// export const removeTodolistTC_ = (todolistId: string) => {
//     return (dispatch: Dispatch) => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(setAppStatusAC({status: 'loading'}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//                 dispatch(removeTodolistAC({id: todolistId}))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//     }
// }
// export const addTodolistTC_ = (title: string) => {
//     return (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.createTodolist(title)
//             .then((res) => {
//                 dispatch(addTodolistAC({todolist: res.data.data.item}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//     }
// }
// export const changeTodolistTitleTC_ = (id: string, title: string) => {
//     return (dispatch: Dispatch) => {
//         todolistsAPI.updateTodolist(id, title)
//             .then((res) => {
//                 dispatch(changeTodolistTitleAC({id, title}))
//             })
//     }
// }

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        // removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     if (index > -1) {
        //         state.splice(index, 1)
        //     }
        // },
        // addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
        //     state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        // },
        // changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     state[index].title = action.payload.title
        // },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer;
export const {
    changeTodolistFilterAC, changeTodolistEntityStatusAC,
} = slice.actions;

// export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case 'REMOVE-TODOLIST':
//             return state.filter(tl => tl.id !== action.id)
//         case 'ADD-TODOLIST':
//             return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
//         case 'CHANGE-TODOLIST-TITLE':
//             return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//         case 'CHANGE-TODOLIST-FILTER':
//             return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
//         case 'CHANGE-TODOLIST-ENTITY-STATUS':
//             return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
//         case 'SET-TODOLISTS':
//
//         default:
//             return state
//     }
// }

// actions
// export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//     type: 'CHANGE-TODOLIST-TITLE',
//     id,
//     title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//     type: 'CHANGE-TODOLIST-FILTER',
//     id,
//     filter
// } as const)
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
//     type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
//
// // thunks


// types
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
// type ActionsType =
//     | RemoveTodolistActionType
//     | AddTodolistActionType
//     | ReturnType<typeof changeTodolistTitleAC>
//     | ReturnType<typeof changeTodolistFilterAC>
//     | SetTodolistsActionType
//     | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType>
