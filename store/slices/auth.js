import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const newState = {
                ...state,
                user: action.payload,
            }
            return newState
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        clearAuth: (state) => {
            const newState = {
                ...state,
                user: null,
            }
            return newState
        },
    },
})

export const { clearAuth, setUser } = authSlice.actions
export default authSlice.reducer
