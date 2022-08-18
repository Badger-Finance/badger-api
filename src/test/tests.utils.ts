export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};
