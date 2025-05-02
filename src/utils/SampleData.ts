// Sample data for all forms in the application
// This file contains test data for filling forms quickly

// Sample data for Multi-Step Form
export const multiStepFormSampleData = {
  // Step 1: Personal Information
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
  },

  // Step 2: Address
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },

  // Step 3: Account
  account: {
    username: "johnsmith123",
    password: "Password123!",
    confirmPassword: "Password123!",
    termsAccepted: true,
  },
};

// Sample data for Basic Registration Form
export const basicRegistrationSampleData = {
  firstName: "Michael",
  lastName: "Johnson",
  email: "michael.johnson@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  terms: true,
};

// Sample data for Array Fields Form
export const arrayFieldsFormSampleData = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 987-6543",

  // Experience items sample
  experience: [
    {
      company: "Tech Innovations Inc.",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "2022-06",
      current: false,
      description:
        "Led a team of developers on various projects. Implemented CI/CD pipelines and improved code quality.",
    },
    {
      company: "Digital Solutions LLC",
      position: "Web Developer",
      startDate: "2017-03",
      endDate: "",
      current: true,
      description:
        "Full-stack development using React and Node.js. Building responsive web applications and maintaining client relationships.",
    },
  ],

  // Education items sample
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2017-06",
    },
    {
      institution: "Online Academy",
      degree: "Professional Certificate",
      fieldOfStudy: "Web Development",
      graduationDate: "2018-12",
    },
  ],

  // Skills sample
  skills: [
    {
      name: "JavaScript",
      level: "expert",
    },
    {
      name: "React",
      level: "advanced",
    },
    {
      name: "Node.js",
      level: "intermediate",
    },
  ],
};

// Sample data for Dependent Fields Form
export const dependentFieldsFormSampleData = {
  name: "Sarah Williams",
  email: "sarah.williams@example.com",

  // Change string to enum value
  employmentType: "employed" as const, // Add "as const" to make it type-safe
  companyName: "Global Enterprises",
  position: "Marketing Manager",

  businessName: "Creative Solutions",
  businessType: "Consulting",

  schoolName: "State University",
  degree: "Master of Business",

  previousEmployer: "Previous Company Inc.",

  // Fix productType too
  productType: "physical" as const,
  shippingAddress: "456 Park Avenue, New York, NY 10022",
  downloadPreference: "direct",
  billingCycle: "monthly",

  termsAccepted: true,
};

// Sample data for File Upload Form
export const fileUploadFormSampleData = {
  title: "Portfolio Project 2023",
  description:
    "A collection of my best design work from this year, including web designs and mobile UI concepts.",
  termsAccepted: true,

  // Mock file data (for UI representation only)
  mockFiles: {
    profileImage: {
      name: "profile-photo.jpg",
      size: 1240000, // 1.24 MB
      type: "image/jpeg",
    },
    resume: {
      name: "professional-resume.pdf",
      size: 956000, // 956 KB
      type: "application/pdf",
    },
    portfolioImages: [
      {
        name: "portfolio-1.png",
        size: 2450000, // 2.45 MB
        type: "image/png",
      },
      {
        name: "portfolio-2.jpg",
        size: 1840000, // 1.84 MB
        type: "image/jpeg",
      },
    ],
    additionalDocuments: [
      {
        name: "project-brief.docx",
        size: 845000, // 845 KB
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
  },
};

// Sample data for Nested Objects Form
export const nestedObjectsFormSampleData = {
  // Basic Information
  basicInfo: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
  },

  // Address
  address: {
    street: "789 Oak Avenue",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "United States",
  },

  // Payment Information
  payment: {
    method: "creditCard",
    cardNumber: "4111111111111111",
    cardholderName: "Alex Morgan",
    expiryDate: "12/25",
    cvv: "123",
    paypalEmail: "alex.morgan@example.com",
    accountNumber: "9876543210",
    routingNumber: "123456789",
    accountName: "Alex Morgan",
    bankName: "First National Bank",
  },

  // Subscription
  subscription: {
    plan: "premium" as const,
    billingCycle: "annual" as const, // Add "as const" to make it type-safe
    autoRenew: true,
    emailNotifications: true,
    smsNotifications: false,
    promoNotifications: true,
  },

  termsAccepted: true,
};

// Sample data for Custom Validation Form
export const customValidationFormSampleData = {
  username: "alexmorgan42",
  password: "StrongPass123!",
  email: "alex.morgan@example.com",
  website: "https://alexmorgan.com",
  creditCard: "4111111111111111",
  bio: "Software developer with 10+ years of experience in web technologies and cloud architecture.",
  country: "United States",
  zipCode: "02108",
  startDate: "2023-06-01",
  endDate: "2023-12-31",
  employmentType: "employed",
  companyName: "Tech Solutions Inc.",
  yearsExperience: 8,
  industry: "technology",
  age: 35,
  phone: "+1 (555) 234-5678",
  termsAccepted: true,
};

// Sample data for Internationalization Form
export const i18nFormSampleData = {
  name: "David Johnson",
  email: "david.johnson@example.com",
  phone: "+1 (555) 345-6789",
  message:
    "Hello, I'm interested in learning more about your services. Please contact me with additional information at your earliest convenience.",
  preferredContact: "email",
  terms: true,
};

// Utility functions for file mocking
export const mockFileObject = (name: string, size: number, type: string) => {
  return {
    name,
    size,
    type,
    lastModified: Date.now(),
    // This is not a real File object, just a mock for UI representation
    isFileMock: true,
  };
};

export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
