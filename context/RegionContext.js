import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getRegions, getRegion } from '../pages/api/regions';
import { storage } from '../utils/storage';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchRegion = async () => {
      const regionId = storage.get('REGION_ID');
      if (region && regionId) {
        return;
      }
      try {
        const regions = await getRegions();
        setRegion(regions[0]);
        storage.set('REGION_ID', regions[0].id);
      } catch (error) {
        console.error('Error fetching region:', error);
      }
    };
    fetchRegion();
  }, [region]);
  const obj = useMemo(() => ({ region, setRegion }), [region]);
  return (
    <RegionContext.Provider value={obj}>{children}</RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);

  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }

  return context;
};
