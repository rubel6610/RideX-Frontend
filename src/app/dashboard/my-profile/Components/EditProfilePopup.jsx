"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Upload,
  Save,
  Loader2,
  User,
  Phone,
  Calendar,
  MapPin,
  Home,
} from "lucide-react";
import { useUpdateData } from "@/app/hooks/useApi";

const EditProfilePopup = ({ profile, isOpen, onClose, userId }) => {
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const updateUserMutation = useUpdateData("user", {
    onSuccess: () => {
      onClose();
    },
    onError: () => {
      alert("Failed to save profile. Please try again.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      present_address: {
        village: "",
        district: "",
        division: "",
        postalCode: "",
      },
      permanent_address: {
        village: "",
        district: "",
        division: "",
        postalCode: "",
      },
      bio: "",
      photoUrl: "",
    },
  });

  const presentAddress = watch("present_address");

  // Load profile data when modal opens
  useEffect(() => {
    if (profile && isOpen) {
      reset({
        fullName: profile.fullName || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        phoneNumber: profile.phoneNumber || "",
        present_address: {
          village: profile.present_address?.village || "",
          district: profile.present_address?.district || "",
          division: profile.present_address?.division || "",
          postalCode: profile.present_address?.postalCode || "",
        },
        permanent_address: {
          village: profile.permanent_address?.village || "",
          district: profile.permanent_address?.district || "",
          division: profile.permanent_address?.division || "",
          postalCode: profile.permanent_address?.postalCode || "",
        },
        bio: profile.bio || "",
        photoUrl: profile.photoUrl || "",
      });
      setImagePreview(profile.photoUrl || "");
    }
  }, [profile, isOpen, reset]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Copy present address to permanent address
  const useSameAsPresentAddress = () => {
    setValue("permanent_address", presentAddress);
  };

  // Upload image to imgbb
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      process.env.IMGBB_KEY,
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await res.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let photoUrl = data.photoUrl;

      if (selectedImage) {
        photoUrl = await uploadImageToImgbb(selectedImage);
      }

      const updatedData = { ...data, photoUrl };
      await updateUserMutation.mutateAsync({ id: profile._id, ...updatedData });
    } catch (error) {
      console.error("Error saving profile:", error);
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="p-6 space-y-6">
            {/* Profile Photo */}
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
                <Label
                  htmlFor="photoUrl"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
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
                    onClick={() => document.getElementById("photoUrl").click()}
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

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName", { required: "Full name is required" })}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[\d\s-()]{10,}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={errors.dateOfBirth ? "border-destructive" : ""}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  defaultValue={watch("gender")}
                >
                  <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("gender")} />
              </div>
            </div>

            {/* Present Address */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Present Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input placeholder="Village" {...register("present_address.village")} />
                <Input placeholder="District" {...register("present_address.district")} />
                <Input placeholder="Division" {...register("present_address.division")} />
                <Input placeholder="Postal Code" {...register("present_address.postalCode")} />
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Permanent Address
                </h3>
                <Button type="button" size="sm" variant="outline" onClick={useSameAsPresentAddress}>
                  Same as Present Address
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input placeholder="Village" {...register("permanent_address.village")} />
                <Input placeholder="District" {...register("permanent_address.district")} />
                <Input placeholder="Division" {...register("permanent_address.division")} />
                <Input placeholder="Postal Code" {...register("permanent_address.postalCode")} />
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} placeholder="Tell us about yourself..." {...register("bio")} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-accent/5">
            <Button type="button" variant="destructive" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
