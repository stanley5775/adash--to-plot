import { Hono } from "hono";
import { submitContactForm } from "../controllers/contact.controller";

const contactRouter = new Hono();

contactRouter.post("/contact", submitContactForm);

export default contactRouter;
