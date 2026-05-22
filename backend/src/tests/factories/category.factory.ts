/* ============================================================
   CATEGORY FACTORY
   Genera categorías de test con datos válidos y variantes
   para edge cases.
   ============================================================ */

export type CategoryPayload = {
  name:  string;
  color?: string;
};

let counter = 0;

export const categoryPayload = (overrides: Partial<CategoryPayload> = {}): CategoryPayload => ({
  name:  `Category ${++counter}`,
  color: "#6366f1",
  ...overrides,
});

export const categoryPayloads = {
  electronics: (overrides: Partial<CategoryPayload> = {}): CategoryPayload =>
    categoryPayload({ name: "Electronics", color: "#3b82f6", ...overrides }),

  furniture: (overrides: Partial<CategoryPayload> = {}): CategoryPayload =>
    categoryPayload({ name: "Furniture", color: "#10b981", ...overrides }),

  tools: (overrides: Partial<CategoryPayload> = {}): CategoryPayload =>
    categoryPayload({ name: "Tools", color: "#f59e0b", ...overrides }),
};

export const invalidCategoryPayloads = {
  missingName:   { color: "#6366f1" },
  invalidColor:  { name: "Category", color: "not-a-hex" },
  emptyName:     { name: "", color: "#6366f1" },
  emptyBody:     {},
};

export const resetCategoryCounter = (): void => {
  counter = 0;
};
