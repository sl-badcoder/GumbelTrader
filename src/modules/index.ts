import { arithmeticModule } from "./arithmetic/arithmeticModule";

export const problemModules = {
  arithmetic: arithmeticModule
};

export type ProblemModuleId = keyof typeof problemModules;

export const availableProblemModules = Object.values(problemModules);
