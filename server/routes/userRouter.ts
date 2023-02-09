import express from 'express'
import userController from '../controllers/userController'
import authMiddleware from '../middleware/authMiddleware'
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {ROLES} from "../dto/global";

const userRouter = express.Router()

userRouter.post("/registration/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('isMaster').isBoolean(),
    body("name").not().isEmpty().isString().trim().escape(),
    userController.registration)

userRouter.post("/registrationAdmin/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registrationFromAdmin)

userRouter.post('/login/',
    body('dataForAuthorizations.email').isEmail(),
    body('dataForAuthorizations.password').isLength({min: 6}),
    userController.login)

userRouter.post('/googleAuth/',
    body("dataForAuthorizations.responseGoogle").isJWT(),
    userController.loginService)

userRouter.post('/facebookAuth/',
    body("dataForAuthorizations.responseFacebook.accessToken").not().isEmpty().isString(),
    body("dataForAuthorizations.responseFacebook.signedRequest").not().isEmpty().isString().isJWT(),
    body("dataForAuthorizations.responseFacebook.name").not().isEmpty().isString(),
    body("dataForAuthorizations.responseFacebook.userID").not().isEmpty().isString(),
    userController.loginService)

userRouter.put('/changeEmail/', userController.changeEmail)

userRouter.get('/auth/', authMiddleware, userController.check)

userRouter.get('/checkEmail/',
    body('email').isEmail(),
    userController.checkEmail)

userRouter.put('/activate/:userId', checkRole(ROLES.ADMIN),
    param("userId").not().isEmpty().isInt({gt: 0}),
    body("isActivated").not().isEmpty().isBoolean(),
    userController.activateAdmin)

userRouter.get('/activate/:link', userController.activate)

userRouter.get("/", checkRole(ROLES.ADMIN), userController.getAll)

userRouter.get("/customers/", userController.getAllCustomers)

userRouter.put('/:userId', checkRole(ROLES.ADMIN),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.updateUser)

userRouter.delete('/:userId', checkRole(ROLES.ADMIN),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.deleteOne)
export default userRouter
