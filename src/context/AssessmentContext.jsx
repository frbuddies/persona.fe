import { createContext, useContext, useReducer } from 'react';
import { calcPersonaScores, calcRoleScores } from '../utils/scoring';

const AssessmentContext = createContext(null);

const initialState = {
  screen: 'intro',
  userName: '',
  userEmail: '',
  userRole: '',
  filledFor: '',
  qi: 0,
  answers: {},
  selected: null,
  scores: {},
  roleScores: {},
  activeTip: 0,
  emailSent: false,
  emailError: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, userName: action.payload };
    case 'SET_EMAIL':
      return { ...state, userEmail: action.payload };
    case 'SET_ROLE':
      return { ...state, userRole: action.payload };
    case 'SET_FILLED_FOR':
      return { ...state, filledFor: action.payload };
    case 'SELECT_OPTION':
      return { ...state, selected: action.payload };
    case 'NEXT_QUESTION': {
      if (state.screen === 'intro') {
        return { ...state, screen: 'assessment', qi: 0, selected: null };
      }
      const answers = { ...state.answers, [state.qi]: state.selected };
      if (state.qi + 1 >= 15) {
        const scores = calcPersonaScores(answers);
        const roleScores = calcRoleScores(scores);
        return {
          ...state,
          answers,
          scores,
          roleScores,
          activeTip: 0,
          emailSent: false,
          screen: 'results',
        };
      }
      return {
        ...state,
        answers,
        qi: state.qi + 1,
        selected: null,
      };
    }
    case 'PREV_QUESTION':
      if (state.qi <= 0) return state;
      return {
        ...state,
        qi: state.qi - 1,
        selected: state.answers[state.qi - 1] || null,
      };
    case 'SET_ACTIVE_TIP':
      return { ...state, activeTip: action.payload };
    case 'SET_EMAIL_SENT':
      return { ...state, emailSent: true };
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload };
    case 'RETAKE':
      return { ...initialState };
    default:
      return state;
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be inside AssessmentProvider');
  return ctx;
}
