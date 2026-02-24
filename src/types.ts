export type District = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  needsOperation: boolean;
  freeDuration: number;
  exitDuration: number;
  paymentAccount: string;
  qrCode: string;
};

export type Settings = {
  defaultDuration: number;
  defaultReminder: number;
};

export type ParkingSession = {
  districtId: string;
  startTime: number;
  expectedDurationHours: number;
  checkoutTime: number | null;
  delayHours: number;
};
