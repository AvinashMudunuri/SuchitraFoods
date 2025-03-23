import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getRegions, getRegion } from '../pages/api/regions';
import { storage } from '../utils/storage';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchRegion = async () => {
      const regionId = storage.get('REGION_ID');
      try {
        let regionData;
        if (regionId) {
          regionData = await getRegion(regionId);
        } else {
          const regions = await getRegions();
          regionData = regions[0];
          storage.set('REGION_ID', regionData.id);
        }

        setRegion(regionData);

        if (regionData?.countries?.length > 0) {
          const indiaCountry = regionData.countries.find(country => country.iso_2 === 'in');
          if (indiaCountry) {
            const formattedCountry = {
              ...indiaCountry,
              label: indiaCountry.display_name,
              value: indiaCountry.iso_2,
              code: indiaCountry.iso_2,
            };
            setCountries([formattedCountry]);
          }
        }
      } catch (error) {
        console.error('Error fetching region:', error);
      }
    };
    fetchRegion();
  }, []);

  const obj = useMemo(() => ({ region, setRegion, countries }), [region, countries]);
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
