import { Routes, Route } from "react-router-dom";
import { Home } from "../features/home/pages/Home";


export function Routing() {
    return (
        <Routes>
            
            <Route path="/" element={<Home />}/>


        </Routes>
    )
}