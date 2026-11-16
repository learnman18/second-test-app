
import { useEffect, useState } from 'react';
import { getStores } from '../api/storeApi';
import type { Store } from '../api/storeApi';
import StoreCard from '../components/StoreCard';

interface StoresPageProps {
  token: string;
  refreshKey: number;
}

const StoresPage = ({ token, refreshKey }: StoresPageProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');


  useEffect(() => {
    if (!token) {
      return console.error('token is missing');
    }

    const getStore = async () => {
      try {
        setIsLoading(true);
        setApiError('');

        const response = await getStores(token);
        setStores(response);
      } catch (error) {
        setApiError(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      } finally {
        setIsLoading(false)
      }
    }

    getStore()
  }, [token, refreshKey]);

  if (isLoading) {
    return <p>Loading stores...</p>;
  }

  if (apiError) {
    return <p role="alert">{apiError}</p>;
  }

  if (stores.length === 0) {
    return <p>No stores found. Create your first store!</p>;
  }

  return (
    <section>
      <h2>My Stores</h2>

      {stores.map((store) => (
        <StoreCard
          key={store.store_id}
          storeName={store.store_name}
          location={store.location || 'N/A'}
          totalProducts={0}
        />
      ))}
    </section>
  );
};

export default StoresPage;
