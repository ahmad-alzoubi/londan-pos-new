import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_CURRENCY,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PARTNERS,
  INITIAL_PARTNER_WITHDRAWALS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_EXPENSES,
  INITIAL_INVOICES,
} from '../data/initialClothingData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFX } from '../utils/soundEffects';

const AppContext = createContext();

const STORAGE_KEY = 'londan_pos_data_v1';
const THEME_KEY = 'londan_theme';

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('pos');

  // Business Data States (Loaded from LocalStorage or Seed)
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [partners, setPartners] = useState(INITIAL_PARTNERS);
  const [partnerWithdrawals, setPartnerWithdrawals] = useState(INITIAL_PARTNER_WITHDRAWALS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  // POS State
  const [cart, setCart] = useState([]);
  const [suspendedOrders, setSuspendedOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartDiscount, setCartDiscount] = useState(0); // discount in amount or percent
  const [lastPrintedInvoice, setLastPrintedInvoice] = useState(null);

  // Cash Drawer State
  const [cashDrawer, setCashDrawer] = useState({
    isOpen: true,
    openingBalance: 500,
    openedAt: new Date().toISOString(),
    notes: 'بداية الوردية الصباحية',
  });

  // Notifications / Toast
  const [toast, setToast] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Apply Theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Load Persisted Local Storage on Initial Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.partners) setPartners(parsed.partners);
        if (parsed.partnerWithdrawals) setPartnerWithdrawals(parsed.partnerWithdrawals);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.cashDrawer) setCashDrawer(parsed.cashDrawer);
        if (parsed.suspendedOrders) setSuspendedOrders(parsed.suspendedOrders);
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
  }, []);

  // Persist State to Local Storage
  useEffect(() => {
    try {
      const stateToSave = {
        products,
        categories,
        partners,
        partnerWithdrawals,
        customers,
        suppliers,
        expenses,
        invoices,
        cashDrawer,
        suspendedOrders,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [
    products,
    categories,
    partners,
    partnerWithdrawals,
    customers,
    suppliers,
    expenses,
    invoices,
    cashDrawer,
    suspendedOrders,
  ]);

  // Supabase Cloud Sync (Optional Realtime Backup)
  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setIsSyncing(true);
    try {
      const payload = {
        products,
        categories,
        partners,
        partnerWithdrawals,
        customers,
        suppliers,
        expenses,
        invoices,
        cashDrawer,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('app_state')
        .upsert({ id: 'main', state: payload, updated_at: new Date().toISOString() });

      if (!error) {
        setLastSyncTime(new Date());
        showToast('تمت المزامنة السحابية بنجاح ☁️', 'success');
      } else {
        console.warn('Supabase sync warning:', error);
      }
    } catch (err) {
      console.warn('Supabase sync failed (offline fallback active):', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // -------------------------------------------------------------
  // POS & Cart Operations
  // -------------------------------------------------------------
  const addToCart = (product, selectedVariant) => {
    if (!product) return;

    // Check available stock
    const variantStock = selectedVariant ? selectedVariant.stock : 0;
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === selectedVariant?.size &&
        item.color === selectedVariant?.color
    );

    const currentQtyInCart = existingIndex > -1 ? cart[existingIndex].qty : 0;

    if (currentQtyInCart + 1 > variantStock) {
      soundFX.playError();
      showToast(`الكمية المتاحة من المقاس (${selectedVariant?.size}) واللون (${selectedVariant?.color}) هي ${variantStock} فقط!`, 'error');
      return;
    }

    soundFX.playScan();

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      const newItem = {
        cartItemId: `${product.id}-${selectedVariant?.size}-${selectedVariant?.color}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price,
        cost: product.cost,
        image: product.image,
        size: selectedVariant?.size || 'Standard',
        color: selectedVariant?.color || 'افتراضي',
        availableStock: variantStock,
        qty: 1,
      };
      setCart((prev) => [newItem, ...prev]);
    }
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const targetItem = cart.find((i) => i.cartItemId === cartItemId);
    if (targetItem && newQty > targetItem.availableStock) {
      soundFX.playError();
      showToast(`عفواً، المخزون المتوفر هو ${targetItem.availableStock} قطعة فقط`, 'error');
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setSelectedCustomer(null);
  };

  // Hold / Suspend Order
  const holdOrder = (note = '') => {
    if (cart.length === 0) {
      showToast('السلة فارغة، لا يمكن تعليق الفاتورة', 'error');
      return;
    }
    const suspended = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      items: [...cart],
      discount: cartDiscount,
      customer: selectedCustomer,
      note: note || `فاتورة معلقة - ${new Date().toLocaleTimeString('ar-SA')}`,
      date: new Date().toISOString(),
    };
    setSuspendedOrders((prev) => [suspended, ...prev]);
    clearCart();
    soundFX.playSuccess();
    showToast('تم تعليق الفاتورة بنجاح. يمكنك استعادتها بأي وقت', 'info');
  };

  // Restore Suspended Order
  const restoreOrder = (orderId) => {
    const order = suspendedOrders.find((o) => o.id === orderId);
    if (!order) return;
    setCart(order.items);
    setCartDiscount(order.discount || 0);
    setSelectedCustomer(order.customer || null);
    setSuspendedOrders((prev) => prev.filter((o) => o.id !== orderId));
    soundFX.playScan();
    showToast(`تم استرجاع الفاتورة رقم ${orderId}`, 'success');
  };

  const deleteSuspendedOrder = (orderId) => {
    setSuspendedOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('تم حذف الفاتورة المعلقة', 'info');
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  const cartCostTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.cost * item.qty, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    const finalAmount = cartSubtotal - (cartDiscount || 0);
    return Math.max(0, finalAmount);
  }, [cartSubtotal, cartDiscount]);

  // Complete Checkout Sale
  const completeCheckout = ({
    paymentMethod = 'كاش',
    paidAmount = 0,
    changeAmount = 0,
    notes = '',
    customCustomerName = null,
  }) => {
    if (cart.length === 0) return null;

    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoices.length + 1)
      .toString()
      .padStart(4, '0')}`;

    const customerObj = selectedCustomer || {
      id: 'cust-1',
      name: customCustomerName || 'زبون نقدي عام',
    };

    const newInvoice = {
      id: invoiceNumber,
      date: new Date().toISOString(),
      customerName: customerObj.name,
      customerId: customerObj.id,
      cashierName: 'كاشير المحل',
      paymentMethod,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: 0,
      total: cartTotal,
      paidAmount: Number(paidAmount) || cartTotal,
      changeAmount: Number(changeAmount) || 0,
      costTotal: cartCostTotal,
      netProfit: cartTotal - cartCostTotal,
      notes,
      status: 'paid',
      items: cart.map((i) => ({
        id: i.productId,
        name: i.name,
        variant: `${i.size} / ${i.color}`,
        size: i.size,
        color: i.color,
        qty: i.qty,
        price: i.price,
        cost: i.cost,
      })),
    };

    // 1. Deduct variant stock from products
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const cartItemsForProduct = cart.filter((c) => c.productId === p.id);
        if (cartItemsForProduct.length === 0) return p;

        const updatedVariants = p.variants.map((v) => {
          const match = cartItemsForProduct.find(
            (c) => c.size === v.size && c.color === v.color
          );
          if (match) {
            return { ...v, stock: Math.max(0, v.stock - match.qty) };
          }
          return v;
        });

        return { ...p, variants: updatedVariants };
      });
    });

    // 2. Add Invoice to Invoices
    setInvoices((prev) => [newInvoice, ...prev]);

    // 3. Update Customer records if debt or loyal customer
    if (customerObj.id && customerObj.id !== 'cust-1') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerObj.id) {
            const addedDebt = paymentMethod === 'آجل / ذمم' ? cartTotal : 0;
            return {
              ...c,
              totalPurchases: (c.totalPurchases || 0) + cartTotal,
              ordersCount: (c.ordersCount || 0) + 1,
              balance: (c.balance || 0) + addedDebt,
            };
          }
          return c;
        })
      );
    }

    // 4. Save Last Printed Invoice
    setLastPrintedInvoice(newInvoice);

    // 5. Sound & Celebration
    soundFX.playSuccess();
    clearCart();

    return newInvoice;
  };

  // -------------------------------------------------------------
  // Returns & Exchanges
  // -------------------------------------------------------------
  const processReturnInvoice = (invoiceId, returnReason = '') => {
    const targetInvoice = invoices.find((inv) => inv.id === invoiceId);
    if (!targetInvoice || targetInvoice.status === 'returned') return;

    // 1. Mark as returned
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'returned',
              returnedAt: new Date().toISOString(),
              returnReason,
            }
          : inv
      )
    );

    // 2. Restock products
    setProducts((prev) => {
      return prev.map((p) => {
        const itemsToRestock = targetInvoice.items.filter((item) => item.id === p.id);
        if (itemsToRestock.length === 0) return p;

        const updatedVariants = p.variants.map((v) => {
          const matchedItem = itemsToRestock.find(
            (item) => item.size === v.size && item.color === v.color
          );
          if (matchedItem) {
            return { ...v, stock: v.stock + matchedItem.qty };
          }
          return v;
        });

        return { ...p, variants: updatedVariants };
      });
    });

    // 3. Adjust customer balance if it was debt
    if (targetInvoice.paymentMethod === 'آجل / ذمم' && targetInvoice.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === targetInvoice.customerId
            ? { ...c, balance: Math.max(0, (c.balance || 0) - targetInvoice.total) }
            : c
        )
      );
    }

    soundFX.playSuccess();
    showToast(`تم إرجاع الفاتورة ${invoiceId} واستعادة القطع للمخزون`, 'info');
  };

  // Delete Invoice
  const deleteInvoice = (invoiceId, restockItems = true) => {
    const targetInvoice = invoices.find((inv) => inv.id === invoiceId);
    if (!targetInvoice) return;

    // 1. Restock items if requested and invoice was not already returned
    if (restockItems && targetInvoice.status !== 'returned') {
      setProducts((prev) => {
        return prev.map((p) => {
          const itemsToRestock = targetInvoice.items?.filter((item) => item.id === p.id) || [];
          if (itemsToRestock.length === 0) return p;

          const updatedVariants = p.variants.map((v) => {
            const matchedItem = itemsToRestock.find(
              (item) => item.size === v.size && item.color === v.color
            );
            if (matchedItem) {
              return { ...v, stock: v.stock + matchedItem.qty };
            }
            return v;
          });

          return { ...p, variants: updatedVariants };
        });
      });
    }

    // 2. Adjust customer balance if it was debt
    if (targetInvoice.paymentMethod === 'آجل / ذمم' && targetInvoice.customerId && targetInvoice.status !== 'returned') {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === targetInvoice.customerId
            ? { ...c, balance: Math.max(0, (c.balance || 0) - targetInvoice.total) }
            : c
        )
      );
    }

    // 3. Remove invoice from state
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));

    soundFX.playSuccess();
    showToast(`تم حذف الفاتورة ${invoiceId} ${restockItems ? 'واستعادة القطع للمخزون' : ''}`, 'info');
  };

  // -------------------------------------------------------------
  // Partners & Profit Sharing Management
  // -------------------------------------------------------------
  const addPartner = (partnerData) => {
    const newPartner = {
      id: `part-${Date.now()}`,
      sharePercentage: Number(partnerData.sharePercentage) || 0,
      initialCapital: Number(partnerData.initialCapital) || 0,
      totalWithdrawals: 0,
      joinDate: new Date().toISOString().split('T')[0],
      ...partnerData,
    };
    setPartners((prev) => [...prev, newPartner]);
    showToast(`تم إضافة الشريك ${newPartner.name} بنجاح`, 'success');
  };

  const updatePartner = (id, partnerData) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partnerData } : p))
    );
    showToast('تم تحديث بيانات الشريك بنجاح', 'success');
  };

  const deletePartner = (id) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف الشريك', 'info');
  };

  const recordPartnerWithdrawal = (withdrawalData) => {
    const amount = Number(withdrawalData.amount) || 0;
    const newWithdrawal = {
      id: `wdr-${Date.now()}`,
      date: withdrawalData.date || new Date().toISOString().split('T')[0],
      amount,
      reason: withdrawalData.reason || 'سحوبات أرباح شخصية',
      paymentMethod: withdrawalData.paymentMethod || 'كاش',
      partnerId: withdrawalData.partnerId,
      partnerName: withdrawalData.partnerName,
    };

    setPartnerWithdrawals((prev) => [newWithdrawal, ...prev]);

    // Update Partner total withdrawals
    setPartners((prev) =>
      prev.map((p) =>
        p.id === withdrawalData.partnerId
          ? { ...p, totalWithdrawals: (p.totalWithdrawals || 0) + amount }
          : p
      )
    );

    soundFX.playSuccess();
    showToast(`تم تسجيل سحب بمبلغ ${amount} ${currency.symbol} للشريك`, 'success');
  };

  // Profit Distribution Calculation
  // Total Revenue = Paid Sales
  // Total Cost of Goods Sold = Invoice Cost
  // Gross Profit = Total Revenue - Total COGS
  // Total Operating Expenses = All Expenses
  // Net Business Profit = Gross Profit - Operating Expenses
  const partnerFinancialSummary = useMemo(() => {
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalCOGS = paidInvoices.reduce((acc, inv) => acc + inv.costTotal, 0);
    const grossProfit = totalRevenue - totalCOGS;

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netBusinessProfit = grossProfit - totalExpenses;

    const partnerCalculations = partners.map((partner) => {
      const shareRatio = (partner.sharePercentage || 0) / 100;
      const profitShare = netBusinessProfit * shareRatio;
      const netPayable = profitShare - (partner.totalWithdrawals || 0);

      return {
        ...partner,
        profitShare,
        netPayable,
      };
    });

    return {
      totalRevenue,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netBusinessProfit,
      partners: partnerCalculations,
    };
  }, [invoices, expenses, partners]);

  // -------------------------------------------------------------
  // Inventory CRUD
  // -------------------------------------------------------------
  const addProduct = (prodData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      variants: [],
      minStockAlert: 5,
      ...prodData,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`تمت إضافة صنف جديد: ${newProduct.name}`, 'success');
  };

  const updateProduct = (id, prodData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...prodData } : p))
    );
    showToast('تم تحديث بيانات الصنف بنجاح', 'success');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف الصنف من المخزون', 'info');
  };

  // -------------------------------------------------------------
  // Expenses & Customers CRUD
  // -------------------------------------------------------------
  const addExpense = (expData) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...expData,
      amount: Number(expData.amount) || 0,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('تم تسجيل المصروف بنجاح', 'success');
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('تم حذف المصروف', 'info');
  };

  const addCustomer = (custData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      balance: 0,
      totalPurchases: 0,
      ordersCount: 0,
      ...custData,
    };
    setCustomers((prev) => [...prev, newCust]);
    showToast(`تمت إضافة العميل ${newCust.name}`, 'success');
  };

  const settleCustomerDebt = (customerId, amountPaid) => {
    const amount = Number(amountPaid) || 0;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, balance: Math.max(0, (c.balance || 0) - amount) }
          : c
      )
    );
    showToast(`تم تسجيل سداد دفعة بقيمة ${amount} ${currency.symbol}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        products,
        setProducts,
        categories,
        setCategories,
        partners,
        partnerWithdrawals,
        customers,
        suppliers,
        expenses,
        invoices,
        cart,
        cartSubtotal,
        cartCostTotal,
        cartTotal,
        cartDiscount,
        setCartDiscount,
        selectedCustomer,
        setSelectedCustomer,
        suspendedOrders,
        cashDrawer,
        setCashDrawer,
        lastPrintedInvoice,
        setLastPrintedInvoice,
        partnerFinancialSummary,
        // POS Actions
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        holdOrder,
        restoreOrder,
        deleteSuspendedOrder,
        completeCheckout,
        processReturnInvoice,
        deleteInvoice,
        // Partners Actions
        addPartner,
        updatePartner,
        deletePartner,
        recordPartnerWithdrawal,
        // Products Actions
        addProduct,
        updateProduct,
        deleteProduct,
        // Expenses & Customers
        addExpense,
        deleteExpense,
        addCustomer,
        settleCustomerDebt,
        // Sync & UI
        syncWithSupabase,
        isSyncing,
        lastSyncTime,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
