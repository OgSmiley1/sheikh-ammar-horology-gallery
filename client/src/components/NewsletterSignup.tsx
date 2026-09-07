import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function NewsletterSignup() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-y border-primary/20 bg-card/60 py-16"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            {language === "ar"
              ? "ابقَ على اطلاع بأحدث الإضافات"
              : "Stay Updated"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "اشترك للحصول على إشعارات حول السجلات الجديدة وقراءات الأرشيف"
              : "Subscribe for notices of new records and archive readings"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Mail className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-primary ${isRTL ? "right-4" : "left-4"}`} />
            <input
              type="email"
              placeholder={language === "ar" ? "بريدك الإلكتروني" : "Your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInvalid={(event) => event.currentTarget.setCustomValidity(isRTL ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email address.")}
              onInput={(event) => event.currentTarget.setCustomValidity("")}
              className={`w-full rounded-lg border border-border bg-background py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none ${isRTL ? "pl-4 pr-12 text-right" : "pl-12 pr-4"}`}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {submitted ? (
              <Check className="w-5 h-5" />
            ) : language === "ar" ? (
              "اشترك"
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-primary"
          >
            {language === "ar"
              ? "شكراً للاشتراك!"
              : "Thank you for subscribing!"}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
