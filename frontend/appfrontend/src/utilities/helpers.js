/* eslint-disable prefer-const */

import * as log from 'loglevel';
//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web


export const parseJwt = (token) => {
  try {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    log.error('Error decoding JWT token:', error.message);
    return null;
  }
};
export const checkIsExpired = (token) => {
  try {
    // Decode the JWT token
    let decoded = parseJwt(token);
    log.error('TOKEN PAYLOAD', decoded);
    // Retrieve the expiration time from the decoded payload
    if (decoded !== null && decoded.exp) {
      // Get the expiration timestamp from the decoded payload
      let expirationTimestamp = decoded.exp;

      // Compare the current time with the expiration time
      let isExpired = expirationTimestamp * 1000 < Date.now();
      return isExpired;
    } else {
      log.error('Token does not contain expiration information.');
      return true;
    }
  } catch (error) {
    log.error('Error decoding JWT token:', error.message);
    return true;
  }
};



export const isWithinSixMonths = (legalDate, currentDate) => {
  // Calculate the difference in years and months
  let yearDiff = currentDate.getFullYear() - legalDate.getFullYear();
  let monthDiff = currentDate.getMonth() - legalDate.getMonth();

  // Calculate the total months difference
  let totalMonthsDiff = yearDiff * 12 + monthDiff;

  // Check if the difference is within 6 months
  return totalMonthsDiff <= 6;
};

export const checkLegalDisclaimer = (legalDisclaimerDate) => {
  // Convert string to Date object
  let legalDisclaimerDateObject = new Date(legalDisclaimerDate);

  // Get the current date
  let currentDate = new Date();
  // Calculate the difference and check is within six months
  return isWithinSixMonths(legalDisclaimerDateObject, currentDate);
};

export const removeAllLocalStorageData = () => {
  localStorage.removeItem('ocap_orange_user');
 // storage.removeItem('persist:root');
  localStorage.clear();
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const isoString = now.toISOString();
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  return `${isoString.slice(0, -1) + milliseconds}Z`;
};

export const isBinaryImage = (str) => {
  // Regular expressions for common image signatures
  const imageSignatures = [
    // eslint-disable-next-line no-control-regex
    /^\x89PNG\x0D\x0A\x1A\x0A/, // PNG
    /^GIF87a/,
    /^GIF89a/,
    /^\xFF\xD8\xFF/, // JPEG
    /^BM/, // BMP
    // eslint-disable-next-line no-control-regex
    /^\x00\x00\x01\x00/, // ICO
    // eslint-disable-next-line no-control-regex
    /^\x00\x00\x02\x00/, // ICO
    // Add more signatures as needed
  ];

  for (const signature of imageSignatures) {
    if (signature.test(str)) {
      return true;
    }
  }

  return false;
};
