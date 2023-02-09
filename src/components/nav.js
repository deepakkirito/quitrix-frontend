import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import '../App.css';

function Nav() {

  const [activeTab, setActiveTab] = useState('Plot');
  const title = document.getElementsByTagName('title');
  const navigate = useNavigate();

  useEffect(() => {
    title[0].innerText = `${activeTab} || Quitrix Assessment`;
    if (activeTab.toLocaleLowerCase() === 'video') {
      navigate('/video', { replace: true });
    } else {
      navigate('/plot', { replace: true });
    }
  }, [activeTab]);

  return (
    <div className='Nav'>
      <h1>Quitrix Round - 1 Offline Assessment</h1>
      <ul
        className="nav nav-tabs"
        onClick={e => setActiveTab(e.target.innerText)}
      >
        <li className="nav-item">
          <Link
            to='/plot'
            className={`nav-link ${activeTab && activeTab === 'Plot' && 'active'}`}
          >Plot</Link>
        </li>
        <li className="nav-item">
          <Link
            to='/video'
            className={`nav-link ${activeTab && activeTab === 'Video' && 'active'}`}
          >Video</Link>
        </li>
      </ul>

    </div>

  );
}



export default Nav;