"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Upload, 
  Save, 
  Loader2, 
  User, 
  Phone, 
  Calendar,
  MapPin,
  Home
} from 'lucide-react';

const EditProfilePopup = ({ profile, isOpen, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      present_address: {
        village: '',
        district: '',
        division: '',
        postalCode: ''
      },
      permanent_address: {
        village: '',
        district: '',
        division: '',
        postalCode: ''
      },
      bio: '',
      photoUrl: ''
    }
  });

  // Watch for address changes to enable/disable same as present address
  const presentAddress = watch('present_address');
  const permanentAddress = watch('permanent_address');


  useEffect(() => {
    if (profile && isOpen) {
      reset({
        fullName: profile.fullName || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        phoneNumber: profile.phoneNumber || '',
        present_address: {
          village: profile.present_address?.village || '',
          district: profile.present_address?.district || '',
          division: profile.present_address?.division || '',
          postalCode: profile.present_address?.postalCode || ''
        },
        permanent_address: {
          village: profile.permanent_address?.village || '',
          district: profile.permanent_address?.district || '',
          division: profile.permanent_address?.division || '',
          postalCode: profile.permanent_address?.postalCode || ''
        },
        bio: profile.bio || '',
        photoUrl: profile.photoUrl || ''
      });
      setImagePreview(profile.photoUrl || '');
    }
  }, [profile, isOpen, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for image files
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setValue('photoUrl', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const useSameAsPresentAddress = () => {
    setValue('permanent_address', presentAddress);
  };

  const onSubmit = async (data) => {

    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6" />
            Edit Profile
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Profile Photo Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary/50" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="photoUrl" className="text-sm font-medium text-foreground mb-2 block">
                  Profile Photo
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="photoUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('photoUrl').click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...register('fullName', { required: 'Full name is required' })}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[\d\s-()]{10,}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  className={errors.phoneNumber ? 'border-destructive' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth', {
                    validate: (value) => {
                      if (!value) return true;
                      const birthDate = new Date(value);
                      const today = new Date();
                      return birthDate <= today || 'Date of birth cannot be in the future';
                    }
                  })}
                  className={errors.dateOfBirth ? 'border-destructive' : ''}
                />
                {errors.dateOfBirth && (
                  <p className="text-destructive text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender" className="mb-2 block">Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value)} defaultValue={watch('gender')}>
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('gender')} />
              </div>
            </div>

            {/* Present Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Present Address</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="present_village">Village/Area</Label>
                  <Input
                    id="present_village"
                    {...register('present_address.village')}
                  />
                </div>
                <div>
                  <Label htmlFor="present_district">District</Label>
                  <Input
                    id="present_district"
                    {...register('present_address.district')}
                  />
                </div>
                <div>
                  <Label htmlFor="present_division">Division</Label>
                  <Input
                    id="present_division"
                    {...register('present_address.division')}
                  />
                </div>
                <div>
                  <Label htmlFor="present_postalCode">Postal Code</Label>
                  <Input
                    id="present_postalCode"
                    {...register('present_address.postalCode')}
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Permanent Address</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useSameAsPresentAddress}
                  className="text-xs"
                >
                  Same as Present Address
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="permanent_village">Village/Area</Label>
                  <Input
                    id="permanent_village"
                    {...register('permanent_address.village')}
                  />
                </div>
                <div>
                  <Label htmlFor="permanent_district">District</Label>
                  <Input
                    id="permanent_district"
                    {...register('permanent_address.district')}
                  />
                </div>
                <div>
                  <Label htmlFor="permanent_division">Division</Label>
                  <Input
                    id="permanent_division"
                    {...register('permanent_address.division')}
                  />
                </div>
                <div>
                  <Label htmlFor="permanent_postalCode">Postal Code</Label>
                  <Input
                    id="permanent_postalCode"
                    {...register('permanent_address.postalCode')}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="mb-2 block">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="Tell us a little about yourself..."
                {...register('bio')}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-border/20 bg-accent/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;