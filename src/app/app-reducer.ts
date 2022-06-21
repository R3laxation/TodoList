import {authAPI} from "../api/todolists-api"
import {setIsLoggedInAC} from "../features/Login/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {

    const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
            // dispatch(setAppStatusAC({status: "succeeded"}))

        // else {
        //     handleServerAppError(res.data, dispatch)
        // }
    }
    // catch (err) {
    //     const error = err as AxiosError
    //     handleServerNetworkError(error, dispatch)
    // }
})

// export const initializeAppTC_ = () => (dispatch: Dispatch) => {
//
// }

const slice = createSlice({
    name: 'app',
    initialState: {
        status: "idle" as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error;
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) =>{
            state.isInitialized = true
        })
    }
})
export const appReducer = slice.reducer;

export const {setAppStatusAC, setAppErrorAC} = slice.actions;


//     (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case "APP/SET-STATUS":
//             return {...state, status: action.status}
//         case "APP/SET-ERROR":
//             return {...state, error: action.error}
//         case "APP/SET-INITIALIZED":
//             return {...state, isInitialized: action.isInitialized}
//         default:
//             return {...state}
//     }
// }

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}

// export const setAppErrorAC = (error: string | null) => ({type: "APP/SET-ERROR", error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
// export const setAppInitializedAC = (isInitialized: boolean) => ({type: "APP/SET-INITIALIZED", isInitialized} as const)

// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
// export type setAppItitializedActionType = ReturnType<typeof setAppInitializedAC>
//
// type ActionsType =
//     | SetAppErrorActionType
//     | SetAppStatusActionType
//     | setAppItitializedActionType


