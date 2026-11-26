
import StoreCard from '../components/StoreCard';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../context/useAuth';

// interface StoresPageProps {
//   refreshKey: number;
// }
// const StoresPages = ({ refreshKey }: StoresPageProps) => {}

const StoresPages = () => {
  const { token, userId } = useAuth();
  const { data: stores, isPending, isFetching, isError, error } = useStores(token ?? '', userId);
  // const { stores, isLoading, apiError } = useStores(token ?? '', refreshKey);

  if (!token) {
    return <p role="alert">Authentication token is required</p>;
  }

  if (isPending) {
    return <p>Loading stores...</p>;
  }

  if (isError) {
    return <p role="alert">{error.message}</p>;
  }

  if (!stores || stores.length === 0) {
    return <p>No stores found. Create your first store!</p>;
  }

  return (
    <section>
      <h2>My Stores</h2>
      {isFetching && <p>Refreshing stores...</p>}
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

export default StoresPages;
