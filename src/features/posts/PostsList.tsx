import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Link } from 'react-router-dom'
import { Post, selectAllPosts, fetchPosts, selectPostsStatus } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import React, { useEffect} from 'react'

interface PostsExcerptProps {
    post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}
         </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export const PostsList = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts)
    const postStatus = useAppSelector(selectPostsStatus)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

    const renderedPosts = orderedPosts.map((post) => (
        <PostExcerpt key={post.id} post={post} />)
    )

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}