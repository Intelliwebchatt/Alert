export interface Contact {
  id: string;
  locationId: string;
  name: string;
  contactType: 'email' | 'sms';
  contactValue: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactInput {
  locationId: string;
  name: string;
  contactType: 'email' | 'sms';
  contactValue: string;
}

export interface UpdateContactInput extends Partial<Omit<CreateContactInput, 'locationId'>> {}