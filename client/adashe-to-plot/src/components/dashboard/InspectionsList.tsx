"use client";

import { useState } from "react";
import { CalendarCheck, X, RotateCcw } from "lucide-react";
import type { Inspection } from "@/types/inspection";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/payment";

export function InspectionsList({ estateNames, initial }: { estateNames: Record<string, string>; initial: Inspection[] }) {
  const [inspections, setInspections] = useState(initial);
  const [rescheduling, setRescheduling] = useState<Inspection | null>(null);

  function cancel(id: string) {
    setInspections((prev) => prev.map((i) => (i.id === id ? { ...i, status: "Cancelled" } : i)));
  }

  function confirmReschedule(date: string, time: string) {
    if (!rescheduling) return;
    setInspections((prev) =>
      prev.map((i) => (i.id === rescheduling.id ? { ...i, date, time, status: "Pending" } : i))
    );
    setRescheduling(null);
  }

  const upcoming = inspections.filter((i) => i.status === "Pending" || i.status === "Confirmed");
  const past = inspections.filter((i) => i.status === "Completed" || i.status === "Cancelled");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-navy-950">Upcoming</h3>
        <div className="mt-4 space-y-3">
          {upcoming.length === 0 && <p className="text-sm text-ink-500">No upcoming inspections.</p>}
          {upcoming.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-800/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gold-100 p-2.5 text-gold-600"><CalendarCheck className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-navy-950">{estateNames[i.estateId]}</p>
                  <p className="text-sm text-ink-500">{formatDate(i.date)} at {i.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={statusToTone(i.status)}>{i.status}</Badge>
                <button onClick={() => setRescheduling(i)} className="flex items-center gap-1 rounded-full border border-navy-800/15 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:border-navy-800/40">
                  <RotateCcw className="h-3 w-3" /> Reschedule
                </button>
                <button onClick={() => cancel(i.id)} className="flex items-center gap-1 rounded-full border border-navy-800/15 px-3 py-1.5 text-xs font-semibold text-status-sold hover:border-status-sold/40">
                  <X className="h-3 w-3" /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-navy-950">Previous Inspections</h3>
        <div className="mt-4 space-y-3">
          {past.length === 0 && <p className="text-sm text-ink-500">No previous inspections.</p>}
          {past.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-800/10 bg-white p-5 opacity-80">
              <div>
                <p className="font-semibold text-navy-950">{estateNames[i.estateId]}</p>
                <p className="text-sm text-ink-500">{formatDate(i.date)} at {i.time}</p>
              </div>
              <Badge tone={statusToTone(i.status)}>{i.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!rescheduling} onClose={() => setRescheduling(null)} title="Reschedule Inspection">
        <RescheduleForm onConfirm={confirmReschedule} />
      </Modal>
    </div>
  );
}

function RescheduleForm({ onConfirm }: { onConfirm: (date: string, time: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm(date, time);
      }}
      className="flex flex-col gap-4"
    >
      <Input label="New date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Input label="New time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      <Button type="submit" className="w-full">Confirm New Time</Button>
    </form>
  );
}
