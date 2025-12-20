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

export default function InventoryPage() {
  const [items] = useState<Item[]>(mockItems);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status>("all");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.serialNumber.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" || (filter === "good" && item.status === "good") || (filter === "warning" && item.status === "warning") || (filter === "expired" && item.status === "expired");

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "expired":
        return <Badge variant="destructive">פג תוקף</Badge>;
      case "warning":
        return <Badge variant="secondary">בקרוב יפוג</Badge>;
      case "good":
        return <Badge variant="default">תקין</Badge>;
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

  const handleDelete = (id: string) => {
    toast.error("הפריט נמחק בהצלחה", { duration: 4000 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">מלאי הציוד</h1>
        <Button onClick={() => setIsEditOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          הוסף פריט
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="חפש לפי מספר צ' או תיאור..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              סינון: {filter === "all" ? "הכל" : filter === "good" ? "תקין" : filter === "warning" ? "בקרוב" : "פג תוקף"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter("all")}>הכל</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("good")}>תקין</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("warning")}>בקרוב יפוג</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("expired")}>פג תוקף</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table dir="rtl" layout={"fixed"}>
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
          <TableBody className="text-center">
            {filteredItems.map((item) => (
              <TableRow key={item.id} className={item.status === "expired" ? "bg-destructive/5" : item.status === "warning" ? "bg-yellow-500/5" : ""}>
                <TableCell>מח 710</TableCell>
                <TableCell>310902748</TableCell>
                <TableCell>490031</TableCell>
                <TableCell>{getStatusEncryptedBadge("good")}</TableCell>
                <TableCell>15/03/2026</TableCell>
                <TableCell>{getStatusBadge("good")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEditOpen(true);
                      }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
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
                סה"כ פריטים: {filteredItems.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* מודל עריכה – נבנה בהמשך */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "עריכת פריט" : "הוספת פריט חדש"}</DialogTitle>
          </DialogHeader>
          {/* כאן יהיה הטופס – נבנה אותו בשלב הבא */}
          <p className="text-muted-foreground">הטופס יופיע כאן</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
