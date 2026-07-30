import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const INDUSTRIES = [
  "Auto sales & service",
  "Construction & trades",
  "Professional services",
  "Restaurant & food service",
  "Retail & e-commerce",
  "Real estate",
  "Healthcare practice",
  "Transportation & logistics",
  "Other",
] as const;

export const SITUATIONS = [
  "Books have never been set up",
  "Behind by a few months",
  "Behind by a year or more",
  "Current, but need a second set of eyes",
  "Switching from another bookkeeper",
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120, "Name is too long"),
  businessName: z.string().trim().max(160, "Business name is too long"),
  industry: z.string().trim().min(1, "Please choose an industry").max(80),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Enter a valid email address")
    .max(255),
  phone: z.string().trim().max(40, "Phone number is too long"),
  situation: z.string().trim().max(120),
  message: z.string().trim().max(4000, "Please keep this under 4,000 characters"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const EMPTY = {
  name: "",
  businessName: "",
  industry: "",
  email: "",
  phone: "",
  situation: "",
  message: "",
};

/**
 * Public lead capture. Writes to the quote_requests table via the anon insert
 * policy; server-side CHECK constraints mirror this client validation.
 */
export const QuoteForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(flat).map(([k, v]) => [k, v?.[0]]),
        ) as FieldErrors,
      );
      return;
    }

    setSubmitting(true);
    const d = parsed.data;
    const { error } = await supabase.from("quote_requests").insert({
      name: d.name,
      business_name: d.businessName || null,
      industry: d.industry,
      email: d.email,
      phone: d.phone || null,
      situation: d.situation || null,
      message: d.message || null,
    });
    setSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "We couldn’t send that",
        description: "Something went wrong submitting your request. Please try again.",
      });
      return;
    }

    setValues(EMPTY);
    setDone(true);
  };

  if (done) {
    return (
      <div className="surface-panel p-8 sm:p-10">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="headline-editorial mt-6 text-[24px] text-foreground sm:text-[28px]">
          Request received
        </h3>
        <p className="mt-4 max-w-[50ch] text-[14.5px] leading-relaxed text-muted-foreground">
          Thank you. A Mizan accountant will review your situation and reply within one business
          day with a scope and a fixed monthly quote. If anything is urgent, mention it in a reply
          to our email and we’ll move it up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setDone(false)}>
            Submit another request
          </Button>
          <Button className="gap-2 btn-glow" onClick={() => navigate("/services")}>
            See what’s included
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-panel p-6 sm:p-9">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="q-name" label="Your name" error={errors.name} required>
          <Input
            id="q-name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Jordan Reyes"
            autoComplete="name"
            maxLength={120}
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field id="q-business" label="Business name" error={errors.businessName}>
          <Input
            id="q-business"
            value={values.businessName}
            onChange={(e) => set("businessName")(e.target.value)}
            placeholder="Reyes Carpentry LLC"
            autoComplete="organization"
            maxLength={160}
          />
        </Field>

        <Field id="q-email" label="Email" error={errors.email} required>
          <Input
            id="q-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            maxLength={255}
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field id="q-phone" label="Phone" error={errors.phone}>
          <Input
            id="q-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            placeholder="(215) 555-0142"
            autoComplete="tel"
            maxLength={40}
          />
        </Field>

        <Field id="q-industry" label="Industry" error={errors.industry} required>
          <Select value={values.industry} onValueChange={set("industry")}>
            <SelectTrigger id="q-industry" aria-invalid={!!errors.industry}>
              <SelectValue placeholder="Choose an industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="q-situation" label="Where your books stand" error={errors.situation}>
          <Select value={values.situation} onValueChange={set("situation")}>
            <SelectTrigger id="q-situation">
              <SelectValue placeholder="Choose the closest fit" />
            </SelectTrigger>
            <SelectContent>
              {SITUATIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="q-message" label="Anything we should know?" error={errors.message}>
          <Textarea
            id="q-message"
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="Number of bank and card accounts, whether you use QuickBooks, payroll headcount, filing deadlines coming up…"
            rows={5}
            maxLength={4000}
          />
        </Field>
      </div>

      <div className="rule-hairline mt-8" />
      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[46ch] text-[11.5px] leading-relaxed text-muted-foreground/70">
          We use your details only to prepare your quote. No documents are requested until the
          engagement is signed.
        </p>
        <Button type="submit" className="btn-glow gap-2 sm:min-w-[190px]" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Request my quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="min-w-0">
    <Label htmlFor={id} className="text-[12.5px] text-muted-foreground">
      {label}
      {required && <span className="ml-1 text-primary">*</span>}
    </Label>
    <div className="mt-2">{children}</div>
    {error && (
      <p className="mt-1.5 text-[11.5px] text-destructive" role="alert">
        {error}
      </p>
    )}
  </div>
);

export default QuoteForm;
