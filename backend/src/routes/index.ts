import {Router} from 'express';
import publicRouter from "./public";
import adminRouter from "./admin";
import authRouter from "./auth";

const router = Router();

router.use(publicRouter);
router.use(authRouter);
router.use(adminRouter);

export default router;
