import { Router } from 'express'
const router = Router()
import cityRouter from './cityRouter'
import masterRouter  from './masterRouter'
import orderRouter  from './orderRouter'
import userRouter  from './userRouter'
import sizeRouter  from './sizeRouter'

router.use('/users', userRouter)
router.use('/cities', cityRouter)
router.use('/masters', masterRouter)
router.use('/orders', orderRouter)
router.use('/sizes', sizeRouter)

export default router
