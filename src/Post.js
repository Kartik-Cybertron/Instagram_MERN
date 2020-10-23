import React , { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db }    from './firebase'
import firebase from 'firebase'

function Post({ postId, user, username, caption, ImageUrl }) {        //to pass parameters
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState([])

const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');

}

    useEffect(() => {
        let unsubscribe;
        if(postId){                 //if post id passed
            unsubscribe = db           //unsubscribe
            .collection("posts")        //inside posts
            .doc(postId)                  //insisde data  
            .collection("comments")         //fetch data from comment inside post
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {     //listening to the specific post
            setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId])
    return (
        <div className="post">
            <div className="post_Header">
            <Avatar
            className="post_Avatar"
            alt="KD"
            src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
            </div>
             {/* header + avatar + username */}

            <img className="post_Image" src={ImageUrl} ></img>       {/* pass the parameters inside jinja   ormat inside attributes*/}
                    {/* image */}
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>
                    {/* username + caption */}

        <div className="post_comments">
            {comments.map((comment) => (
                <p>
                    <strong>{comment.username}</strong > {comment.text}
                </p>
            ))}
        </div>
                {/* un-authorized will not have the authority to comment */}
        {user && (
            <form className="post_commentBox">
                <input 
                className="post_input"
                type="text" 
                placeholder="Add a comment....."
                value={comment}
                onChange={(e) => setComment(e.target.value)}  //to get the individual comment from the post
                />
                <button
                className="post_btn"
                disabled={!comment}
                type= "submit"
                onClick={postComment}
                > 
                    Post
                </button>
            </form>
       
        )}


       </div>
    )
}

export default Post