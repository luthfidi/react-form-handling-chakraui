# React Form Mastery

A comprehensive guide to building complex forms with React Hook Form and Zod schema validation. This project demonstrates 10 real-world form patterns with clean, professional UI using Chakra UI.

## ✨ Features

- **TypeScript** for type safety and better developer experience
- **React Hook Form** for efficient form state management
- **Zod** for powerful schema validation
- **Chakra UI** for beautiful and accessible UI components
- **Responsive Design** with dark/light mode support
- **10 Complete Form Examples** from basic to advanced

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/luthfidi/react-form-mastery
cd react-form-mastery

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 📋 Form Examples

### Basic Level

1. **Basic Registration** (`/basic-registration`)

   - Email format validation, password requirements
   - Password confirmation matching
   - Terms acceptance checkbox validation

2. **Multi-step Form** (`/multi-step-form`)

   - 3-step wizard: Personal Info → Address → Account
   - Progress indicator with step navigation
   - Zustand store for data persistence

3. **Dependent Fields** (`/dependent-fields`)

   - Employment status drives conditional fields
   - Product type shows relevant options
   - Dynamic validation based on selections

4. **Array Fields** (`/array-fields`)
   - Resume builder with experience/education/skills
   - Add/remove items with validation
   - Minimum/maximum array length rules

### Advanced Level

5. **File Upload** (`/file-upload`)

   - Single & multiple file uploads
   - File type validation (images, documents)
   - 5MB size limit with drag & drop UI

6. **Nested Objects** (`/nested-objects`)

   - Subscription form with payment methods
   - Address, billing, and notification preferences
   - Conditional payment fields (card/PayPal/bank)

7. **Async Validation** (`/async-validation`)

   - Username availability checking
   - Email duplicate detection
   - Debounced API calls with loading states

8. **Custom Validation** (`/custom-validation`)

   - Credit card validation (Luhn algorithm)
   - Password strength meter
   - Country-specific postal code validation

9. **Dynamic Fields** (`/dynamic-fields`)

   - Form builder with live preview
   - JSON config to working form
   - Code generation for React/HTML

10. **Internationalization** (`/internationalization`)
    - 7 languages: EN, ID, ES, FR, DE, JA, ZH
    - Dynamic error messages and labels
    - Browser language auto-detection

## 🛠 Tech Stack

**Core**: React 18 + TypeScript + Vite  
**Forms**: React Hook Form + Zod + @hookform/resolvers  
**UI**: Chakra UI + Emotion + Framer Motion  
**State**: Zustand + TanStack Query  
**Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── pages/               # Form example pages
├── schemas/             # Zod validation schemas
├── store/               # Zustand stores
├── utils/               # Utilities and sample data
└── theme.ts             # Chakra UI theme
```

## 🔧 Key Patterns

### Schema-First Validation

```typescript
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Too short"),
});
```

### Form Integration

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

### Reusable Components

```typescript
<FileUpload name="avatar" accept="image/*" maxSize={5000000} />
```

### Auto-Fill Sample Data

```typescript
// Every form includes a magic wand button for instant testing
const fillWithSampleData = () => {
  reset(sampleData); // Pre-populated realistic data
};
```

## 🌟 Highlights

- **Performance Optimized** - Minimal re-renders with React Hook Form
- **Type Safe** - Full TypeScript integration with Zod schemas
- **Accessible** - WCAG compliant with Chakra UI
- **Mobile Ready** - Responsive design for all devices
- **Auto-Fill Feature** - One-click sample data for quick testing
- **Production Ready** - Error handling, loading states, validation

## 📱 Browser Support

Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+

## 🚀 Deployment

**Build for production:**

```bash
npm run build
```

**Deploy to Vercel/Netlify:**

- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🔗 Links

- **Live Demo**: [https://react-form-mastery.vercel.app](https://react-form-mastery.vercel.app)
- **GitHub**: [https://github.com/luthfidi/react-form-mastery](https://github.com/luthfidi/react-form-mastery)
- **Author**: [@luthfidi](https://github.com/luthfidi)

---

Built with ♥ for learning advanced React form patterns
