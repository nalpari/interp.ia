"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface Target {
  id: number;
  name: string;
  current: number;
  target: number;
}

const initialTargets: Target[] = [
  { id: 1, name: "Q1 Target", current: 250000, target: 300000 },
  { id: 2, name: "Q2 Target", current: 180000, target: 350000 },
  { id: 3, name: "Q3 Target", current: 50000, target: 400000 },
  { id: 4, name: "Q4 Target", current: 0, target: 450000 },
];

export default function TargetsPage() {
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [newTarget, setNewTarget] = useState({ name: "", target: "" });
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);

  const handleNewTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTarget({ ...newTarget, [e.target.name]: e.target.value });
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number.parseInt(newTarget.target);
    if (newTarget.name && target) {
      setTargets([
        ...targets,
        { id: targets.length + 1, name: newTarget.name, current: 0, target },
      ]);
      setNewTarget({ name: "", target: "" });
    }
  };

  const handleEditTarget = (target: Target) => {
    setEditingTarget(target);
  };

  const handleUpdateTarget = () => {
    setTargets(
      targets.map((t) => (t.id === editingTarget?.id ? editingTarget : t))
    );
    setEditingTarget(null);
  };

  const handleDeleteTarget = (id: number) => {
    setTargets(targets.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Sales Targets
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Current Targets</CardTitle>
          <CardDescription>
            Track your progress towards sales goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target Name</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.id}>
                  <TableCell>{target.name}</TableCell>
                  <TableCell>${target.current.toLocaleString()}</TableCell>
                  <TableCell>${target.target.toLocaleString()}</TableCell>
                  <TableCell>
                    <Progress
                      value={(target.current / target.target) * 100}
                      className="w-[60%]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTarget(target)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTarget(target.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Target</CardTitle>
          <CardDescription>Set a new sales target</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTarget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetName">Target Name</Label>
              <Input
                id="targetName"
                name="name"
                value={newTarget.name}
                onChange={handleNewTargetChange}
                placeholder="e.g., Q1 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                name="target"
                type="number"
                value={newTarget.target}
                onChange={handleNewTargetChange}
                placeholder="e.g., 500000"
              />
            </div>
            <Button type="submit">Add Target</Button>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={!!editingTarget}
        onOpenChange={() => setEditingTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Target</DialogTitle>
            <DialogDescription>
              Make changes to your target here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTarget && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTargetName">Target Name</Label>
                <Input
                  id="editTargetName"
                  value={editingTarget.name}
                  onChange={(e) =>
                    setEditingTarget({ ...editingTarget, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTargetAmount">Target Amount</Label>
                <Input
                  id="editTargetAmount"
                  type="number"
                  value={editingTarget.target}
                  onChange={(e) =>
                    setEditingTarget({
                      ...editingTarget,
                      target: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCurrentAmount">Current Amount</Label>
                <Input
                  id="editCurrentAmount"
                  type="number"
                  value={editingTarget.current}
                  onChange={(e) =>
                    setEditingTarget({
                      ...editingTarget,
                      current: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateTarget}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
