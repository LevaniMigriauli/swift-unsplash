import {Link} from 'react-router-dom'

interface HeaderProps {
    headingTitle: string;
    onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header = ({headingTitle, onSearch}: HeaderProps) => {

    return (
        <header>
            <h1>{headingTitle}</h1>
            <ul className={'header__nav'}>
                <li><Link to={'/'}>Home</Link></li>
                <li><Link to={'/history'}>History</Link></li>
            </ul>
            <input placeholder="ძებნა..." onChange={onSearch}/>
        </header>
    )
}

export default Header