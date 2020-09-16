import React, { useState, useEffect } from 'react'
import './Post.css'
import { Avatar } from '@material-ui/core'
import { db } from './firebase'
import firebase from 'firebase'

function Post({ username, postId, user, caption, imageUrl }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()))
                })
        }

        return () => {
            unsubscribe()
        }

    }, [postId])

    const postComment = (event) => {
        event.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src=""
                />
                <h4>{username}</h4>
            </div>
            <img className="post__image" alt="" src={imageUrl} />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map(comment => (
                        <p>
                            <b>{comment.username}</b> {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >Post</button>
                </form>
            )}
        </div>
    )
}

export default Post
