import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

type Step = {
  icon: React.ReactNode;
  label: string;
  customComp?: React.ReactNode;
  content: React.ReactNode | ((props: StepContentProps) => React.ReactNode);
};

type StepperProps = {
  stepperName?: string;
  stepperClassName?: string;
  containerClassName?: string;
  steps: Step[];
};

type StepContentProps = {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const activeGradient =
  "bg-gradient-to-r from-blue-400 via-purple-700 to-pink-500";

const Stepper = (props: StepperProps) => {
  const {
    stepperName = "stepper",
    steps,
    stepperClassName,
    containerClassName,
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step");

  useEffect(() => {
    // If no step in URL or invalid step, redirect to first step
    const stepNumber = step ? parseInt(step) : null;
    if (!stepNumber || stepNumber < 1 || stepNumber > steps.length) {
      setSearchParams({ step: "1" });
    }
  }, [step, steps.length, setSearchParams]);

  const currentStep = step ? parseInt(step) : 1;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setSearchParams({ step: (currentStep + 1).toString() });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setSearchParams({ step: (currentStep - 1).toString() });
    }
  };

  const renderStepContent = (step: Step) => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === steps.length;

    const navigationProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      isFirstStep,
      isLastStep,
    };

    if (typeof step.content === "function") {
      return step.content(navigationProps);
    }

    return (
      <div className="flex flex-col gap-4">
        {step.content}
        <StepperNavigation {...navigationProps} />
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-4", containerClassName)}>
      <div className={cn("pb-8 pl-10", stepperClassName)}>
        <div className="flex w-fit flex-nowrap">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <div
                key={stepperName + step.label + index}
                className={cn(
                  "flex items-center",
                  steps.length === stepNumber ? "w-auto" : "w-[146px]",
                )}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "rounded-full border-3 shadow-md",
                      isActive && `${activeGradient} border-none p-[3px]`,
                      isCompleted ? "border-slate-400" : "border-white",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 cursor-default items-center justify-center rounded-full",
                        currentStep < stepNumber ? "bg-slate-100" : "bg-white",
                        isActive && "text-purple-600",
                      )}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <p
                    className={cn(
                      "absolute -bottom-8 text-sm font-medium text-nowrap",
                      isCompleted && "text-primary",
                      !isCompleted && "text-muted-foreground",
                      isActive &&
                        `${activeGradient} bg-clip-text text-transparent`,
                    )}
                  >
                    {step.label}
                  </p>
                </div>

                {steps.length > stepNumber ? (
                  <div
                    className={cn(
                      "mx-1 flex-1",
                      currentStep + 1 <= stepNumber
                        ? "border-t-[2px] border-dashed"
                        : "h-[2px] bg-slate-400",
                      isActive && activeGradient,
                    )}
                  ></div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {steps.find((_, index) => index + 1 === currentStep)
        ? renderStepContent(steps[currentStep - 1])
        : null}
    </div>
  );
};

type StepperNavigationProps = StepContentProps & {
  className?: string;
};

const StepperNavigation = ({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  className = "",
}: StepperNavigationProps) => {
  return (
    <div className={`flex justify-between ${className}`}>
      <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
        Back
      </Button>
      <Button onClick={onNext} disabled={isLastStep}>
        Next
      </Button>
    </div>
  );
};

export { StepperNavigation, type StepContentProps };
export default Stepper;
