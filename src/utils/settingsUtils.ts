export const getCategoryFromKey = (key: string): string => {
  if (key.startsWith("hero_")) return "home";
  if (key.startsWith("description_")) return "home";
  if (key.startsWith("home_")) return "home";
  if (key.startsWith("program_")) return "program";
  if (key.startsWith("location_")) return "location";
  if (key.startsWith("transport_card_")) return "location";
  if (key.startsWith("section_")) return "home";
  return "general";
};

export const mergeWithDefaults = (
  data: any,
  defaults: any
): any => {
  const merged = { ...defaults };
  Object.keys(data).forEach(key => {
    if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
      merged[key] = data[key];
    } else if (!(key in defaults)) {
      merged[key] = data[key];
    }
  });
  return merged;
};

export const parseJsonSafely = (value: string, defaultValue: any = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};
