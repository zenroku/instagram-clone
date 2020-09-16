import React, { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Input, Modal, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import './App.css';
import Post from './Post'
import ImageUpload from './ImageUpload'
import { db, auth } from './firebase'
import InstagramEmbed from 'react-instagram-embed'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))


function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

  const classes = useStyles()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (authUser) {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
    });
    return () => {
      unsubscribe()
    }
  }, [user])

  useEffect(() => {
    db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))

    setOpen(false)
    setUsername('')
    setPassword('')
  }

  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false)
    setUsername('')
    setPassword('')
  }



  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>sign up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>sign up</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          <Accordion style={{ marginBottom: 10 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Upload Your Own!!!</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {
                user?.displayName ? (
                  <ImageUpload username={user.displayName} />
                ) : (
                    <h3>Sorry u need to login</h3>
                  )
              }
            </AccordionDetails>
          </Accordion>
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CBaHKB3D6cp/?utm_source=ig_web_button_share_sheet"
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=""
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {/* {
        user?.displayName ? (
          
        ) : (
            <h3>Sorry u need to login</h3>
          )
      } */}
    </div>
  );
}

export default App;
