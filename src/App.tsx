import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from "./pages/Home.tsx";
import History from "./pages/History.tsx";

function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/swift-unsplash/'} element={<Home/>}/>
                <Route path={'/swift-unsplash/history'} element={<History/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
