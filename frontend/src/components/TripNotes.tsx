import { useState } from 'react';
import { useGetTripNotes, useAddTravelNote, useDeleteTravelNote } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface TripNotesProps {
  tripId: string;
}

const NOTE_CATEGORIES = [
  'Flight Details',
  'Accommodation',
  'Activities',
  'Restaurants',
  'Emergency Contacts',
  'Important Documents',
  'Packing List',
  'General',
];

export default function TripNotes({ tripId }: TripNotesProps) {
  const { data: notes = [], isLoading } = useGetTripNotes(tripId);
  const { mutate: addNote, isPending: isAddingNote } = useAddTravelNote();
  const { mutate: deleteNote } = useDeleteTravelNote();

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    addNote(
      {
        tripId,
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
      },
      {
        onSuccess: () => {
          setIsAddNoteOpen(false);
          setNoteTitle('');
          setNoteContent('');
          setNoteCategory('General');
        },
      }
    );
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Travel Notes & Documents</h3>
          <p className="text-sm text-muted-foreground">
            Keep all your important travel information organized
          </p>
        </div>
        <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Travel Note</DialogTitle>
              <DialogDescription>
                Create a new note or document for this trip
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="noteTitle">Title *</Label>
                <Input
                  id="noteTitle"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g., Flight Confirmation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noteCategory">Category *</Label>
                <Select value={noteCategory} onValueChange={setNoteCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="noteContent">Content *</Label>
                <Textarea
                  id="noteContent"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your note details here..."
                  rows={8}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingNote}>
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notes yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first note to keep track of important information
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map(note => (
            <Card key={note.id} className="group relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(note.createdAt)}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteNote(note.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Badge variant="secondary" className="w-fit mt-2">
                  {note.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
