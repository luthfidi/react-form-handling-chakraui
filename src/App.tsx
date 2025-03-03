import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";

// Lazy load the form pages for better performance
import { lazy, Suspense } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";

// Lazy loaded components
const BasicRegistrationForm = lazy(
  () => import("./pages/basic-registration/BasicRegistrationForm")
);
const MultiStepForm = lazy(
  () => import("./pages/multi-step-form/MultiStepForm")
);
const DependentFieldsForm = lazy(
  () => import("./pages/dependent-fields/DependentFieldsForm")
);
const ArrayFieldsForm = lazy(
  () => import("./pages/array-fields/ArrayFieldsForm")
);
const FileUploadForm = lazy(() => import("./pages/file-upload/FileUploadForm"));
const NestedObjectsForm = lazy(
  () => import("./pages/nested-objects/NestedObjectsForm")
);
const AsyncValidationForm = lazy(
  () => import("./pages/async-validation/AsyncValidationForm")
);
const CustomValidationForm = lazy(
  () => import("./pages/custom-validation/CustomValidationForm")
);
const DynamicFieldsForm = lazy(
  () => import("./pages/dynamic-fields/DynamicFieldsForm")
);
const InternationalizationForm = lazy(
  () => import("./pages/internationalization/InternationalizationForm")
);

const LoadingFallback = () => (
  <Center h="50vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="brand.500"
      size="xl"
    />
  </Center>
);

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/basic-registration"
            element={<BasicRegistrationForm />}
          />
          <Route path="/multi-step-form" element={<MultiStepForm />} />
          <Route path="/dependent-fields" element={<DependentFieldsForm />} />
          <Route path="/array-fields" element={<ArrayFieldsForm />} />
          <Route path="/file-upload" element={<FileUploadForm />} />
          <Route path="/nested-objects" element={<NestedObjectsForm />} />
          <Route path="/async-validation" element={<AsyncValidationForm />} />
          <Route path="/custom-validation" element={<CustomValidationForm />} />
          <Route path="/dynamic-fields" element={<DynamicFieldsForm />} />
          <Route
            path="/internationalization"
            element={<InternationalizationForm />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
