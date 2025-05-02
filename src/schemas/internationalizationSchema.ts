import { z } from "zod";

// Define available languages
export const availableLanguages = [
  { code: "en", name: "English" },
  { code: "id", name: "Indonesia" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
] as const;

export type LanguageCode = (typeof availableLanguages)[number]["code"];

// Generic form field interface with translations
export interface I18nField {
  name: string;
  type: "text" | "email" | "select" | "checkbox" | "radio" | "textarea";
  required: boolean;
  translations: Record<
    LanguageCode,
    {
      label: string;
      placeholder?: string;
      errorMessage?: string;
      options?: { label: string; value: string }[];
    }
  >;
}

// Form schema
export const createI18nSchema = (language: LanguageCode) => {
  const nameSchema = z
    .string()
    .min(2, getErrorMessages(language, "nameMin"))
    .max(50, getErrorMessages(language, "nameMax"));

  const emailSchema = z
    .string()
    .email(getErrorMessages(language, "invalidEmail"));

  const phoneSchema = z
    .string()
    .regex(/^\+?[0-9\s\-()]+$/, getErrorMessages(language, "invalidPhone"))
    .optional();

  const messageSchema = z
    .string()
    .min(10, getErrorMessages(language, "messageMin"))
    .max(500, getErrorMessages(language, "messageMax"));

  const preferredContactSchema = z.enum(["email", "phone"]);

  const termsSchema = z.boolean().refine((val) => val === true, {
    message: getErrorMessages(language, "termsRequired"),
  });

  return z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    message: messageSchema,
    preferredContact: preferredContactSchema,
    terms: termsSchema,
  });
};

export type I18nFormData = z.infer<ReturnType<typeof createI18nSchema>>;

// Error messages in different languages
const errorMessages: Record<string, Record<LanguageCode, string>> = {
  nameMin: {
    en: "Name must be at least 2 characters",
    id: "Nama minimal harus 2 karakter",
    es: "El nombre debe tener al menos 2 caracteres",
    fr: "Le nom doit comporter au moins 2 caractères",
    de: "Der Name muss mindestens 2 Zeichen lang sein",
    ja: "名前は2文字以上である必要があります",
    zh: "名字至少需要2个字符",
  },
  nameMax: {
    en: "Name must not exceed 50 characters",
    id: "Nama tidak boleh lebih dari 50 karakter",
    es: "El nombre no debe exceder los 50 caracteres",
    fr: "Le nom ne doit pas dépasser 50 caractères",
    de: "Der Name darf 50 Zeichen nicht überschreiten",
    ja: "名前は50文字を超えてはいけません",
    zh: "名字不能超过50个字符",
  },
  invalidEmail: {
    en: "Please enter a valid email address",
    id: "Masukkan alamat email yang valid",
    es: "Por favor introduce una dirección de correo electrónico válida",
    fr: "Veuillez entrer une adresse e-mail valide",
    de: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    ja: "有効なメールアドレスを入力してください",
    zh: "请输入有效的电子邮件地址",
  },
  invalidPhone: {
    en: "Please enter a valid phone number",
    id: "Masukkan nomor telepon yang valid",
    es: "Por favor ingrese un número de teléfono válido",
    fr: "Veuillez entrer un numéro de téléphone valide",
    de: "Bitte geben Sie eine gültige Telefonnummer ein",
    ja: "有効な電話番号を入力してください",
    zh: "请输入有效的电话号码",
  },
  messageMin: {
    en: "Message must be at least 10 characters",
    id: "Pesan minimal harus 10 karakter",
    es: "El mensaje debe tener al menos 10 caracteres",
    fr: "Le message doit comporter au moins 10 caractères",
    de: "Die Nachricht muss mindestens 10 Zeichen lang sein",
    ja: "メッセージは10文字以上である必要があります",
    zh: "消息至少需要10个字符",
  },
  messageMax: {
    en: "Message must not exceed 500 characters",
    id: "Pesan tidak boleh lebih dari 500 karakter",
    es: "El mensaje no debe exceder los 500 caracteres",
    fr: "Le message ne doit pas dépasser 500 caractères",
    de: "Die Nachricht darf 500 Zeichen nicht überschreiten",
    ja: "メッセージは500文字を超えてはいけません",
    zh: "消息不能超过500个字符",
  },
  termsRequired: {
    en: "You must accept the terms and conditions",
    id: "Anda harus menyetujui syarat dan ketentuan",
    es: "Debes aceptar los términos y condiciones",
    fr: "Vous devez accepter les termes et conditions",
    de: "Sie müssen die Allgemeinen Geschäftsbedingungen akzeptieren",
    ja: "利用規約に同意する必要があります",
    zh: "您必须接受条款和条件",
  },
};

// Helper function to get error messages
export function getErrorMessages(language: LanguageCode, key: string): string {
  return errorMessages[key][language] || errorMessages[key]["en"];
}

// Form fields with translations
export const formFields: I18nField[] = [
  {
    name: "name",
    type: "text",
    required: true,
    translations: {
      en: {
        label: "Full Name",
        placeholder: "Enter your full name",
        errorMessage: "Name is required",
      },
      id: {
        label: "Nama Lengkap",
        placeholder: "Masukkan nama lengkap Anda",
        errorMessage: "Nama wajib diisi",
      },
      es: {
        label: "Nombre Completo",
        placeholder: "Ingrese su nombre completo",
        errorMessage: "El nombre es obligatorio",
      },
      fr: {
        label: "Nom Complet",
        placeholder: "Entrez votre nom complet",
        errorMessage: "Le nom est requis",
      },
      de: {
        label: "Vollständiger Name",
        placeholder: "Geben Sie Ihren vollständigen Namen ein",
        errorMessage: "Name ist erforderlich",
      },
      ja: {
        label: "氏名",
        placeholder: "氏名を入力してください",
        errorMessage: "名前は必須です",
      },
      zh: {
        label: "全名",
        placeholder: "输入您的全名",
        errorMessage: "名字是必需的",
      },
    },
  },
  {
    name: "email",
    type: "email",
    required: true,
    translations: {
      en: {
        label: "Email Address",
        placeholder: "Enter your email address",
        errorMessage: "Email is required",
      },
      id: {
        label: "Alamat Email",
        placeholder: "Masukkan alamat email Anda",
        errorMessage: "Email wajib diisi",
      },
      es: {
        label: "Correo Electrónico",
        placeholder: "Ingrese su correo electrónico",
        errorMessage: "El correo electrónico es obligatorio",
      },
      fr: {
        label: "Adresse Email",
        placeholder: "Entrez votre adresse email",
        errorMessage: "L'email est requis",
      },
      de: {
        label: "E-Mail-Adresse",
        placeholder: "Geben Sie Ihre E-Mail-Adresse ein",
        errorMessage: "E-Mail ist erforderlich",
      },
      ja: {
        label: "メールアドレス",
        placeholder: "メールアドレスを入力してください",
        errorMessage: "メールは必須です",
      },
      zh: {
        label: "电子邮件地址",
        placeholder: "输入您的电子邮件地址",
        errorMessage: "电子邮件是必需的",
      },
    },
  },
  {
    name: "phone",
    type: "text",
    required: false,
    translations: {
      en: {
        label: "Phone Number",
        placeholder: "Enter your phone number (optional)",
      },
      id: {
        label: "Nomor Telepon",
        placeholder: "Masukkan nomor telepon Anda (opsional)",
      },
      es: {
        label: "Número de Teléfono",
        placeholder: "Ingrese su número de teléfono (opcional)",
      },
      fr: {
        label: "Numéro de Téléphone",
        placeholder: "Entrez votre numéro de téléphone (facultatif)",
      },
      de: {
        label: "Telefonnummer",
        placeholder: "Geben Sie Ihre Telefonnummer ein (optional)",
      },
      ja: {
        label: "電話番号",
        placeholder: "電話番号を入力してください（任意）",
      },
      zh: {
        label: "电话号码",
        placeholder: "输入您的电话号码（可选）",
      },
    },
  },
  {
    name: "preferredContact",
    type: "radio",
    required: true,
    translations: {
      en: {
        label: "Preferred Contact Method",
        options: [
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
        ],
      },
      id: {
        label: "Metode Kontak Pilihan",
        options: [
          { label: "Email", value: "email" },
          { label: "Telepon", value: "phone" },
        ],
      },
      es: {
        label: "Método de Contacto Preferido",
        options: [
          { label: "Correo electrónico", value: "email" },
          { label: "Teléfono", value: "phone" },
        ],
      },
      fr: {
        label: "Méthode de Contact Préférée",
        options: [
          { label: "Email", value: "email" },
          { label: "Téléphone", value: "phone" },
        ],
      },
      de: {
        label: "Bevorzugte Kontaktmethode",
        options: [
          { label: "E-Mail", value: "email" },
          { label: "Telefon", value: "phone" },
        ],
      },
      ja: {
        label: "希望する連絡方法",
        options: [
          { label: "メール", value: "email" },
          { label: "電話", value: "phone" },
        ],
      },
      zh: {
        label: "首选联系方式",
        options: [
          { label: "电子邮件", value: "email" },
          { label: "电话", value: "phone" },
        ],
      },
    },
  },
  {
    name: "message",
    type: "textarea",
    required: true,
    translations: {
      en: {
        label: "Message",
        placeholder: "Enter your message",
        errorMessage: "Message is required",
      },
      id: {
        label: "Pesan",
        placeholder: "Masukkan pesan Anda",
        errorMessage: "Pesan wajib diisi",
      },
      es: {
        label: "Mensaje",
        placeholder: "Ingrese su mensaje",
        errorMessage: "El mensaje es obligatorio",
      },
      fr: {
        label: "Message",
        placeholder: "Entrez votre message",
        errorMessage: "Le message est requis",
      },
      de: {
        label: "Nachricht",
        placeholder: "Geben Sie Ihre Nachricht ein",
        errorMessage: "Nachricht ist erforderlich",
      },
      ja: {
        label: "メッセージ",
        placeholder: "メッセージを入力してください",
        errorMessage: "メッセージは必須です",
      },
      zh: {
        label: "消息",
        placeholder: "输入您的消息",
        errorMessage: "消息是必需的",
      },
    },
  },
  {
    name: "terms",
    type: "checkbox",
    required: true,
    translations: {
      en: {
        label: "I accept the terms and conditions",
        errorMessage: "You must accept the terms and conditions",
      },
      id: {
        label: "Saya menyetujui syarat dan ketentuan",
        errorMessage: "Anda harus menyetujui syarat dan ketentuan",
      },
      es: {
        label: "Acepto los términos y condiciones",
        errorMessage: "Debe aceptar los términos y condiciones",
      },
      fr: {
        label: "J'accepte les termes et conditions",
        errorMessage: "Vous devez accepter les termes et conditions",
      },
      de: {
        label: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen",
        errorMessage:
          "Sie müssen die Allgemeinen Geschäftsbedingungen akzeptieren",
      },
      ja: {
        label: "利用規約に同意します",
        errorMessage: "利用規約に同意する必要があります",
      },
      zh: {
        label: "我接受条款和条件",
        errorMessage: "您必须接受条款和条件",
      },
    },
  },
];

// UI translations
export const uiTranslations: Record<
  LanguageCode,
  {
    formTitle: string;
    formDescription: string;
    submitButton: string;
    resetButton: string;
    successMessage: string;
    successDescription: string;
    formDataLabel: string;
    changeLanguage: string;
    fillSampleData: string;
  }
> = {
  en: {
    formTitle: "Contact Us",
    formDescription: "Please fill out the form below to get in touch with us.",
    submitButton: "Submit",
    resetButton: "Reset",
    successMessage: "Form Submitted Successfully!",
    successDescription:
      "Thank you for contacting us. We will get back to you soon.",
    formDataLabel: "Submitted Data:",
    changeLanguage: "Change Language",
    fillSampleData: "Fill with sample data",
  },
  id: {
    formTitle: "Hubungi Kami",
    formDescription:
      "Silakan isi formulir di bawah ini untuk menghubungi kami.",
    submitButton: "Kirim",
    resetButton: "Reset",
    successMessage: "Formulir Berhasil Dikirim!",
    successDescription:
      "Terima kasih telah menghubungi kami. Kami akan segera menghubungi Anda kembali.",
    formDataLabel: "Data yang Dikirim:",
    changeLanguage: "Ganti Bahasa",
    fillSampleData: "Isi dengan data contoh",
  },
  es: {
    formTitle: "Contáctenos",
    formDescription:
      "Por favor, complete el siguiente formulario para ponerse en contacto con nosotros.",
    submitButton: "Enviar",
    resetButton: "Reiniciar",
    successMessage: "¡Formulario Enviado con Éxito!",
    successDescription:
      "Gracias por contactarnos. Nos pondremos en contacto con usted pronto.",
    formDataLabel: "Datos Enviados:",
    changeLanguage: "Cambiar Idioma",
    fillSampleData: "Completar con datos de ejemplo",
  },
  fr: {
    formTitle: "Contactez-nous",
    formDescription:
      "Veuillez remplir le formulaire ci-dessous pour nous contacter.",
    submitButton: "Soumettre",
    resetButton: "Réinitialiser",
    successMessage: "Formulaire Soumis avec Succès!",
    successDescription:
      "Merci de nous avoir contactés. Nous vous répondrons bientôt.",
    formDataLabel: "Données Soumises:",
    changeLanguage: "Changer de Langue",
    fillSampleData: "Remplir avec des données d'exemple",
  },
  de: {
    formTitle: "Kontaktieren Sie Uns",
    formDescription:
      "Bitte füllen Sie das untenstehende Formular aus, um mit uns in Kontakt zu treten.",
    submitButton: "Absenden",
    resetButton: "Zurücksetzen",
    successMessage: "Formular Erfolgreich Übermittelt!",
    successDescription:
      "Vielen Dank für Ihre Kontaktaufnahme. Wir werden uns in Kürze bei Ihnen melden.",
    formDataLabel: "Übermittelte Daten:",
    changeLanguage: "Sprache Ändern",
    fillSampleData: "Mit Beispieldaten ausfüllen",
  },
  ja: {
    formTitle: "お問い合わせ",
    formDescription: "以下のフォームに記入して、私たちに連絡してください。",
    submitButton: "送信",
    resetButton: "リセット",
    successMessage: "フォームが正常に送信されました！",
    successDescription:
      "お問い合わせいただきありがとうございます。まもなくご連絡いたします。",
    formDataLabel: "送信データ：",
    changeLanguage: "言語を変更",
    fillSampleData: "サンプルデータを入力",
  },
  zh: {
    formTitle: "联系我们",
    formDescription: "请填写下面的表格与我们联系。",
    submitButton: "提交",
    resetButton: "重置",
    successMessage: "表单提交成功！",
    successDescription: "感谢您与我们联系。我们将尽快回复您。",
    formDataLabel: "提交的数据：",
    changeLanguage: "更改语言",
    fillSampleData: "填入示例数据",
  },
};

// Direction for languages (for RTL support if needed in the future)
export const languageDirection: Record<LanguageCode, "ltr" | "rtl"> = {
  en: "ltr",
  id: "ltr",
  es: "ltr",
  fr: "ltr",
  de: "ltr",
  ja: "ltr",
  zh: "ltr",
};
