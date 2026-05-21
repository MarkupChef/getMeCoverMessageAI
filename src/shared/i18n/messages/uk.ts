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
    title: "Тут буде ваш AI-генератор.",
    hero: {
      description:
        "Починайте з продуктового інтерфейсу. Маркетингові та SEO-блоки залишаються нижче робочої області.",
    },
    description:
      "Автентифікація, підписки, валідація, макет і межі бази даних уже налаштовані, щоб продуктові функції можна було додавати без перебудови застосунку.",
    actions: {
      results: "Відкрити результати",
      auth: "Почати з автентифікації",
    },
    generator: {
      title: "Тут буде генератор",
      description:
        "Ця заглушка резервує робочу область першого екрана для майбутнього AI-flow.",
    },
    about: {
      badge: "Про продукт",
      title: "Масштабована SaaS-основа, де рутинні частини вже підключені.",
    },
    howItWorks: {
      title: "Як це працює",
      description: "Фінальний продуктовий flow залишиться простим і прямим.",
      steps: {
        open: {
          title: "Відкрийте генератор",
          description: "Користувач одразу потрапляє в продуктовий інтерфейс.",
        },
        generate: {
          title: "Згенеруйте preview",
          description: "Введіть дані й перегляньте AI-результат до збереження.",
        },
        save: {
          title: "Збережіть після входу",
          description: "Збережені результати будуть у захищеному розділі Results.",
        },
      },
    },
    footer: "Побудовано як shell для solo-user AI SaaS.",
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
          team: "Команда з 3 людей",
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
