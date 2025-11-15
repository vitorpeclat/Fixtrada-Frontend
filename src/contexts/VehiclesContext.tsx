import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Vehicle = {
  carID?: string;
  carPlaca?: string;
  carMarca?: string;
  carModelo?: string;
  carAno?: number;
  carCor?: string;
  carKM?: number;
  carTpCombust?: string;
  carOpTracao?: string;
  carOpTrocaOleo?: string;
  carOpTrocaPneu?: string;
  carOpRevisao?: string;
  carAtivo?: boolean;
  fk_usuario_usuID?: string;
};

interface VehiclesContextData {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextData>({} as VehiclesContextData);

export const VehiclesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!isAuthenticated) {
      setVehicles([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/vehicles');

      if (res.status !== 200) {
        throw new Error(`Erro ${res.status}: ${res.data?.message}`);
      }
      const data = res.data;
      setVehicles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setVehicles([]);
      setError(err.response?.data?.message ?? err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    if (authLoading) return;
    fetchVehicles();
  }, [authLoading, fetchVehicles]);

  return (
    <VehiclesContext.Provider value={{ vehicles, loading, error, reload: fetchVehicles }}>
      {children}
    </VehiclesContext.Provider>
  );
};

export function useVehicles() {
  return useContext(VehiclesContext);
}
