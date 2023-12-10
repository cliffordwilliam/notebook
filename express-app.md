# Express app (cognitive reducer)

`npm`

```
npm init -y
npm i express pg sequelize jsonwebtoken dotenv bcrypt multer imagekit jest supertest
npm i -D nodemon sequelize-cli
```

`.gitignore`

```
node_modules
.env
```

`.env`

```env
SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

`sequelize`

```
npx sequelize init
```

`config.json`

```
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "amenhotep",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "amenhotepTest",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
}
```

`Create database and test database`

```
npx sequelize db:create
npx sequelize db:create --env test
```

## Helper

```js
const BCRYPT = require('bcrypt')
const JWT = require('jsonwebtoken')


/**
 * A cool helper class!
 */
class Helper {
    /**
     * What it says on the tin, uses bcrypt.
     * 
     * @param {string} value - The value to be hashed.
     * @returns {Promise<string>} - Resolves the hashed value.
     * @throws {error} - Hashing error.
     */
    static async passwordHasher(value) {
        try {
            const SALT = 10
            return await BCRYPT.hash(value, SALT)
        } catch (error) {
            throw error
        }
    }
    /**
     * Find an obj by its id from the given sequelize model.
     * 
     * @param {number} value - The id.
     * @param {import('sequelize').Model} model - The sequelize model.
     * @returns {Promise<{id:number, OBJ:object}>} - Resolves the found object.
     * @throws {error} - Custom error if findByPk returns falsy.
     */
    static async findById(id, model) {
        try {
            const OBJ = await model.findByPk(id)
            if (!OBJ) {
                throw({name:"CustomError",msg: `Obj with id:${id} is not found.`,status:404})
            }
            return OBJ
        } catch (error) {
            throw error
        }
    }
    /**
     * Compare the user given normal password with the hashed password in the database.
     * 
     * @param {string} receivedPassword - Given un-hashed password.
     * @param {string} databasePassword - Database hashed password.
     * @returns {Promise<boolean>} - Resolves boolean, true if password is the same.
     * @throws {error} - Password is not the same error.
     */
    static async passwordComparer(receivedPassword, databasePassword) {
        try {
            return await BCRYPT.compare(receivedPassword, databasePassword)
        } catch (error) {
            throw error
        }
    }
    /**
     * Token maker.
     * Turns payload + jwt secret key into a token.
     * payload (user data) -> token
     * 
     * @param {object} payload - Given payload. (user data)
     * @returns {Promise<string>} - Resolves token.
     * @throws {error} - JWT.sign function error.
     */
    static async tokenGenerator(payload){
        try {
            return await JWT.sign(payload,process.env.SECRET_KEY)
        } catch (error) {
            throw error
        }
    }
    /**
     * Token receiver.
     * Token -> payload (user data)
     * Wrong token? Payload have non-existent (user data).
     * Compared with databse's users unique row, it won't find anything, throw CustomError.
     * 
     * @param {string} token - Received token.
     * @returns {Promise<string>} - Resolves payload.
     * @throws {error} - JWT.verify function error.
     */
    static async tokenVerifier(token){
        try {
            return await JWT.verify(token,process.env.SECRET_KEY)
        } catch (error) {
            throw error
        }
    }
    /**
     * Find an obj by the given value from the given sequelize model.
     * 
     * @param {object} where - The criteria
     * @param {import('sequelize').Model} model - The sequelize model.
     * @returns {Promise<{OBJ:object}>} - Resolves the found object. 
     */
    static async findOne(model, where, isCheckingPayload=false){
        try {
            const OBJ = await model.findOne({where})
            if (!OBJ) {
                if (isCheckingPayload) { // TOKEN -> Payload -> Payload got the right data?
                    throw ({name:"CustomError",msg:`unauthorized`,status:401})
                }
                throw ({name:"CustomError",msg:`Obj with this ${where} is not found.`,status:404})
            }
            return OBJ
        } catch (error) {
            throw error
        }
    }
}


module.exports = Helper
```

## Util

`3rd Party API` - Helper

```js
const multer = require('multer')
const ImageKit = require("imagekit")


const storage = multer.memoryStorage()

class Util {
  // both are used to upload to imagekit
  // const RESULT = await Util.imagekit.upload({file:IMAGE_BASE_64,fileName:req.file.originalname,tags:[`${req.file.originalname}`]})
  static imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  })
  static upload = multer({ storage })
}


module.exports = Util
```

## Table

`Create model`

```
npx sequelize model:create --name Singular --attributes col:datatype,col2:datatype,..
```

`Migration`
- `constraints`
- `validation`
- `fk`

```js
      col: {
        type: Sequelize.STRING,
        allowNull: false, // required
        references:{model:"Plural",key:"id"}, // fk
        onUpdate:"cascade", // fk
        onDelete:"cascade", // fk
        unique: true, // unique
        defaultValue: 'value', // default value
        validate: {
          isEmail:true, // isEmail
          validate: {len:[5,Infinity]}, // char len min 5
          isUrl:true, // isUrl
          min:100 // min number 100
        }
      },
```

`Model`
- `constraints`
- `validation`
- `association`
- `before create`

```js
    col: {
      type:DataTypes.STRING,
      allowNull:false, // required
      unique:true, // unique
      defaultValue:"value", // default value
      validate:{
        isUrl:{msg:"wrong imgUrl format"}, // isUrl
        len:{args:[5,Infinity],msg:"col min char is 5"}, // char len min 5
        min:{args:[100],msg:'col min value is 100.'} // min number 100
        isEmail:{msg:"wrong email format"}, //isEmail
        notNull:{msg:"col required"}, // required
        notEmpty:{msg:"col required"} // required
      }
    },

    // Association
    static associate(models) {
      Singular.hasMany(models.Singular)
      Singular.belongsTo(models.Singular)
    }

    // before create hash
    Singular.beforeCreate(async (singular) => {
        const HASHED_PASSWORD = await Helper.passwordHasher(singular.password)
        singular.password = HASHED_PASSWORD
    });
```

## Migrate

`Create database and test database`

```
npx sequelize db:migrate
npx sequelize db:migrate --env test
```

## Seed

`Create` seed

```
npx sequelize seed:create --name seedName
```

`Edit` seed

```js
  // UP
  async up (queryInterface, Sequelize) {
    // hash here because UP is not caught by before create
    await queryInterface.bulkInsert('Plural', [
      {
        username: 'username',
        email: 'email@email.com',
        password: await Helper.passwordHasher("password"),
        role: 'role',
        phoneNumber: '+1 123-456-7890',
        address: '1 Love Lane, Anime City',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'username2',
        email: 'email2@email.com',
        password: await Helper.passwordHasher("password2"),
        role: 'role',
        phoneNumber: '+1 123-456-7890',
        address: '1 Love Lane, Anime City',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],{})
  },
```

```js
  // DOWN
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Plural', null, {});
  }
```

`Seed` database

```bash
npx sequelize db:seed:all
```

## MVC

- `1 Controller / model`
- `1 Router / model`

## MIDDLEWARE

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {Singular,Singular1,Singular2,...} = require("../models")


/**
 * Error handler + guards
 */
class Middleware {
    /**
     * Res status code + message based on err.name.
     */
    static async errorHandler(err,req,res,next){
        // console.log(err)
        try {
            switch (err.name) {
                case "SequelizeValidationError":
                case "SequelizeUniqueConstraintError":
                    return res.status(400).json({msg:err.errors[0].message})
                case "CustomError":
                    return res.status(err.status).json({msg:err.msg})
                case "JsonWebTokenError":
                    return res.status(401).json({msg:err.message})
                default:
                    return res.status(500).json({msg:"Internal Server Error"})
            }
        } catch (error) {
        }
    }
    /**
     * No token? Throw.
     * Token wrong? Throw. (AKA token's user data does not exist in database)
     * Got correct token? Store token's user data in req.loggedInUser
     */
    static async tokenGuard(req,res,next){
        try {
            // got token? (from header authorization?)
            if (!req.headers.authorization) throw ({name:"CustomError",msg:"unauthorized",status:401})
            // grab token
            const TOKEN = req.headers.authorization.split(" ")[1]
            // token -> payload (token's user data)
            const PAYLOAD = await Helper.tokenVerifier(TOKEN)
            // user exist? (user, where payload data)
            const USER = await Helper.findOne(User, {username:PAYLOAD.username}, true)
            // add user data to req.loggedInUser
            req.loggedInUser = {id:USER.id, username:USER.username, role:USER.role}
            next()
        } catch (error) {
            next(error)
        }
    }
    /**
     * Role is admin? Next. Otherwise throw.
     */
    static async roleAdminGuard(req,res,next){
        try {
            if (req.loggedInUser.role !== 2) throw ({name:"CustomError",msg:"Forbidden",status:403})
            next()
        } catch (error) {
            next(error)
        }
    }
}


module.exports = Middleware
```

## SingularController

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {Singular,Singular2,Singular3,...} = require("../models")


class SingularController {
    static async getSingular(req,res,next){
      try {
          // query must be a string
          if (req.query.username && !isNaN(+req.query.username)) throw {name:"CustomError",msg:"username query must be a string",status:400}
          if (req.query.username && req.query.username.length > 50) throw {name:"CustomError",msg:"username maximum length is 50 characters",status:400}
          // query must be a string
          if (req.query.sort && !isNaN(+req.query.sort)) throw {name:"CustomError",msg:"sort query must be a string",status:400}
          if (req.query.sort && req.query.sort !== "oldest") throw {name:"CustomError",msg:"sort can only be the word 'oldest'",status:400}
          // query must be a number
          if (req.query.reputation_score && isNaN(+req.query.reputation_score)) throw {name:"CustomError",msg:"reputation_score query must be a number",status:400}
          if (req.query.reputation_score && req.query.reputation_score < 0) throw {name:"CustomError",msg:"reputation_score minimum value is 0",status:400}
          if (req.query.reputation_score && !Number.isInteger(+req.query.reputation_score)) throw {name:"CustomError",msg:"reputation_score cannot be a float",status:400}
          // query must be a number
          if (req.query.page && isNaN(+req.query.page)) throw {name:"CustomError",msg:"page query must be a number",status:400}
          if (req.query.page && req.query.page < 1) throw {name:"CustomError",msg:"page minimum value is 1",status:400}
          if (req.query.page && !Number.isInteger(+req.query.page)) throw {name:"CustomError",msg:"page cannot be a float",status:400}
          // query must be a number
          if (req.query.role && isNaN(+req.query.role)) throw {name:"CustomError",msg:"role query must be a number",status:400}
          if (req.query.role && req.query.role < 0) throw {name:"CustomError",msg:"role minimum value is 0",status:400}
          if (req.query.role && !Number.isInteger(+req.query.role)) throw {name:"CustomError",msg:"role cannot be a float",status:400}
          // query builder
          let query = {}
          if (req.query.username) query.username = {[Op.iLike]: `%${req.query.username}%`} // username
          if (req.query.role) query.role = req.query.role // role
          let order = req.query.sort === 'oldest' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']] // sort
          // pagination
          const limit = 10
          const CURRENT_PAGE = req.query.page || 1
          const offset = (CURRENT_PAGE - 1) * limit
          // findAll (exclude password)
          const USERS_ARRAY = await User.findAll({where:query,order,offset,limit,attributes:{exclude:["password"]}})
          res.status(200).json({
              msg: "success getUser",
              users: USERS_ARRAY
          })
        } catch (error) {
          next(error)
        }
      }
    static async getSingularId(req,res,next){
      try {
          const OBJ = await Helper.findById(req.params.id, Lodging)
          res.status(200).json({
              msg: "success getSingularId",
              user: OBJ
          })
        } catch (error) {
          next(error)
        }
      }
    static async postSingular(req,res,next){
      try {
        // const {name,facility,roomCapacity,imgUrl,location,price,TypeId} = req.body
        // const UserId = req.loginInfo.userId // ID from Login -> use this to create (so that resource belongs to that user ID)
        // const POSTED_LODGING = await Lodging.create({name,facility,roomCapacity,imgUrl,location,price,TypeId,UserId})
        const POSTED_SINGULAR = await Singular.create({name:req.body.name})
        res.status(201).json({
          message: "Success postSingular",
          POSTED_SINGULAR
        })
        } catch (error) {
          next(error)
        }
      }
    static async putSingular(req,res,next){
        try {
            const OBJ = await Helper.findById(req.params.id, Singular) // don't exists? throw
            // const {name,facility,roomCapacity,imgUrl,location,price,TypeId} = req.body
            // const UPDATED_LODGING = await Lodging.update({name,facility,roomCapacity,imgUrl,location,price,TypeId,UserId:id},{where:{id},returning:true})
            const UPDATED_SINGULAR = await Singular.update({name:req.body.name},{where:{id:req.params.id},returning:true})
            res.status(200).json({
                message: "Success putSingular",
                UPDATED_SINGULAR
            })
        } catch (error) {
            next(error)
        }
    }
    static async deleteSingular(req,res,next){
        try {
            const OBJ = await Helper.findById(req.params.id, Singular) // don't exists? throw
            await Singular.destroy({where:{id:req.params.id}})
            res.status(200).json({
                message: "Success deleteSingular",
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
    static async patchSingular(req,res,next){
        try {
            const OBJ = await Helper.findById(req, Singular) // don't exists? throw
            // no req.file? (img file) throw
            if (!req.file) {
                throw ({name:"CustomError",message:`imgUrl required`,status:400})
            }
            // req.file -> base64
            const IMAGE_BASE_64 = req.file.buffer.toString("base64")
            // upload base64 | base64 -> url
            const RESULT = await Util.imagekit.upload({file:IMAGE_BASE_64,fileName:req.file.originalname,tags:[`${req.file.originalname}`]})
            const NEW_IMG_URL = RESULT.url
            // patch imgUrl = url
            await Lodging.update({imgUrl:NEW_IMG_URL},{where:{id}})
            res.status(200).json({
                message: "Success deleteSingular",
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = SingularController
```

## AuthController

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class AuthController {
    // POST STAFF: FOR ADMIN ONLY
    static async postAddUser(req,res,next) {
        try {
             // empty body? throw
            const {username, email, password, phoneNumber, address} = req.body
            if (!username) throw ({name:"CustomError",message:`username required`,status:400})
            if (!email) throw ({name:"CustomError",message:`email required`,status:400})
            if (!password) throw ({name:"CustomError",message:`password required`,status:400})
            if (!phoneNumber) throw ({name:"CustomError",message:`phoneNumber required`,status:400})
            if (!address) throw ({name:"CustomError",message:`address required`,status:400})
            // POST
            const role = "Staff"
            const CREATED_USER = await User.create({username, email, password, phoneNumber, address, role})
            // res status
            const CREATED_USER_NO_PASSWORD = await User.findByPk(CREATED_USER.id,{attributes:{ exclude:['password']},})
            res.status(201).json({
                message: `Success create user`,
                CREATED_USER_NO_PASSWORD
            })
        } catch (error) {
            next(error)
        }
    }
    static async postLogin(req,res,next) {
        // POST: GENERATES TOKEN FOR USERS
        try {
            // empty body?
            const {email, password} = req.body
            if (!email) throw ({name:"CustomError",message:`email required`,status:400})
            if (!password) throw ({name:"CustomError",message:`password required`,status:400})
            const USER = await Helper.findOne(User, {email}) // user exists?
            if (!await Helper.passwordComparer(password, USER.password)) throw ({name:"CustomError",message:`Wrong password`,status:401}) // password correct?
            // payload
            const PAYLOAD = {
                id:USER.id,
                username:USER.username,
                email:USER.email,
                role:USER.role
            }
            // payload -> token
            const TOKEN = await Helper.tokenGenerator(PAYLOAD)
            // res status
            res.status(200).json({message:`Success generate token for ${USER.username}`, TOKEN})
        } catch (error) {
            next(error)
        }
    }
}


module.exports = AuthController
```

## TYPE_ROUTER

```js
const EXPRESS = require("express")
const TypeController = require("../controllers/typeController") // get controller
const Middleware = require("../middleware/middleware") // guards
const Util = require("../util/util") // 3rd API helper


const TYPE_ROUTER = EXPRESS.Router()

// controller handle endpoints
TYPE_ROUTER.post("/", TypeController.postType)
TYPE_ROUTER.get("/", TypeController.getType)
TYPE_ROUTER.put("/:id", TypeController.putType)
TYPE_ROUTER.delete("/:id", TypeController.deleteType)


module.exports = TYPE_ROUTER
```

## LODGING_ROUTER

```js
const EXPRESS = require("express")
const LodgingController = require("../controllers/lodgingController") // get controller
const Middleware = require("../middleware/middleware") // guards
const Util = require("../util/util") // 3rd API helper


const LODGING_ROUTER = EXPRESS.Router()

// controller handle endpoints
LODGING_ROUTER.get("/", LodgingController.getLodging)
LODGING_ROUTER.get("/:id", LodgingController.getLodgingId)
LODGING_ROUTER.post("/", LodgingController.postLodging)
LODGING_ROUTER.put("/:id", Middleware.staffEditSelfOnly, LodgingController.putLodging) // staff edit self guard
LODGING_ROUTER.delete("/:id", Middleware.staffEditSelfOnly, LodgingController.deleteLodging) // staff edit self guard
LODGING_ROUTER.patch("/:id", Middleware.staffEditSelfOnly, Util.upload.single("imgUrl"), LodgingController.patchLodging) // staff edit self guard


module.exports = LODGING_ROUTER
```

## HOME_ROUTER

```js
const EXPRESS = require("express")
 //child router
const USER_ROUTER = require("./userRouter")
const LODGING_ROUTER = require("./lodgingRouter")
const TYPE_ROUTER = require("./typeRouter")
// guards
const Middleware = require("../middleware/middleware")
// get controllers
const HomeController = require("../controllers/homeController")
const AuthController = require("../controllers/authController")
const LodgingController = require("../controllers/lodgingController")

const HOME_ROUTER = EXPRESS.Router()

// free
HOME_ROUTER.post("/login", AuthController.postLogin)
HOME_ROUTER.get("/pub", LodgingController.getLodgingPub)
HOME_ROUTER.get("/pub/:id", LodgingController.getLodgingIdPub)
// token guard
HOME_ROUTER.use(Middleware.authentication)
HOME_ROUTER.use("/type", TYPE_ROUTER)
HOME_ROUTER.use("/user", USER_ROUTER)
HOME_ROUTER.use("/lodging", LODGING_ROUTER)
HOME_ROUTER.get("/", HomeController.getHome)
HOME_ROUTER.post("/add-user", Middleware.authorization, AuthController.postAddUser) // Admin only guard


module.exports = HOME_ROUTER
```

## APP

```js
if (process.env.NODE_ENV !== "production") require('dotenv').config() // production?
const EXPRESS = require("express")
const HOME_ROUTER = require("./routers/homeRouter") // home router
const Middleware = require("./middleware/middleware") // err handler


const APP = EXPRESS()

APP.use(EXPRESS.urlencoded({extended:true})) // req.body
APP.use(EXPRESS.json()) // ini buat baca dari test
APP.use(HOME_ROUTER) // home router
APP.use(Middleware.errorHandler) // error handler


module.exports = APP
```

## WWW

```js
const APP = require("../app")


const PORT = process.env.PORT || 3000
APP.listen(PORT, ()=>{`listening to ${PORT}`})
```
