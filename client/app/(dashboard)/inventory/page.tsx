// app/(dashboard)/inventory/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockItems, type Item } from "@/lib/mockData";
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Status } from "@/types/dashboard";
import React from "react";
import { generateInventory } from "./mockData";

export default function InventoryPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const data = generateInventory(150);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "good":
        return <Badge variant="default">תקין</Badge>;
      case "warning":
        return <Badge variant="secondary">בקרוב יפוג</Badge>;
      case "bad":
        return <Badge variant="destructive">פג תוקף</Badge>;
    }
  };

  const getStatusEncryptedBadge = (status: any) => {
    switch (status) {
      case "good":
        return <Badge variant="default">מוצפן</Badge>;
      case "bad":
        return <Badge variant="destructive">לא מוצפן</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">מלאי הציוד</h1>
        <Button onClick={() => setIsEditOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          הוסף פריט
        </Button>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="חפש לפי מספר צ' או תיאור..." className="pr-10" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button value={"outline"}>
              <Filter className="ml-2 h-4 w-4" />
              סינון סטטוס
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>הכל</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>תקין</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>בקרוב יפוג</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>פג תוקף</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Section 3 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם החומר</TableHead>
              <TableHead>מק"ט</TableHead>
              <TableHead>צ'</TableHead>
              <TableHead>הצפנה</TableHead>
              <TableHead>תוקף סוללה</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead className="text-center">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.chNumber}</TableCell>
                <TableCell>{getStatusEncryptedBadge(item.encryption.status)}</TableCell>
                <TableCell>{item.batteryExpiry}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button size={"sm"} variant={"ghost"}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size={"sm"} variant={"ghost"}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-center bg-red-200">
                סה"כ פריטים: 125
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* מודל עריכה – נבנה בהמשך */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>הוספת פריט חדש</DialogHeader>
          {/* כאן יהיה הטופס – נבנה אותו בשלב הבא */}
          <p className="text-muted-foreground">הטופס יופיע כאן</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
