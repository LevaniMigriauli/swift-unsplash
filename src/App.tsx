import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from "./pages/Home.tsx";
import History from "./pages/History.tsx";

function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/history'} element={<History/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
