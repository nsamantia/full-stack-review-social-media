const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    //TODO Login existing user
    /*
    TODO get email, password from req.body
    TODO check if user already exists. If they do, reject the request
    TODO salt and hash password
    TODO create the user in the db
    TODO put the user on session
    TODO send confirmation
*/
const db = req.app.get('db')

const {email, password} = req.body

const [user] = await db.check_user([email])

if(user){
  return res.status(409).send('user already exists')
}

const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync(password, salt)

const [newUser] = await db.register_user([email, hash])

req.session.user = newUser

res.status(200).send(req.sesson.user)
  },
  login: async (req, res) => {
    //TODO Register new user
    /*
  TODO get email and password from req.body
  TODO see if the user exists. If they don't, reject the request
  TODO Compare password and hash. If there is a mismatch, reject the request
  TODO Put the user on session
  TODO send confirmation


*/

    const db = req.app.get('db')
    const {email, password} = req.body
    const [existingUser] = await db.check_user([email])
    if(!existingUser){
      return res.status(404).send('User not found')
    }

    const isAuthenticated = bcrypt.compareSync(password, existingUser.hash)

    if(!isAuthenticated){
      return res.status(403).send('Incorrect email or password')
    }

    delete existingUser.hash
    
    req.session.user = existingUser

    res.status(200).send(req.session.user)


  },
  logout: async (req, res) => {

    //TODO Logout user

    req.session.destory
    res.sendStatus(200)
  },
  getUser: (req, res) => {
    //TODO Get user from session

    if(req.session.user){
      res.status(200).send(req.session.user)
    } else {
      res.status(404).send('No session found')
    }
  },
}
