import { arithmeticModule } from "./arithmetic/arithmeticModule";
import { sequenceModule } from "./sequences/sequenceModule";

export const problemModules = {
  arithmetic: arithmeticModule,
  sequences: sequenceModule
};

export type ProblemModuleId = keyof typeof problemModules;

export const availableProblemModules = Object.values(problemModules);
