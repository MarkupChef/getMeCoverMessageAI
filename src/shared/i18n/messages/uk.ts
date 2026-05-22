import type { Messages } from "./en";

const uk = {
  metadata: {
    title: "Project starter",
    description:
      "Стартер solo-user проєкту на Next.js і Supabase.",
  },
  common: {
    brand: "Project starter",
    language: "Мова",
    english: "English",
    ukrainian: "Українська",
  },
  siteHeader: {
    results: "Результати",
    pricing: "Ціни",
    plan: "План",
    signIn: "Увійти",
  },
  siteFooter: {
    privacy: "Політика конфіденційності",
    terms: "Умови користування",
    contact: "Контакт",
    email: "youemail@example.com",
  },
  userMenu: {
    profile: "Профіль",
    billing: "Білінг",
    settings: "Налаштування",
    signOut: "Вийти",
  },
  errors: {
    genericTitle: "Щось пішло не так",
    retry: "Спробувати знову",
    notFoundTitle: "Сторінку не знайдено",
    notFoundDescription: "Сторінка, яку ви шукаєте, не існує.",
    goHome: "На головну",
  },
  home: {
    nav: {
      signIn: "Увійти",
      createAccount: "Створити акаунт",
    },
    badge: "Next.js 16 + Supabase",
    title: "Твоя AI-фіча може бути тут",
    hero: {
      description:
        "Використовуйте перший екран як місце для головного AI-flow вашого продукту.",
    },
    description:
      "Цей стартер дає solo-user MVP базові частини веб-застосунку: auth, захищені маршрути, керування акаунтом, налаштування, валідацію, межі бази даних і точки розширення для майбутніх продуктових flow.",
    actions: {
      results: "Відкрити результати",
      auth: "Почати з автентифікації",
    },
    generator: {
      title: "Робоча область фічі",
      description:
        "Замініть цю заглушку основним flow вашої AI-фічі, інструмента або веб-застосунку.",
    },
    about: {
      badge: "Про стартер",
      title: "Практичний project starter для solo-user MVP веб-застосунків.",
    },
    howItWorks: {
      title: "Як це працює",
      description:
        "Налаштуйте environment, підключіть Supabase і починайте замінювати заглушки продуктовою логікою.",
      steps: {
        publicEnv: {
          title: "Додайте публічні змінні",
          description:
            "Налаштуйте публічні змінні для вашого Supabase-проєкту та локальної або production-адреси.",
        },
        serverEnv: {
          title: "Додайте server-only секрети",
          description:
            "Задайте server-only секрети для видалення акаунта, admin-cleanup і anti-abuse storage.",
        },
        supabase: {
          title: "Застосуйте базу Supabase",
          description:
            "Запустіть міграції, щоб profiles, billing placeholders, usage tracking, triggers і user-scoped RLS policies існували до додавання продуктових даних.",
        },
      },
    },
    footer: "Побудовано як solo-user project starter.",
    checklist: {
      title: "Чекліст шаблону",
      description:
        "Базові можливості застосунку готові для ваших продуктових slices.",
      items: {
        registration: "Реєстрація через email і пароль",
        signIn: "Вхід через email/password і вихід",
        google: "Вхід через Google OAuth",
        passwordRecovery: "Forgot і reset password flows",
        passwordChange: "Зміна пароля для email-акаунтів",
        accountDeletion: "Видалення акаунта з anti-abuse guard",
        protectedShell: "Захищений app layout",
        profile: "Профіль і дані акаунта",
        theme: "Світла, темна і системна тема",
        language: "Перемикання англійської та української мов",
        supabase: "Supabase Auth, Postgres і user-scoped RLS",
        forms: "Валідація через Zod і React Hook Form",
        i18n: "Локалізовані маршрути й messages через next-intl",
        extensions: "Заглушки billing, plan і results screen",
      },
    },
    stack: {
      title: "Стек",
      description:
        "Стартер використовує сучасний typed Next.js stack з локальними UI primitives і тестовою базою.",
      items: {
        next: {
          title: "Next.js 16 App Router",
          description: "File-system routing, server components, route handlers і proxy support.",
        },
        react: {
          title: "React 19",
          description: "Поточний React runtime для server і client components.",
        },
        typescript: {
          title: "TypeScript strict mode",
          description: "Типізований application code, schemas і Supabase database shapes.",
        },
        tailwind: {
          title: "TailwindCSS 4",
          description: "Token-based styling через app stylesheet.",
        },
        ui: {
          title: "Local shadcn-style UI",
          description: "Reusable components у src/shared/ui.",
        },
        supabase: {
          title: "Supabase SSR/Auth/Postgres",
          description: "Browser, server, proxy і admin helpers навколо Supabase.",
        },
        zod: {
          title: "Zod",
          description: "Runtime schemas з inferred TypeScript types.",
        },
        forms: {
          title: "React Hook Form",
          description: "Валідовані форми з @hookform/resolvers/zod.",
        },
        query: {
          title: "TanStack Query",
          description: "Client-side async state для майбутніх продуктових фіч.",
        },
        theme: {
          title: "next-themes",
          description: "Перемикання теми з persisted light, dark і system modes.",
        },
        i18n: {
          title: "next-intl",
          description: "Localized routes, navigation helpers і message dictionaries.",
        },
        testing: {
          title: "Vitest і Playwright",
          description: "Інструменти для unit, component і browser smoke tests.",
        },
      },
    },
  },
  pricing: {
    publicTitle: "Ціни",
    accountTitle: "План",
    description:
      "Почніть з безкоштовного плану й оновіть його, коли знадобиться більше лімітів.",
    period: "на місяць",
    stripePlaceholder: "Stripe Checkout буде підключено пізніше.",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        action: "Продовжити",
        features: {
          backgroundRemoval: "Обмежене видалення фону",
          upscale: "Обмежений upscale",
          export: "Безкоштовний експорт без водяного знака",
        },
      },
      pro: {
        name: "Pro",
        price: "$10",
        action: "Оновити",
        features: {
          credits: "600 AI-кредитів на місяць",
          models: "Доступ до всіх AI-моделей",
          backgroundRemoval: "Необмежене видалення фону",
          upscale: "Необмежений upscale",
          team: "Вищі ліміти workspace",
          batchExports: "1,000 batch-експортів на місяць",
          license: "Комерційна ліцензія",
        },
      },
    },
  },
  privacy: {
    title: "Політика конфіденційності",
    body: "тут буде текст вашої Політики конфіденційності",
  },
  terms: {
    title: "Умови користування",
    body: "тут буде текст ваших Умов користування",
  },
  results: {
    list: {
      title: "Результати",
      description: "Збережені AI-результати з'являться тут.",
      empty: {
        title: "Результатів ще немає",
        description: "Створіть свій перший результат.",
        action: "До генератора",
      },
    },
    detail: {
      title: "Результат",
      description: "Деталі збереженого результату з'являться тут.",
      empty: {
        title: "Результат не знайдено",
        description: "Цю заглушку буде підключено до збережених результатів пізніше.",
        action: "Назад до результатів",
      },
    },
  },
  settings: {
    title: "Налаштування",
    description: "Персоналізуйте вигляд і поведінку застосунку для свого акаунта.",
    appearance: {
      title: "Вигляд",
      description: "Оберіть візуальний режим для всього застосунку.",
      themeLabel: "Тема",
      themeDescription: "Використовуйте світлу, темну або системну тему.",
    },
    language: {
      title: "Мова",
      description: "Оберіть мову інтерфейсу для цього браузера.",
      languageLabel: "Мова інтерфейсу",
      languageDescription: "Перемикайтеся між підтримуваними мовами застосунку.",
    },
  },
  billing: {
    title: "Білінг",
    description:
      "Керуйте платіжними даними та рахунками після підключення білінгу.",
    empty: {
      title: "Білінг ще не налаштовано",
      description:
        "Платежі, рахунки та доступ до customer portal з'являться тут після додавання платіжної інтеграції.",
      action: "Переглянути план",
    },
  },
  profile: {
    title: "Профіль",
    description: "Керуйте даними акаунта та видаленням.",
    account: {
      title: "Дані акаунта",
      description: "Основні дані вашого поточного акаунта.",
      email: "Email",
      fullName: "Повне ім'я",
      emptyFullName: "Не вказано",
    },
    usage: {
      title: "Ліміти використання",
      description: "Безкоштовні генерації, прив'язані до цього акаунта.",
      free: "Безкоштовні генерації",
      value: "{used} / {limit}",
      unavailable: "Не налаштовано",
    },
    security: {
      title: "Пароль",
      description: "Змініть пароль для входу через email.",
      passwordUnavailable:
        "Зміна пароля доступна лише для акаунтів, створених через email і пароль.",
    },
    danger: {
      title: "Видалити акаунт",
      description: "Назавжди видалити акаунт і персональні дані профілю.",
      retentionNotice:
        "Ваш акаунт і персональні дані буде видалено. Деякі хешовані технічні дані можуть зберігатися до 180 днів, щоб запобігати зловживанням і повторному скиданню безкоштовних лімітів.",
    },
  },
  deleteAccount: {
    trigger: "Видалити акаунт",
    dialog: {
      title: "Видалити акаунт",
      description:
        "Цю дію не можна скасувати. Введіть email акаунта, щоб підтвердити видалення.",
      emailLabel: "Email акаунта",
      confirm: "Видалити акаунт",
    },
    validation: {
      emailRequired: "Введіть поточний email, щоб підтвердити видалення акаунта.",
      emailMismatch: "Email не збігається з поточним акаунтом.",
    },
    messages: {
      deleted: "Ваш акаунт видалено.",
      unableDelete: "Не вдалося видалити акаунт.",
    },
  },
  auth: {
    card: {
      signIn: {
        title: "Раді бачити знову",
        description: "Увійдіть, щоб продовжити роботу у workspace.",
        footerText: "Немає акаунта?",
        footerLabel: "Створити",
      },
      signUp: {
        title: "Створіть акаунт",
        description:
          "Почніть з особистого профілю. Product-specific фічі можна додати після базового налаштування.",
        footerText: "Уже маєте акаунт?",
        footerLabel: "Увійти",
      },
      forgotPassword: {
        title: "Скидання пароля",
        description: "Введіть email, і ми надішлемо інструкції для скидання.",
        footerText: "Згадали пароль?",
        footerLabel: "Увійти",
      },
      resetPassword: {
        title: "Оберіть новий пароль",
        description: "Використайте щонайменше 8 символів.",
        footerText: "Повернутися до",
        footerLabel: "входу",
      },
    },
    fields: {
      fullName: "Повне ім'я",
      email: "Email",
      password: "Пароль",
      currentPassword: "Поточний пароль",
      confirmPassword: "Підтвердьте пароль",
      newPassword: "Новий пароль",
      confirmNewPassword: "Підтвердьте новий пароль",
    },
    actions: {
      signIn: "Увійти",
      createAccount: "Створити акаунт",
      forgotPassword: "Забули пароль?",
      continueWithGoogle: "Продовжити з Google",
      sendResetLink: "Надіслати посилання",
      changePassword: "Змінити пароль",
      updatePassword: "Оновити пароль",
      close: "Закрити",
      togglePasswordVisibility: "Показати або приховати пароль",
    },
    validation: {
      emailRequired: "Email обов'язковий.",
      emailInvalid: "Введіть коректну email-адресу.",
      passwordRequired: "Пароль обов'язковий.",
      passwordMin: "Пароль має містити щонайменше 8 символів.",
      fullNameRequired: "Повне ім'я обов'язкове.",
      fullNameMin: "Повне ім'я має містити щонайменше 2 символи.",
      fullNameMax: "Повне ім'я має містити не більше 120 символів.",
      confirmPasswordRequired: "Підтвердьте пароль.",
      passwordsMismatch: "Паролі не збігаються.",
    },
    messages: {
      unableSignIn: "Не вдалося увійти.",
      unableCreateAccount: "Не вдалося створити акаунт. Спробуйте пізніше.",
      unableSendResetEmail: "Не вдалося надіслати лист для скидання.",
      unableUpdatePassword: "Не вдалося оновити пароль.",
      checkEmailPassword: "Перевірте email і пароль.",
      authNotConfigured: "Автентифікацію не налаштовано.",
      checkAccountDetails: "Перевірте надіслані дані акаунта.",
      confirmAccount:
        "Перевірте пошту. Якщо акаунт можна створити, ми надіслали лист для продовження.",
      googleNotConfigured: "Вхід через Google не налаштовано.",
      unableGoogle: "Не вдалося почати вхід через Google.",
      validEmail: "Введіть коректну email-адресу.",
      resetInstructions: "Інструкції для скидання пароля надіслано.",
      checkNewPassword: "Перевірте новий пароль.",
      signInRequired: "Увійдіть знову, щоб змінити пароль.",
      passwordUnavailable:
        "Зміна пароля доступна лише для акаунтів, створених через email і пароль.",
      passwordUpdated: "Пароль оновлено.",
      currentPasswordInvalid: "Поточний пароль неправильний.",
    },
    passwordDialog: {
      title: "Змінити пароль",
      description: "Введіть поточний пароль і оберіть новий.",
      successTitle: "Пароль оновлено",
      successDescription:
        "Ваш пароль змінено. Використовуйте новий пароль під час наступного входу.",
    },
  },
} as const satisfies Messages;

export default uk;
