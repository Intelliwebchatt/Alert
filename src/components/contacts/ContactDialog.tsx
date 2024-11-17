import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/contact';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactType: z.enum(['email', 'sms']),
  contactValue: z.string().refine(
    (value) => {
      if (value === 'email') {
        return z.string().email().safeParse(value).success;
      }
      return phoneRegex.test(value);
    },
    {
      message: 'Invalid email or phone number',
    }
  ),
});

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  contact?: Contact;
}

export function ContactDialog({
  open,
  onOpenChange,
  locationId,
  contact,
}: ContactDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      name: '',
      contactType: 'email',
      contactValue: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      setIsLoading(true);
      if (contact) {
        await api.contact.update.mutate({
          id: contact.id,
          ...values,
        });
        toast.success('Contact updated successfully');
      } else {
        await api.contact.create.mutate({
          locationId,
          ...values,
        });
        toast.success('Contact created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('contactType') === 'email'
                      ? 'Email Address'
                      : 'Phone Number'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        form.watch('contactType') === 'email'
                          ? 'john@example.com'
                          : '+1234567890'
                      }
                      type={form.watch('contactType') === 'email' ? 'email' : 'tel'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}