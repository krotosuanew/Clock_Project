import express from 'express'
import sizeController from "../controllers/sizeController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {ROLES} from "../dto/global";

const sizeRouter = express.Router()

sizeRouter.post("/", checkRole(ROLES.ADMIN),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    sizeController.create)

sizeRouter.get('/', sizeController.getAll)

sizeRouter.put('/:sizeId', checkRole(ROLES.ADMIN),
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    sizeController.update)

sizeRouter.delete('/:sizeId', checkRole(ROLES.ADMIN),
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    sizeController.deleteOne)


export default sizeRouter