export const getProductImage = (product) => {
    if (product.image && product.image.length > 10) return product.image;

    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    // Specific Mappings
    if (name.includes("apple")) return "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80";
    if (name.includes("banana")) return "https://images.unsplash.com/photo-1571771896612-618492027f21?w=400&q=80";
    if (name.includes("milk")) return "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80";
    if (name.includes("bread")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80";
    if (name.includes("egg")) return "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80";
    if (name.includes("cheese")) return "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&q=80";
    if (name.includes("chicken")) return "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80";
    if (name.includes("meat") || name.includes("beef")) return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80";
    if (name.includes("fish") || name.includes("salmon")) return "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&q=80";
    if (name.includes("rice")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80";
    if (name.includes("pasta")) return "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&q=80";
    if (name.includes("potato")) return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80";
    if (name.includes("tomato")) return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80";
    if (name.includes("onion")) return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80";
    if (name.includes("carrot")) return "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80";
    if (name.includes("coke") || name.includes("cola")) return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80";
    if (name.includes("juice")) return "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80";
    if (name.includes("water")) return "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80";
    if (name.includes("chocolate")) return "https://images.unsplash.com/photo-1511381978829-ba9a2041240d?w=400&q=80";
    if (name.includes("chips")) return "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80";

    // Category Fallbacks
    if (category.includes("fruit")) return "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80";
    if (category.includes("veg")) return "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80";
    if (category.includes("dairy")) return "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80";
    if (category.includes("bakery") || category.includes("bread")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80";
    if (category.includes("meat")) return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80";
    if (category.includes("drink") || category.includes("beverage")) return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80";
    if (category.includes("snack")) return "https://images.unsplash.com/photo-1621939514649-28b12e81658b?w=400&q=80";

    // Default
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"; // Generic grocery bag/store image
};
