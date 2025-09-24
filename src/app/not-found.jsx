"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md text-center shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-primary/10 text-primary">
            <Car size={40} />
          </div>
          <CardTitle className="text-5xl font-extrabold text-gray-800 dark:text-gray-100 mt-4">
            404
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you are looking for took a wrong turn.  
            Let’s get you back on the RideX route.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="rounded-xl px-6">
                Go Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-6 flex items-center"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
