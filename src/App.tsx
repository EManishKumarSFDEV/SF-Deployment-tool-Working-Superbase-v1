import React, { useState, useEffect } from 'react';
import UserStoryList from '@/components/UserStoryList';
import AddUserStory from '@/components/AddUserStory';
import ChangeTracker from '@/components/ChangeTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function App() {
  const [selectedUserStoryId, setSelectedUserStoryId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUserStorySelect = (id: number) => {
    setSelectedUserStoryId(id);
  };

  const handleAddUserStorySuccess = () => {
    // Refresh the user story list
    setSelectedUserStoryId(null);
  };

  useEffect(() => {
    if (!supabase) {
      setError('Supabase client is not initialized. Please check your environment variables.');
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Salesforce Deployment Tracker</h1>
      <Tabs defaultValue="userStories">
        <TabsList>
          <TabsTrigger value="userStories">User Stories</TabsTrigger>
          <TabsTrigger value="addUserStory">Add User Story</TabsTrigger>
          <TabsTrigger value="changeTracker">Change Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="userStories">
          <Input
            placeholder="Filter user stories by number"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4"
          />
          <UserStoryList filter={filter} onSelect={handleUserStorySelect} />
        </TabsContent>
        <TabsContent value="addUserStory">
          <AddUserStory onSuccess={handleAddUserStorySuccess} />
        </TabsContent>
        <TabsContent value="changeTracker">
          {selectedUserStoryId ? (
            <ChangeTracker userStoryId={selectedUserStoryId} />
          ) : (
            <p>Please select a user story to view and manage changes.</p>
          )}
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}

export default App;