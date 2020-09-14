//TODO Basic express setup
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const authCTRL = require('./authController')
const postCtrl = require('./controller')
const verifyUser = require('./middlewares/verifyUser')

const app = express()

const{CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 *24 * 365}
}))
//#auth endpoints
//TODO login, register, logout, getUser
app.post('/auth/register', authCTRL.register)
app.post('/auth/login', authCTRL.login)
app.delete('/auth/logout', authCTRL.logout)
app.get('/auth.user', authCTRL.getUser)

//#posts endpoints
//TODO get post put delete posts
app.get('/api/posts', verifyUser, postCtrl.getPosts)
app.post('/api/posts', verifyUser,  postCtrl.addPost)
app.put('/api/posts/:post_id', verifyUser, postCtrl.editPost)
app.delete('/api/posts/:post_id', verifyUser, postCtrl.deletePost)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('DB ready!')
    app.listen(SERVER_PORT, () => console.log(`What up from ${SERVER_PORT}`))
})
