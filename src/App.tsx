import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Settings } from './views/Settings';
import { DistrictList } from './views/DistrictList';
import { DistrictEdit } from './views/DistrictEdit';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="districts" element={<DistrictList />} />
            <Route path="districts/:id" element={<DistrictEdit />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
