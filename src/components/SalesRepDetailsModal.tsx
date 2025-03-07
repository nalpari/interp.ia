import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SalesRep {
  id: number;
  name: string;
  email: string;
  performance: number;
  sales: number;
  territory: string;
  department: string;
  isActive: boolean;
  companiesAssigned: number;
  customersAssigned: number;
  startDate: string;
  manager: string;
}

interface SalesRepDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesRep: SalesRep | null;
}

export default function SalesRepDetailsModal({
  isOpen,
  onClose,
  salesRep,
}: SalesRepDetailsModalProps) {
  if (!salesRep) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sales Rep Details</DialogTitle>
          <DialogDescription>
            Detailed information about the sales representative.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://avatar.vercel.sh/${salesRep.name.replace(
                  " ",
                  "-"
                )}.png`}
              />
              <AvatarFallback>
                {salesRep.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{salesRep.name}</h3>
              <p className="text-sm text-gray-500">{salesRep.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <p className="text-lg font-semibold">{salesRep.performance}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-lg font-semibold">
                ${salesRep.sales.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Territory</p>
              <p className="text-lg font-semibold">{salesRep.territory}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-lg font-semibold">{salesRep.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Companies Assigned
              </p>
              <p className="text-lg font-semibold">
                {salesRep.companiesAssigned}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Customers Assigned
              </p>
              <p className="text-lg font-semibold">
                {salesRep.customersAssigned}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="text-lg font-semibold">{salesRep.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Manager</p>
              <p className="text-lg font-semibold">{salesRep.manager}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge variant={salesRep.isActive ? "default" : "secondary"}>
              {salesRep.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/sales-reps/${salesRep.id}`}>Edit</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
