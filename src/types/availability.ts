export type Availability = {
  id: string;
  professionalId: string;
  weekday: number;
  startTime: string; // "09:00"
  endTime: string; // "14:00"
  professional?: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
};
