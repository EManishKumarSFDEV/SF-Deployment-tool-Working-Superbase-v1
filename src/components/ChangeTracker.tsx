import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FieldChange, LWCChange, ProfileChange, PermissionChange } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ChangeTrackerProps {
  userStoryId: number;
}

const ChangeTracker: React.FC<ChangeTrackerProps> = ({ userStoryId }) => {
  const [fieldChanges, setFieldChanges] = useState<FieldChange[]>([]);
  const [lwcChanges, setLWCChanges] = useState<LWCChange[]>([]);
  const [profileChanges, setProfileChanges] = useState<ProfileChange[]>([]);
  const [permissionChanges, setPermissionChanges] = useState<PermissionChange[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchChanges();
  }, [userStoryId]);

  const fetchChanges = async () => {
    const fetchData = async (table: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('userStoryId', userStoryId);

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to fetch ${table}`,
          variant: 'destructive',
        });
      } else {
        setter(data || []);
      }
    };

    await fetchData('field_changes', setFieldChanges);
    await fetchData('lwc_changes', setLWCChanges);
    await fetchData('profile_changes', setProfileChanges);
    await fetchData('permission_changes', setPermissionChanges);
  };

  const handleAddChange = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert({ ...data, userStoryId });

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to add ${table.replace('_', ' ')}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${table.replace('_', ' ')} added successfully`,
      });
      fetchChanges();
    }
  };

  const handleRemoveChange = async (table: string, id: number) => {
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to remove ${table.replace('_', ' ')}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${table.replace('_', ' ')} removed successfully`,
      });
      fetchChanges();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Field Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {fieldChanges.map((change) => (
            <div key={change.id} className="mb-2">
              <p>API Name: {change.apiName}</p>
              <p>Label: {change.label}</p>
              <p>Field Type: {change.fieldType}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveChange('field_changes', change.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              handleAddChange('field_changes', {
                apiName: form.apiName.value,
                label: form.label.value,
                fieldType: form.fieldType.value,
              });
              form.reset();
            }}
            className="space-y-2"
          >
            <Input name="apiName" placeholder="API Name" required />
            <Input name="label" placeholder="Label" required />
            <Input name="fieldType" placeholder="Field Type" required />
            <Button type="submit">Add Field Change</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LWC Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {lwcChanges.map((change) => (
            <div key={change.id} className="mb-2">
              <p>Component Name: {change.componentName}</p>
              <p>File Type: {change.fileType}</p>
              <p>Code: {change.code.substring(0, 50)}...</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveChange('lwc_changes', change.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              handleAddChange('lwc_changes', {
                componentName: form.componentName.value,
                fileType: form.fileType.value,
                code: form.code.value,
              });
              form.reset();
            }}
            className="space-y-2"
          >
            <Input name="componentName" placeholder="Component Name" required />
            <Input name="fileType" placeholder="File Type" required />
            <Textarea name="code" placeholder="Code" required />
            <Button type="submit">Add LWC Change</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {profileChanges.map((change) => (
            <div key={change.id} className="mb-2">
              <p>Profile Name: {change.profileName}</p>
              <p>Changes: {change.changes}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveChange('profile_changes', change.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              handleAddChange('profile_changes', {
                profileName: form.profileName.value,
                changes: form.changes.value,
              });
              form.reset();
            }}
            className="space-y-2"
          >
            <Input name="profileName" placeholder="Profile Name" required />
            <Textarea name="changes" placeholder="Changes" required />
            <Button type="submit">Add Profile Change</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {permissionChanges.map((change) => (
            <div key={change.id} className="mb-2">
              <p>Permission Set: {change.permissionSet}</p>
              <p>Permission: {change.permission}</p>
              <p>Access: {change.access}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveChange('permission_changes', change.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              handleAddChange('permission_changes', {
                permissionSet: form.permissionSet.value,
                permission: form.permission.value,
                access: form.access.value,
              });
              form.reset();
            }}
            className="space-y-2"
          >
            <Input name="permissionSet" placeholder="Permission Set" required />
            <Input name="permission" placeholder="Permission" required />
            <Select name="access" required>
              <SelectTrigger>
                <SelectValue placeholder="Select access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Read">Read</SelectItem>
                <SelectItem value="Write">Write</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add Permission Change</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeTracker;