import { useState, useEffect } from "react";

/**
 * useLocalStorage
 *
 * @param {string} key           The name of the localStorage key
 * @param {*}      initialValue  What to use if localStorage is empty
 *
 * @returns {[any, function]}    [storedValue, setValue]
 */
function useLocalStorage(key, initialValue) {
  // On init, read from localStorage or fall back to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(`useLocalStorage(${key}):`, err);
      return initialValue;
    }
  });

  // Whenever storedValue changes, write it (or remove it) in localStorage
  useEffect(() => {
    try {
      if (storedValue === undefined || storedValue === "" || storedValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (err) {
      console.error(`useLocalStorage(${key}):`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;