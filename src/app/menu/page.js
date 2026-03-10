"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getCategories,
    getAllProducts,
    createProduct,
    updateProduct,
    toggleProduct,
    deleteProduct,
    createCategory,
} from "@/actions/products";

import {
    Search,
    Plus,
    LayoutGrid,
    Edit2,
    Trash2,
    X,
    ImagePlus,
    Coffee,
    Pizza,
    Utensils,
    CupSoda,
    IceCream,
    Package,
    Folder,
    Loader2
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

const getLucideIcon = (iconName) => {
    const iconMap = {
        fastfood: Pizza,
        local_cafe: Coffee,
        restaurant: Utensils,
        emoji_food_beverage: CupSoda,
        icecream: IceCream,
        category: Folder,
    };
    const Icon = iconMap[iconName] || Package;
    return <Icon className="size-4" />;
};

export default function Menu() {
    const [categories, setCategories] = useState([]);
    const [products, setProductsList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const [catResult, prodResult] = await Promise.all([
            getCategories(),
            getAllProducts(),
        ]);
        if (catResult.success) setCategories(catResult.data);
        if (prodResult.success) setProductsList(prodResult.data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredProducts = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory ? p.categoryId === selectedCategory : true;
        return matchSearch && matchCategory;
    });

    const handleToggle = async (id) => {
        await toggleProduct(id);
        await loadData();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        await deleteProduct(id);
        await loadData();
    };

    const getCategoryCount = (catId) => {
        return products.filter((p) => p.categoryId === catId).length;
    };

    return (
        <main className="flex-1 flex flex-col bg-background overflow-y-auto">
            <header className="px-4 pl-14 lg:px-8 py-4 lg:py-6 bg-card border-b border-border sticky top-0 z-10 flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                        Menu Management
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                        Organize categories and items shown on the POS.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-muted/50 border-transparent rounded-lg text-sm focus-visible:ring-primary sm:w-64 lg:w-80"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setEditProduct(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 rounded-lg font-bold shadow-sm shadow-primary/20"
                    >
                        <Plus className="size-4" />
                        Add Item
                    </Button>
                </div>
            </header>

            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Sidebar Categories */}
                <div className="w-full lg:w-64 shrink-0 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground">Categories</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowCategoryModal(true)}
                            className="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                    <ScrollArea className="w-full whitespace-nowrap lg:whitespace-normal">
                        <div className="flex lg:flex-col gap-2 lg:gap-1 pb-4 lg:pb-0 pr-4 lg:pr-0">
                            <Button
                                variant={selectedCategory === null ? "default" : "ghost"}
                                onClick={() => setSelectedCategory(null)}
                                className={`shrink-0 flex items-center justify-between px-4 py-6 rounded-xl text-sm min-w-[140px] lg:min-w-0 transition-colors w-full ${selectedCategory === null ? "font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <LayoutGrid className="size-4" />
                                    All
                                </div>
                                <Badge variant={selectedCategory === null ? "secondary" : "outline"} className={`ml-2 font-mono h-5 px-1.5 ${selectedCategory === null ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30" : ""}`}>
                                    {products.length}
                                </Badge>
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`shrink-0 flex items-center justify-between px-4 py-6 rounded-xl text-sm min-w-[140px] lg:min-w-0 transition-colors w-full ${selectedCategory === cat.id ? "font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <div className="flex items-center gap-2 lg:gap-3">
                                        {getLucideIcon(cat.icon)}
                                        {cat.name}
                                    </div>
                                    <Badge variant={selectedCategory === cat.id ? "secondary" : "outline"} className={`ml-2 font-mono h-5 px-1.5 ${selectedCategory === cat.id ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30" : ""}`}>
                                        {getCategoryCount(cat.id)}
                                    </Badge>
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="hidden sm:flex lg:hidden" />
                    </ScrollArea>
                </div>

                {/* Menu Items Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="size-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`bg-card p-4 rounded-xl border border-border shadow-sm group transition-all ${!product.isActive ? "opacity-60" : "hover:border-primary/30"}`}
                                >
                                    <div
                                        className={`aspect-square rounded-lg mb-4 bg-center bg-cover bg-muted overflow-hidden relative ${!product.isActive ? "grayscale" : ""}`}
                                        style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined }}
                                    >
                                        {!product.isActive && (
                                            <Badge variant="destructive" className="absolute top-2 left-2 text-[10px] font-bold uppercase rounded border-0">
                                                Hidden
                                            </Badge>
                                        )}
                                        {!product.imageUrl && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Coffee className="size-10 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => {
                                                    setEditProduct(product);
                                                    setShowAddModal(true);
                                                }}
                                                className="size-9 rounded-full bg-background text-primary hover:scale-110 transition-transform"
                                            >
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => handleDelete(product.id)}
                                                className="size-9 rounded-full hover:scale-110 transition-transform"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-foreground text-sm line-clamp-1" title={product.name}>
                                                {product.name}
                                            </h3>
                                            <p className="text-primary font-bold text-sm mt-0.5">
                                                {formatRupiah(product.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center pt-1" title={product.isActive ? 'Hide product' : 'Show product'}>
                                            <Switch
                                                checked={product.isActive}
                                                onCheckedChange={() => handleToggle(product.id)}
                                            />
                                        </div>
                                    </div>
                                    {product.description && (
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2" title={product.description}>
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Add New placeholder */}
                            <div
                                onClick={() => {
                                    setEditProduct(null);
                                    setShowAddModal(true);
                                }}
                                className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer min-h-[260px] group"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Plus className="size-6" />
                                </div>
                                <span className="font-bold text-sm">
                                    Add New Item
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card border-border">
                    <DialogHeader className="p-6 pb-4 border-b border-border">
                        <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    {showAddModal && (
                        <ProductForm
                            product={editProduct}
                            categories={categories}
                            onClose={() => setShowAddModal(false)}
                            onSave={async () => {
                                setShowAddModal(false);
                                await loadData();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Category Modal */}
            <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-card border-border">
                    <DialogHeader className="p-6 pb-4 border-b border-border">
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    {showCategoryModal && (
                        <CategoryForm
                            onClose={() => setShowCategoryModal(false)}
                            onSave={async () => {
                                setShowCategoryModal(false);
                                await loadData();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </main>
    );
}

function ProductForm({ product, categories, onClose, onSave }) {
    const isEdit = !!product;
    const [form, setForm] = useState({
        name: product?.name || "",
        price: product?.price || "",
        categoryId: product?.categoryId || categories[0]?.id || "",
        sku: product?.sku || "",
        imageUrl: product?.imageUrl || "",
        description: product?.description || "",
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (result.success) {
                setForm((prev) => ({ ...prev, imageUrl: result.imageUrl }));
            } else {
                alert("Upload gagal: " + result.error);
            }
        } catch {
            alert("Upload gagal, coba lagi");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview("");
        setForm((prev) => ({ ...prev, imageUrl: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (isEdit) {
            await updateProduct(product.id, {
                ...form,
                price: Number(form.price),
            });
        } else {
            await createProduct({
                ...form,
                price: Number(form.price),
            });
        }
        setSaving(false);
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-5">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Product Image</Label>
                        {imagePreview ? (
                            <div className="relative group w-full max-w-[200px]">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-xl border border-border"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                                    <Label className="cursor-pointer px-3 py-1.5 bg-background rounded-lg text-xs font-bold text-foreground hover:bg-muted transition-colors">
                                        Change
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </Label>
                                    <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} className="text-xs h-[28px]">
                                        Remove
                                    </Button>
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
                                        <Loader2 className="size-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Label className="cursor-pointer flex flex-col items-center justify-center h-32 w-full max-w-[200px] border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all">
                                {uploading ? (
                                    <Loader2 className="size-6 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <ImagePlus className="size-8 text-muted-foreground/50 mb-2" />
                                        <span className="text-xs text-muted-foreground font-medium">Click to upload image</span>
                                        <span className="text-[10px] text-muted-foreground/70 mt-1">JPG, PNG (max 5MB)</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </Label>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (Rp)</Label>
                            <Input id="price" required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="bg-muted/50" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={form.categoryId || ""} onValueChange={(val) => setForm({ ...form, categoryId: val })}>
                            <SelectTrigger className="bg-muted/50">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 resize-none" />
                    </div>
                </div>
            </ScrollArea>
            <div className="p-6 border-t border-border mt-auto pt-4 flex gap-3 bg-muted/20">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-background">Cancel</Button>
                <Button type="submit" disabled={saving || uploading} className="flex-1">
                    {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                    {saving ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
                </Button>
            </div>
        </form>
    );
}

function CategoryForm({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await createCategory({ name, icon: icon || null });
        setSaving(false);
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="catName">Category Name</Label>
                    <Input id="catName" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Snacks" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="catIcon">Icon Name (optional)</Label>
                    <Input id="catIcon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. fastfood" className="bg-muted/50" />
                    <p className="text-[10px] text-muted-foreground mt-1">Leave blank to use default icon</p>
                </div>
            </div>
            <div className="p-6 border-t border-border pt-4 flex gap-3 bg-muted/20">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-background">Cancel</Button>
                <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                    {saving ? "Saving..." : "Save Category"}
                </Button>
            </div>
        </form>
    );
}
