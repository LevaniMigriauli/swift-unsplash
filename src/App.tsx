import {HashRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from "./pages/Home.tsx";
import History from "./pages/History.tsx";

function App() {


    return (
        <HashRouter>
            <Routes>
                <Route path={'/swift-unsplash/'} element={<Home/>}/>
                <Route path={'/swift-unsplash/history'} element={<History/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App
