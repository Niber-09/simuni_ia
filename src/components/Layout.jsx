import React from 'react';
import Navigation from '@/components/Navigation';
import AdminNavigation from '@/components/AdminNavigation';

const Layout = ({ children, type = 'public' }) => {
  return (
    <>
      {type === 'public' ? <Navigation /> : <AdminNavigation />}
      <main>{children}</main>
    </>
  );
};

export default Layout;