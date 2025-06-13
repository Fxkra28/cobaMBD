import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js'; 
import { Settings, Key, Calendar, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast'; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; 

interface SettingsPageProps {
  user: User;
  supabaseClient: any; 
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, supabaseClient }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState<Date | undefined>(user.user_metadata?.birthdate ? new Date(user.user_metadata.birthdate) : undefined);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingBirthdate, setIsUpdatingBirthdate] = useState(false);
  const [isUpdatingPhoneNumber, setIsUpdatingPhoneNumber] = useState(false);

  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleChangeBirthdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingBirthdate(true);

    if (!birthdate) {
      toast({
        title: "Error",
        description: "Please select a birthdate.",
        variant: "destructive",
      });
      setIsUpdatingBirthdate(false);
      return;
    }

    try {
      // Supabase's updateUser can handle user_metadata updates directly
      const { error } = await supabaseClient.auth.updateUser({
        data: { birthdate: birthdate.toISOString().split('T')[0] }, // Format as YYYY-MM-DD
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your birthdate has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update birthdate.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingBirthdate(false);
    }
  };

  const handleChangePhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPhoneNumber(true);

    try {
      // Supabase's updateUser for phone number (requires SMS verification setup in Supabase)
      const { error } = await supabaseClient.auth.updateUser({
        phone: phoneNumber,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your phone number has been updated. Please check your phone for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update phone number.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPhoneNumber(false);
    }
  };


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> Change Password
          </CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Change Birthdate */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Change Birthdate
          </CardTitle>
          <CardDescription>Update your birthdate information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeBirthdate} className="space-y-4">
            <div>
              <Label htmlFor="birthdate">Birthdate</Label>
              <Popover>
                <PopoverTrigger asChild>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {/* You'll need to import a Calendar component, e.g., from shadcn/ui date picker */}
                  {/* For simplicity, I'm omitting the full Calendar implementation here. */}
                  {/* You'd typically use a component like <Calendar mode="single" selected={birthdate} onSelect={setBirthdate} initialFocus /> */}
                   <p className="p-4 text-sm text-muted-foreground">Calendar component goes here (e.g., ShadCN's `Calendar`)</p>
                </PopoverContent>
              </Popover>
              {/* Fallback for demonstration if Calendar component isn't integrated yet */}
              <Input
                id="birthdate-fallback"
                type="date"
                value={birthdate ? format(birthdate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setBirthdate(e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-2"
              />
            </div>
            <Button type="submit" disabled={isUpdatingBirthdate}>
              {isUpdatingBirthdate ? 'Updating...' : 'Update Birthdate'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Phone Number */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" /> Phone Number
          </CardTitle>
          <CardDescription>Update your phone number.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePhoneNumber} className="space-y-4">
            <div>
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel" // Use type="tel" for phone numbers
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +6281234567890"
                required
              />
            </div>
            <Button type="submit" disabled={isUpdatingPhoneNumber}>
              {isUpdatingPhoneNumber ? 'Updating...' : 'Update Phone Number'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
