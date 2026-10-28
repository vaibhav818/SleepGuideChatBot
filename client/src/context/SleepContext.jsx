import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sleepAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SleepContext = createContext();

export function SleepProvider({ children }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setStats(null);
      return;
    }

    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [logsRes, statsRes] = await Promise.all([
          sleepAPI.getLogs(1, 15),
          sleepAPI.getStats(),
        ]);

        if (isMounted) {
          if (logsRes.success) setLogs(logsRes.data || []);
          if (statsRes.success) setStats(statsRes.data || null);
        }
      } catch (err) {
        console.warn('Error loading sleep data:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, refreshTrigger]);

  const addSleepLog = async (logData) => {
    try {
      const res = await sleepAPI.logSleep(logData);
      if (res.success) {
        refreshData();
        return res;
      }
    } catch (err) {
      console.error('Failed to log sleep:', err);
      throw err;
    }
  };

  const deleteSleepLog = async (id) => {
    try {
      const res = await sleepAPI.deleteLog(id);
      if (res.success) {
        setLogs((prev) => prev.filter((l) => l._id !== id));
        refreshData();
        return res;
      }
    } catch (err) {
      console.error('Failed to delete log:', err);
      throw err;
    }
  };

  return (
    <SleepContext.Provider
      value={{
        logs,
        stats,
        loading,
        refreshData,
        addSleepLog,
        deleteSleepLog,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export function useSleep() {
  const context = useContext(SleepContext);
  if (!context) {
    throw new Error('useSleep must be used within a SleepProvider');
  }
  return context;
}

