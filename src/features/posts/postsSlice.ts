import {createSlice, PayloadAction, nanoid} from '@reduxjs/toolkit'
import {client} from '@/api/client'

import type { RootState } from '../../app/store'
import { createAppAsyncThunk } from '@/app/withTypes'

import { userLoggedOut } from '@/features/auth/authSlice'

export interface Reactions{
    thumbsUp: number
    tada: number
    heart: number
    rocket: number
    eyes: number
}

export type ReactionName = keyof Reactions

export interface Post{
    id: string
    title: string
    content: string
    user: string
    date: string
    reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

interface PostsState {
    posts: Post[]
    status: 'idle' | 'pending' | 'succeeded' | 'rejected'
    error: string | null
}

const initialReactions: Reactions = {
    thumbsUp: 0,
    tada: 0,
    heart: 0,
    rocket: 0,
    eyes: 0
}

export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async ()=> {
    const repsonse = await client.get<Post[]>('/fakeApi/posts')
    return repsonse.data
})

const initialState: PostsState = {
    posts: [],
    status: 'idle',
    error: null
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state , action: PayloadAction<Post> ) {
            state.posts.push(action.payload)
        },
            prepare(title: string, content: string, userId: string) {
                return{
                    payload: { 
                        id: nanoid(), 
                        date: new Date().toISOString(),
                        title, 
                        content, 
                        user: userId,
                        reactions: initialReactions
                         }
                }
            }
        },
        postUpdated(state, action: PayloadAction<PostUpdate>) {
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(
            state,
            action: PayloadAction<{ postId: string; reaction: ReactionName}>
        ) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLoggedOut, (state) => {
            return initialState
        })
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'pending'
        } )
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts.push(...action.payload)
        })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message ?? 'Unkown Error'           
             })
    },
    selectors: {
        selectAllPosts: postsState => postsState,
        selectPostById: (postsState, postId: string) => {
            return postsState.posts.find(post => post.id === postId)
        }
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = (state: RootState, postId: string) =>
    state.posts.posts.find((post) => post.id === postId)
  
export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error



