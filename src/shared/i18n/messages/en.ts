const en = {
  metadata: {
    title: "Project starter",
    description:
      "A solo-user project starter built with Next.js and Supabase.",
  },
  common: {
    brand: "Project starter",
    language: "Language",
    english: "English",
    ukrainian: "Ukrainian",
  },
  siteHeader: {
    results: "Results",
    pricing: "Pricing",
    plan: "Plan",
    signIn: "Sign in",
    freeLimitLabel: "{limit} free uses without registration",
    freeCredits: "{count, plural, one {# credit} other {# credits}}",
    creditsLoading: "Loading credits",
    freeCreditsUnavailable: "Credits unavailable",
  },
  siteFooter: {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact",
    email: "youemail@example.com",
  },
  userMenu: {
    profile: "Profile",
    billing: "Billing",
    settings: "Settings",
    signOut: "Sign out",
  },
  errors: {
    genericTitle: "Something went wrong",
    retry: "Try again",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you are looking for does not exist.",
    goHome: "Go home",
  },
  anonymousUsage: {
    useLimit: "Generate",
    upgrade: "Upgrade Plan",
    createAccount: "Create account",
    remaining:
      "{remaining, plural, one {# free credit left.} other {# free credits left.}}",
    exhausted: "Your free credits have ended.",
    signupRequired: "Create an account or sign in to continue.",
    unavailable: "Free usage is unavailable right now. Try again later.",
  },
  home: {
    nav: {
      signIn: "Sign in",
      createAccount: "Create account",
    },
    badge: "Next.js 16 + Supabase",
    title: "Your AI feature can be here",
    hero: {
      description:
        "Use this first screen as the place where your product's core AI workflow will live.",
    },
    description:
      "This starter gives a solo-user MVP the baseline web-app pieces: auth, protected routes, account controls, settings, validation, database boundaries, and extension points for future product flows.",
    actions: {
      results: "Open results",
      auth: "Start with auth",
    },
    generator: {
      title: "Your feature workspace",
      description:
        "Replace this placeholder with the main flow for your AI feature, tool, or application workflow.",
    },
    about: {
      badge: "About starter",
      title: "A practical project starter for solo-user MVP web apps.",
    },
    howItWorks: {
      title: "How it works",
      description:
        "Configure the environment, connect Supabase, and start replacing placeholders with your product logic.",
      steps: {
        publicEnv: {
          title: "Set public app variables",
          description:
            "Add the public variables that point the app at your Supabase project and local or deployed URL.",
        },
        serverEnv: {
          title: "Add server-only secrets",
          description:
            "Set the server-only secrets for account deletion, admin-side cleanup, and anti-abuse storage.",
        },
        supabase: {
          title: "Apply the Supabase baseline",
          description:
            "Run the migrations so profiles, billing placeholders, usage tracking, triggers, and user-scoped RLS policies exist before real product data is added.",
        },
      },
    },
    footer: "Built as a solo-user project starter.",
    checklist: {
      title: "Scaffold checklist",
      description:
        "Core app capabilities ready for your product-specific slices.",
      items: {
        registration: "Email/password registration",
        signIn: "Email/password sign in and sign out",
        google: "Google OAuth sign in",
        passwordRecovery: "Forgot and reset password flows",
        passwordChange: "Password change for email accounts",
        accountDeletion: "Account deletion with anti-abuse guard",
        anonymousUsageLimits: "Anonymous free-credit limits",
        protectedShell: "Protected application layout",
        profile: "Profile and account details",
        theme: "Light, dark, and system theme",
        language: "English and Ukrainian language switching",
        supabase: "Supabase Auth, Postgres, and user-scoped RLS",
        forms: "Zod and React Hook Form validation",
        i18n: "Localized routing and messages with next-intl",
        extensions: "Placeholder billing, plan, and results screens",
      },
    },
    stack: {
      title: "Stack",
      description:
        "The starter uses a modern typed Next.js stack with local UI primitives and test coverage.",
      items: {
        next: {
          title: "Next.js 16 App Router",
          description: "File-system routing, server components, route handlers, and proxy support.",
        },
        react: {
          title: "React 19",
          description: "Current React runtime for server and client components.",
        },
        typescript: {
          title: "TypeScript strict mode",
          description: "Typed application code, schemas, and Supabase database shapes.",
        },
        tailwind: {
          title: "TailwindCSS 4",
          description: "Token-based styling through the app stylesheet.",
        },
        ui: {
          title: "Local shadcn-style UI",
          description: "Reusable components stored in src/shared/ui.",
        },
        supabase: {
          title: "Supabase SSR/Auth/Postgres",
          description: "Browser, server, proxy, and admin helpers around Supabase.",
        },
        zod: {
          title: "Zod",
          description: "Runtime schemas with inferred TypeScript types.",
        },
        forms: {
          title: "React Hook Form",
          description: "Validated forms with @hookform/resolvers/zod.",
        },
        query: {
          title: "TanStack Query",
          description: "Client-side async state when product features need it.",
        },
        theme: {
          title: "next-themes",
          description: "Theme switching with persisted light, dark, and system modes.",
        },
        i18n: {
          title: "next-intl",
          description: "Localized routes, navigation helpers, and message dictionaries.",
        },
        testing: {
          title: "Vitest and Playwright",
          description: "Unit, component, and browser smoke test tooling.",
        },
      },
    },
  },
  pricing: {
    publicTitle: "Pricing",
    accountTitle: "Plan",
    description:
      "Start with the free plan and upgrade when you need more usage.",
    period: "per month",
    stripePlaceholder: "Stripe checkout will be connected later.",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        action: "Continue",
        features: {
          backgroundRemoval: "Limited Background Removal",
          upscale: "Limited Upscale",
          export: "Free export without watermark",
        },
      },
      pro: {
        name: "Pro",
        price: "$10",
        action: "Upgrade",
        features: {
          credits: "600 AI Credits Monthly",
          models: "Access all AI models",
          backgroundRemoval: "Unlimited Background Removal",
          upscale: "Unlimited Upscale",
          team: "Higher workspace limits",
          batchExports: "1,000 Batch Exports Monthly",
          license: "Commercial license",
        },
      },
    },
  },
  privacy: {
    title: "Privacy Policy",
    body: "your Privacy Policy text here",
  },
  terms: {
    title: "Terms of Service",
    body: "your Terms of Service text here",
  },
  results: {
    list: {
      title: "Results",
      description: "Saved AI results will appear here.",
      empty: {
        title: "No results yet",
        description: "Create your first result.",
        action: "Go to generator",
      },
    },
    detail: {
      title: "Result",
      description: "Saved result details will appear here.",
      empty: {
        title: "No result found",
        description: "This placeholder will be connected to saved results later.",
        action: "Back to results",
      },
    },
  },
  settings: {
    title: "Settings",
    description: "Personalize how the app looks and behaves for your account.",
    appearance: {
      title: "Appearance",
      description: "Choose the visual mode used across the app.",
      themeLabel: "Theme",
      themeDescription: "Use light, dark, or your system preference.",
    },
    language: {
      title: "Language",
      description: "Choose the interface language for this browser.",
      languageLabel: "Display language",
      languageDescription: "Switch between supported app languages.",
    },
  },
  billing: {
    title: "Billing",
    description:
      "Manage payment details and invoices after billing is connected.",
    empty: {
      title: "Billing is not configured yet",
      description:
        "Payments, invoices, and customer portal access will appear here after the payment integration is added.",
      action: "View plan",
    },
  },
  profile: {
    title: "Profile",
    description: "Manage your account details and deletion controls.",
    account: {
      title: "Account details",
      description: "Basic details from your signed-in account.",
      email: "Email",
      fullName: "Full name",
      emptyFullName: "Not set",
    },
    usage: {
      title: "Usage limits",
      description: "Free generation usage attached to this account.",
      free: "Free generations",
      value: "{used} / {limit}",
      unavailable: "Not configured",
    },
    security: {
      title: "Password",
      description: "Change the password used to sign in with email.",
      passwordUnavailable:
        "Password changes are available only for accounts created with email and password.",
    },
    danger: {
      title: "Delete account",
      description:
        "Permanently delete your account and personal profile data.",
      retentionNotice:
        "Your account and personal data will be deleted. Some hashed technical data may be retained for up to 180 days to prevent abuse and repeated free-limit resets.",
    },
  },
  deleteAccount: {
    trigger: "Delete account",
    dialog: {
      title: "Delete account",
      description:
        "This action cannot be undone. Type your account email to confirm deletion.",
      emailLabel: "Account email",
      confirm: "Delete account",
    },
    validation: {
      emailRequired: "Enter your current email to confirm account deletion.",
      emailMismatch: "The email does not match the signed-in account.",
    },
    messages: {
      deleted: "Your account has been deleted.",
      unableDelete: "Unable to delete account.",
    },
  },
  auth: {
    card: {
      signIn: {
        title: "Welcome back",
        description: "Sign in to continue to your workspace.",
        footerText: "No account?",
        footerLabel: "Create one",
      },
      signUp: {
        title: "Create your account",
        description:
          "Start with a personal profile. Product-specific features can be added after setup.",
        footerText: "Already have an account?",
        footerLabel: "Sign in",
      },
      forgotPassword: {
        title: "Reset password",
        description: "Enter your email and we will send reset instructions.",
        footerText: "Remembered it?",
        footerLabel: "Sign in",
      },
      resetPassword: {
        title: "Choose a new password",
        description: "Use at least 8 characters.",
        footerText: "Back to",
        footerLabel: "sign in",
      },
    },
    fields: {
      fullName: "Full name",
      email: "Email",
      password: "Password",
      currentPassword: "Current password",
      confirmPassword: "Confirm password",
      newPassword: "New password",
      confirmNewPassword: "Confirm new password",
    },
    actions: {
      signIn: "Sign in",
      createAccount: "Create account",
      forgotPassword: "Forgot password?",
      continueWithGoogle: "Continue with Google",
      sendResetLink: "Send reset link",
      changePassword: "Change password",
      updatePassword: "Update password",
      close: "Close",
      togglePasswordVisibility: "Show or hide password",
    },
    validation: {
      emailRequired: "Email is required.",
      emailInvalid: "Enter a valid email address.",
      passwordRequired: "Password is required.",
      passwordMin: "Password must be at least 8 characters.",
      fullNameRequired: "Full name is required.",
      fullNameMin: "Full name must be at least 2 characters.",
      fullNameMax: "Full name must be 120 characters or fewer.",
      confirmPasswordRequired: "Confirm your password.",
      passwordsMismatch: "Passwords do not match.",
    },
    messages: {
      unableSignIn: "Unable to sign in.",
      unableCreateAccount: "Unable to create account. Try again later.",
      unableSendResetEmail: "Unable to send reset email.",
      unableUpdatePassword: "Unable to update password.",
      checkEmailPassword: "Check your email and password.",
      authNotConfigured: "Authentication is not configured.",
      checkAccountDetails: "Check the submitted account details.",
      confirmAccount:
        "Check your inbox. If an account can be created, we sent an email to continue.",
      googleNotConfigured: "Google sign in is not configured.",
      unableGoogle: "Unable to start Google sign in.",
      validEmail: "Enter a valid email address.",
      resetInstructions: "Password reset instructions were sent.",
      checkNewPassword: "Check the new password.",
      signInRequired: "Sign in again to change your password.",
      passwordUnavailable:
        "Password changes are available only for accounts created with email and password.",
      passwordUpdated: "Password updated.",
      currentPasswordInvalid: "Current password is invalid.",
    },
    passwordDialog: {
      title: "Change password",
      description: "Enter your current password and choose a new one.",
      successTitle: "Password updated",
      successDescription:
        "Your password has been changed. Use the new password the next time you sign in.",
    },
  },
} as const;

export default en;

type WidenMessages<T> = T extends string
  ? string
  : { readonly [Key in keyof T]: WidenMessages<T[Key]> };

export type Messages = WidenMessages<typeof en>;
