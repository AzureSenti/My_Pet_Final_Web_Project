/**
 * UMI Route Wrapper cho Bác sĩ thú y CMS
 * File này được khai báo trong routes.ts với wrappers: ['@/wrappers/VetAuth']
 */
import VetLayout from '@/layouts/VetLayout';
import React from 'react';
import { useModel, Redirect } from 'umi';

const VetAuth: React.FC<{ children: React.ReactNode; location?: any }> = ({ children, location }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  if (!currentUser) {
    return <Redirect to="/user/login" />;
  }

  if (currentUser.role !== 'vet') {
    return <Redirect to="/403" />;
  }

  return <VetLayout location={location}>{children}</VetLayout>;
};

export default VetAuth;
