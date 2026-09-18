import STMPservice from "../services/email";
import { contactSchema } from "../validators/contactSchema";
import type { Context } from "hono";
export const submitContactForm = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid contact form data",
          errors: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    }

    const { fullName, phoneNumber, email, message } = parsed.data;

    await STMPservice.contactFormSubmitted({
      fullName,
      phoneNumber,
      email,
      message,
    });

    return c.json(
      {
        success: true,
        message: "Your message has been sent successfully",
      },
      200,
    );
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to send your message. Please try again.",
      },
      500,
    );
  }
};
