import { Link, useParams} from 'react-router-dom';
import { selectPostById } from './postsSlice';
import { PostAuthor } from './PostAuthor';
import { ReactionButtons } from './ReactionButtons';
import { selectCurrentUsername } from '@/features/auth/authSlice';



import {useAppSelector} from '../../app/hooks';

export const SinglePostPage = () => {
    const { postId } = useParams();

    const post = useAppSelector(state => selectPostById(state, postId!))
    const currentUsername = useAppSelector(selectCurrentUsername)

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
        }

        const canEdit = currentUsername === post.user
        
        return (
            <section>
                <article className="post">
                    <h2>{post.title}</h2>
                    <div>
                        <PostAuthor userId={post.user} />
                    </div>
                    <p className="post-content">{post.content}</p>
                    <ReactionButtons post={post} />
                    {canEdit && (
                    <Link to={`/editPost/${post.id}`} className="button">
                        Edit Post
                    </Link>
                    )}
                </article>
            </section>
        )
    }






