import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getDistance } from '../utils';

export const DistrictList = () => {
  const { districts, setDistricts, currentLocation } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除该商圈吗？')) {
      setDistricts(districts.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-4 relative min-h-full">
      <div className="absolute top-[-56px] right-4 z-10">
        <button 
          onClick={() => navigate('/districts/new')}
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4 mt-2">
        {districts.map(district => {
          const distance = currentLocation ? getDistance(currentLocation.lat, currentLocation.lng, district.lat, district.lng) : 0;
          
          return (
            <div 
              key={district.id}
              onClick={() => navigate(`/districts/${district.id}`)}
              className="p-4 border border-gray-200 rounded bg-white flex relative overflow-hidden group cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{district.name}</h3>
                  <span className="text-sm text-gray-500">{distance > 0 ? `${Math.round(distance)}m` : ''}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>经纬度: {district.lat.toFixed(6)},{district.lng.toFixed(6)}</p>
                  <p>免费时间: {district.freeDuration}小时 {district.needsOperation ? '(需要操作)' : ''}</p>
                  <p>出场时间: {district.exitDuration}分钟</p>
                </div>
              </div>
              <div className="w-20 h-20 ml-4 bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                {district.qrCode ? (
                  <img src={district.qrCode} alt="QR" className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon className="text-sky-500" size={32} />
                )}
              </div>
              
              <button 
                onClick={(e) => handleDelete(e, district.id)}
                className="absolute right-0 top-0 bottom-0 w-16 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={24} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
