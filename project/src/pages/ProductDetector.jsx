import React, { useRef, useEffect, useState } from 'react';
import { loadModel, classifyImage } from '../lib/mlUtils';
import { FaCamera, FaSpinner, FaSearch, FaStop, FaPlay } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FiBox } from 'react-icons/fi';

const ProductDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [predictions, setPredictions] = useState([]);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);
    const [matchedProducts, setMatchedProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const initModel = async () => {
            try {
                await loadModel();
                setIsModelLoading(false);
            } catch (err) {
                setError("Failed to load ML model. Check console.");
                setIsModelLoading(false);
            }
        };
        initModel();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            const userStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = userStream;
                setStream(userStream);
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Could not access camera. Ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
        setPredictions([]);
    };

    useEffect(() => {
        let animationId;
        let lastSearchTime = 0;

        const runClassification = async () => {
            if (isCameraActive && videoRef.current && !isModelLoading) {
                if (videoRef.current.readyState >= 2) { 
                    try {
                        const results = await classifyImage(videoRef.current);
                        setPredictions(results);

                        // Trigger backend search if confidence is high and we haven't searched recently
                        if (results.length > 0 && results[0].probability > 0.25) {
                            const now = Date.now();
                            if (now - lastSearchTime > 3000) { // Throttled to max 1 search per 3 seconds
                                lastSearchTime = now;
                                searchBackendProducts(results[0].className);
                            }
                        }
                    } catch (err) {
                        console.error("Classification loop error:", err);
                    }
                }
                animationId = requestAnimationFrame(runClassification);
            }
        };

        if (isCameraActive) {
            runClassification();
        }

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isCameraActive, isModelLoading]);

    const searchBackendProducts = async (searchTerm) => {
        try {
            setIsSearching(true);
            const res = await axios.get(`${API_BASE_URL}/products/search?q=${searchTerm}`);
            setMatchedProducts(res.data);
        } catch (err) {
            console.error("Failed to search backend products", err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="p-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-800">Product Image Detection</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time object recognition using MobileNet AI</p>
                </header>

                <main className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                    {/* Camera Feed Section */}
                    <div className="flex-1 flex flex-col gap-4">
                        <Card className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border-none">
                            {isCameraActive ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-100">
                                    <FaCamera className="text-6xl mb-4 opacity-20" />
                                    <p>Camera is inactive</p>
                                </div>
                            )}

                            {isModelLoading && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                    <FaSpinner className="animate-spin text-4xl mb-3 text-primary" />
                                    <p className="font-medium">Loading AI Model...</p>
                                </div>
                            )}

                            {error && (
                                <div className="absolute bottom-4 left-4 right-4 bg-destructive/90 text-white p-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}
                        </Card>

                        <div className="flex gap-4">
                            {!isCameraActive ? (
                                <Button
                                    onClick={startCamera}
                                    className="flex-1 h-12 gap-2"
                                    disabled={isModelLoading}
                                >
                                    <FaPlay /> Start Detection
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopCamera}
                                    variant="destructive"
                                    className="flex-1 h-12 gap-2"
                                >
                                    <FaStop /> Stop Camera
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Predictions Section */}
                    <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaSearch className="text-primary text-sm" />
                            Live Predictions
                        </h2>

                        <div className="space-y-3">
                            {predictions.length > 0 ? (
                                predictions.map((pred, idx) => (
                                    <Card key={idx} className="p-4 border-slate-200 hover:border-primary/30 transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-800 capitalize">
                                                {pred.className.split(',')[0]}
                                            </span>
                                            <Badge variant={pred.probability > 0.5 ? "success" : "secondary"}>
                                                {(pred.probability * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full transition-all duration-300"
                                                style={{ width: `${pred.probability * 100}%` }}
                                            />
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                                    <p className="text-sm">No detection results</p>
                                </div>
                            )}
                        </div>

                        {/* Matched Products Section */}
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                                <FiBox className="text-primary" />
                                Inventory Matches
                            </h3>
                            {isSearching ? (
                                <div className="flex justify-center p-4"><FaSpinner className="animate-spin text-primary" /></div>
                            ) : matchedProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {matchedProducts.map((prod) => (
                                        <Card key={prod._id} className="p-3 flex items-center gap-3 border-l-4 border-l-primary">
                                            <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                                                <img src={prod.image || prod.image_url || 'https://via.placeholder.com/50'} alt={prod.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800 text-sm line-clamp-1">{prod.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-slate-500">{prod.category}</span>
                                                    <span className="text-xs font-bold text-emerald-600">Stock: {prod.quantity}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 bg-slate-100 p-3 rounded-xl text-center">
                                    No items in inventory matched the detection.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductDetector;
