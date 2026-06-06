import React from "react";
import { STEPS } from "../../helpers/dataOfPets";
import { Step } from "../../pages/pets/PetsForm";

// ── Step indicator ─────────────────────────────────────────────────────────
export const StepBar: React.FC<{ current: Step; completed: Set<Step> }> = ({
  current,
  completed,
}) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const isActive = current === step.id;
      const isDone = completed.has(step.id);
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-200 ${
                isDone
                  ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200"
                  : isActive
                  ? "bg-white border-green-400 text-green-600 shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : step.emoji}
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide text-center leading-tight ${
                isActive
                  ? "text-green-600"
                  : isDone
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 mb-5 mx-1 rounded transition-colors duration-300 ${
                isDone ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);
