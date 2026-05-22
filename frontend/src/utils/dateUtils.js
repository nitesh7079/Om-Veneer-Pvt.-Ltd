import ndc from 'nepali-date-converter';

const NepaliDate = ndc.default || ndc;

export const getNepaliDateString = (gregorianDateString) => {
  if (!gregorianDateString) return '';
  try {
    const bsDate = new NepaliDate(new Date(gregorianDateString));
    // NepaliDate format method supports DD, MMMM (Full Nepali Month Name in English characters), YYYY
    return bsDate.format('DD MMMM YYYY');
  } catch (e) {
    console.error('Error parsing Nepali Date:', e);
    return '';
  }
};
