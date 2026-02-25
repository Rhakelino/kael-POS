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

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
}

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
        const matchSearch = p.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory
            ? p.categoryId === selectedCategory
            : true;
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
        <main className="flex-1 flex flex-col bg-slate-50 dark:bg-zinc-900 overflow-y-auto">
            <header className="px-4 pl-14 lg:px-8 py-4 lg:py-6 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Menu Management
                    </h2>
                    <p className="text-xs lg:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Organize categories and items shown on the POS.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 text-sm">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary sm:w-64 lg:w-80"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditProduct(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            add
                        </span>
                        Add Item
                    </button>
                </div>
            </header>

            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Sidebar Categories */}
                <div className="w-full lg:w-64 shrink-0 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-zinc-100">Categories</h3>
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="p-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                add
                            </span>
                        </button>
                    </div>
                    <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`shrink-0 flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold min-w-[140px] lg:min-w-0 transition-colors ${selectedCategory === null
                                ? "bg-primary text-white shadow-sm shadow-primary/20"
                                : "bg-white dark:bg-zinc-950 lg:bg-transparent border border-slate-200 dark:border-zinc-800 lg:border-none lg:hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                                }`}
                        >
                            <div className="flex items-center gap-2 lg:gap-3">
                                <span className="material-symbols-outlined text-[18px]">
                                    grid_view
                                </span>
                                All
                            </div>
                            <span
                                className={`px-2 py-0.5 rounded text-xs ml-2 ${selectedCategory === null
                                    ? "bg-white dark:bg-zinc-950/20"
                                    : "bg-slate-100 dark:bg-zinc-800 lg:bg-slate-200 dark:bg-zinc-800"
                                    }`}
                            >
                                {products.length}
                            </span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium min-w-[140px] lg:min-w-0 transition-colors ${selectedCategory === cat.id
                                    ? "bg-primary text-white shadow-sm shadow-primary/20 font-bold"
                                    : "bg-white dark:bg-zinc-950 lg:bg-transparent border border-slate-200 dark:border-zinc-800 lg:border-none lg:hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                                    }`}
                            >
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <span className="material-symbols-outlined text-[18px]">
                                        {cat.icon || "category"}
                                    </span>
                                    {cat.name}
                                </div>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs ml-2 ${selectedCategory === cat.id
                                        ? "bg-white dark:bg-zinc-950/20"
                                        : "bg-slate-100 dark:bg-zinc-800 lg:bg-slate-200 dark:bg-zinc-800"
                                        }`}
                                >
                                    {getCategoryCount(cat.id)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Items Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm group ${!product.isActive ? "opacity-60" : ""
                                        }`}
                                >
                                    <div
                                        className={`aspect-square rounded-lg mb-4 bg-center bg-cover bg-slate-100 dark:bg-zinc-800 overflow-hidden relative ${!product.isActive ? "grayscale" : ""
                                            }`}
                                        style={{
                                            backgroundImage: product.imageUrl
                                                ? `url('${product.imageUrl}')`
                                                : undefined,
                                        }}
                                    >
                                        {!product.isActive && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded uppercase">
                                                Hidden
                                            </span>
                                        )}
                                        {!product.imageUrl && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300">
                                                    coffee
                                                </span>
                                            </div>
                                        )}
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditProduct(product);
                                                    setShowAddModal(true);
                                                }}
                                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 text-primary flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 text-rose-500 flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                                {product.name}
                                            </h3>
                                            <p className="text-primary font-bold text-sm mt-0.5">
                                                {formatRupiah(product.price)}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                className="sr-only peer"
                                                type="checkbox"
                                                checked={product.isActive}
                                                onChange={() =>
                                                    handleToggle(product.id)
                                                }
                                            />
                                            <div className="w-8 h-4 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-zinc-950 after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    {product.description && (
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2">
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
                                className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer min-h-[260px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">
                                        add
                                    </span>
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
            {showAddModal && (
                <ProductModal
                    product={editProduct}
                    categories={categories}
                    onClose={() => setShowAddModal(false)}
                    onSave={async () => {
                        setShowAddModal(false);
                        await loadData();
                    }}
                />
            )}

            {/* Add Category Modal */}
            {showCategoryModal && (
                <CategoryModal
                    onClose={() => setShowCategoryModal(false)}
                    onSave={async () => {
                        setShowCategoryModal(false);
                        await loadData();
                    }}
                />
            )}
        </main>
    );
}

function ProductModal({ product, categories, onClose, onSave }) {
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <h3 className="text-lg font-bold">
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:text-zinc-400"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-2">
                            Product Image
                        </label>
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-xl border border-slate-200 dark:border-zinc-800"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                                    <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-zinc-950 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:bg-zinc-800 transition-colors">
                                        Change
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="px-3 py-1.5 bg-rose-500 rounded-lg text-xs font-bold text-white hover:bg-rose-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-white dark:bg-zinc-950/80 rounded-xl flex items-center justify-center">
                                        <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all">
                                {uploading ? (
                                    <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">
                                            add_photo_alternate
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-zinc-400 font-medium">
                                            Click to upload image
                                        </span>
                                        <span className="text-[10px] text-slate-300 mt-0.5">
                                            JPG, PNG, WebP (max 5MB)
                                        </span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                            Name
                        </label>
                        <input
                            required
                            className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                                Price (Rp)
                            </label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                                SKU
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={form.sku}
                                onChange={(e) =>
                                    setForm({ ...form, sku: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                            Category
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    categoryId: e.target.value,
                                })
                            }
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : isEdit
                                ? "Update Product"
                                : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function CategoryModal({ onClose, onSave }) {
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Add Category</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:text-zinc-400"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                            Category Name
                        </label>
                        <input
                            required
                            className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Snacks"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1">
                            Icon (Material Symbol)
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="e.g. fastfood"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Add Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}
