"use client"
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export default function RiderStatus({ riderId }) {
    const [online, setOnline] = useState(false);

    const goOnline = async () => {
        await fetch('/api/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ riderId, status: online ? 'offline' : 'online' })
        });
        setOnline(!online);
    };

    return (
        <div>
            <button
                onClick={goOnline}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40
                    ${online
                        ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                        : 'bg-accent border-accent text-foreground hover:bg-accent/60'}
                `}
                aria-pressed={online}
            >
                {online ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                <span className="ml-1">
                    {online ? 'Online' : 'Offline'}
                </span>
            </button>
        </div>
    );
}
