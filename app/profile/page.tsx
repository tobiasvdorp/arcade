"use client";

import { useState } from "react";
import Image from "next/image";
import { AchievementBadge } from "@/components/ui/AchievementBadge";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <section className="container py-8" aria-labelledby="profile-heading">
      <h1 id="profile-heading" className="text-3xl font-bold mb-6">
        Profile
      </h1>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="rounded-2xl border glass shadow-soft p-4">
          <div className="aspect-square rounded-xl overflow-hidden border bg-muted">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile avatar"
                width={400}
                height={400}
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-muted-foreground">
                No avatar
              </div>
            )}
          </div>
          <label className="mt-3 block text-sm font-medium">
            Upload avatar
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setAvatar(reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <div className="rounded-2xl border glass shadow-soft p-4">
          <h2 className="text-lg font-semibold">Trophies</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <AchievementBadge label="First Win" />
            <AchievementBadge label="1000 Points" />
            <AchievementBadge label="Combo Master" />
          </div>
        </div>
      </div>
    </section>
  );
}
