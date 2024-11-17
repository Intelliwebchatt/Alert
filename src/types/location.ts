export interface Location {
  id: string;
  userId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLocationInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface UpdateLocationInput extends Partial<CreateLocationInput> {
  active?: boolean;
}