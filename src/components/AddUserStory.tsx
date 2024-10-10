import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  number: z.string().min(1, 'Story number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
});

interface AddUserStoryProps {
  onSuccess: () => void;
}

const AddUserStory: React.FC<AddUserStoryProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from('user_stories').insert(values);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add user story',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'User story added successfully',
      });
      form.reset();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Number</FormLabel>
              <FormControl>
                <Input placeholder="US-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="User Story Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="User Story Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add User Story</Button>
      </form>
    </Form>
  );
};

export default AddUserStory;