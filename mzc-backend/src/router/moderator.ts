import routes from "./image";
import {AdminController} from "../controller/AdminController";

routes.get('/dashboard', AdminController.getDashboard);

export default routes;