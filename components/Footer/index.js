import React from 'react';
import { SOCIAL_TWITTER, SOCIAL_TELEGRAM, SOCIAL_GITHUB} from '../../constants/social';
import PoweredByCz from '../../public/static/assets/images/poweredbycz.png';

function Footer() {
    return(<footer id="footer" className="footer pb-7" style={{position:"relative"}}>
    <div className="content has-text-centered">
      <div>
        <a className="m-2" href={SOCIAL_TELEGRAM} target="_blank">
          <span className="icon"><i className="fa-brands fa-telegram"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_TWITTER} target="_blank">
          <span className="icon"><i className="fa-brands fa-twitter"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_GITHUB} target="_blank">
          <span className="icon"><i className="fa-brands fa-github"></i></span>
        </a>
      </div>  
      <p className='pb-6'>
        v0.1.6
      </p>
    </div>
  </footer>);
}

export default Footer;