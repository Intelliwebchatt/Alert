import { Contact } from '@/types/contact';
import { ContactCard } from './ContactCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ContactDialog } from './ContactDialog';

interface ContactListProps {
  locationId: string;
  contacts: Contact[];
}

export function ContactList({ locationId, contacts }: ContactListProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
        {contacts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No contacts added yet
          </p>
        )}
      </div>

      <ContactDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        locationId={locationId}
      />
    </div>
  );
}