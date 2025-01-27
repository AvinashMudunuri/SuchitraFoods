'use client';
import { useActionState } from 'react';
import { useFormState } from 'react-dom';

// This hook will use whichever is available and working
export const useFormAction = (action, initialState) => {
  try {
    // Try useActionState from react first
    return useActionState(action, initialState);
  } catch {
    // Fall back to useFormState from react-dom if needed
    return useFormState(action, initialState);
  }
};
