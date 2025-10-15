// Helper functions for managing hockey seasons

/**
 * Calculate the hockey season based on a date
 * Hockey seasons typically run September - August
 * @param {Date|string} date - The date to calculate season from
 * @returns {string} Season in format "YYYY-YYYY" (e.g., "2024-2025")
 */
export const getSeasonFromDate = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1; // JavaScript months are 0-indexed
  const year = d.getFullYear();

  // If month is Sept (9) or later, season is current year to next year
  // Otherwise, season is previous year to current year
  if (month >= 9) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

/**
 * Get the current hockey season
 * @returns {string} Current season in format "YYYY-YYYY"
 */
export const getCurrentSeason = () => {
  return getSeasonFromDate(new Date());
};

/**
 * Generate a list of recent seasons for dropdowns
 * @param {number} yearsBack - Number of years to go back (default 5)
 * @param {number} yearsForward - Number of years to go forward (default 2)
 * @returns {Array<string>} Array of season strings
 */
export const getSeasonOptions = (yearsBack = 5, yearsForward = 2) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Determine the current season's start year
  const currentSeasonStart = currentMonth >= 9 ? currentYear : currentYear - 1;

  const seasons = [];
  for (let i = yearsBack; i >= -yearsForward; i--) {
    const startYear = currentSeasonStart - i;
    seasons.push(`${startYear}-${startYear + 1}`);
  }

  return seasons;
};

/**
 * Parse season string to get start and end years
 * @param {string} season - Season string like "2024-2025"
 * @returns {{startYear: number, endYear: number}}
 */
export const parseSeasonString = (season) => {
  const [start, end] = season.split('-').map(Number);
  return { startYear: start, endYear: end };
};
