import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LocationCard } from '@/components/locations/LocationCard';
import { LocationDialog } from '@/components/locations/LocationDialog';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Locations() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data: locations, isLoading } = api.location.list.useQuery();

  const handleUpdateLocation = async (
    id: string,
    data: { active: boolean }
  ) => {
    try {
      await api.location.update.mutate({ id, ...data });
      toast.success('Location updated successfully');
    } catch (error) {
      toast.error('Failed to update location');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations?.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onUpdate={handleUpdateLocation}
          />
        ))}
        {locations?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No locations found</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsAddOpen(true)}
            >
              Add your first location
            </Button>
          </div>
        )}
      </div>

      <LocationDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}