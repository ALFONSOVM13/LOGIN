import React from 'react';
import { MDBFooter, MDBContainer } from 'mdb-react-ui-kit';

export default function App() {
  return (
    <MDBFooter className='text-center text-white' style={{ backgroundColor: '#000000' }}>
      <MDBContainer className='p-4'>
        <h5>Desarrolladores</h5>
        <ul className='list-unstyled mb-0'>
          <li>Alfonso Vengoechea</li>
          <li>Natalia Romerin Perez</li>
          <li>Josttin</li>
        </ul>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: '#000000' }}>
        © 2023 Copyright:
        <h1 className='text-white'>
          UNICOSTA
        </h1>
      </div>
    </MDBFooter>
  );
}
