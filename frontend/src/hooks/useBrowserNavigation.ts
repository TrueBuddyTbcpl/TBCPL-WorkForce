import { useEffect } from 'react';

interface UseBrowserNavigationOptions {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  baseUrl?: string;
}

export function useBrowserNavigation({ 
  currentStep,
  totalSteps,
  onStepChange,
  baseUrl = window.location.pathname
}: UseBrowserNavigationOptions) {
  useEffect(() => {
    // Initialize history with current step
    const currentState = window.history.state;
    
    if (!currentState || !currentState.formStep) {
      window.history.replaceState(
        { formStep: currentStep, isFormNavigation: true },
        '',
        `${baseUrl}?step=${currentStep}`
      );
    }

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      // Only handle if this is form navigation
      if (event.state && event.state.isFormNavigation) {
        const step = event.state.formStep;
        
        // Validate step is within bounds
        if (step >= 1 && step <= totalSteps) {
          onStepChange(step);
        } else {
          // If out of bounds, reset to step 1
          onStepChange(1);
          window.history.replaceState(
            { formStep: 1, isFormNavigation: true },
            '',
            `${baseUrl}?step=1`
          );
        }
      } else {
        // If trying to go back beyond form, push forward
        window.history.pushState(
          { formStep: currentStep, isFormNavigation: true },
          '',
          `${baseUrl}?step=${currentStep}`
        );
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, totalSteps, onStepChange, baseUrl]);

  // Navigate to specific step with history
  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      onStepChange(step);
      window.history.pushState(
        { formStep: step, isFormNavigation: true },
        '',
        `${baseUrl}?step=${step}`
      );
    }
  };

  // Clear form navigation history
  const clearHistory = () => {
    window.history.replaceState(
      { formStep: 1, isFormNavigation: true },
      '',
      baseUrl
    );
  };

  return { navigateToStep, clearHistory };
}
