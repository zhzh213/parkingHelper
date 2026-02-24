import React, { createContext, useContext, useState, useEffect } from 'react';
import { District, Settings, ParkingSession } from '../types';

const defaultDistricts: District[] = [
  {
    id: '1',
    name: '长江证券停车场',
    lat: 30.555,
    lng: 114.333,
    needsOperation: true,
    freeDuration: 2,
    exitDuration: 30,
    paymentAccount: '长江证券停车场',
    qrCode: ''
  },
  {
    id: '2',
    name: 'SKP',
    lat: 1.55000,
    lng: 55.33000,
    needsOperation: true,
    freeDuration: 2,
    exitDuration: 15,
    paymentAccount: 'SKP会员',
    qrCode: ''
  }
];

const defaultSettings: Settings = {
  defaultDuration: 2,
  defaultReminder: 3,
};

type AppContextType = {
  districts: District[];
  setDistricts: (districts: District[]) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  session: ParkingSession | null;
  setSession: (session: ParkingSession | null) => void;
  currentLocation: { lat: number; lng: number } | null;
  refreshLocation: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem('districts');
    return saved ? JSON.parse(saved) : defaultDistricts;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [session, setSession] = useState<ParkingSession | null>(() => {
    const saved = localStorage.getItem('session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('districts', JSON.stringify(districts));
  }, [districts]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }, [session]);

  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <AppContext.Provider value={{ districts, setDistricts, settings, setSettings, session, setSession, currentLocation, refreshLocation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
