import { CONDITIONS } from "../types/article";

export const getConditionClass = (conditionValue: string): string => {
  const condition = CONDITIONS.find((c) => c.value === conditionValue);
  return condition ? condition.class : "";
};

export const getConditionLabel = (conditionValue: string): string => {
  const condition = CONDITIONS.find((c) => c.value === conditionValue);
  return condition ? condition.label : "";
};
