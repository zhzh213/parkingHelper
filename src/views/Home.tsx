import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getDistance, formatDuration } from '../utils';
import { Image as ImageIcon } from 'lucide-react';
import { LongPressButton } from '../components/LongPressButton';

export const Home = () => {
  const { districts, settings, session, setSession, currentLocation } = useAppContext();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(settings.defaultDuration);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedDistricts = React.useMemo(() => {
    if (!currentLocation) return districts;
    return [...districts].sort((a, b) => {
      const distA = getDistance(currentLocation.lat, currentLocation.lng, a.lat, a.lng);
      const distB = getDistance(currentLocation.lat, currentLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [districts, currentLocation]);

  useEffect(() => {
    if (sortedDistricts.length > 0 && !selectedDistrictId) {
      setSelectedDistrictId(sortedDistricts[0].id);
    }
  }, [sortedDistricts, selectedDistrictId]);

  const selectedDistrict = districts.find(d => d.id === selectedDistrictId) || sortedDistricts[0];

  const handleEnter = () => {
    if (!selectedDistrict) return;
    setSession({
      districtId: selectedDistrict.id,
      startTime: Date.now(),
      expectedDurationHours: selectedDuration,
      checkoutTime: null,
      delayHours: 0,
    });
  };

  const handleCheckout = () => {
    if (!session) return;
    setSession({
      ...session,
      checkoutTime: Date.now(),
      delayHours: 0,
    });
  };

  const handleExit = () => {
    setSession(null);
  };

  const handleDelay = () => {
    if (!session) return;
    setSession({
      ...session,
      delayHours: session.delayHours + 1,
    });
  };

  if (session) {
    const activeDistrict = districts.find(d => d.id === session.districtId);
    if (!activeDistrict) return <div>Error: District not found</div>;

    const isCheckedOut = session.checkoutTime !== null;
    const parkedTime = isCheckedOut ? now - session.checkoutTime! : now - session.startTime;
    
    let nextReminderTime = 0;
    if (isCheckedOut) {
      nextReminderTime = session.checkoutTime! + (1 + session.delayHours) * 3600 * 1000 - settings.defaultReminder * 60 * 1000;
    } else {
      nextReminderTime = session.startTime + (session.expectedDurationHours + session.delayHours) * 3600 * 1000 - settings.defaultReminder * 60 * 1000;
    }
    
    const timeToReminder = nextReminderTime - now;

    return (
      <div className="flex flex-col items-center p-6 space-y-8">
        <div className="flex justify-center w-full mt-8">
          <LongPressButton 
            onComplete={isCheckedOut ? handleExit : handleCheckout}
            className="w-48 h-48 rounded-full border border-gray-300 flex flex-col items-center justify-center bg-white shadow-sm active:bg-gray-50 transition-colors"
          >
            <span className="text-2xl font-bold text-gray-800 mb-1">
              {isCheckedOut ? '出场' : '结账'}
            </span>
            <span className="text-sm text-gray-500 mb-1">
              {isCheckedOut ? '已结账' : '已在场'}
            </span>
            <span className="text-lg font-mono text-gray-700">
              {formatDuration(parkedTime)}
            </span>
          </LongPressButton>
        </div>

        <div className="w-full border border-gray-200 p-4 bg-white shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">目前数据</h2>
          
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>已入场: {activeDistrict.name}</p>
            <p>免费时长: {activeDistrict.freeDuration}小时</p>
            <p>出场时长: {activeDistrict.exitDuration}分钟</p>
            <p>距离下次提醒: <span className="font-mono">{timeToReminder > 0 ? formatDuration(timeToReminder) : '已超时'}</span></p>
            <p>缴费公众号: {activeDistrict.paymentAccount || '无'}</p>
          </div>

          <div className="flex justify-end mb-4">
            <button 
              onClick={handleDelay}
              className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium active:bg-sky-600"
            >
              延后1小时
            </button>
          </div>

          <div className="w-full aspect-video bg-gray-100 border-4 border-gray-200 flex items-center justify-center overflow-hidden relative">
            {activeDistrict.qrCode ? (
              <img src={activeDistrict.qrCode} alt="Payment QR" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon size={48} className="text-sky-500 mb-2" />
                <span>暂无缴费码</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex justify-center w-full mt-8 mb-6">
        <LongPressButton 
          onComplete={handleEnter}
          className="w-48 h-48 rounded-full border border-gray-300 flex flex-col items-center justify-center bg-white shadow-sm active:bg-gray-50 transition-colors"
        >
          <span className="text-sm text-gray-500 mb-2">{selectedDistrict?.name || '选择商圈'}</span>
          <span className="text-4xl font-bold text-gray-800">入场</span>
        </LongPressButton>
      </div>

      <div className="text-xs text-gray-500 mb-6 text-center">
        目前经纬度: {currentLocation ? `${currentLocation.lat.toFixed(6)},${currentLocation.lng.toFixed(6)}` : '获取中...'}
      </div>

      <div className="w-full mb-6">
        <div className="text-sm text-gray-700 mb-3">停车时长:</div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setSelectedDuration(settings.defaultDuration)}
            className={`py-3 rounded border text-sm font-medium ${selectedDuration === settings.defaultDuration ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            默认 ({settings.defaultDuration}小时)
          </button>
          <button 
            onClick={() => setSelectedDuration(1)}
            className={`py-3 rounded border text-sm font-medium ${selectedDuration === 1 ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            1小时
          </button>
          <button 
            onClick={() => setSelectedDuration(2)}
            className={`py-3 rounded border text-sm font-medium ${selectedDuration === 2 ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            2小时
          </button>
          <button 
            onClick={() => setSelectedDuration(3)}
            className={`py-3 rounded border text-sm font-medium ${selectedDuration === 3 ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            3小时
          </button>
        </div>
      </div>

      <div className="w-full space-y-4">
        {sortedDistricts.slice(0, 10).map((district) => {
          const distance = currentLocation ? getDistance(currentLocation.lat, currentLocation.lng, district.lat, district.lng) : 0;
          const isSelected = selectedDistrictId === district.id;
          
          return (
            <div 
              key={district.id}
              onClick={() => setSelectedDistrictId(district.id)}
              className={`p-4 border rounded cursor-pointer flex transition-colors ${isSelected ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white'}`}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
