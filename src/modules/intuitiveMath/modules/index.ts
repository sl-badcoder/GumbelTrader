import { decimalPlaceModule } from "./decimalPlaceModule";
import { eightyInEightMcModule } from "./eightyInEightMcModule";
import { fermiEstimationModule } from "./fermiEstimationModule";
import { fractionTrapModule } from "./fractionTrapModule";
import { magnitudeSenseModule } from "./magnitudeSenseModule";
import { missingOperandModule } from "./missingOperandModule";
import { mixedEliminationModule } from "./mixedEliminationModule";
import { percentIntuitionModule } from "./percentIntuitionModule";
import { ratioRateUnitsModule } from "./ratioRateUnitsModule";
import { strategyRecognitionModule } from "./strategyRecognitionModule";
import { typedHardcoreModule } from "./typedHardcoreModule";

export const intuitiveMathModules = {
  missingOperand: missingOperandModule,
  decimalPlace: decimalPlaceModule,
  fractionTrap: fractionTrapModule,
  magnitudeSense: magnitudeSenseModule,
  percentIntuition: percentIntuitionModule,
  ratioRateUnits: ratioRateUnitsModule,
  fermiEstimation: fermiEstimationModule,
  strategyRecognition: strategyRecognitionModule,
  mixedElimination: mixedEliminationModule,
  eightyInEightMc: eightyInEightMcModule,
  typedHardcore: typedHardcoreModule
};

export type IntuitiveMathModuleKey = keyof typeof intuitiveMathModules;

export function isIntuitiveMathModuleId(
  moduleId: string
): moduleId is (typeof intuitiveMathModules)[IntuitiveMathModuleKey]["id"] {
  return Object.values(intuitiveMathModules).some((module) => module.id === moduleId);
}

export function getIntuitiveMathModule(moduleId: string) {
  return Object.values(intuitiveMathModules).find((module) => module.id === moduleId);
}
