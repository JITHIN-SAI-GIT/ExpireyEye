import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FaShoppingCart, FaSearch, FaTimes, FaMoneyBillWave, FaCreditCard, FaGooglePay, FaBoxOpen, FaPrint, FaWhatsapp } from "react-icons/fa";
import { FiPlus, FiMinus, FiTrash2, FiGrid, FiList } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";
import Sidebar from "./Sidebar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { getProductImage } from "../lib/imageMapper";

const SalesPOS = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [customer, setCustomer] = useState({ name: "", phone: "", payment: "Cash" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);



    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/products`);
            if (Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setError("Invalid data received from server");
            }
        } catch (err) {
            console.error("Error fetching products", err);
            setError("Failed to load products. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            const finalPrice = product.ml_discount > 0 && product.clearance_flag
                ? Math.round(product.price * (1 - product.ml_discount / 100))
                : product.price;

            if (existing) {
                return prev.map((item) =>
                    item._id === product._id ? { ...item, cartQty: item.cartQty + 1 } : item
                );
            }
            return [...prev, { ...product, price: finalPrice, originalPrice: product.price, cartQty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item._id === id) {
                    const newQty = Math.max(1, item.cartQty + delta);
                    if (newQty > item.quantity) {
                        alert(`Only ${item.quantity} in stock!`);
                        return item;
                    }
                    return { ...item, cartQty: newQty };
                }
                return item;
            })
        );
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.cartQty, 0);
    const totalSavings = cart.reduce((acc, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
            return acc + (item.originalPrice - item.price) * item.cartQty;
        }
        return acc;
    }, 0);

    const handleSharePDF = async () => {
        const element = document.getElementById("receipt-content");
        if (!element) return alert("Error: Receipt element missing!");

        const opt = {
            margin: 0,
            filename: `Receipt-${lastOrder.orderId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (err) {
            alert(`Error generating PDF: ${err.message}`);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Cart is empty!");

        const orderData = {
            customerName: customer.name,
            phoneNumber: customer.phone,
            totalAmount: cartTotal,
            paymentMethod: customer.payment,
            items: cart.map((item) => ({
                productId: item._id,
                name: item.name,
                quantity: item.cartQty,
                price: item.price,
            })),
        };

        try {
            const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
            setLastOrder({ ...orderData, date: new Date().toLocaleString(), orderId: res.data._id || `ORD-${Date.now()}` });
            setCart([]);
            setCheckoutModalOpen(false);
            setCustomer({ name: "", phone: "", payment: "Cash" });
            fetchProducts();
            setShowReceipt(true);
        } catch (err) {
            console.error("Checkout Error:", err);
            alert("Checkout Failed!");
        }
    };

    const filteredProducts = products.filter((p) => {
        return (
            (categoryFilter === "all" || p.category === categoryFilter) &&
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const categories = ["all", ...new Set(products.map((p) => p.category))];

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900">
            <Sidebar />

            <div className="flex flex-1 relative z-10 h-full overflow-hidden">
                {/* LEFT: Product Grid */}
                <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-slate-50/50">
                    <header className="p-6 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-heading font-bold text-slate-800"
                            >
                                Sales POS
                            </motion.h1>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={fetchProducts}
                                    title="Refresh Products"
                                    className={loading ? 'animate-spin' : ''}
                                >
                                    <FiGrid className="h-5 w-5" />
                                </Button>

                                <div className="w-full max-w-xs relative">
                                    <Input
                                        placeholder="Search products..."
                                        icon={<FaSearch />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-slate-100 border-transparent focus:bg-white focus:border-primary w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories Pills */}
                        <motion.div
                            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                                        categoryFilter === cat
                                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-64 text-primary">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64 text-destructive">
                                <p className="text-lg font-bold mb-2">Error Loading Products</p>
                                <Button variant="outline" onClick={fetchProducts}>Try Again</Button>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-24"
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05 }
                                    }
                                }}
                            >
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            whileHover={{ y: -4 }}
                                            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden flex flex-col"
                                        >
                                            <div className="relative h-32 overflow-hidden bg-slate-100">
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"; }}
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant={product.quantity > 0 ? "success" : "destructive"}>
                                                        {product.quantity > 0 ? `${product.quantity}` : "Out"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="p-3 flex-1 flex flex-col">
                                                <h3 className="font-bold text-slate-800 truncate text-sm" title={product.name}>
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{product.category}</p>

                                                <div className="mt-auto flex justify-between items-end">
                                                    <div>
                                                        {product.ml_discount > 0 && product.clearance_flag ? (
                                                            <div className="flex flex-col">
                                                                <Badge variant="destructive" className="mb-1 text-[10px] px-1.5 py-0">
                                                                    -{product.ml_discount}%
                                                                </Badge>
                                                                <div className="flex items-baseline gap-1.5">
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        ₹{Math.round(product.price * (1 - product.ml_discount / 100))}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400 line-through">
                                                                        ₹{product.price}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                                                        )}
                                                    </div>

                                                    <Button
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.quantity <= 0}
                                                    >
                                                        <FiPlus size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <FaBoxOpen className="text-5xl mb-4 opacity-20" />
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Cart Sidebar */}
                <div className="w-80 lg:w-96 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col shadow-soft z-30 h-full">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaShoppingCart className="text-primary" />
                                Current Order
                            </h2>
                            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">
                                {cart.reduce((acc, i) => acc + i.cartQty, 0)} Items
                            </Badge>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30">
                        <AnimatePresence mode='popLayout'>
                            {cart.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center"
                                >
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <FaShoppingCart className="text-3xl opacity-20" />
                                    </div>
                                    <p className="font-medium text-slate-500">Cart is empty</p>
                                    <p className="text-xs mt-1">Add items to start selling</p>
                                </motion.div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white border border-slate-100 p-2 rounded-xl flex items-center shadow-sm group hover:border-primary/20 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-3 border border-slate-100">
                                            <img
                                                src={getProductImage(item)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate text-sm">{item.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-primary font-bold text-xs">₹{item.price}</span>
                                                {item.originalPrice > item.price && (
                                                    <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-3">
                                            <button
                                                onClick={() => updateQty(item._id, -1)}
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
                                            >
                                                <FiMinus size={12} />
                                            </button>
                                            <span className="w-6 text-center font-mono text-sm font-medium">{item.cartQty}</span>
                                            <button
                                                onClick={() => updateQty(item._id, 1)}
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
                                            >
                                                <FiPlus size={12} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-slate-400 hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-30">
                        {totalSavings > 0 && (
                            <div className="flex justify-between text-xs text-emerald-600 mb-3 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                <span>Total Savings</span>
                                <span>- ₹{totalSavings.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-baseline mb-6">
                            <span className="text-slate-500 text-sm">Total Amount</span>
                            <span className="text-3xl font-bold text-slate-900 tracking-tight">
                                ₹{cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <Button
                            onClick={() => setCheckoutModalOpen(true)}
                            disabled={cart.length === 0}
                            className="w-full h-12 text-base shadow-lg shadow-primary/20"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {checkoutModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setCheckoutModalOpen(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
                                    <p className="text-slate-500 text-sm mt-1">Complete the purchase details</p>
                                </div>
                                <button
                                    onClick={() => setCheckoutModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleCheckout} className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        label="Customer Name"
                                        placeholder="Enter customer name"
                                        required
                                        value={customer.name}
                                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                    <Input
                                        label="Phone Number"
                                        placeholder="Enter phone number"
                                        required
                                        type="tel"
                                        value={customer.phone}
                                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-3">Payment Method</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'Cash', icon: FaMoneyBillWave },
                                            { id: 'Card', icon: FaCreditCard },
                                            { id: 'UPI', icon: FaGooglePay }
                                        ].map(method => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setCustomer({ ...customer, payment: method.id })}
                                                className={cn(
                                                    "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200",
                                                    customer.payment === method.id
                                                        ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
                                                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                                                )}
                                            >
                                                <method.icon className="text-xl" />
                                                <span className="font-semibold text-sm">{method.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex justify-between items-center text-slate-600 mb-2 text-sm">
                                        <span>Items</span>
                                        <span className="font-semibold">{cart.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 shadow-lg shadow-primary/20">
                                    Confirm Order
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Receipt Modal */}
            <AnimatePresence>
                {showReceipt && lastOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
                            onClick={() => setShowReceipt(false)}
                        />

                        <motion.div
                            className="bg-white text-black p-8 rounded-lg w-full max-w-md shadow-2xl relative z-20 print:shadow-none print:w-full print:max-w-none print:absolute print:inset-0 print:rounded-none"
                            id="receipt-content"
                        >
                            {/* Print Styles */}
                            <style>{`
                                @media print {
                                    body * { visibility: hidden; }
                                    #receipt-content, #receipt-content * { visibility: visible; }
                                    #receipt-content { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; box-shadow: none !important; }
                                    .no-print { display: none !important; }
                                }
                            `}</style>

                            <div className="text-center mb-6 border-b border-gray-200 pb-4">
                                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Expirey Eye</h1>
                                <p className="text-xs text-gray-500 mt-1">Smart Retail Solutions</p>
                                <div className="mt-4 flex justify-between text-xs text-gray-500">
                                    <span>{lastOrder.date}</span>
                                    <span>#{lastOrder.orderId}</span>
                                </div>
                            </div>

                            {/* Lines Items */}
                            <div className="space-y-2 mb-6 border-b border-gray-200 pb-4 min-h-[150px]">
                                <div className="flex justify-between text-xs font-bold border-b border-gray-100 pb-2 text-slate-700">
                                    <span className="w-1/2">Item</span>
                                    <span className="w-1/6 text-center">Qty</span>
                                    <span className="w-1/3 text-right">Price</span>
                                </div>
                                {lastOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm text-slate-800">
                                        <span className="w-1/2 truncate pr-2">{item.name}</span>
                                        <span className="w-1/6 text-center">{item.quantity}</span>
                                        <span className="w-1/3 text-right font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-1 mb-8">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{lastOrder.totalAmount}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-slate-900 border-t border-dashed border-slate-300 pt-2 mt-2">
                                    <span>Total Pay</span>
                                    <span>₹{lastOrder.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Paid via</span>
                                    <span>{lastOrder.paymentMethod}</span>
                                </div>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-8 mb-6">Thank you for shopping with us!</p>

                            <div className="flex gap-3 no-print">
                                <Button variant="secondary" onClick={handleSharePDF} className="flex-1" leftIcon={<FaPrint />}>
                                    Save PDF
                                </Button>
                                <Button onClick={() => window.print()} className="flex-1" leftIcon={<FaPrint />}>
                                    Print
                                </Button>
                                <Button variant="ghost" onClick={() => setShowReceipt(false)}>Close</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesPOS;
