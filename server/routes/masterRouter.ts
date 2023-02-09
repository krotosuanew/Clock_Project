import {Router} from 'express'
import masterController from "../controllers/masterController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param, query} from 'express-validator';
import {ROLES} from "../dto/global";

const masterRouter = Router()


masterRouter.post("/",
    masterController.create)

masterRouter.get('/', masterController.getAll)

masterRouter.get('/:cityId',
    param("cityId").not().isEmpty().isInt({gt: 0}),
    query("time").not().isEmpty().isString(),
    masterController.getMastersForOrder)

masterRouter.put('/:masterId',
    param("masterId").not().isEmpty().isInt({gt: 0}),
    checkRole(ROLES.ADMIN),
    body("name").not().isEmpty().isString().trim().escape(),
    body("rating").not().isEmpty().not().isString().isFloat({gt: -1, lt: 6}),
    body("cityId").not().isEmpty().isArray(),
    masterController.update)

masterRouter.put('/activate/:masterId', checkRole(ROLES.ADMIN),
    param("masterId").not().isEmpty().isInt({gt: 0}),
    body("isActivated").not().isEmpty().isBoolean(),
    masterController.activate)

masterRouter.put('/rating/:uuid',
    param("uuid").isUUID(4),
    body("rating").not().isEmpty().not().isString().isFloat({gt: -1, lt: 6}),
    body("review").isString().isLength({min: 0, max: 1000}),
    masterController.ratingUpdate)
masterRouter.get('/rating/:masterId',
    param("masterId").not().isEmpty().isInt({gt: 0}),
    masterController.getRatingReviews)
masterRouter.get('/rating/link/:uuid',
    param("uuid").isUUID(4),
    masterController.checkLink)

masterRouter.delete('/:masterId', checkRole(ROLES.ADMIN),
    param("masterId").not().isEmpty().isInt({gt: 0}),
    masterController.deleteOne)


export default masterRouter