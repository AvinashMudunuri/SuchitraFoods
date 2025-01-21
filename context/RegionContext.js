import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getRegions, getRegion } from '../pages/api/regions';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchRegion = async () => {
      if (region) {
        localStorage.setItem('region_id', region.id);
        return;
      }

      const regionId = localStorage.getItem('region_id');
      try {
        if (!regionId) {
          const regions = await getRegions();
          setRegion(regions[0]);
        } else {
          const fetchedRegion = await getRegion(regionId);
          setRegion(fetchedRegion);
        }
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
