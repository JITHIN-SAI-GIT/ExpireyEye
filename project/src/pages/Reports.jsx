import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FaFileDownload, FaPrint, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const Reports = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/orders`);
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders", err);
        }
    };

    const calculateTotalRevenue = () => {
        return orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2);
    };

    const exportToCSV = () => {
        const headers = "Order ID,Customer,Phone,Items,Total,Method,Date\n";
        const rows = orders.map(order =>
            `${order._id},${order.customerName},${order.phoneNumber},"${order.items.map(i => i.name).join(';')}",${order.totalAmount},${order.paymentMethod},${new Date(order.createdAt).toLocaleDateString()}`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales_report.csv";
        a.click();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/orders/${id}`);
            setOrders(orders.filter(order => order._id !== id));
        } catch (err) {
            console.error("Error deleting order:", err);
            alert("Failed to delete order");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-slate-800">Sales Reports</h1>
                            <p className="text-slate-500 mt-1">View and export your transaction history</p>
                        </div>
                        <div className="flex gap-3">
                            <Card className="px-4 py-2 flex-col justify-center border-emerald-100 bg-emerald-50/50 hidden md:flex">
                                <p className="text-xs text-emerald-600 font-medium uppercase">Total Revenue</p>
                                <p className="text-xl font-bold text-emerald-700">₹{calculateTotalRevenue()}</p>
                            </Card>
                            <Button onClick={exportToCSV} variant="primary" leftIcon={<FaFileDownload />}>
                                Export CSV
                            </Button>
                            <Button onClick={() => window.print()} variant="outline" leftIcon={<FaPrint />}>
                                Print
                            </Button>
                        </div>
                    </header>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                                No transactions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => (
                                            <TableRow key={order._id}>
                                                <TableCell className="text-slate-500">
                                                    <div className="flex flex-col">
                                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-semibold text-slate-700">{order.customerName}</p>
                                                    <p className="text-xs text-slate-400">{order.phoneNumber}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-slate-600 max-w-xs truncate" title={order.items.map(i => `${i.cartQty}x ${i.name}`).join(', ')}>
                                                        {order.items.length} items
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn(
                                                        "font-medium",
                                                        order.paymentMethod === 'Cash' ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                                                            order.paymentMethod === 'Card' ? "text-blue-600 bg-blue-50 border-blue-200" :
                                                                "text-purple-600 bg-purple-50 border-purple-200"
                                                    )}>
                                                        {order.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-800">
                                                    ₹{order.totalAmount.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(order._id)}
                                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                        title="Delete Record"
                                                    >
                                                        <FaTrash size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
