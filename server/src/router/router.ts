import { Router } from "express";
import { AuthController } from "../controllers/users/auth.controller";
import { BasketController } from "../controllers/basket/basket.controller";
import { DeliveryController } from "../controllers/delivery/delivery.controller";
import { ProductsController } from "../controllers/products/products.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();
const basketController = new BasketController();
const deliveryController = new DeliveryController();
const productsController = new ProductsController();

router.post("/auth/register", authController.register.bind(authController));
router.post("/auth/login", authController.login.bind(authController));
router.post("/auth/logout", authMiddleware, authController.logout.bind(authController));
router.get("/auth/me", authMiddleware, authController.me.bind(authController));

router.get("/basket/active", authMiddleware, basketController.getActive.bind(basketController));
router.post("/basket/items", authMiddleware, basketController.addItem.bind(basketController));
router.get("/delivery/active", authMiddleware, deliveryController.getActive.bind(deliveryController));
router.post("/delivery", authMiddleware, deliveryController.create.bind(deliveryController));
router.get("/products", productsController.list.bind(productsController));

export default router;
