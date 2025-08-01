import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, Users, Building, Trash2, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';

interface BookingRequest {
  id: string;
  roomName: string;
  roomType: string;
  location: string;
  lecturerName: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
}

interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'auditorium';
  location: string;
  level: string;
  capacity: number;
}

const Index = () => {
  const { toast } = useToast();
  
  // Sample data for pending bookings
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: 'BR001',
      roomName: 'Lab A1',
      roomType: 'Computer Lab',
      location: 'Block A, Level 1',
      lecturerName: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '09:00',
      duration: '2 hours',
      status: 'pending',
      purpose: 'Programming Workshop'
    },
    {
      id: 'BR002',
      roomName: 'Classroom B3',
      roomType: 'Lecture Hall',
      location: 'Block B, Level 3',
      lecturerName: 'Prof. Michael Chen',
      date: '2024-01-16',
      time: '14:00',
      duration: '1.5 hours',
      status: 'pending',
      purpose: 'Database Systems Lecture'
    },
    {
      id: 'BR003',
      roomName: 'Auditorium Main',
      roomType: 'Auditorium',
      location: 'Main Building',
      lecturerName: 'Dr. Emma Wilson',
      date: '2024-01-17',
      time: '10:00',
      duration: '3 hours',
      status: 'pending',
      purpose: 'Annual Tech Conference'
    }
  ]);

  // Sample data for rooms
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'R001', name: 'Lab A1', type: 'lab', location: 'Block A', level: 'Level 1', capacity: 30 },
    { id: 'R002', name: 'Classroom B3', type: 'classroom', location: 'Block B', level: 'Level 3', capacity: 45 },
    { id: 'R003', name: 'Auditorium Main', type: 'auditorium', location: 'Main Building', level: 'Ground Floor', capacity: 200 },
    { id: 'R004', name: 'Lab C2', type: 'lab', location: 'Block C', level: 'Level 2', capacity: 25 },
    { id: 'R005', name: 'Classroom A4', type: 'classroom', location: 'Block A', level: 'Level 4', capacity: 40 }
  ]);

  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: '',
    type: 'classroom',
    location: '',
    level: '',
    capacity: 0
  });

  const handleApproveBooking = (id: string) => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: 'approved' as const } : booking
      )
    );
    toast({
      title: "Booking Approved",
      description: "The booking request has been approved successfully.",
    });
  };

  const handleRejectBooking = (id: string) => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: 'rejected' as const } : booking
      )
    );
    toast({
      title: "Booking Rejected",
      description: "The booking request has been rejected.",
      variant: "destructive",
    });
  };

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.location || !newRoom.level || !newRoom.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const room: Room = {
      ...newRoom,
      id: `R${String(rooms.length + 1).padStart(3, '0')}`
    };

    setRooms(prev => [...prev, room]);
    setNewRoom({ name: '', type: 'classroom', location: '', level: '', capacity: 0 });
    setIsAddRoomOpen(false);
    toast({
      title: "Room Added",
      description: "New room has been added successfully.",
    });
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setNewRoom(room);
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    setRooms(prev => 
      prev.map(room => 
        room.id === editingRoom.id ? { ...newRoom, id: editingRoom.id } : room
      )
    );
    setEditingRoom(null);
    setNewRoom({ name: '', type: 'classroom', location: '', level: '', capacity: 0 });
    toast({
      title: "Room Updated",
      description: "Room information has been updated successfully.",
    });
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast({
      title: "Room Deleted",
      description: "Room has been deleted successfully.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Building className="h-4 w-4 text-blue-600" />;
      case 'auditorium':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <MapPin className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">APIIT Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Classroom Booking Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="bookings">Pending Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
          </TabsList>

          {/* Pending Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Pending Booking Requests</span>
                </CardTitle>
                <CardDescription>
                  Review and manage classroom booking requests from lecturers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Room Details</TableHead>
                        <TableHead>Lecturer</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingRequests.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{booking.roomName}</div>
                              <div className="text-sm text-muted-foreground">{booking.roomType}</div>
                              <div className="text-sm text-muted-foreground">{booking.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.lecturerName}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{booking.date}</div>
                              <div className="text-sm text-muted-foreground">
                                {booking.time} ({booking.duration})
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.purpose}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveBooking(booking.id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBooking(booking.id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Room Management Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Room Management</span>
                    </CardTitle>
                    <CardDescription>
                      Add, edit, and manage classroom information
                    </CardDescription>
                  </div>
                  <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Room</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new room.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input
                            id="name"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">Type</Label>
                          <Select value={newRoom.type} onValueChange={(value: 'classroom' | 'lab' | 'auditorium') => setNewRoom(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="classroom">Classroom</SelectItem>
                              <SelectItem value="lab">Lab</SelectItem>
                              <SelectItem value="auditorium">Auditorium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location" className="text-right">Location</Label>
                          <Input
                            id="location"
                            value={newRoom.location}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, location: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="level" className="text-right">Level</Label>
                          <Input
                            id="level"
                            value={newRoom.level}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, level: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="capacity" className="text-right">Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={newRoom.capacity || ''}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddRoom}>Add Room</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.id}</TableCell>
                          <TableCell>{room.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getRoomTypeIcon(room.type)}
                              <span className="capitalize">{room.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{room.location}</TableCell>
                          <TableCell>{room.level}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{room.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog open={editingRoom?.id === room.id} onOpenChange={(open) => !open && setEditingRoom(null)}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditRoom(room)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Room</DialogTitle>
                                    <DialogDescription>
                                      Update the room information.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-name" className="text-right">Name</Label>
                                      <Input
                                        id="edit-name"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-type" className="text-right">Type</Label>
                                      <Select value={newRoom.type} onValueChange={(value: 'classroom' | 'lab' | 'auditorium') => setNewRoom(prev => ({ ...prev, type: value }))}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="classroom">Classroom</SelectItem>
                                          <SelectItem value="lab">Lab</SelectItem>
                                          <SelectItem value="auditorium">Auditorium</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-location" className="text-right">Location</Label>
                                      <Input
                                        id="edit-location"
                                        value={newRoom.location}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, location: e.target.value }))}
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-level" className="text-right">Level</Label>
                                      <Input
                                        id="edit-level"
                                        value={newRoom.level}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, level: e.target.value }))}
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-capacity" className="text-right">Capacity</Label>
                                      <Input
                                        id="edit-capacity"
                                        type="number"
                                        value={newRoom.capacity || ''}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                                        className="col-span-3"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleUpdateRoom}>Update Room</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteRoom(room.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
