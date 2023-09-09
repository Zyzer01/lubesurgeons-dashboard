import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get the stored value from local storage, or use the initial value if it doesn't exist
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // Create a state to store the current value
  const [value, setValue] = useState<T>(initial);

  // Define a function to update the stored value and state
  const updateValue = (newValue: T) => {
    // Update the state
    setValue(newValue);
    // Update local storage with the new value
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as const;
}
