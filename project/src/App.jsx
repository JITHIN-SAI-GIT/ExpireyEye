import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Route,Routes } from "react-router-dom";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
<>
<Header/>
<main>
<Routes>
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/" element={<Login />} />
 <Route path="/signup" element={<Signup />} />
</Routes>

</main>
</>
)
}
