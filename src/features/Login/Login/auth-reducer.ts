import {setAppStatusAC} from "../../../app/app-reducer";
import {authAPI, FieldErrorType, LoginParamsType} from "../../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from "axios";

export const loginTC = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (err) {
        const error = err as AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }

    } catch (err)  {
        const error = err as AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})

// export const logoutTC_ = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.logout()
//         .then((res) => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: false}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((err) => {
//             handleServerNetworkError(err, dispatch)
//         })
// }
// export const loginTC_ = (data: LoginParamsType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: "loading"}))
//     authAPI.login(data)
//         .then((res) => {
//             if(res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             }
//             else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((err) => {
//             handleServerNetworkError(err, dispatch)
//         })
// }
// type InitialStateType = typeof initialState

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true;
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false;
        })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;
//     (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }
// actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// types

// type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
// function handleServerAppError() {
//     throw new Error('Function not implemented.');
// }


// thunks



