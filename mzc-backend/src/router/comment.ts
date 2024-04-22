import {Router} from "express";
import {CommentController} from "../controller/CommentController";
import {AuthMiddleware} from "../middleware/AuthMiddleware";

const routes = Router();
routes.post('', AuthMiddleware.verifyToken, CommentController.addComment);
routes.get('/list', CommentController.findAllComment);
routes.get('', CommentController.findOneComment);
routes.put('', AuthMiddleware.verifyToken, CommentController.modifyComment);
routes.delete('', AuthMiddleware.verifyToken, CommentController.removeComment);

export default routes;