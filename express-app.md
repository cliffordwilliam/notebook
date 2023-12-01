# Express app (cognitive reducer)

Setup `npm`

```
npm init -y
npm i express pg sequelize jsonwebtoken dotenv bcrypt multer imagekit
npm i -D nodemon sequelize-cli
```

create `.gitignore` file

```
node_modules
.env
```

create `.env`

```env
SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

Setup `sequelize`

```
npx sequelize init
```

Edit `config.json` file

```
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "rentRoom",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "rentRoomTest",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
}
```

`Create database`

```
npx sequelize db:create
```

Tables:

1. `User`
2. `Lodging` - Main
3. `Type` - Support

Association:

`User` -< `Lodging` >- `Type`

## User Table

- username : string
- email : string (required, `unique`, `isEmail`)
- password : string (required, `length min 5`)
- role : string (`default`: Staff)
- phoneNumber : string
- address : string

`Create model`

```
npx sequelize model:create --name User --attributes username:string,email:string,password:string,role:string,phoneNumber:string,address:string
```

Edit `migration`:
- `constraints`
- `validation`
- `fk`

```js
      email: {
        type: Sequelize.STRING,
        allowNull: false, // required
        unique: true, // unique
        validate: {isEmail:true} // isEmail
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // required
        validate: {len:[5,Infinity]} // len min 5
      },
```

Edit `model`:
- `constraints`
- `validation`

```js
    email: {
      type:DataTypes.STRING,
      allowNull:false, // required
      unique:true, // unique
      validate:{
        isEmail:{msg:"wrong email format"}, //isEmail
        notNull:{msg:"email required"}, // required custom err msg
        notEmpty:{msg:"email required"} // required custom err msg
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false, // required
      validate:{
        len:{args:[5,Infinity],msg:"password min 5"}, // length min 5
        notNull:{msg:"password required"}, // required custom err msg
        notEmpty:{msg:"password required"} // required custom err msg
      }
    },
    role: {
      type:DataTypes.STRING,
      defaultValue:"Staff" // default Staff
    },
```

Add `association` to model

```js
    static associate(models) {
      User.hasMany(models.Lodging)
    }
```

## Lodging Table

- name : string (required)
- facility : text (required)
- roomCapacity : integer (required)
- imgUrl : string (required, `isUrl`)
- location : string (required)
- price : integer (required, `min 100`)
- TypeId : integer (required)
- UserId : integer (required)

`Create Model`

```
npx sequelize model:create --name Lodging --attributes name:string,facility:text,roomCapacity:integer,imgUrl:string,location:string,price:integer,TypeId:integer,UserId:integer
```

Edit `migration`:
- `constraints`
- `validation`
- `fk`

```js
      name: {
        type: Sequelize.STRING,
        allowNull: false, // required
      },
      facility: {
        type: Sequelize.TEXT,
        allowNull: false, // required
      },
      roomCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false, // required
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false, // required
        validate: {isUrl:true} // isUrl
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false, // required
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false, // required
        validate: {min:100} // min 100
      },
      TypeId: {
        type: Sequelize.INTEGER,
        allowNull: false, // required
        references:{model:"Types",key:"id"}, // fk
        onUpdate:"cascade", // follow owner id changes
        onDelete:"cascade" // del myself if owner gone
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false, // required
        references:{model:"Users",key:"id"}, // fk
        onUpdate:"cascade", // follow owner id changes
        onDelete:"cascade" // del myself if owner gone
      },
```

Edit `model`:
- `constraints`
- `validation`

```js
    name: {
      type:DataTypes.STRING,
      allowNull:false, // required
      validate:{
        notNull:{msg:"name required"}, // required custom err msg
        notEmpty:{msg:"name required"} // required custom err msg
      }
    },
    facility: {
      type:DataTypes.TEXT,
      allowNull:false, // required
      validate:{
        notNull:{msg:"facility required"}, // required custom err msg
        notEmpty:{msg:"facility required"} // required custom err msg
      }
    },
    roomCapacity: {
      type:DataTypes.INTEGER,
      allowNull:false, // required
      validate:{
        notNull:{msg:"roomCapacity required"}, // required custom err msg
        notEmpty:{msg:"roomCapacity required"} // required custom err msg
      }
    },
    imgUrl: {
      type:DataTypes.STRING,
      allowNull:false, // required
      validate:{
        isUrl:{msg:"wrong imgUrl format"}, // isUrl
        notNull:{msg:"imgUrl required"}, // required custom err msg
        notEmpty:{msg:"imgUrl required"} // required custom err msg
      }
    },
    location: {
      type:DataTypes.STRING,
      allowNull:false, // required
      validate:{
        notNull:{msg:"location required"}, // required custom err msg
        notEmpty:{msg:"location required"} // required custom err msg
      }
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false, // required
      validate:{
        len:{args:[100,Infinity],msg:"Min Price 100"}, // length min 5
        notNull:{msg:"price required"}, // required custom err msg
        notEmpty:{msg:"price required"} // required custom err msg
      }
    },
    TypeId: {
      type:DataTypes.INTEGER,
      allowNull:false, // required
      validate:{
        notNull:{msg:"TypeId required"}, // required custom err msg
        notEmpty:{msg:"TypeId required"} // required custom err msg
      }
    },
    UserId: {
      type:DataTypes.INTEGER,
      allowNull:false, // required
      validate:{
        notNull:{msg:"UserId required"}, // required custom err msg
        notEmpty:{msg:"UserId required"} // required custom err msg
      }
    }
```

Add `association` to model

```js
    static associate(models) {
      Lodging.belongsTo(models.User)
      Lodging.belongsTo(models.Type)
    }
```

## Type Table

- name : string (required)

`Create Model`

```
npx sequelize model:create --name Type --attributes name:string
```

Edit `migration`:
- `constraints`
- `validation`
- `fk`

```js
      name: {
        type: Sequelize.STRING,
        allowNull: false // required
      },
```

Edit `model`:
- `constraints`
- `validation`

```js
    name: {
      type:DataTypes.STRING,
      allowNull:false, // required
      validate:{
        notNull:{msg:"name required"}, // required custom err msg
        notEmpty:{msg:"name required"} // required custom err msg
      }
    }
```

Add ```association``` to model

```js
    static associate(models) {
      Type.hasMany(models.Lodging)
    }
```

## Migrate

```
npx sequelize db:migrate
```

## Helper

```js
const BCRYPT = require('bcrypt')
const JWT = require('jsonwebtoken')


class Helper {
  static async passwordHasher(value) {
    // Password Hasher
    // (throws Error)
    try {
      const OUT = await BCRYPT.hash(value, 10);
      return OUT
    } catch (error) {
      throw error
    }
  }
  static async findById(req, model) {
    // Find anything by its ID
    // (throws CustomError)
    try {
      const {id} = req.params
      const OBJ = await model.findByPk(id)
      if (!OBJ) {
          throw({name:"CustomError",message: `Obj id:${id} not found`,status:404})
      }
      return {id, OBJ}
    } catch (error) {
      throw error
    }
  }
  static async passwordComparer(receivedPassword, databasePassword) {
    // Password Comparer - Hashed
    // (throws Error)
    try {
      const OUT = await BCRYPT.compare(receivedPassword, databasePassword)
      return OUT
    } catch (error) {
      throw error
    }
  }
  static async tokenGenerator(payload){
    // Payload + process.env.SECRET_KEY -> TOKEN
    const TOKEN = JWT.sign(payload,process.env.SECRET_KEY)
    return TOKEN
  }
  static async tokenVerifier(token){
    // TOKEN checker -> Bool
    return JWT.verify(token,process.env.SECRET_KEY)
  }
  static async findOne(model, where, fromAuthorization=false){
    // Find anything by ANYTHING
    // (throws CustomError)
    try {
      const OBJ = await model.findOne({where})
      if (!OBJ) {
          if (!fromAuthorization) {
            throw ({name:"CustomError",message:`Unauthorized`,status:401})
          }
          throw ({name:"CustomError",message:`Obj with this ${where} is not found`,status:404})
      }
      return OBJ
    } catch (error) {
      throw error
    }
  }
}


module.exports = Helper
```

## Seed

- There is only `2 admin forever`
- `Only Admin add Staff`

`Seed 2 admin`

`Create` seed

```
npx sequelize seed:create --name seedUserWithAdmin
```

`Edit` seed

```js
  // UP
  async up (queryInterface, Sequelize) {
    // UP IS NOT CAUGHT BY BEFORE CREATE
    const HASHED_ADMIN_PASSWORD = await passwordHasher("AdminPass123")
    await queryInterface.bulkInsert('Users', [
      {
        username: 'AdminHatsune',
        email: 'adminhatsune@lovehotel.com',
        password: HASHED_ADMIN_PASSWORD,
        role: 'Admin',
        phoneNumber: '+1 123-456-7890',
        address: '1 Love Lane, Anime City',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'AdminSakura',
        email: 'adminsakura@lovehotel.com',
        password: HASHED_ADMIN_PASSWORD,
        role: 'Admin',
        phoneNumber: '+1 987-654-3210',
        address: '2 Romantic Road, Otaku Town',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],{})
  },
```

```js
  // DOWN
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
```

```js
    // BEFORE CREATE
    User.beforeCreate(async (user) => {
        const HASHED_PASSWORD = await passwordHasher(user.password)
        user.password = HASHED_PASSWORD
    });
```

`Seed` database

```bash
npx sequelize db:seed:all
```

## Util

`3rd Party API` - Helper

```js
const multer = require('multer')
const ImageKit = require("imagekit")


const storage = multer.memoryStorage()

class Util {
    static imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    })
    static upload = multer({ storage })
}


module.exports = Util
```

## MVC

models:
1. `User`
2. `Lodging`
3. `Type`

So:
- `3 Controllers`
- `3 Routers`

## UserController

```js
// USELESS
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class UserController {
    static async getUser(req,res,next){
        try {
            res.status(200).json({
                message: "Success getUser"
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = UserController
```

## TypeController

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class TypeController {
    // POST
    static async postType(req,res,next){
        try {
            const {name} = req.body
            const POSTED_TYPE = await Type.create({name})
            res.status(201).json({
                message: "Success create type",
                POSTED_TYPE
            })
        } catch (error) {
            next(error)
        }
    }
    // GET
    static async getType(req,res,next){
        try {
            const TYPES_ARRAY = await Type.findAll()
            res.status(200).json({
                message: "Success findAll type",
                TYPES_ARRAY
            })
        } catch (error) {
            next(error)
        }
    }
    // PUT
    static async putType(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Type) // exists?
            const {name} = req.body
            const UPDATED_TYPE = await Type.update({name},{where:{id},returning:true})
            res.status(200).json({
                message: `Success put type id:${id}`,
                UPDATED_TYPE
            })
        } catch (error) {
            next(error)
        }
    }
    // DELETE
    static async deleteType(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Type) // exists?
            await Type.destroy({where:{id}})
            res.status(200).json({
                message: `Success delete type id:${id}`,
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = TypeController
```

## LodgingController

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")
const {Op} = require("sequelize")


class LodgingController {
    // POST
    static async postLodging(req,res,next){
        try {
            const {name,facility,roomCapacity,imgUrl,location,price,TypeId} = req.body
            const UserId = req.loginInfo.userId // ID from Login
            const POSTED_LODGING = await Lodging.create({name,facility,roomCapacity,imgUrl,location,price,TypeId,UserId})
            res.status(201).json({
                message: "Success create lodging",
                POSTED_LODGING
            })
        } catch (error) {
            next(error)
        }
    }
    // GET
    static async getLodging(req,res,next){
        try {
            const LODGINGS_ARRAY = await Lodging.findAll({include:[{model:User,attributes:{exclude:["password"]}}]})
            res.status(200).json({
                message: "Success findAll lodging",
                LODGINGS_ARRAY
            })
        } catch (error) {
            next(error)
        }
    }
    // GET (FREE + QUERY)
    static async getLodgingPub(req,res,next){
        try {
            // query errors?
            const {name,TypeId,sort,page} = req.query
            if (name !== undefined && !isNaN(Number(name))) {
                throw { name: "CustomError", message: "name is string", status: 400 };
            }
            if (TypeId !== undefined) {
                const PARSED_TYPE_ID = Number(TypeId);
                if (isNaN(PARSED_TYPE_ID)) {
                    throw { name: "CustomError", message: "TypeId is number", status: 400 };
                }
                req.query.TypeId = Math.round(PARSED_TYPE_ID);
            }
            if (sort !== undefined && !isNaN(Number(sort))) {
                throw { name: "CustomError", message: "sort is string", status: 400 };
            }
            if (page !== undefined) {
                const PARSED_PAGE = Number(page);
                if (isNaN(PARSED_PAGE)) {
                    throw { name: "CustomError", message: "page is number", status: 400 };
                }
                req.query.page = Math.round(PARSED_PAGE);
            }
            // query builder
            let query = {}
            if (name) query.name = {[Op.iLike]: `%${name}%`}
            if (TypeId) query.TypeId = TypeId
            let order = [['createdAt', 'DESC']]
            if (sort) order = sort === 'oldest' ? [['createdAt', 'ASC']] : order
            const limit = 10
            const CURRENT_PAGE = page || 1
            const offset = (CURRENT_PAGE - 1) * limit
            // GET
            const LODGINGS_ARRAY = await Lodging.findAll({where:query,order,offset,limit})
            res.status(200).json({
                message: "Success findAll lodging",
                LODGINGS_ARRAY
            })
        } catch (error) {
            next(error)
        }
    }
    // GET{ID}
    static async getLodgingId(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging)
            res.status(200).json({
                message: `Success findById lodging id ${id}`,
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
    // GET{ID} (FREE)
    static async getLodgingIdPub(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging)
            res.status(200).json({
                message: `Success findById lodging id ${id}`,
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
    // PUT
    static async putLodging(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging) // exists?
            const {name,facility,roomCapacity,imgUrl,location,price,TypeId} = req.body
            const UPDATED_LODGING = await Lodging.update({name,facility,roomCapacity,imgUrl,location,price,TypeId,UserId:id},{where:{id},returning:true})
            res.status(200).json({
                message: `Success put lodging id:${id}`,
                UPDATED_LODGING
            })
        } catch (error) {
            next(error)
        }
    }
    // DEL
    static async deleteLodging(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging) // exists?
            await Lodging.destroy({where:{id}})
            res.status(200).json({
                message: `Success delete lodging id:${id}`,
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
    // PATCH
    static async patchLodging(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging) // exists?
            if (!req.file) {
                throw ({name:"CustomError",message:`imgUrl required`,status:400})
            }
            const IMAGE_BASE_64 = req.file.buffer.toString("base64")
            const RESULT = await Util.imagekit.upload({file:IMAGE_BASE_64,fileName:req.file.originalname,tags:[`${req.file.originalname}`]})
            const NEW_IMG_URL = RESULT.url
            await Lodging.update({imgUrl:NEW_IMG_URL},{where:{id}})
            res.status(200).json({
                message: "Success patch lodging",
                OBJ
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = LodgingController
```

## AuthController

```js
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class AuthController {
    // POST: FOR ADMIN TO ADD STAFF
    static async postAddUser(req,res,next) {
        try {
             // empty body?
            const {username, email, password, phoneNumber, address} = req.body
            if (!username) {
                throw ({name:"CustomError",message:`username required`,status:400})
            }
            if (!email) {
                throw ({name:"CustomError",message:`email required`,status:400})
            }
            if (!password) {
                throw ({name:"CustomError",message:`password required`,status:400})
            }
            if (!phoneNumber) {
                throw ({name:"CustomError",message:`phoneNumber required`,status:400})
            }
            if (!address) {
                throw ({name:"CustomError",message:`address required`,status:400})
            }
            // POST
            const role = "Staff"
            const CREATED_USER = await User.create({username, email, password, phoneNumber, address, role})
            // SEND NEW
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
        // POST: MAKES TOKEN FOR USERS
        try {
            // empty body?
            const {email, password} = req.body
            if (!email) {
                throw ({name:"CustomError",message:`email required`,status:400})
            }
            if (!password) {
                throw ({name:"CustomError",message:`password required`,status:400})
            }
            const USER = await Helper.findOne(User, {email}) // exists?
            const IS_PASSWORD_VALID = await Helper.passwordComparer(password, USER.password) // password ok?
            if (!IS_PASSWORD_VALID) {
                throw ({name:"CustomError",message:`Wrong password`,status:401})
            }
            // GENERATE TOKEN
            const PAYLOAD = {
                id:USER.id,
                username:USER.username,
                email:USER.email,
                role:USER.role
            }
            const TOKEN = await Helper.tokenGenerator(PAYLOAD)
            res.status(200).json({message:`Success generate token for ${USER.username}`, TOKEN})
        } catch (error) {
            next(error)
        }
    }
}


module.exports = AuthController
```

## HomeController

```js
// USELESS
const Util = require("../util/util")
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class HomeController {
    static async getHome(req,res,next){
        try {
            res.status(200).json({
                message: "Success get home"
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = HomeController
```

## MIDDLEWARE

```js
const Helper = require("../helper/helper")
const {User, Lodging, Type} = require("../models")


class Middleware {
    // sends status + msg
    static errorHandler(err,req,res,next){
        console.log(err);
        let status = 500
        let message = "Internal Server Error"
        switch (err.name) {
            case "SequelizeValidationError":
                status = 400
                message = err.errors[0].message
                break
            case "SequelizeUniqueConstraintError":
                status = 400
                message = "Email already exists"
                break
            case "CustomError":
                status = err.status
                message = err.message
                break
            case "JsonWebTokenError":
                status = 401
                message = err.message
                break
        }
        res.status(status).json({message,err})
    }
    // TOKEN GUARD
    static async authentication(req,res,next){
        try {
            const {authorization} = req.headers
            if (!authorization) { // no token? throw
                throw ({name:"CustomError",message:`Unauthorized`,status:401})
            }
            // create TOKEN + update LOGIN INFO
            const TOKEN = authorization.split(" ")[1]
            const PAYLOAD = await Helper.tokenVerifier(TOKEN)
            const USER = await Helper.findOne(User, {email:PAYLOAD.email}, true)
            req.loginInfo = {
                userId:USER.id,
                username:USER.username,
                role:USER.role
            }
            next()
        } catch (error) {
            next(error)
        }
    }
    // ADMIN GUARD
    static async authorization(req,res,next){
        try {
            const {userId,role} = req.loginInfo
            if (role !== "Admin") { // logged as staff? throw
                throw ({name:"CustomError",message:`Forbidden`,status:403})
            }
            next()
        } catch (error) {
            next(error)
        }
    }
    // Staff EDIT self LODGE only
    static async staffEditSelfOnly(req,res,next){
        try {
            const {id, OBJ} = await Helper.findById(req, Lodging)
            const {userId,role} = req.loginInfo
            if (role==="Staff" && userId!==OBJ.UserId) { // Staff edit others? throw
                throw {name:'CustomError',message:'Forbidden',status:403};
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}


module.exports = Middleware
```

## USER_ROUTER

```js
// USELESS
const EXPRESS = require("express")
const UserController = require("../controllers/userController") // get controller


const USER_ROUTER = EXPRESS.Router()

// controller handle endpoints
USER_ROUTER.get("/", UserController.getHome)


module.exports = USER_ROUTER

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
