import { PERSONAL_BUSINESS, ENTITY_BUSINESS, SIMPLE_BUSINESS } from "./string";

// 사업자 종류
export const BUSINESS_TYPE_OPTIONS = [
  {
    label: ENTITY_BUSINESS,
    value: "entity",
  },
  {
    label: PERSONAL_BUSINESS,
    value: "personal",
  },
  {
    label: SIMPLE_BUSINESS,
    value: "simple",
  },
];
