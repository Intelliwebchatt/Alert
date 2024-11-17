import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Location } from '@/types/location';
import { LocationDialog } from './LocationDialog';
import { DeleteLocationDialog } from './DeleteLocationDialog';

interface LocationCardProps {
  location: Location;
  onUpdate: (id: string, data: { active: boolean }) => Promise<void>;
}

export function LocationCard({ location, onUpdate }: LocationCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleActiveToggle = async () => {
    await onUpdate(location.id, { active: !location.active });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{location.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              checked={location.active}
              onCheckedChange={handleActiveToggle}
              aria-label="Toggle location active state"
            />
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
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{location.address}</p>
              <p className="text-sm">
                Radius: {location.radius}m
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LocationDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        location={location}
      />

      <DeleteLocationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        locationId={location.id}
        locationName={location.name}
      />
    </>
  );
}