import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "./slice"

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
