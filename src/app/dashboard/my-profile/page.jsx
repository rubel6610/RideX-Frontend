"use client";

import { useAuth } from "@/app/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Pencil } from "lucide-react";
import { useState } from "react";
import EditProfilePopup from "./Components/EditProfilePopup";
import { ProfileSkeleton } from "@/components/Shared/Skeleton/ProfileSkeleton";
import { useFetchData, useUpdateData } from "@/app/hooks/useApi";
import { toast } from "sonner";

// Reusable row
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-base text-foreground font-semibold">
        {value || "-"}
      </span>
    </div>
  );
}

const MyProfile = () => {
  const { user } = useAuth();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // ✅ Fetch user profile using query params (email)
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useFetchData("user", "user", { email: user?.email }, { 
    enabled: !!user && !!user.email && typeof user.email === 'string' && user.email.trim() !== ''
  });

  // ✅ Update user profile using your reusable `useUpdateData`
  const updateProfile = useUpdateData("user", {
    onSuccess: () => {
      toast.success("Profile updated successfully ✅");
      setIsEditPopupOpen(false);
    },
    onError: () => {
      toast.error("Failed to update profile ❌");
    },
  });

  // ✅ Save handler
  const handleSaveProfile = (updatedData) => {
    updateProfile.mutate({ id: profile._id, ...updatedData });
  };

  if (isLoading) return <ProfileSkeleton />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg p-0 border-2 border-primary/20">
        {/* Header Section */}
        <div className="flex flex-col items-center pt-10 pb-6 bg-background rounded-t-2xl">
          <div className="relative">
            <img
              src={profile.photoUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow"
            />
            <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-primary text-background text-xs font-bold shadow-lg border border-primary/20">
              {profile.role}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mt-4 flex items-center gap-2">
            {profile.fullName}
            {profile.isVerified === "verified" && (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )}
          </h2>
          <span className="text-base text-muted-foreground mb-2">
            {profile.email}
          </span>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Personal details
            </h3>
            <div className="bg-accent/20 rounded-xl border border-primary/10 divide-y divide-border/10">
              <DetailRow label="Full name" value={profile.fullName} />
              <DetailRow label="Date of Birth" value={profile.dateOfBirth} />
              <DetailRow label="Gender" value={profile.gender} />
              <DetailRow label="Nationality" value="Bangladeshi" />
              <DetailRow
                label="Address"
                value={`${profile.present_address?.village}, ${profile.present_address?.district}`}
              />
              <DetailRow label="Phone Number" value={profile.phoneNumber} />
              <DetailRow label="Email" value={profile.email} />
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Account Details
            </h3>
            <div className="bg-accent/20 rounded-xl border border-primary/10 divide-y divide-border/10">
              <DetailRow
                label="Display Name"
                value={profile.fullName.split(" ")[0].toLowerCase()}
              />
              <DetailRow
                label="Account Created"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
              <DetailRow
                label="Last Login"
                value={new Date(profile.lastLogin).toLocaleDateString()}
              />
              <DetailRow label="Membership Status" value="Standard Member" />
              <DetailRow
                label="Account Verification"
                value={
                  profile.isVerified 
                }
              />
              <DetailRow label="Language Preference" value="English" />
              <DetailRow label="Time Zone" value="GMT+6 (Dhaka)" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 px-8 pb-8">
          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2"
            onClick={() => setIsEditPopupOpen(true)}
          >
            <Pencil className="w-5 h-5" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Edit Profile Popup */}
      <EditProfilePopup
        profile={profile}
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default MyProfile;
