import React, { useState, useEffect } from 'react';
import { UserStory } from '@/types';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

const UserStoryList: React.FC = () => {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchUserStories();
  }, []);

  const fetchUserStories = async () => {
    const { data, error } = await supabase
      .from('user_stories')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user stories',
        variant: 'destructive',
      });
    } else {
      setUserStories(data || []);
    }
  };

  const handleRemoveUserStory = async (id: number) => {
    const { error } = await supabase.from('user_stories').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove user story',
        variant: 'destructive',
      });
    } else {
      setUserStories(userStories.filter((story) => story.id !== id));
      toast({
        title: 'Success',
        description: 'User story removed successfully',
      });
    }
  };

  const filteredStories = userStories.filter((story) =>
    story.number.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Stories</CardTitle>
        <Input
          placeholder="Filter by story number"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {currentStories.map((story) => (
            <AccordionItem key={story.id} value={story.id.toString()}>
              <AccordionTrigger>
                {story.number} - {story.title}
              </AccordionTrigger>
              <AccordionContent>
                <p>{story.description}</p>
                <p>Date: {new Date(story.date).toLocaleDateString()}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveUserStory(story.id)}
                  className="mt-2"
                >
                  Remove
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredStories.length / storiesPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => paginate(i + 1)}
              className="mx-1"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStoryList;