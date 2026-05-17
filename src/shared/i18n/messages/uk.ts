import type { Messages } from "./en";

const uk = {
  metadata: {
    title: "SaaS Starter",
    description: "Масштабований SaaS-шаблон на Next.js і Supabase.",
  },
  common: {
    brand: "SaaS Starter",
    language: "Мова",
    english: "English",
    ukrainian: "Українська",
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
    title: "Масштабована SaaS-основа, де рутинні частини вже підключені.",
    description:
      "Автентифікація, підписки, валідація, макет і межі бази даних уже налаштовані, щоб продуктові функції можна було додавати без перебудови застосунку.",
    actions: {
      dashboard: "Відкрити панель",
      auth: "Почати з автентифікації",
    },
    checklist: {
      title: "Чекліст шаблону",
      description: "Базові SaaS-можливості готові для продуктових slices.",
      items: {
        auth: "Supabase SSR auth",
        model: "Модель даних у межах користувача",
        forms: "Форми з валідацією Zod",
        fsd: "Feature-Sliced Design",
      },
    },
  },
  dashboard: {
    shell: {
      tagline: "Production-ready SaaS foundation",
      navigation: "Навігація",
      openNavigation: "Відкрити навігацію",
    },
    sidebar: {
      overview: "Огляд",
      analytics: "Аналітика",
      profile: "Профіль",
      billing: "Білінг",
      settings: "Налаштування",
    },
    userMenu: {
      profile: "Профіль",
      settings: "Налаштування",
      signOut: "Вийти",
    },
    page: {
      badge: "Захищений маршрут",
      title: "Панель",
      description:
        "Ця оболонка готова для продуктових віджетів, аналітики та даних у межах користувача.",
      stats: {
        usage: {
          label: "Події використання",
          value: "0",
          note: "Підключіть продуктові події пізніше",
        },
        account: {
          label: "Акаунт",
          value: "1",
          note: "Дані користувача захищені RLS",
        },
        plan: {
          label: "План",
          value: "Free",
          note: "Заготовка для білінгу",
        },
      },
      targets: {
        title: "Наступні цілі реалізації",
        description: "Додавайте реальні feature slices без зміни основи.",
        productEntities: "Підключити продуктові entities",
        profileSettings: "Додати налаштування профілю акаунта",
        stripe: "Додати Stripe Checkout і webhooks",
        usage: "Відстежувати використання та стан підписки",
      },
    },
  },
  settings: {
    title: "Налаштування",
    description: "Заготовки налаштувань акаунта та білінгу.",
    account: {
      title: "Акаунт",
      description: "Налаштування профілю та особистого workspace.",
      typeLabel: "Тип акаунта",
      typeValue: "Індивідуальний",
      note: "Оновлення профілю залишатимуться в межах поточного користувача.",
    },
    billing: {
      title: "Білінг",
      description: "Точка розширення Stripe, інтеграція ще не підключена.",
      statusLabel: "Статус підписки",
      statusValue: "Не налаштовано",
      note: "Додайте Checkout, Customer Portal і webhooks після визначення цін.",
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
        description: "Почніть з особистого профілю. Команди створюються всередині застосунку.",
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
      updatePassword: "Оновити пароль",
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
      unableCreateAccount: "Не вдалося створити акаунт.",
      unableSendResetEmail: "Не вдалося надіслати лист для скидання.",
      unableUpdatePassword: "Не вдалося оновити пароль.",
      checkEmailPassword: "Перевірте email і пароль.",
      authNotConfigured: "Автентифікацію не налаштовано.",
      checkAccountDetails: "Перевірте надіслані дані акаунта.",
      confirmAccount: "Перевірте пошту, щоб підтвердити акаунт.",
      googleNotConfigured: "Вхід через Google не налаштовано.",
      unableGoogle: "Не вдалося почати вхід через Google.",
      validEmail: "Введіть коректну email-адресу.",
      resetInstructions: "Інструкції для скидання пароля надіслано.",
      checkNewPassword: "Перевірте новий пароль.",
    },
  },
} as const satisfies Messages;

export default uk;
