import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  type PersonalInfoData, 
  type AddressData, 
  type AccountData, 
  type MultiStepFormData 
} from '../schemas/multiStepFormSchema'

interface MultiStepFormState {
  // Form data
  personalInfo: PersonalInfoData | null
  address: AddressData | null
  account: AccountData | null
  // Active step
  activeStep: number
  // Status
  isCompleted: boolean
  // Actions
  setPersonalInfo: (data: PersonalInfoData) => void
  setAddress: (data: AddressData) => void
  setAccount: (data: AccountData) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
  completeForm: () => void
  getAllFormData: () => MultiStepFormData | null
}

export const useMultiStepFormStore = create<MultiStepFormState>()(
  persist(
    (set, get) => ({
      // Initial form data
      personalInfo: null,
      address: null,
      account: null,
      // Start at step 1
      activeStep: 0,
      // Not completed yet
      isCompleted: false,
      
      // Actions
      setPersonalInfo: (data) => set({ personalInfo: data }),
      
      setAddress: (data) => set({ address: data }),
      
      setAccount: (data) => set({ account: data }),
      
      nextStep: () => {
        const { activeStep } = get()
        if (activeStep < 2) {
          set({ activeStep: activeStep + 1 })
        }
      },
      
      prevStep: () => {
        const { activeStep } = get()
        if (activeStep > 0) {
          set({ activeStep: activeStep - 1 })
        }
      },
      
      goToStep: (step) => {
        if (step >= 0 && step <= 2) {
          set({ activeStep: step })
        }
      },
      
      reset: () => set({
        personalInfo: null,
        address: null,
        account: null,
        activeStep: 0,
        isCompleted: false
      }),
      
      completeForm: () => set({ isCompleted: true }),
      
      getAllFormData: () => {
        const { personalInfo, address, account } = get()
        
        if (!personalInfo || !address || !account) {
          return null
        }
        
        return {
          personalInfo,
          address,
          account
        }
      }
    }),
    {
      name: 'multi-step-form', // Name for localStorage
    }
  )
)