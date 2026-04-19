import React, { Suspense } from 'react';

const ProductList = React.lazy(() => import('products/ProductList'));
const CartWidget = React.lazy(() => import('cart/CartWidget'));

const App: React.FC = () => {
  return (
    <div>
      <h1>Host App</h1>

      <Suspense fallback={<div>Loading Products...</div>}>
        <ProductList />
      </Suspense>

      <Suspense fallback={<div>Loading Cart...</div>}>
        <CartWidget />
      </Suspense>
    </div>
  );
};

export default App;
