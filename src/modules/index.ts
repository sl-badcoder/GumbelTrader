import { arithmeticModule } from "./arithmetic/arithmeticModule";
import { intuitiveMathModules } from "./intuitiveMath/modules";
import {
  combinatoricsModule,
  probabilityModule
} from "./quant/quantModules";
import { sequenceModule } from "./sequences/sequenceModule";

export const problemModules = {
  arithmetic: arithmeticModule,
  sequences: sequenceModule,
  missingOperand: intuitiveMathModules.missingOperand,
  decimalPlace: intuitiveMathModules.decimalPlace,
  fractionTrap: intuitiveMathModules.fractionTrap,
  magnitudeSense: intuitiveMathModules.magnitudeSense,
  percentIntuition: intuitiveMathModules.percentIntuition,
  ratioRateUnits: intuitiveMathModules.ratioRateUnits,
  fermiEstimation: intuitiveMathModules.fermiEstimation,
  strategyRecognition: intuitiveMathModules.strategyRecognition,
  mixedElimination: intuitiveMathModules.mixedElimination,
  typedHardcore: intuitiveMathModules.typedHardcore,
  eightyInEightMc: intuitiveMathModules.eightyInEightMc,
  probability: probabilityModule,
  combinatorics: combinatoricsModule
};

export type ProblemModuleId = keyof typeof problemModules;

export const availableProblemModules = Object.values(problemModules);
