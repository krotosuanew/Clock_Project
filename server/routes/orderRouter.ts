import {Router} from 'express'
import orderController from "../controllers/orderController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {ROLES} from "../dto/global";

const orderRouter = Router()
orderRouter.get('/exportOrder/', orderController.exportToExcel)

orderRouter.get('/bill/', orderController.createBill)

orderRouter.get('/downloadPhotos/', orderController.downloadPhotos)

orderRouter.get('/statistics/', checkRole(ROLES.ADMIN), orderController.ordersStatistics)

orderRouter.get('/:userId', checkRole(ROLES.CUSTOMER),
    param("userId").not().isEmpty().isInt({gt: 0}),
    orderController.getUserOrders)

orderRouter.get('/Master/:userId', checkRole(ROLES.MASTER),
    param("userId").not().isEmpty().isInt({gt: 0}),
    orderController.getMasterOrders)

orderRouter.get('/', checkRole(ROLES.ADMIN), orderController.getAllOrders)

orderRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("time").not().isEmpty(),
    body("price").not().isEmpty().not().isString().isInt({gt: 0}),
    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    orderController.create,)


orderRouter.put("/:orderId", checkRole(ROLES.ADMIN),
    param("orderId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("time").not().isEmpty(),
    body("price").not().isEmpty().not().isString().isInt({gt: 0}),
    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    orderController.update)

orderRouter.put("/statusChange/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),
    orderController.statusChange)
orderRouter.post("/payPal",
    orderController.payPalChange)


orderRouter.delete("/:orderId", checkRole(ROLES.ADMIN),
    param("orderId").not().isEmpty().isInt({gt: 0}),
    orderController.deleteOne)

export default orderRouter