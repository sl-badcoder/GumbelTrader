import { arithmeticModule } from "./arithmetic/arithmeticModule";
import { eightyInEightModule } from "./eightyInEight/eightyInEightModule";
import {
  combinatoricsModule,
  probabilityModule
} from "./quant/quantModules";
import { sequenceModule } from "./sequences/sequenceModule";

export const problemModules = {
  arithmetic: arithmeticModule,
  sequences: sequenceModule,
  eightyInEight: eightyInEightModule,
  probability: probabilityModule,
  combinatorics: combinatoricsModule
};

export type ProblemModuleId = keyof typeof problemModules;

export const availableProblemModules = Object.values(problemModules);
