import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db , auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button , Input} from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';


//  fetching size of the display for pop up alignment
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
// alignment of pop up box
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
// module foe modal pop up css
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle]= useState(getModalStyle);

  // const var and functions by useState
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged((authUser)=>{     //it keeps the user logged in
        if (authUser) {
        //user has logged in
        console.log(authUser)
        setUser(authUser)
        }
        else{
          //user has logged out
          setUser(null);
        }
      })
      return() =>{
        //perform some cleanup
        unsubscribe();
      }

  }, [user,username])


//use effect  --> runs a peice of code based on condition
  useEffect(() => {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {     //snapshot = listner gives whenever data modify or changes  it will update the data
     //every time a new post added this code is executed
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
        }))); // --> map is like a for loop
    })
  }, []); //to run on every refresh

//Authentication for user Sign up
    const signup = (event)=>{

      event.preventDefault();

      auth.createUserWithEmailAndPassword(email , password)
        .then((authUser)=> {
         return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error)=> alert(error.message))       // firebase it also gives backend validation for credentials
    }

    const signIn = (event)=>{
      event.preventDefault();
      auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))
      setOpenSignIn(false);
    }

  return (
    // main body
    <div className="App">

   

      {/* model for pop up signup option on signup btn click */}
      <Modal
        open={ open }
        onClose={ () => setOpen(false) }
        >

      <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
              />
            </center>
            {/* Input for username , email , password */}
            <Input
            type ="text"
            placeholder="Username"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            />
            <Input
            type ="text"
            placeholder="Email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input
            type ="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            {/* signup btn */}
            <Button onClick={signup}>Sign Up</Button>
          </form>
      </div>

      </Modal>

       <Modal
        open={ openSignIn }
        onClose={ () => setOpenSignIn(false) }
        >

      <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
              />
            </center>
            {/* Input for username , email , password */}
            <Input
            type ="text"
            placeholder="Email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input
            type ="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            {/* signup btn */}
            <Button onClick={signIn}>Sign In</Button>
          </form>
      </div>

      </Modal>

      {/* header logo */}
        <div className="app_header s4">
          <img
              className="app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
          />
        {/* signup and logout btn on main body */}
        
        { user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
            <div className="app_loginContainer s12 m6 l4">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
       </div>
       
        {/* text printed in main body
        <h1>Hello Lets Build InstaClone</h1> */}
        <div className  ="app_Posts s12 m6 l4">
        <div className="app_PostsLeft">
        {/* to show multiple post through blocks/components */}
        {
                  //map is used as a for loop to loop
                  posts.map(({id, post}) =>(
                    //To pass data from db to post.js
                    <Post key={id} postId={id} user= {user} username={post.username} caption={post.caption} ImageUrl={post.imageUrl} />
                  ))
                }
        </div>
  <div className="app_PostsRight">
  <InstagramEmbed
          url='https://www.instagram.com/p/B_uf9dmAGPw/'     //paste on pic from your instagram acc
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        /> 
  </div>
         
        
        </div>
      
        
                
          { user?. displayName ? (                          //optional procedure change user?.displayName ? ():()
            <ImageUpload username={user.displayName} />
            ): (
              <h3>Sorry you need to login to upload</h3>
            )}
   

  </div>
  );
}

export default App;
