const en = {
  metadata: {
    title: "SaaS Starter",
    description: "A scalable SaaS scaffold built with Next.js and Supabase.",
  },
  common: {
    brand: "SaaS Starter",
    language: "Language",
    english: "English",
    ukrainian: "Ukrainian",
  },
  errors: {
    genericTitle: "Something went wrong",
    retry: "Try again",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you are looking for does not exist.",
    goHome: "Go home",
  },
  home: {
    nav: {
      signIn: "Sign in",
      createAccount: "Create account",
    },
    badge: "Next.js 16 + Supabase",
    title: "A scalable SaaS foundation with the boring parts already wired.",
    description:
      "Auth, subscriptions, validation, layout, and database boundaries are in place so product features can be added without reshaping the app.",
    actions: {
      dashboard: "Open dashboard",
      auth: "Start with auth",
    },
    checklist: {
      title: "Scaffold checklist",
      description: "Core SaaS capabilities ready for product-specific slices.",
      items: {
        auth: "Supabase SSR auth",
        model: "User-scoped data model",
        forms: "Zod validated forms",
        fsd: "Feature-Sliced Design",
      },
    },
  },
  dashboard: {
    shell: {
      tagline: "Production-ready SaaS foundation",
      navigation: "Navigation",
      openNavigation: "Open navigation",
    },
    sidebar: {
      overview: "Overview",
      analytics: "Analytics",
      profile: "Profile",
      billing: "Billing",
      settings: "Settings",
    },
    userMenu: {
      profile: "Profile",
      settings: "Settings",
      signOut: "Sign out",
    },
    page: {
      badge: "Protected route",
      title: "Dashboard",
      description:
        "This shell is ready for product widgets, analytics, and user-scoped data.",
      stats: {
        usage: {
          label: "Usage events",
          value: "0",
          note: "Connect product events later",
        },
        account: {
          label: "Account",
          value: "1",
          note: "User-scoped data with RLS",
        },
        plan: {
          label: "Plan",
          value: "Free",
          note: "Billing placeholder",
        },
      },
      targets: {
        title: "Next implementation targets",
        description: "Add real feature slices without changing the foundation.",
        productEntities: "Connect product-specific entities",
        profileSettings: "Add account profile settings",
        stripe: "Add Stripe checkout and webhooks",
        usage: "Track usage and subscription state",
      },
    },
  },
  settings: {
    title: "Settings",
    description: "Account and billing settings placeholders.",
    account: {
      title: "Account",
      description: "Profile and personal workspace settings.",
      typeLabel: "Account type",
      typeValue: "Individual",
      note: "Profile updates will stay scoped to the signed-in user.",
    },
    billing: {
      title: "Billing",
      description: "Stripe extension point, not integrated yet.",
      statusLabel: "Subscription status",
      statusValue: "Not configured",
      note: "Add Checkout, Customer Portal, and webhooks when pricing is defined.",
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
        description: "Start with a personal profile. Teams are created inside the app.",
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
      updatePassword: "Update password",
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
    },
  },
} as const;

export default en;

type WidenMessages<T> = T extends string
  ? string
  : { readonly [Key in keyof T]: WidenMessages<T[Key]> };

export type Messages = WidenMessages<typeof en>;
