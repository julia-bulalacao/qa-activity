// Navigation and Progress Management
class AutomationNavigator {
  constructor() {
    this.steps = [
      { id: 'welcome', name: 'Welcome', url: 'index.html' },
      { id: 'setup', name: 'Setup', url: 'create-application.html' },
      { id: 'form', name: 'Form', url: 'form.html' },
      { id: 'review', name: 'Review', url: 'success.html' },
      { id: 'complete', name: 'Complete', url: 'congratulations.html' }
    ];

    this.simpleSteps = [
      { id: 'portal', name: 'Portal', url: 'front-page.html' },
      { id: 'form', name: 'Form', url: 'simple-form.html' },
      { id: 'complete', name: 'Complete', url: 'finisher-page.html' }
    ];

    this.init();
  }

  init() {
    this.updateProgressOnLoad();
    this.setupNavigationEvents();
  }

  getCurrentStep() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return this.getStepByUrl(path);
  }

  getStepByUrl(url) {
    // Check automation challenge steps first
    let step = this.steps.find(s => s.url === url);
    if (step) return step;

    // Check simple form steps
    step = this.simpleSteps.find(s => s.url === url);
    return step;
  }

  getStepIndex(stepId, isSimple = false) {
    const steps = isSimple ? this.simpleSteps : this.steps;
    return steps.findIndex(s => s.id === stepId);
  }

  getProgressPercentage(stepId, isSimple = false) {
    const steps = isSimple ? this.simpleSteps : this.steps;
    const index = this.getStepIndex(stepId, isSimple);
    return index >= 0 ? ((index + 1) / steps.length) * 100 : 0;
  }

  updateProgressBar(stepId, isSimple = false) {
    const progressBar = document.querySelector('.progress-fill');
    if (!progressBar) return;

    const percentage = this.getProgressPercentage(stepId, isSimple);
    progressBar.style.width = percentage + '%';

    // Add animation class
    progressBar.classList.add('animated');
    setTimeout(() => progressBar.classList.remove('animated'), 1000);

    // Update step labels
    this.updateStepLabels(stepId, isSimple);
  }

  updateStepLabels(currentStepId, isSimple = false) {
    const labels = document.querySelectorAll('.progress-labels span');
    const steps = isSimple ? this.simpleSteps : this.steps;
    const currentIndex = this.getStepIndex(currentStepId, isSimple);

    labels.forEach((label, index) => {
      label.classList.remove('active', 'complete');

      if (index < currentIndex) {
        label.classList.add('complete');
      } else if (index === currentIndex) {
        label.classList.add('active');
      }
    });
  }

  updateProgressOnLoad() {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    // Determine if this is simple form workflow
    const isSimple = this.simpleSteps.some(s => s.id === currentStep.id);

    setTimeout(() => {
      this.updateProgressBar(currentStep.id, isSimple);
    }, 100);
  }

  navigateTo(stepId, isSimple = false) {
    const steps = isSimple ? this.simpleSteps : this.steps;
    const step = steps.find(s => s.id === stepId);

    if (step) {
      // Store navigation state
      this.saveNavigationState(stepId, isSimple);
      window.location.href = step.url;
    }
  }

  goToPreviousStep() {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    const isSimple = this.simpleSteps.some(s => s.id === currentStep.id);
    const steps = isSimple ? this.simpleSteps : this.steps;
    const currentIndex = this.getStepIndex(currentStep.id, isSimple);

    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      this.navigateTo(previousStep.id, isSimple);
    }
  }

  goToNextStep() {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    const isSimple = this.simpleSteps.some(s => s.id === currentStep.id);
    const steps = isSimple ? this.simpleSteps : this.steps;
    const currentIndex = this.getStepIndex(currentStep.id, isSimple);

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      this.navigateTo(nextStep.id, isSimple);
    }
  }

  saveNavigationState(stepId, isSimple = false) {
    const state = {
      currentStep: stepId,
      isSimple: isSimple,
      timestamp: Date.now()
    };

    localStorage.setItem('automationNavigation', JSON.stringify(state));
  }

  getNavigationState() {
    const stored = localStorage.getItem('automationNavigation');
    return stored ? JSON.parse(stored) : null;
  }

  setupNavigationEvents() {
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.goToPreviousStep();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.goToNextStep();
        }
      }
    });

    // Handle back button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-back-btn')) {
        e.preventDefault();
        this.goToPreviousStep();
      }
    });
  }

  // Utility methods for step validation
  canNavigateToStep(stepId, isSimple = false) {
    const steps = isSimple ? this.simpleSteps : this.steps;
    const targetIndex = this.getStepIndex(stepId, isSimple);
    const currentStep = this.getCurrentStep();
    const currentIndex = this.getStepIndex(currentStep?.id, isSimple);

    // Can only navigate to current step or previous steps
    return targetIndex <= currentIndex;
  }

  markStepComplete(stepId, isSimple = false) {
    const completedSteps = this.getCompletedSteps();
    const key = isSimple ? 'simple' : 'automation';

    if (!completedSteps[key]) {
      completedSteps[key] = [];
    }

    if (!completedSteps[key].includes(stepId)) {
      completedSteps[key].push(stepId);
      localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
    }
  }

  getCompletedSteps() {
    const stored = localStorage.getItem('completedSteps');
    return stored ? JSON.parse(stored) : { automation: [], simple: [] };
  }

  resetProgress() {
    localStorage.removeItem('automationNavigation');
    localStorage.removeItem('completedSteps');
  }

  // Debug methods
  getCurrentStepInfo() {
    const currentStep = this.getCurrentStep();
    const isSimple = this.simpleSteps.some(s => s.id === currentStep?.id);

    return {
      step: currentStep,
      isSimple: isSimple,
      progress: this.getProgressPercentage(currentStep?.id, isSimple),
      completedSteps: this.getCompletedSteps()
    };
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.automationNavigator = new AutomationNavigator();
});

// Utility functions for easy access
function goToPreviousStep() {
  if (window.automationNavigator) {
    window.automationNavigator.goToPreviousStep();
  }
}

function goToNextStep() {
  if (window.automationNavigator) {
    window.automationNavigator.goToNextStep();
  }
}

function markCurrentStepComplete() {
  if (window.automationNavigator) {
    const currentStep = window.automationNavigator.getCurrentStep();
    const isSimple = window.automationNavigator.simpleSteps.some(s => s.id === currentStep?.id);
    window.automationNavigator.markStepComplete(currentStep?.id, isSimple);
  }
}