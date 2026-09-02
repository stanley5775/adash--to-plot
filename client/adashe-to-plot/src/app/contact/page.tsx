import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/booking/WhatsAppButton";
import { WHATSAPP_DISPLAY_NUMBER } from "@/lib/whatsapp";

const details = [
  { icon: Phone, label: "Phone", value: WHATSAPP_DISPLAY_NUMBER },
  { icon: Mail, label: "Email", value: "achezyhomes@gmail.com" },
  { icon: MapPin, label: "Office", value: "Abuja, Nigeria" },
  { icon: Clock, label: "Business Hours", value: "Mon – Sat, 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />
        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">Get in Touch</h1>
        <p className="mt-3 text-ink-500">
          Have a question about an estate, a payment plan, or want to book an inspection? Reach us directly or send
          a message below.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-4 rounded-2xl border border-navy-800/10 bg-white p-5">
                <div className="rounded-xl bg-gold-100 p-2.5 text-gold-600"><d.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-300">{d.label}</p>
                  <p className="mt-0.5 font-semibold text-navy-950">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <WhatsAppButton message="Hello Adashè-to-Plot, I have a question." className="w-full" />
          </div>
          <div className="mt-6 flex h-52 items-center justify-center rounded-2xl border border-dashed border-navy-800/20 bg-navy-50 text-sm text-ink-400">
            Map placeholder — Kuje, Abuja
          </div>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
