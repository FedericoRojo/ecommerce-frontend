import { useEffect, useState } from 'react';
import Header from './Header';
import Carrousel from './Carrousel';
import Footer from './Footer';

function HomePage() {

    return (
      <div>
          <Carrousel />
          <Carrousel />
      </div> 
  )
}

export default HomePage;
