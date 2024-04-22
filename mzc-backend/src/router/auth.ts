import {Router} from "express";
import {AuthController} from "../controller/AuthController";

const routes = Router();
routes.post('/signin', AuthController.signIn);
routes.post('/signup', AuthController.signUp);

export default routes;