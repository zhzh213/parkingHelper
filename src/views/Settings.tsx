import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Settings = () => {
  const { settings, setSettings } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <label className="text-lg font-bold text-gray-800">默认在场时长:</label>
        <div className="flex items-center space-x-2">
          <select 
            value={settings.defaultDuration}
            onChange={(e) => setSettings({ ...settings, defaultDuration: Number(e.target.value) })}
            className="border border-gray-300 rounded p-2 bg-white text-gray-800 w-24"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <span className="text-lg font-bold text-gray-800">小时</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-lg font-bold text-gray-800">默认提前:</label>
        <div className="flex items-center space-x-2">
          <select 
            value={settings.defaultReminder}
            onChange={(e) => setSettings({ ...settings, defaultReminder: Number(e.target.value) })}
            className="border border-gray-300 rounded p-2 bg-white text-gray-800 w-24"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-lg font-bold text-gray-800">分钟提醒</span>
        </div>
      </div>

      <div className="pt-8">
        <button 
          onClick={() => navigate('/districts')}
          className="w-full bg-sky-500 text-white py-3 rounded text-lg font-medium active:bg-sky-600 transition-colors"
        >
          商圈管理
        </button>
      </div>
    </div>
  );
};
