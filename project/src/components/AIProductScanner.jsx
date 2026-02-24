import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, Upload, X, Loader } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const AIProductScanner = ({ onScanSuccess }) => {
    const [imageURL, setImageURL] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setError(null);
            analyzeImage(url);
        }
    };

    const analyzeImage = async (url) => {
        setIsAnalyzing(true);
        try {
            // Ensure backend is WebGL for performance
            await tf.setBackend('webgl');

            // Load the model
            const model = await mobilenet.load();

            // Create an HTMLImageElement to pass to the model
            const img = new Image();
            img.src = url;
            img.crossOrigin = 'anonymous';

            img.onload = async () => {
                // Classify the image
                const predictions = await model.classify(img);
                console.log('Predictions:', predictions);

                if (predictions && predictions.length > 0) {
                    // Take the top prediction
                    const topPrediction = predictions[0];

                    // Cleaner Name Logic
                    let rawName = topPrediction.className.split(',')[0].trim();
                    // Remove scientific/Latin names
                    rawName = rawName.replace(/\s*\(.*?\)\s*/g, '');

                    // Generalization Map: Specific -> Generic
                    const nameMap = {
                        // --- FRUITS ---
                        'granny smith': 'Apple', 'golden delicious': 'Apple', 'delicious': 'Apple', 'braeburn': 'Apple', 'gala': 'Apple', 'fuji': 'Apple', 'mcintosh': 'Apple',
                        'orange': 'Orange', 'mandarin': 'Orange', 'tangerine': 'Orange', 'clementine': 'Orange', 'satsuma': 'Orange', 'lemon': 'Lemon', 'lime': 'Lime', 'grapefruit': 'Grapefruit', 'pomelo': 'Pomelo',
                        'banana': 'Banana', 'plantain': 'Banana', 'cavendish': 'Banana',
                        'strawberry': 'Strawberry', 'raspberry': 'Raspberry', 'blueberry': 'Blueberry', 'cranberry': 'Cranberry', 'blackberry': 'Blackberry',
                        'cantaloupe': 'Melon', 'honeydew': 'Melon', 'watermelon': 'Watermelon', 'papaya': 'Papaya',
                        'pomegranate': 'Pomegranate', 'fig': 'Fig', 'pineapple': 'Pineapple', 'mango': 'Mango', 'custard apple': 'Custard Apple', 'durian': 'Durian', 'jackfruit': 'Jackfruit', 'kiwi': 'Kiwi', 'grape': 'Grape', 'raisin': 'Raisin', 'peach': 'Peach', 'nectarine': 'Peach', 'apricot': 'Apricot', 'plum': 'Plum', 'cherry': 'Cherry', 'pear': 'Pear', 'avocado': 'Avocado',

                        // --- VEGETABLES ---
                        'broccoli': 'Broccoli', 'cauliflower': 'Cauliflower', 'cabbage': 'Cabbage', 'brussels sprout': 'Brussels Sprouts',
                        'carrot': 'Carrot', 'potato': 'Potato', 'sweet potato': 'Sweet Potato', 'yam': 'Yam', 'beet': 'Beetroot', 'radish': 'Radish', 'turnip': 'Turnip', 'parsnip': 'Parsnip',
                        'tomato': 'Tomato', 'cucumber': 'Cucumber', 'zucchini': 'Zucchini', 'squash': 'Squash', 'pumpkin': 'Pumpkin', 'eggplant': 'Eggplant',
                        'lettuce': 'Lettuce', 'spinach': 'Spinach', 'kale': 'Kale', 'chard': 'Chard', 'arugula': 'Arugula',
                        'pepper': 'Pepper', 'capsicum': 'Pepper', 'chili': 'Chili Pepper', 'jalapeno': 'Chili Pepper',
                        'onion': 'Onion', 'garlic': 'Garlic', 'ginger': 'Ginger', 'scallion': 'Green Onion', 'leek': 'Leek',
                        'mushroom': 'Mushroom', 'corn': 'Corn', 'maize': 'Corn', 'peas': 'Peas', 'bean': 'Beans', 'asparagus': 'Asparagus', 'celery': 'Celery',

                        // --- MEAT & SEAFOOD ---
                        'chicken': 'Chicken', 'hen': 'Chicken', 'rooster': 'Chicken', 'turkey': 'Turkey', 'duck': 'Duck',
                        'beef': 'Beef', 'steak': 'Beef', 'cow': 'Beef', 'ox': 'Beef',
                        'pork': 'Pork', 'ham': 'Ham', 'bacon': 'Bacon', 'sausage': 'Sausage', 'hotdog': 'Hot Dog', 'hot dog': 'Hot Dog', 'ribs': 'Ribs',
                        'fish': 'Fish', 'salmon': 'Salmon', 'tuna': 'Tuna', 'cod': 'Cod', 'trout': 'Trout', 'halibut': 'Halibut',
                        'shrimp': 'Shrimp', 'prawn': 'Shrimp', 'crab': 'Crab', 'lobster': 'Lobster', 'clam': 'Clams', 'oyster': 'Oysters', 'mussel': 'Mussels',

                        // --- DAIRY & EGGS ---
                        'milk': 'Milk', 'cream': 'Cream', 'half and half': 'Cream',
                        'cheese': 'Cheese', 'cheddar': 'Cheese', 'mozzarella': 'Cheese', 'swiss': 'Cheese', 'parmesan': 'Cheese',
                        'yogurt': 'Yogurt', 'butter': 'Butter', 'margarine': 'Butter',
                        'ice cream': 'Ice Cream', 'sorbet': 'Ice Cream', 'gelato': 'Ice Cream',
                        'egg': 'Eggs',

                        // --- BAKERY ---
                        'bread': 'Bread', 'toast': 'Bread', 'baguette': 'Bread', 'loaf': 'Bread', 'bun': 'Bun', 'roll': 'Roll',
                        'bagel': 'Bagel', 'croissant': 'Croissant', 'pretzel': 'Pretzel',
                        'cake': 'Cake', 'cupcake': 'Cupcake', 'muffin': 'Muffin', 'brownie': 'Brownie',
                        'cookie': 'Cookie', 'biscuit': 'Cookie', 'doughnut': 'Doughnut', 'donut': 'Doughnut', 'pie': 'Pie', 'tart': 'Tart',

                        // --- PANTRY & GRAINS ---
                        'rice': 'Rice', 'pasta': 'Pasta', 'spaghetti': 'Pasta', 'macaroni': 'Pasta', 'noodle': 'Noodles', 'ramen': 'Noodles',
                        'cereal': 'Cereal', 'oatmeal': 'Oatmeal', 'oats': 'Oats', 'granola': 'Granola',
                        'flour': 'Flour', 'sugar': 'Sugar', 'salt': 'Salt', 'pepper shaker': 'Pepper',
                        'oil': 'Oil', 'olive oil': 'Oil', 'vegetable oil': 'Oil', 'vinegar': 'Vinegar', 'sauce': 'Sauce', 'ketchup': 'Ketchup', 'mustard': 'Mustard', 'mayonnaise': 'Mayonnaise',
                        'soup': 'Soup', 'can': 'Canned Food', 'tin': 'Canned Food', 'jar': 'Jarred Food',

                        // --- SNACKS ---
                        'chip': 'Chips', 'potato chip': 'Chips', 'dorito': 'Chips', 'tortilla chip': 'Chips',
                        'cracker': 'Crackers', 'popcorn': 'Popcorn',
                        'chocolate': 'Chocolate', 'candy': 'Candy', 'gum': 'Gum',
                        'nut': 'Nuts', 'peanut': 'Peanuts', 'almond': 'Almonds', 'cashew': 'Cashews', 'walnut': 'Walnuts',

                        // --- BEVERAGES ---
                        'coffee': 'Coffee', 'espresso': 'Coffee', 'cappuccino': 'Coffee', 'latte': 'Coffee', 'mocha': 'Coffee', 'cup': 'Coffee', 'mug': 'Coffee',
                        'tea': 'Tea', 'chai': 'Tea',
                        'soda': 'Soda', 'coke': 'Soda', 'pop': 'Soda', 'cola': 'Soda', 'pepsi': 'Soda',
                        'water': 'Water', 'bottle': 'Water', 'juice': 'Juice', 'smoothie': 'Smoothie',
                        'beer': 'Beer', 'wine': 'Wine', 'liquor': 'Liquor', 'champagne': 'Champagne',

                        // --- PREPARED FOODS ---
                        'pizza': 'Pizza', 'burger': 'Burger', 'cheeseburger': 'Burger', 'hamburger': 'Burger',
                        'sandwich': 'Sandwich', 'sub': 'Sandwich', 'wrap': 'Wrap', 'burrito': 'Burrito', 'taco': 'Taco',
                        'salad': 'Salad', 'sushi': 'Sushi', 'stew': 'Stew', 'curry': 'Curry',

                        // --- HOUSEHOLD & PERSONAL CARE ---
                        'soap': 'Soap', 'shampoo': 'Shampoo', 'conditioner': 'Conditioner', 'lotion': 'Lotion', 'toothpaste': 'Toothpaste', 'toothbrush': 'Toothbrush',
                        'towel': 'Towel', 'tissue': 'Tissues', 'toilet paper': 'Toilet Paper', 'napkin': 'Napkins',
                        'detergent': 'Detergent', 'bleach': 'Bleach', 'cleaner': 'Cleaner', 'sponge': 'Sponge',
                        'battery': 'Batteries', 'bulb': 'Light Bulb',

                        // --- MISC / MOBILE-NET QUIRKS ---
                        'tabby': 'Cat Food', 'persian cat': 'Cat Food', 'siamese': 'Cat Food', // Just in case
                        'remote': 'Remote Control', 'mouse': 'Computer Mouse', 'keyboard': 'Keyboard', 'monitor': 'Screen', 'screen': 'Screen',
                        'book': 'Book', 'notebook': 'Notebook', 'pen': 'Pen', 'pencil': 'Pencil'
                    };

                    let name = rawName;
                    const lowerRaw = rawName.toLowerCase();

                    // Check against map (partial match check)
                    for (const [key, value] of Object.entries(nameMap)) {
                        if (lowerRaw.includes(key)) {
                            name = value;
                            break;
                        }
                    }

                    // Capitalize first letter if not from map
                    if (name === rawName) {
                        name = name.charAt(0).toUpperCase() + name.slice(1);
                    }

                    const lowerName = name.toLowerCase();
                    let category = 'Pantry'; // Default

                    // Enhanced Category Mapping
                    if (['banana', 'apple', 'orange', 'lemon', 'fruit', 'berry', 'melon', 'grape', 'strawberry', 'pineapple'].some(k => lowerName.includes(k))) category = 'Fruits';
                    else if (['broccoli', 'carrot', 'spinach', 'vegetable', 'potato', 'onion', 'pepper', 'cucumber', 'lettuce', 'tomato'].some(k => lowerName.includes(k))) category = 'Vegetables';
                    else if (['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream'].some(k => lowerName.includes(k))) category = 'Dairy';
                    else if (['bread', 'muffin', 'cake', 'bagel', 'croissant', 'cookie', 'doughnut', 'pizza', 'burger', 'sandwich'].some(k => lowerName.includes(k))) category = 'Bakery';
                    else if (['soda', 'juice', 'coffee', 'tea', 'water', 'drink', 'beer', 'wine', 'cola'].some(k => lowerName.includes(k))) category = 'Beverages';
                    else if (['chicken', 'beef', 'pork', 'meat', 'steak', 'sausage', 'hot dog'].some(k => lowerName.includes(k))) category = 'Meat';
                    else if (['fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster'].some(k => lowerName.includes(k))) category = 'Seafood';

                    // --- New Features: Price & Expiry ---
                    const price = generatePrice(category);
                    const expiryDate = calculateExpiry(category);

                    onScanSuccess({ name, category, price, expiryDate });
                } else {
                    setError('Could not identify the image.');
                }
                setIsAnalyzing(false);
            };
        } catch (err) {
            console.error('TF Error:', err);
            setError('Failed to load AI model. Please try again.');
            setIsAnalyzing(false);
        }
    };

    // Helper: Generate random realistic price based on category
    const generatePrice = (cat) => {
        let min = 1, max = 10;
        switch (cat) {
            case 'Dairy': min = 2; max = 8; break;
            case 'Bakery': min = 1; max = 6; break;
            case 'Beverages': min = 1; max = 5; break;
            case 'Snacks': min = 1; max = 7; break;
            case 'Fruits': min = 0.5; max = 4; break;
            case 'Vegetables': min = 0.5; max = 4; break;
            case 'Meat': min = 5; max = 20; break;
            case 'Seafood': min = 8; max = 25; break;
            default: min = 1; max = 10;
        }
        return (Math.random() * (max - min) + min).toFixed(2);
    };

    // Helper: Calculate default expiry date based on category shelf life
    const calculateExpiry = (cat) => {
        const today = new Date();
        let daysToAdd = 365; // Default 1 year for pantry

        switch (cat) {
            case 'Dairy': daysToAdd = 10; break; // Milk/Yogurt spoils fast
            case 'Bakery': daysToAdd = 5; break; // Bread lasts less
            case 'Fruits': daysToAdd = 7; break;
            case 'Vegetables': daysToAdd = 7; break;
            case 'Meat': daysToAdd = 3; break; // Very short shelf life
            case 'Seafood': daysToAdd = 2; break;
            case 'Beverages': daysToAdd = 90; break;
            default: daysToAdd = 180;
        }

        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + daysToAdd);
        return futureDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };

    const clearImage = () => {
        setImageURL(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all bg-slate-50 relative overflow-hidden",
            isAnalyzing ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary hover:bg-slate-100"
        )}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
            />

            {!imageURL ? (
                <div onClick={() => !isAnalyzing && fileInputRef.current.click()} className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center space-y-3 py-4">
                        <div className="p-4 bg-white rounded-full shadow-sm text-primary">
                            <Upload className="h-8 w-8" />
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                            Click to upload image
                        </div>
                        <p className="text-xs text-slate-400">Supported formats: JPG, PNG</p>
                    </div>
                </div>
            ) : (
                <div className="relative inline-block w-full">
                    <img
                        src={imageURL}
                        alt="Preview"
                        className="max-h-48 rounded-lg shadow-md mx-auto object-contain"
                        ref={imageRef}
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-white/90 text-slate-500 rounded-full p-1.5 hover:bg-white hover:text-red-500 transition-colors shadow-sm"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                            <Loader className="h-8 w-8 text-white animate-spin mb-2" />
                            <span className="text-white text-sm font-bold tracking-wide">AI Analyzing...</span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center justify-center gap-2">
                    <X className="h-4 w-4" /> {error}
                </div>
            )}
        </div>
    );
};

export default AIProductScanner;
