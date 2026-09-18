import { useMutation } from "@tanstack/react-query";
import { submitContactForm, type ContactFormData } from "../api/contactus";

export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => submitContactForm(data),
  });
};
