import { useState } from 'react';
import StoreCard from '../components/StoreCard';
import { StoreEditForm } from '../components/StoreEditForm';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../context/useAuth';
import type { Store, CreateStoreData } from '../api/storeApi';
// import { deleteStore } from '../api/storeApi';
import { useDeleteStore } from '../hooks/useDeleteStore';

// interface StoresPageProps {
//   refreshKey: number;
// }
// const StoresPages = ({ refreshKey }: StoresPageProps) => {}

const StoresPages = () => {
  const { token, userId } = useAuth();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { data: stores, isPending, isFetching, isError, error } = useStores(token ?? '', userId);
  // const { stores, isLoading, apiError } = useStores(token ?? '', refreshKey);
  const deleteStoreMutation = useDeleteStore();

  /*
  //start - These are state created for store delete purpose because we are not using the react query here.
  const [deletingStoreId, setDeletingStoreId] = useState<number | null>(null);
  const [deletedStoreIds, setDeletedStoreIds] = useState<number[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  //end - These are state created for store delete purpose because we are not using the react query here.
  */
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

  //delete store with tanstack query
  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this store?'
    );

    if (!confirmed) return;

    deleteStoreMutation.mutate(id, {
      onSuccess: () => {
        if (selectedStore?.store_id === id) {
          setSelectedStore(null);
        }
      },
    });
  };

  /*
  //for store delete not using react query, just using normal react code to delete the store. we can use but not using it.
  const handleDelete = async (id: number) => {
    if (!token) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this store?'
    );

    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeletingStoreId(id);

      await deleteStore(id, token);

      setDeletedStoreIds((previous) => [...previous, id]);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Failed to delete store'
      );
    } finally {
      setDeletingStoreId(null);
    }
  };
  */

  const getInitialValues = (store: Store): CreateStoreData => ({
    store_name: store.store_name,
    location: store.location ?? '',
    store_email: store.store_email ?? '',
  });

  // const visibleStores = (stores ?? []).filter(
  //   (store) => !deletedStoreIds.includes(store.store_id)
  // );

  return (
    <section>
      <h2>My Stores</h2>

      {isFetching && <p>Refreshing stores...</p>}
      {deleteStoreMutation.isError && (
        <p role="alert">
          {deleteStoreMutation.error.message}
        </p>
      )}

      {
        stores.map((store) => (
          <div key={store.store_id}>
            <StoreCard
              storeId={store.store_id}
              storeName={store.store_name}
              location={store.location || 'N/A'}
              totalProducts={0}
              onDelete={handleDelete}
              isDeleting={
                deleteStoreMutation.isPending &&
                deleteStoreMutation.variables === store.store_id
              }
              deleteDisabled={deleteStoreMutation.isPending}
            />

            <button
              type="button"
              onClick={() => setSelectedStore(store)}
            >
              Edit
            </button>

            {selectedStore?.store_id === store.store_id && (
              <StoreEditForm
                key={selectedStore.store_id}
                storeId={selectedStore.store_id}
                initialValues={getInitialValues(selectedStore)}
                onCancel={() => setSelectedStore(null)}
                onUpdated={() => setSelectedStore(null)}
              />
            )}
          </div>
        ))
      }

      {/*
      {deleteError && <p role="alert">{deleteError}</p>}

      {visibleStores.length === 0 ? (
        <p>No stores found. Create your first store!</p>
      ) : (
        visibleStores.map((store) => (
          <div key={store.store_id}>
            <StoreCard
              storeId={store.store_id}
              storeName={store.store_name}
              location={store.location || 'N/A'}
              totalProducts={0}
              onDelete={handleDelete}
              isDeleting={deletingStoreId === store.store_id}
              deleteDisabled={deletingStoreId !== null}
            />

            <button
              type="button"
              onClick={() => setSelectedStore(store)}
            >
              Edit
            </button>

            {selectedStore?.store_id === store.store_id && (
              <StoreEditForm
                key={selectedStore.store_id}
                storeId={selectedStore.store_id}
                initialValues={getInitialValues(selectedStore)}
                onCancel={() => setSelectedStore(null)}
                onUpdated={() => setSelectedStore(null)}
              />
            )}
          </div>
        ))
      )}
      */}
    </section>
  );
};

export default StoresPages;
