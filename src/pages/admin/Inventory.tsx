import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Package, Search, Plus, Trash2, Edit, AlertCircle, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type InventoryItem = {
    id: string;
    name: string;
    category: "Shelter" | "Food" | "Medical" | "Equipment";
    quantity: number;
    unit: string;
    location: string;
    status: "In Stock" | "Low Stock" | "Critical";
};

function computeStatus(qty: number): "In Stock" | "Low Stock" | "Critical" {
    if (qty < 20) return "Critical";
    if (qty < 50) return "Low Stock";
    return "In Stock";
}

export function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // Form State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", category: "Shelter", quantity: 0, unit: "", location: "" });

    // Load inventory from Supabase on mount
    useEffect(() => {
        const fetchInventory = async () => {
            setLoadingItems(true);
            const { data, error } = await supabase
                .from("inventory")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                toast.error("Failed to load inventory: " + error.message);
            } else {
                setItems(data as InventoryItem[]);
            }
            setLoadingItems(false);
        };

        fetchInventory();
    }, []);

    const handleAddItem = async () => {
        if (!newItem.name.trim() || !newItem.unit.trim() || !newItem.location.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSaving(true);
        const { data, error } = await supabase
            .from("inventory")
            .insert({
                name:     newItem.name.trim(),
                category: newItem.category,
                quantity: newItem.quantity,
                unit:     newItem.unit.trim(),
                location: newItem.location.trim(),
                status:   computeStatus(newItem.quantity),
            })
            .select()
            .single();

        if (error) {
            toast.error("Failed to add item: " + error.message);
        } else {
            setItems([data as InventoryItem, ...items]);
            setIsAddOpen(false);
            setNewItem({ name: "", category: "Shelter", quantity: 0, unit: "", location: "" });
            toast.success(`"${data.name}" added to inventory.`);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("inventory")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete item: " + error.message);
        } else {
            setItems(items.filter(item => item.id !== id));
            toast.success("Item removed from inventory.");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockCount = items.filter(i => i.status !== "In Stock").length;
    const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
                    <p className="text-slate-500 mt-1">Track relief resources and warehouse capacities.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            <Plus className="mr-2 h-4 w-4" /> Add New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Inventory Item</DialogTitle>
                            <DialogDescription>Add a new resource to the central database.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select
                                    onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                                    defaultValue="Shelter"
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Shelter">Shelter</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Medical">Medical</SelectItem>
                                        <SelectItem value="Equipment">Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    className="col-span-3"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit" className="text-right">Unit</Label>
                                <Input
                                    id="unit"
                                    className="col-span-3"
                                    placeholder="e.g. kg, boxes, units"
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input
                                    id="location"
                                    className="col-span-3"
                                    placeholder="Warehouse Name"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleAddItem} className="bg-slate-900 text-white" disabled={isSaving}>
                                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save Item"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                        <Package className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Across all districts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Items below threshold</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
                        <AlertCircle className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-slate-500 mt-1">Operating normaly</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <CardTitle>Resource List</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    className="pl-9"
                                    placeholder="Search resources..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Shelter">Shelter</SelectItem>
                                    <SelectItem value="Medical">Medical</SelectItem>
                                    <SelectItem value="Equipment">Equipment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingItems ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-50">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {item.quantity} <span className="text-slate-400 text-xs">{item.unit}</span>
                                            </TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    item.status === "In Stock" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                                                        item.status === "Low Stock" ? "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200" :
                                                            "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                                                }>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4 text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
