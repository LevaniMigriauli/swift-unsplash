import {Link, useLocation} from 'react-router-dom'
import './Header.css'

interface HeaderProps {
    headingTitle: string;
    onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasSearchInput?: boolean
}

const Header = ({headingTitle, hasSearchInput, onSearch}: HeaderProps) => {
    const location = useLocation()

    return (
        <header className={'header'}>
            <h1>{headingTitle}</h1>
            {hasSearchInput && <input className={'header__input'} placeholder="ძებნა..." onChange={onSearch}/>}
            <ul className={'header__nav'}>
                <li className={location.pathname === '/swift-unsplash/' ? 'active' : ''}><Link to={'/swift-unsplash/'}>Home</Link></li>
                <li className={location.pathname === '/swift-unsplash/history' ? 'active' : ''}>
                    <Link to={'/swift-unsplash/history'}>History</Link>
                </li>
            </ul>
        </header>
    )
}

export default Header