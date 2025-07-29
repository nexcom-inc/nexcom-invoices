/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = [], showErrorToast = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setError(errorMessage);
          if (showErrorToast) {
            // showError('Error', errorMessage);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (showErrorToast) {
        // showError('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export function useAsyncAction<T extends any[], R>(
  action: (...args: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { showError } = useToast();

  const execute = async (...args: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await action(...args);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // showError('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}