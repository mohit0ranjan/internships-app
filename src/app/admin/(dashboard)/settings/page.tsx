"use client";

import { useState } from "react";
import useSWR from "swr";
import { Settings, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SettingsPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/settings", fetcher);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  const handleSave = async (id: string, originalValue: string) => {
    const value = localValues[id] ?? originalValue;
    if (value === originalValue) return;

    setSavingId(id);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update setting");

      toast.success("Setting updated successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) return <div className="p-6">Loading Settings...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load settings data</div>;

  const settings = data?.settings || [];
  
  // Group settings by category
  const groupedSettings = settings.reduce((acc: any, setting: any) => {
    const cat = setting.category || "GENERAL";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 ">System Settings</h1>
          <p className="text-navy-500  mt-1">Configure global application variables and behaviors.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Caution</h4>
          <p className="text-sm text-amber-700 mt-1">
            Modifying these values can directly impact the registration flow, email sending, and system access. Make changes carefully.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedSettings).map((category) => (
          <Card key={category} className="border-navy-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-wider text-navy-600">
                <Settings className="w-5 h-5" /> {category} SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedSettings[category].map((setting: any) => {
                const isDirty = localValues[setting.id] !== undefined && localValues[setting.id] !== setting.value;
                return (
                  <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pb-4 border-b border-navy-50 last:border-0 last:pb-0">
                    <div className="md:col-span-1">
                      <p className="font-semibold text-navy-900 font-mono text-sm">{setting.key}</p>
                      {setting.description && (
                        <p className="text-xs text-navy-500 mt-1">{setting.description}</p>
                      )}
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Input
                        value={localValues[setting.id] ?? setting.value}
                        onChange={(e) => setLocalValues({ ...localValues, [setting.id]: e.target.value })}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant={isDirty ? "default" : "outline"}
                        size="sm"
                        disabled={savingId === setting.id || !isDirty}
                        onClick={() => handleSave(setting.id, setting.value)}
                        className="w-24 shrink-0"
                      >
                        {savingId === setting.id ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
