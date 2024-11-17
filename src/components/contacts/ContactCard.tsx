import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Contact } from '@/types/contact';
import { ContactDialog } from './ContactDialog';
import { DeleteContactDialog } from './DeleteContactDialog';

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {contact.contactType === 'email' ? (
              <Mail className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Phone className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-muted-foreground">
                {contact.contactValue}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ContactDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        locationId={contact.locationId}
        contact={contact}
      />

      <DeleteContactDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        contactId={contact.id}
        contactName={contact.name}
      />
    </>
  );
}