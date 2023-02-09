import {Router} from 'express'
import {body, param} from 'express-validator';
import cityController from "../controllers/cityController"
import checkRole from "../middleware/checkRoleMiddleware"
import {ROLES} from "../dto/global";

const cityRouter = Router()


cityRouter.post("/", checkRole(ROLES.ADMIN),
    body("name").not().isEmpty().isString().trim().escape(),
    cityController.create)

cityRouter.put('/:cityId', checkRole(ROLES.ADMIN),
    body("name").not().isEmpty().isString().trim().escape(),
    param("cityId").not().isEmpty().isInt({gt: 0}),
    cityController.update)

cityRouter.delete('/:cityId', checkRole(ROLES.ADMIN),
    param("cityId").not().isEmpty().isInt({gt: 0}),
    cityController.deleteOne)

cityRouter.get('/', cityController.getAll)

export default cityRouter