import {Router} from 'express';
import {validate} from "@/core/middleware/validate";
import {UserValidator} from "@/modules/user/user.validator";
import {UserController} from "@/modules/user/user.controller";

const router = Router();

// Auth router
router.post('/auth/login', [validate(UserValidator.onLogin)], (new UserController()).login)

export default router;
