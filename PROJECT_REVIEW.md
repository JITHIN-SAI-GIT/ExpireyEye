# Machine Learning Application Development Project Review

## 1️⃣ Execution (Project Execution Workflow)

### Requirement Analysis
The primary objective of this project is to automate the detection of expiring products in a retail environment and apply dynamic discounts to reduce food waste. The system must monitor inventory in real-time, identify products nearing their expiry date, and automatically adjust prices based on predefined business rules without manual intervention.

### Data Collection
Data is collected through the system's inventory management module. The `products_list.json` file serves as the initial seed dataset, containing structured product information. In the live environment, store managers input new stock data via the Point of Sale (POS) and Inventory UI, which is then stored in the MongoDB database.

### Data Preprocessing
To ensure accurate model execution, the following preprocessing steps are applied:
1.  **Temporal Normalization:** All `expiryDate` fields are parsed and normalized to midnight (00:00:00) to facilitate consistent date comparisons.
2.  **Validation:** Input data is validated to ensure `quantity` and `price` are non-negative.
3.  **Filtering:** Products with missing or invalid expiry dates are excluded from the scoring pipeline to prevent errors.

### Feature Engineering
The system engineers specific features for the heuristic scoring engine:
*   **Days Remaining (`daysLeft`):** A temporal feature calculated as the difference between the current date and the product's `expiryDate`.
*   **Stock Surplus Indicator:** A derived feature combining `quantity` thresholds (e.g., `quantity > 50`) with `daysLeft` to identify overstocked items.
*   **Perishability:** Implicitly handled through category classification (e.g., "Meat" vs. "Pantry"), which influences the base probability of a sale.

### Model Selection
**Selected Model:** Rule-Based Heuristic Scoring Engine
**Reasoning:** Given the strict regulatory requirements for food safety and the need for deterministic pricing strategies, a transparent heuristic model was selected. This approach offers full explainability and precise control over discount logic, unlike "black box" neural networks, ensuring that discounts are applied consistently based on predefined business rules (e.g., "if 2 days left, exactly 50% off").

### Model Training (Logic Calibration)
While the model does not undergo traditional gradient descent training, its logic thresholds were calibrated based on retail best practices:
*   **Critical Zone (≤ 2 days):** 50% Discount, 90% Sale Probability.
*   **High Urgency (≤ 5 days):** 30% Discount, 75% Sale Probability.
*   **Stock Pressure:** Additional 10% discount if `daysLeft < 10` and `quantity > 50`.

### Model Evaluation Metrics
The system's effectiveness is evaluated using:
*   **Discount Application Rate:** The percentage of expiring inventory items that are successfully flagged and discounted.
*   **Stock Clearance Probability:** The estimated likelihood (`sale_probability`) that a discounted item will be sold before expiry.

### Model Deployment
The Scoring Engine is deployed as an integrated Micro-Service (`MLService.js`) within the Node.js/Express backend. It is triggered automatically via API endpoints or scheduled tasks to re-score the inventory.

### Monitoring and Maintenance
*   **Execution Logs:** System logs track the number of items processed and discounts applied during each run.
*   **Logic Updates:** The heuristic rules are modular, allowing for easy updates to thresholds or discount percentages if inventory turnover rates change.

---

## 2️⃣ Dataset (Project-Specific Dataset Description)

### Dataset Name
**ExpireyEye Retail Inventory Simulation Dataset**

### Dataset Source
Internal synthetic dataset generated for retail testing (Mock Data from `products_list.json`).

### Dataset Size
*   **Records:** Approximately 200 distinct product SKUs.
*   **Format:** JSON / MongoDB Document Collection.

### Feature Types
The dataset comprises a mix of categorical, numerical, and temporal features:
*   **Categorical:** `category` (e.g., "Meat", "Dairy", "Pantry", "Seafood").
*   **Numerical:** `quantity` (Stock Level), `price` (Unit Cost), `ml_discount` (Target/Output), `sale_probability` (Output).
*   **Temporal:** `expiryDate` (Critical Feature), `last_ml_run`.

### Target Variable
*   **Primary Target:** `ml_discount` (The calculated discount percentage).
*   **Secondary Target:** `sale_probability` (The estimated probability of the item selling).

### Data Cleaning Methods
*   **Schema Validation:** Mongoose schemas enforce data integrity, ensuring `expiryDate` is a valid Date object.
*   **Default Value Injection:** New records are initialized with default values for predictive fields (`ml_discount: 0`, `clearance_flag: false`).

### Data Transformation
*   **Time-to-Event Transformation:** Raw `expiryDate` timestamps are converted into a scalar `daysLeft` integer for processing by the logic engine.
*   **Probability Scaling:** Logic outcomes are mapped to a 0-100 probability scale for intuitive representation in the UI.

### Suitability
This dataset is highly suitable for the problem statement as it represents a diverse range of product perishability profiles. This diversity allows the logic engine to demonstrate its ability to apply differential pricing strategies across various categories (e.g., short shelf-life "Meat" vs. long shelf-life "Pantry").

---

## 3️⃣ Architecture (Project-Based System Architecture)

### Architecture Layers

1.  **Presentation / UI Layer**
    *   **Technology:** React (Vite) + CSS.
    *   **Key Components:** `SalesPOS.jsx` (Point of Sale Interface), `DashboardLayout` (Manager/Admin View).
    *   **Role:** Visualizes the inventory, highlights expiring products with "Clearance" tags, displays the calculated `ml_discount`, and handles user interactions.

2.  **Application / Backend Layer**
    *   **Technology:** Node.js + Express.
    *   **Key Components:** `mlRoutes.js` (API Gateway for ML services), `productRoutes.js` (CRUD operations).
    *   **Role:** Acts as the central controller, handling API requests, managing authentication, and orchestrating the execution of the scoring logic.

3.  **Machine Learning Model Layer**
    *   **Technology:** JavaScript (Server-Side Logic) within `MLService.js`.
    *   **Role:** Executes the scoring algorithm (`predictDiscount`), iterating through the inventory to enable real-time decision-making based on the defined business rules.

4.  **Data Storage Layer**
    *   **Technology:** MongoDB (via Mongoose).
    *   **Collections:** `products` (Inventory & ML scores), `orders` (Sales transaction history).
    *   **Role:** Persists the state of the application, including product details, expiry dates, and the discounts applied by the model.

### End-to-End Data Flow
1.  **Trigger:** New stock is added or a daily schedule evokes the scoring engine.
2.  **Input:** The system retrieves `expiryDate` and `quantity` from the MongoDB `products` collection.
3.  **Processing (ML Model):** `MLService` calculates `daysLeft`, evaluates the data against the rules, and generates `ml_discount`.
4.  **Output:** The `product` document is updated in the database with the new Discount and Probability values.
5.  **Visualization:** The `SalesPOS` component fetches the updated product list and displays "Clearance 50% Off" tags to the user.

### Model Integration
The model follows a **Monolithic Integration** pattern, being tightly coupled with the backend service layer (`services/MLService.js`). It is exposed via a RESTful API endpoint (`POST /api/ml/predict-discount`), allowing for on-demand execution from the frontend or external triggers.

### Deployment Environment
*   **Type:** Cloud / Web Hosting (Production Ready).
*   **Configuration:** Single-instance Node.js container for the Backend, with Static file hosting for the Frontend distribution.

### Scalability and Performance
*   **Scalability:** The current iteration uses an O(n) approach to score all products. For future scaling, this can be optimized using batch processing or database-level aggregation pipelines.
*   **Performance:** The in-memory processing within Node.js is highly efficient for the current dataset size (< 10,000 items), ensuring near-instantaneous response times.
