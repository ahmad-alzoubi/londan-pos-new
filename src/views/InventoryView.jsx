import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Barcode, 
  Tag, 
  Package, 
  DollarSign, 
  X,
  Layers,
  Sparkles,
  FolderTree
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoriesModal } from '../components/inventory/CategoriesModal';

export const InventoryView = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, currency, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // If selected category was deleted, fallback to 'الكل'
  useEffect(() => {
    if (selectedCategory !== 'الكل' && !categories.includes(selectedCategory)) {
      setSelectedCategory('الكل');
    }
  }, [categories, selectedCategory]);

  // Form states for product
  const [formData, setFormData] = useState({
    name: '',
    category: 'فساتين نسائية',
    sku: '',
    barcode: '',
    cost: '',
    price: '',
    minStockAlert: 5,
    image: '',
    variants: [
      { size: 'S', color: 'أسود ملكي', stock: 5 },
      { size: 'M', color: 'أسود ملكي', stock: 5 },
      { size: 'L', color: 'أسود ملكي', stock: 5 },
    ],
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[1] || 'فساتين نسائية',
      sku: `LND-${Math.floor(100 + Math.random() * 900)}`,
      barcode: `628100100${Math.floor(1000 + Math.random() * 9000)}`,
      cost: '',
      price: '',
      minStockAlert: 5,
      image: '',
      variants: [
        { size: 'S', color: 'أسود ملكي', stock: 5 },
        { size: 'M', color: 'أسود ملكي', stock: 5 },
        { size: 'L', color: 'أسود ملكي', stock: 5 },
      ],
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      barcode: product.barcode || '',
      cost: product.cost.toString(),
      price: product.price.toString(),
      minStockAlert: product.minStockAlert || 5,
      image: product.image || '',
      variants: product.variants ? [...product.variants] : [],
    });
    setIsProductModalOpen(true);
  };

  const handleAddVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: 'M', color: 'بيج', stock: 5 }],
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = {
        ...updated[index],
        [field]: field === 'stock' ? Number(value) || 0 : value,
      };
      return { ...prev, variants: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم الصنف', 'error');
      return;
    }
    if (!formData.price) {
      showToast('يرجى إدخال سعر البيع', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      cost: Number(formData.cost) || 0,
      price: Number(formData.price) || 0,
      minStockAlert: Number(formData.minStockAlert) || 5,
      image: formData.image.trim(),
      variants: formData.variants,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              إدارة المخزون والأزياء
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {products.length} موديلات
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة المقاسات، الألوان، التكاليف، وهوامش الربح، وتنبيهات نواقص القطع.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoriesModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <FolderTree className="w-4 h-4 text-indigo-500" />
            <span>إدارة وتعديل الأقسام ({categories.filter(c => c !== 'الكل').length})</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكود SKU أو الباركود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCategoriesModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
            title="إدارة وتعديل وحذف الأقسام"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>قسم جديد</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">الصورة</th>
                <th className="p-3.5 font-bold">اسم الموديل / الصنف</th>
                <th className="p-3.5 font-bold">الفئة</th>
                <th className="p-3.5 font-bold">الكود / الباركود</th>
                <th className="p-3.5 font-bold">سعر التكلفة</th>
                <th className="p-3.5 font-bold">سعر البيع</th>
                <th className="p-3.5 font-bold">هامش الربح</th>
                <th className="p-3.5 font-bold">المقاسات والألوان</th>
                <th className="p-3.5 font-bold">إجمالي المخزون</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const totalStock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                const profitMargin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : 0;
                const isLowStock = totalStock <= (p.minStockAlert || 5);

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Image */}
                    <td className="p-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Shirt className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    {/* SKU & Barcode */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      <div>{p.sku}</div>
                      {p.barcode && <div className="text-[10px] text-slate-400">{p.barcode}</div>}
                    </td>

                    {/* Cost */}
                    <td className="p-3.5 font-mono text-slate-500">
                      {p.cost} {currency.symbol}
                    </td>

                    {/* Price */}
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {p.price} {currency.symbol}
                    </td>

                    {/* Margin */}
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {profitMargin}%
                    </td>

                    {/* Variants pills */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.variants?.slice(0, 4).map((v, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono"
                          >
                            {v.size}-{v.color} ({v.stock})
                          </span>
                        ))}
                        {p.variants?.length > 4 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{p.variants.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-black text-sm ${
                          totalStock === 0 ? 'text-rose-500' : isLowStock ? 'text-amber-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {totalStock}
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" title="كمية منخفضة" />
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف ${p.name}؟`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Shirt className="w-5 h-5 text-indigo-600" />
                <span>{editingProduct ? 'تعديل بيانات الصنف' : 'إضافة صنف ملابس جديد'}</span>
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم الموديل / الصنف *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: فستان مخمل طويل مطرز"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      الفئة / القسم *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoriesModalOpen(true)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      + إدارة الأقسام
                    </button>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    {categories.filter((c) => c !== 'الكل').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    كود الصنف (SKU)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الباركود الدولي / المحلي
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابط صورة الصنف (اختياري)
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    سعر التكلفة ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    سعر البيع للزبون ({currency.symbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-black text-indigo-600"
                  />
                </div>
              </div>

              {/* Clothing Sizes and Colors Matrix */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>المقاسات والألوان المتوفرة في المخزن:</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مقاس/لون</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 text-xs"
                    >
                      <div className="w-1/3">
                        <input
                          type="text"
                          placeholder="المقاس (S, M, 40...)"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-bold"
                        />
                      </div>
                      <div className="w-1/3">
                        <input
                          type="text"
                          placeholder="اللون (أسود، خمري...)"
                          value={v.color}
                          onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center"
                        />
                      </div>
                      <div className="w-1/4">
                        <input
                          type="number"
                          placeholder="الكمية"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-mono font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  حفظ الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Management Modal */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </div>
  );
};
