
import React from 'react';
import { Calculator } from '@/components/Calculator';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Calculator />
      </main>
    </div>
  );
};

export default Index;
