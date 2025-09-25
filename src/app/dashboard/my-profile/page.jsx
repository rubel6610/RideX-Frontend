"use client";

import { useAuth } from '@/app/hooks/AuthProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, LogOut, Pencil } from 'lucide-react';


import { useEffect, useState } from 'react';

const MyProfile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
                if (!baseUrl) throw new Error('Base URL not set');
                const res = await fetch(`${baseUrl}/api/users`);
                if (!res.ok) throw new Error('Failed to fetch user data');
                const data = await res.json();
                // If API returns an array, filter by email
                const found = Array.isArray(data)
                  ? data.find(u => u.email === user?.email)
                  : (data.email === user?.email ? data : null);
                setProfile(found);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchProfile();
    }, [user]);

    if (loading) return <ProfileSkeleton />;
// ProfileSkeleton for loading state
function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg p-0 border border-border/20 animate-pulse">
            <div className="flex flex-col items-center pt-10 pb-6 bg-background rounded-t-2xl">
                <Skeleton className="w-28 h-28 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2 rounded" />
                <Skeleton className="h-5 w-32 mb-2 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
                <div>
                    <Skeleton className="h-6 w-40 mb-4 rounded" />
                    <div className="bg-accent/10 rounded-xl border border-border/10 divide-y divide-border/10">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full my-3 rounded" />
                        ))}
                    </div>
                </div>
                <div>
                    <Skeleton className="h-6 w-40 mb-4 rounded" />
                    <div className="bg-accent/10 rounded-xl border border-border/10 divide-y divide-border/10">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full my-3 rounded" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4 px-8 pb-8">
                <Skeleton className="h-10 w-32 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
            </div>
        </div>
    );
}
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!profile) return <div>No profile data found.</div>;

    return (
        <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg p-0 border-2 border-primary/20">
            {/* Header Section */}
            <div className="flex flex-col items-center pt-10 pb-6 bg-background rounded-t-2xl">
                <div className="relative">
                    <img src={profile.photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow" />
                    <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-primary text-background text-xs font-bold shadow-lg border border-primary/20">{profile.role}</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mt-4 flex items-center gap-2">
                    {profile.fullName}
                    {profile.isVerified === 'verified' && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                </h2>
                <span className="text-base text-muted-foreground mb-2">{profile.email}</span>
            </div>
            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
                {/* Personal Details */}
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">Personal details</h3>
                    <div className="bg-accent/20 rounded-xl border border-primary/10 divide-y divide-border/10">
                        <DetailRow label="Full name" value={profile.fullName} />
                        <DetailRow label="Date of Birth" value={profile.dateOfBirth} />
                        <DetailRow label="Gender" value={profile.gender} />
                        <DetailRow label="Nationality" value="Bangladeshi" />
                        <DetailRow label="Address" value={`${profile.present_address?.village}, ${profile.present_address?.district}`} />
                        <DetailRow label="Phone Number" value={profile.phoneNumber} />
                        <DetailRow label="Email" value={profile.email} />
                    </div>
                </div>
                {/* Account Details */}
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">Account Details</h3>
                    <div className="bg-accent/20 rounded-xl border border-primary/10 divide-y divide-border/10">
                        <DetailRow label="Display Name" value={profile.fullName.replace(/\s/g, '_').toLowerCase()} />
                        <DetailRow label="Account Created" value={new Date(profile.createdAt).toLocaleDateString()} />
                        <DetailRow label="Last Login" value={new Date().toLocaleDateString()} />
                        <DetailRow label="Membership Status" value="Standard Member" />
                        <DetailRow label="Account Verification" value={profile.isVerified === 'verified' ? (
                            <span className="px-2 py-0.5 rounded bg-success/10 text-success text-xs font-semibold border border-success/30">Verified</span>
                        ) : (
                            <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/30">Pending</span>
                        )} />
                        <DetailRow label="Language Preference" value="English" />
                        <DetailRow label="Time Zone" value="GMT+6 (Dhaka)" />
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 px-8 pb-8">
                <Link href="/dashboard/my-profile/edit">
                    <Button variant="primary" size="lg" className="flex items-center gap-2">
                        <Pencil className="w-5 h-5" /> Edit Profile
                    </Button>
                </Link>
                <Button variant="destructive" size="lg" className="flex items-center gap-2" onClick={logout}>
                    <LogOut className="w-5 h-5" /> Sign Out
                </Button>
            </div>
        </div>
    );
// DetailRow component for clean row styling
function DetailRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-3 px-4">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <span className="text-base text-foreground font-semibold">{value || '-'}</span>
        </div>
    );
}
};

export default MyProfile;