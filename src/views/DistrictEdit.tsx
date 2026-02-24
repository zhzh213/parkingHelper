import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { District } from '../types';

export const DistrictEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { districts, setDistricts, currentLocation } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNew = id === 'new';
  const existingDistrict = districts.find(d => d.id === id);

  const [formData, setFormData] = useState<Partial<District>>({
    name: '',
    lat: 0,
    lng: 0,
    needsOperation: false,
    freeDuration: 2,
    exitDuration: 30,
    paymentAccount: '',
    qrCode: ''
  });

  useEffect(() => {
    if (existingDistrict) {
      setFormData(existingDistrict);
    }
  }, [existingDistrict]);

  const handleGetCurrentLocation = () => {
    if (currentLocation) {
      setFormData(prev => ({
        ...prev,
        lat: currentLocation.lat,
        lng: currentLocation.lng
      }));
    } else {
      alert('无法获取当前位置，请确保已授权位置权限。');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, qrCode: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入商圈名');
      return;
    }

    const newDistrict: District = {
      id: isNew ? Date.now().toString() : existingDistrict!.id,
      name: formData.name || '',
      lat: formData.lat || 0,
      lng: formData.lng || 0,
      needsOperation: formData.needsOperation || false,
      freeDuration: formData.freeDuration || 0,
      exitDuration: formData.exitDuration || 0,
      paymentAccount: formData.paymentAccount || '',
      qrCode: formData.qrCode || ''
    };

    if (isNew) {
      setDistricts([...districts, newDistrict]);
    } else {
      setDistricts(districts.map(d => d.id === newDistrict.id ? newDistrict : d));
    }
    navigate(-1);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center">
        <label className="w-24 text-gray-700">商圈名:</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="flex-1 border border-gray-300 rounded p-2"
        />
      </div>

      <div className="flex items-center">
        <label className="w-24 text-gray-700">经度:</label>
        <input 
          type="number" 
          value={formData.lng} 
          onChange={e => setFormData({...formData, lng: Number(e.target.value)})}
          className="flex-1 border border-gray-300 rounded p-2"
        />
        <button 
          onClick={handleGetCurrentLocation}
          className="ml-2 bg-sky-500 text-white px-3 py-2 rounded text-sm shrink-0"
        >
          获取当前<br/>经纬度
        </button>
      </div>

      <div className="flex items-center">
        <label className="w-24 text-gray-700">纬度:</label>
        <input 
          type="number" 
          value={formData.lat} 
          onChange={e => setFormData({...formData, lat: Number(e.target.value)})}
          className="flex-1 border border-gray-300 rounded p-2"
        />
      </div>

      <div className="flex items-center">
        <label className="w-24 text-gray-700">需要操作:</label>
        <select 
          value={formData.needsOperation ? 'yes' : 'no'}
          onChange={e => setFormData({...formData, needsOperation: e.target.value === 'yes'})}
          className="flex-1 border border-gray-300 rounded p-2 bg-white"
        >
          <option value="yes">是</option>
          <option value="no">否</option>
        </select>
      </div>

      {formData.needsOperation && (
        <div className="flex items-center">
          <label className="w-24 text-gray-700">微信公众号:</label>
          <input 
            type="text" 
            value={formData.paymentAccount} 
            onChange={e => setFormData({...formData, paymentAccount: e.target.value})}
            className="flex-1 border border-gray-300 rounded p-2"
          />
        </div>
      )}

      <div className="flex items-center">
        <label className="w-24 text-gray-700">免费时长:</label>
        <select 
          value={formData.freeDuration}
          onChange={e => setFormData({...formData, freeDuration: Number(e.target.value)})}
          className="flex-1 border border-gray-300 rounded p-2 bg-white"
        >
          <option value={0}>无</option>
          <option value={0.5}>半小时</option>
          <option value={1}>1小时</option>
          <option value={2}>2小时</option>
          <option value={3}>3小时</option>
        </select>
      </div>

      <div className="flex items-center">
        <label className="w-24 text-gray-700">出场时长:</label>
        <select 
          value={formData.exitDuration}
          onChange={e => setFormData({...formData, exitDuration: Number(e.target.value)})}
          className="flex-1 border border-gray-300 rounded p-2 bg-white"
        >
          <option value={15}>15分钟</option>
          <option value={20}>20分钟</option>
          <option value={30}>30分钟</option>
        </select>
      </div>

      <div className="flex items-start pt-2">
        <label className="w-24 text-gray-700 pt-2">缴费码:</label>
        <div className="relative">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-32 bg-gray-100 border-4 border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {formData.qrCode ? (
              <img src={formData.qrCode} alt="QR" className="max-w-full max-h-full object-contain" />
            ) : (
              <Plus size={48} className="text-gray-400" />
            )}
          </div>
          {formData.qrCode && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-3 -bottom-3 w-8 h-8 bg-white rounded-full border border-gray-300 flex items-center justify-center text-gray-600 shadow-sm"
            >
              <Edit2 size={16} />
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="flex space-x-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded text-lg font-medium"
        >
          取消
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 bg-sky-500 text-white py-3 rounded text-lg font-medium"
        >
          保存
        </button>
      </div>
    </div>
  );
};
