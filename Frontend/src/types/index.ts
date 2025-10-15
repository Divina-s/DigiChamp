export interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    anchor?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface FormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }
  
  export interface QuizQuestion {
      question: string;
      options: {
        A: string;
        B: string;
        C: string;
        D: string;
      };
      correct: 'A' | 'B' | 'C' | 'D';
    }
  