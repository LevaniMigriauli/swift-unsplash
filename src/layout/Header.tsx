import {Link, useLocation} from 'react-router-dom'
import './header.css'

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
                <li className={location.pathname === '/' ? 'active' : ''}><Link to={'/'}>Home</Link></li>
                <li className={location.pathname === '/history' ? 'active' : ''}>
                    <Link to={'/history'}>History</Link>
                </li>
            </ul>
        </header>
    )
}

export default Header