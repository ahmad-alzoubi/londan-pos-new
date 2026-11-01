import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Tag, 
  AlertTriangle,
  FolderTree,
  ArrowRightLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CategoriesModal = ({ isOpen, onClose }) => {
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useApp();

  // State for new category input
  const [newCatName, setNewCatName] = useState('');

  // State for inline editing
  const [editingCat, setEditingCat] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // State for delete confirmation
  const [deletingCat, setDeletingCat] = useState(null);
  const [fallbackCat, setFallbackCat] = useState('');

  if (!isOpen) return null;

  // Categories without 'الكل'
  const manageCategories = categories.filter((c) => c !== 'الكل');

  // Handle Add Category
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = addCategory(newCatName.trim());
    if (res.success) {
      setNewCatName('');
    }
  };

  // Start Editing
  const startEdit = (cat) => {
    setEditingCat(cat);
    setEditingValue(cat);
    setDeletingCat(null);
  };

  // Save Edit
  const saveEdit = (oldCat) => {
    if (!editingValue.trim()) return;
    const res = updateCategory(oldCat, editingValue.trim());
    if (res.success) {
      setEditingCat(null);
      setEditingValue('');
    }
  };

  // Start Delete
  const startDelete = (cat) => {
    setDeletingCat(cat);
    setEditingCat(null);
    // Find default fallback (first category that is not this one)
    const otherCats = manageCategories.filter((c) => c !== cat);
    setFallbackCat(otherCats[0] || 'أزياء عامة');
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (!deletingCat) return;
    deleteCategory(deletingCat, fallbackCat);
    setDeletingCat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none" dir="rtl">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  إدارة الأقسام والتصنيفات
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  {manageCategories.length} أقسام
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                إضافة أقسام جديدة، تعديل الأسماء، أو حذفها مع نقل تلقائي للمنتجات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="اسم القسم الجديد (مثال: ملابس أطفال، ملابس شتوية...)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/30 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم</span>
            </button>
          </form>

          {/* Delete Confirmation Box (If active) */}
          {deletingCat && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    تأكيد حذف قسم: <span className="underline decoration-rose-500 font-black">{deletingCat}</span>
                  </h4>
                  {(() => {
                    const count = products.filter((p) => p.category === deletingCat).length;
                    return count > 0 ? (
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                        يوجد <strong className="font-bold">{count} منتج</strong> تابع لهذا القسم حالياً. اختر قسماً بديلاً لنقل هذه المنتجات إليه تلقائياً:
                      </p>
                    ) : (
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                        هذا القسم لا يحتوي على أي منتجات حالياً. سيتم حذفه نهائياً من النظام.
                      </p>
                    );
                  })()}
                </div>
              </div>

              {products.filter((p) => p.category === deletingCat).length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <ArrowRightLeft className="w-4 h-4 text-slate-500 shrink-0" />
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    القسم البديل:
                  </label>
                  <select
                    value={fallbackCat}
                    onChange={(e) => setFallbackCat(e.target.value)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {manageCategories
                      .filter((c) => c !== deletingCat)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200 dark:border-rose-900/60">
                <button
                  type="button"
                  onClick={() => setDeletingCat(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm shadow-rose-600/30 cursor-pointer"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>الأقسام الحالية</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (قسم "الكل" افتراضي للعرض ولا يمكن تعديله أو حذفه)
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
              {manageCategories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const isEditing = editingCat === cat;

                return (
                  <div
                    key={cat}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(cat);
                            if (e.key === 'Escape') setEditingCat(null);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(cat)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                          title="حفظ التعديل"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCat(null)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer"
                          title="إلغاء"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {cat}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            count > 0 
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {count} {count === 1 ? 'صنف' : count === 2 ? 'صنفان' : 'أصناف'}
                          </span>

                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                            title="تعديل اسم القسم"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => startDelete(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="حذف القسم"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
