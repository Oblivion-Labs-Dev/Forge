import React, { createContext, useContext } from 'react';
import type { useForgeSparks } from './useForgeSparks';

type SparkApi = ReturnType<typeof useForgeSparks>;

const LivingForgeContext = createContext<SparkApi | null>(null);

export const LivingForgeProvider: React.FC<{ value: SparkApi; children: React.ReactNode }> = ({
  value,
  children
}) => <LivingForgeContext.Provider value={value}>{children}</LivingForgeContext.Provider>;

export function useLivingForge() {
  const ctx = useContext(LivingForgeContext);
  if (!ctx) throw new Error('useLivingForge must be used within LivingForgeProvider');
  return ctx;
}
