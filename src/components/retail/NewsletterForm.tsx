"use client";

import { useState, useSyncExternalStore, FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Tag,
  User,
  Users,
} from "lucide-react";

const PROMO_CODE = "NNVAWELL01";

// The iWILL 'til I'm Well app that owns the registration API and the login
// screen members land on afterwards. Override at build time with
// NEXT_PUBLIC_IWILL_APP_URL (e.g. https://app.iwilltilimwell.com for production).
const APP_URL = (
  process.env.NEXT_PUBLIC_IWILL_APP_URL || "https://app.iwilltilimwell.com"
).replace(/\/+$/, "");
const REGISTER_ENDPOINT = `${APP_URL}/api/register`;
const LOGIN_URL = `${APP_URL}/login`;
const TERMS_URL = "https://iwilltilimwell.com/terms-conditions";
const PRIVACY_URL = "https://iwilltilimwell.com/privacy-policy";
const MIN_AGE = 18;
// How long the "account created" message shows before going to the login screen.
const REDIRECT_DELAY_MS = 2500;

// UTM / attribution params captured from the landing URL and forwarded with the registration.
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) result[key] = value;
  }
  return result;
}

// Field names match the /api/register payload so server errors map straight back.
type FormData = {
  fname: string;
  lname: string;
  email: string;
  primaryPhone: string;
  dob: string; // YYYY-MM-DD from <input type="date">
  gender: "" | "m" | "f" | "o";
  password: string;
  password_confirmation: string;
  terms: boolean;
};

type FieldName = keyof FormData;
type FormErrors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = [
  "fname",
  "lname",
  "email",
  "primaryPhone",
  "dob",
  "gender",
  "password",
  "password_confirmation",
  "terms",
];

const NAME_PATTERN = /^[\p{L}\s'-]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts "(555) 123-4567", "555.123.4567", "+1 555 123 4567"... -> "5551234567".
function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;
}

const noopSubscribe = () => () => {};

function dateYearsAgo(years: number): Date {
  const today = new Date();
  return new Date(
    today.getFullYear() - years,
    today.getMonth(),
    today.getDate(),
  );
}

function toIsoDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

// The app stores dates of birth as MM/DD/YYYY.
function toApiDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

function validateName(value: string, label: string): string | undefined {
  const name = value.trim();
  if (!name) return `${label} is required`;
  if (name.length < 2) return `${label} must be at least 2 characters`;
  if (name.length > 50) return `${label} must be 50 characters or fewer`;
  if (!NAME_PATTERN.test(name))
    return `${label} may only contain letters, spaces, hyphens and apostrophes`;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  errors.fname = validateName(data.fname, "First name");
  errors.lname = validateName(data.lname, "Last name");

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(data.email.trim()))
    errors.email = "Enter a valid email";

  if (!data.primaryPhone.trim())
    errors.primaryPhone = "Phone number is required";
  else if (normalizePhone(data.primaryPhone).length !== 10)
    errors.primaryPhone = "Enter a 10-digit US phone number";

  if (!data.dob) errors.dob = "Date of birth is required";
  else {
    const [y, m, d] = data.dob.split("-").map(Number);
    if (new Date(y, m - 1, d) > dateYearsAgo(MIN_AGE))
      errors.dob = `You must be at least ${MIN_AGE} years old to register`;
  }

  if (!data.gender) errors.gender = "Please select an option";

  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8 || data.password.length > 20)
    errors.password = "Password must be 8–20 characters";
  else if (!/[A-Za-z]/.test(data.password) || !/\d/.test(data.password))
    errors.password =
      "Password must contain at least one letter and one number";

  if (!data.password_confirmation)
    errors.password_confirmation = "Please confirm your password";
  else if (data.password_confirmation !== data.password)
    errors.password_confirmation = "Passwords do not match";

  if (!data.terms)
    errors.terms = "Please agree to the Terms & Conditions and Privacy Policy";

  for (const key of FIELD_ORDER) if (!errors[key]) delete errors[key];
  return errors;
}

function inputClass(hasError: boolean, withIcon = true) {
  return `w-full ${withIcon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-lg border bg-white ${
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-primary"
  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:bg-gray-50`;
}

type FieldProps = {
  id: FieldName;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
};

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}{" "}
        <span className="text-primary" aria-hidden="true">
          *
        </span>
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function NewsletterForm() {
  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    email: "",
    primaryPhone: "",
    dob: "",
    gender: "",
    password: "",
    password_confirmation: "",
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // The date picker's 18+ limit is computed in the browser only; the static
  // export would otherwise bake in the build date.
  const maxDob = useSyncExternalStore(
    noopSubscribe,
    () => toIsoDate(dateYearsAgo(MIN_AGE)),
    () => undefined,
  );

  const update = <K extends FieldName>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear a stale error while the user corrects the field; blur/submit re-validate.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    if (key === "email") setEmailTaken(false);
  };

  const validateField = (key: FieldName) => {
    setErrors((prev) => ({ ...prev, [key]: validate(formData)[key] }));
  };

  const focusFirstError = (fieldErrors: FormErrors) => {
    const first = FIELD_ORDER.find((key) => fieldErrors[key]);
    if (first) document.getElementById(first)?.focus();
  };

  const describedBy = (key: FieldName, hasHint = false) =>
    errors[key] ? `${key}-error` : hasHint ? `${key}-hint` : undefined;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      focusFirstError(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    // Registration payload: account fields, the applied affiliate code, the
    // landing page, and any UTM / click-id attribution params.
    const payload = {
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      email: formData.email.trim(),
      primaryPhone: normalizePhone(formData.primaryPhone),
      dob: toApiDate(formData.dob),
      gender: formData.gender,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      terms: formData.terms,
      promo_code: PROMO_CODE,
      landing_page: window.location.href,
      ...readUtmParams(),
    };

    let response: Response;
    let body: {
      message?: string;
      errors?: Record<string, string[]>;
      redirect_url?: string;
    } | null;
    try {
      response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      body = await response.json().catch(() => null);
    } catch (err) {
      console.error("Registration request failed:", err);
      setFormError(
        "We couldn't reach iWILL 'til I'm Well. Please check your connection and try again.",
      );
      setSubmitting(false);
      return;
    }

    if (response.ok) {
      // Account created: show a confirmation, then send the member to the iWILL
      // login screen to sign in with the email and password they just chose.
      const loginUrl = body?.redirect_url || LOGIN_URL;
      setRedirectUrl(loginUrl);
      window.setTimeout(
        () => window.location.assign(loginUrl),
        REDIRECT_DELAY_MS,
      );
      return;
    }

    setSubmitting(false);

    if (response.status === 409) {
      const fieldErrors = {
        email: body?.message ?? "An account with this email already exists.",
      };
      setErrors(fieldErrors);
      setEmailTaken(true);
      focusFirstError(fieldErrors);
      return;
    }

    if (response.status === 422 && body?.errors) {
      const fieldErrors: FormErrors = {};
      for (const [key, messages] of Object.entries(body.errors)) {
        if ((FIELD_ORDER as string[]).includes(key))
          fieldErrors[key as FieldName] = messages[0];
      }
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
      } else {
        setFormError(
          body.message ?? "Please check your details and try again.",
        );
      }
      return;
    }

    if (response.status === 429) {
      setFormError("Too many attempts. Please wait a minute and try again.");
      return;
    }

    setFormError(
      body?.message ??
        "Something went wrong creating your account. Please try again.",
    );
  };

  if (redirectUrl) {
    return (
      <section
        id="claim-form"
        className="section-padding bg-primary-50/50 scroll-mt-24"
        aria-labelledby="success-heading"
      >
        <div className="container-main">
          <div className="max-w-md mx-auto text-center" role="status">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle
                className="w-10 h-10 text-green-600"
                aria-hidden="true"
              />
            </div>
            <h2
              id="success-heading"
              className="text-3xl font-bold text-foreground mb-3"
            >
              Account created, {formData.fname.trim()}!
            </h2>
            <p className="text-gray-600">
              Affiliate code{" "}
              <strong className="text-primary tracking-wide">
                {PROMO_CODE}
              </strong>{" "}
              is applied. Log in with <strong>{formData.email.trim()}</strong>{" "}
              and the password you just chose to pick your plan.
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Taking you to the login page…
            </p>
            <Button asChild variant="accent" size="lg" className="mt-4">
              <a href={redirectUrl}>Log in now</a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      disabled={submitting}
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Eye className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <section
      id="claim-form"
      className="section-padding bg-primary-50/50 scroll-mt-24"
      aria-labelledby="form-heading"
    >
      <div className="container-main">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8" data-animate="fade-up">
            <h2
              id="form-heading"
              className="text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-3"
            >
              Claim your member rate
            </h2>
            <p className="text-gray-600">
              Create your iWILL &apos;til I&apos;m Well account — your NNVA
              affiliate code is already applied. You&apos;ll choose your plan
              right after.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-primary-100"
            noValidate
          >
            {formError && (
              <div
                className="flex items-start gap-3 mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field id="fname" label="First Name" error={errors.fname}>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={(e) => update("fname", e.target.value)}
                      onBlur={() => validateField("fname")}
                      className={inputClass(!!errors.fname)}
                      placeholder="Jane"
                      autoComplete="given-name"
                      maxLength={50}
                      aria-required="true"
                      aria-invalid={!!errors.fname}
                      aria-describedby={describedBy("fname")}
                      disabled={submitting}
                    />
                  </div>
                </Field>

                <Field id="lname" label="Last Name" error={errors.lname}>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      id="lname"
                      name="lname"
                      value={formData.lname}
                      onChange={(e) => update("lname", e.target.value)}
                      onBlur={() => validateField("lname")}
                      className={inputClass(!!errors.lname)}
                      placeholder="Smith"
                      autoComplete="family-name"
                      maxLength={50}
                      aria-required="true"
                      aria-invalid={!!errors.lname}
                      aria-describedby={describedBy("lname")}
                      disabled={submitting}
                    />
                  </div>
                </Field>
              </div>

              <div>
                <Field id="email" label="Email Address" error={errors.email}>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => validateField("email")}
                      className={inputClass(!!errors.email)}
                      placeholder="jane@email.com"
                      autoComplete="email"
                      maxLength={255}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={describedBy("email")}
                      disabled={submitting}
                    />
                  </div>
                </Field>
                {emailTaken && (
                  <a
                    href={LOGIN_URL}
                    className="inline-block mt-1 text-sm font-semibold text-primary underline underline-offset-2"
                  >
                    Log in to your existing account
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  id="primaryPhone"
                  label="Mobile Phone"
                  error={errors.primaryPhone}
                >
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type="tel"
                      id="primaryPhone"
                      name="primaryPhone"
                      value={formData.primaryPhone}
                      onChange={(e) => update("primaryPhone", e.target.value)}
                      onBlur={() => validateField("primaryPhone")}
                      className={inputClass(!!errors.primaryPhone)}
                      placeholder="(555) 123-4567"
                      autoComplete="tel-national"
                      inputMode="tel"
                      maxLength={17}
                      aria-required="true"
                      aria-invalid={!!errors.primaryPhone}
                      aria-describedby={describedBy("primaryPhone")}
                      disabled={submitting}
                    />
                  </div>
                </Field>

                <Field id="dob" label="Date of Birth" error={errors.dob}>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={(e) => update("dob", e.target.value)}
                      onBlur={() => validateField("dob")}
                      className={inputClass(!!errors.dob)}
                      min="1900-01-01"
                      max={maxDob}
                      autoComplete="bday"
                      aria-required="true"
                      aria-invalid={!!errors.dob}
                      aria-describedby={describedBy("dob")}
                      disabled={submitting}
                    />
                  </div>
                </Field>
              </div>

              <Field id="gender" label="Gender" error={errors.gender}>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      update("gender", e.target.value as FormData["gender"])
                    }
                    onBlur={() => validateField("gender")}
                    className={`${inputClass(!!errors.gender)} ${formData.gender ? "" : "text-gray-400"}`}
                    autoComplete="sex"
                    aria-required="true"
                    aria-invalid={!!errors.gender}
                    aria-describedby={describedBy("gender")}
                    disabled={submitting}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    <option value="m" className="text-foreground">
                      Male
                    </option>
                    <option value="f" className="text-foreground">
                      Female
                    </option>
                    <option value="o" className="text-foreground">
                      Other
                    </option>
                  </select>
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  id="password"
                  label="Password"
                  error={errors.password}
                  hint="8–20 characters, with at least one letter and one number."
                >
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => update("password", e.target.value)}
                      onBlur={() => validateField("password")}
                      className={`${inputClass(!!errors.password)} pr-11`}
                      autoComplete="new-password"
                      maxLength={20}
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby={describedBy("password", true)}
                      disabled={submitting}
                    />
                    {passwordToggle}
                  </div>
                </Field>

                <Field
                  id="password_confirmation"
                  label="Confirm Password"
                  error={errors.password_confirmation}
                >
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={(e) =>
                        update("password_confirmation", e.target.value)
                      }
                      onBlur={() => validateField("password_confirmation")}
                      className={`${inputClass(!!errors.password_confirmation)} pr-11`}
                      autoComplete="new-password"
                      maxLength={20}
                      aria-required="true"
                      aria-invalid={!!errors.password_confirmation}
                      aria-describedby={describedBy("password_confirmation")}
                      disabled={submitting}
                    />
                    {passwordToggle}
                  </div>
                </Field>
              </div>

              <div>
                <label
                  htmlFor="promoCode"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Affiliate Code
                </label>
                <div className="relative">
                  <Tag
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    value={PROMO_CODE}
                    readOnly
                    aria-describedby="promoCode-note"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-200 bg-primary-50 font-bold tracking-[0.15em] text-primary focus:outline-none"
                  />
                </div>
                <p id="promoCode-note" className="mt-1 text-xs text-gray-500">
                  Your NNVA affiliate code is applied automatically.
                </p>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={(e) => update("terms", e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 accent-primary"
                    aria-required="true"
                    aria-invalid={!!errors.terms}
                    aria-describedby={describedBy("terms")}
                    disabled={submitting}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 leading-5"
                  >
                    I agree to the{" "}
                    <a
                      href={TERMS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href={PRIVACY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>
                    .{" "}
                    <span className="text-primary" aria-hidden="true">
                      *
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <p
                    id="terms-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-8"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Creating your account...</span>
                </>
              ) : (
                "Create My Account"
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <a
                href={LOGIN_URL}
                className="font-semibold text-primary underline underline-offset-2"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
