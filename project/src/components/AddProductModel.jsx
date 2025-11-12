import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiCamera } from 'react-icons/fi';
// 1. Remove the old import for 'react-qr-reader'
import BarcodeScanner from "./Barcodescanner" // 2. Import your new scanner component

function AddProductModal({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({ /* ... */ });
  const [isScanning, setIsScanning] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // This function receives the barcode from the new scanner component
  const handleBarcodeScan = async (barcode) => {
    console.log(`Scanned barcode: ${barcode}`);
    
    try {
      const response = await axios.get(`/api/products/lookup/${barcode}`);
      const productInfo = response.data;

      setFormData({
        ...formData,
        name: productInfo.name,
        category: productInfo.category,
      });

      setIsScanning(false); // Go back to the form view
    } catch (error) {
      alert(error.response?.data?.msg || "Could not find product for this barcode.");
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/products', formData);
    alert('Product added successfully!');
    onProductAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
        </div>

        {isScanning ? (
          // --- SCANNER VIEW ---
          <div>
            {/* 3. Use the new BarcodeScanner component */}
            <BarcodeScanner onScanSuccess={handleBarcodeScan} />
            <button onClick={() => setIsScanning(false)} className="w-full mt-4 bg-red-500 p-2 rounded-lg">
              Cancel Scan
            </button>
          </div>
        ) : (
          // --- FORM VIEW (no changes here) ---
          <form onSubmit={handleSubmit}>
             <button
              type="button"
              onClick={() => setIsScanning(true)}
              className="w-full flex items-center justify-center mb-4 bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
            >
              <FiCamera className="mr-2" /> Scan Barcode
            </button>
            {/* ... rest of your form fields ... */}
          </form>
        )}
      </div>
    </div>
  );
}

export default AddProductModal;