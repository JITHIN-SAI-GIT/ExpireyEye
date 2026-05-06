import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiVideo, FiLoader, FiPlay, FiSearch, FiFilm } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import { API_BASE_URL } from "../config";

const MarketingData = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedVideo, setGeneratedVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleGenerateVideo = async (product) => {
        setGenerating(true);
        setSelectedProduct(product);
        setGeneratedVideo(null);

        try {
            // Use product image or a placeholder if missing
            const imageUrl = product.image_url || "https://via.placeholder.com/600x400?text=Product+Image";

            const response = await axios.post(
                `${API_BASE_URL}/marketing/generate-video`,
                {
                    imageUrl: imageUrl,
                    prompt: `Cinematic pan of ${product.name}, 4k promotion`,
                    productName: product.name
                },
                { withCredentials: true }
            );

            // Replicate usually returns an output array or object. 
            // If it returns a list of URLs (SVD does this), take the first one.
            const videoOutput = response.data.videoUrl;
            const videoUrl = Array.isArray(videoOutput) ? videoOutput[0] : videoOutput;

            setGeneratedVideo(videoUrl);
        } catch (error) {
            console.error("Video creation failed:", error);
            alert("Failed to generate video. Check specific error in console.");
        } finally {
            setGenerating(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Video Marketing</h1>
                            <p className="text-slate-500 mt-2">Generate promotional videos for your products instantly.</p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Product List */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -4 }}
                                        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer group ${selectedProduct?._id === product._id
                                            ? "border-primary shadow-lg ring-1 ring-primary/20"
                                            : "border-slate-100 shadow-sm hover:shadow-md"
                                            }`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img
                                                    src={product.image_url || "https://via.placeholder.com/100"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                                                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                                            ${product.price}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description || "No description available"}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGenerateVideo(product);
                                                    }}
                                                    disabled={generating && selectedProduct?._id === product._id}
                                                    className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                                >
                                                    {generating && selectedProduct?._id === product._id ? (
                                                        <>
                                                            <FiLoader className="animate-spin" /> Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiVideo /> Generate Video
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Preview/Result Section */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden sticky top-8">
                                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                            <FiFilm className="text-primary" />
                                            Video Studio
                                        </h3>
                                    </div>

                                    <div className="p-6">
                                        {generatedVideo ? (
                                            <div className="space-y-4">
                                                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video group">
                                                    <video
                                                        src={generatedVideo}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                        autoPlay
                                                        loop
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <a
                                                        href={generatedVideo}
                                                        download="promo-video.mp4"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 bg-primary text-white py-2.5 rounded-xl font-medium text-center hover:bg-primary-dark transition-colors"
                                                    >
                                                        Download Video
                                                    </a>
                                                    <button
                                                        onClick={() => setGeneratedVideo(null)}
                                                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                                                {generating ? (
                                                    <div className="space-y-4">
                                                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">Creating Magic...</h4>
                                                            <p className="text-sm text-slate-500 mt-1">This takes about 2-3 minutes.</p>
                                                        </div>
                                                    </div>
                                                ) : selectedProduct ? (
                                                    <div className="space-y-4">
                                                        <img
                                                            src={selectedProduct.image_url}
                                                            alt="Preview"
                                                            className="w-32 h-32 rounded-lg object-cover mx-auto shadow-md"
                                                        />
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">Ready to Generate</h4>
                                                            <p className="text-sm text-slate-500 mt-1">
                                                                Create a promotional video for <br />
                                                                <span className="text-primary font-medium">{selectedProduct.name}</span>
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleGenerateVideo(selectedProduct)}
                                                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all w-full"
                                                        >
                                                            Start Generation
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 opacity-50">
                                                        <FiPlay size={40} className="mx-auto" />
                                                        <p className="font-medium text-slate-900">Select a product</p>
                                                        <p className="text-sm text-slate-500">Choose a product from the list to create a video.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketingData;
