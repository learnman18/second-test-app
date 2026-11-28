
import { useState } from 'react';
import { useUpdateStore } from '../hooks/useUpdateStore';
import type { CreateStoreData } from '../api/storeApi';

interface StoreEditFormProps {
  storeId: number;
  initialValues: CreateStoreData;
  onCancel: () => void;
  onUpdated: () => void;
}

export const StoreEditForm = ({ storeId, initialValues, onCancel, onUpdated, }: StoreEditFormProps) => {

  const [storeForm, setStoreForm] = useState<CreateStoreData>(initialValues);

  const updateStoreMutation = useUpdateStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStoreForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateStoreMutation.mutate(
      {
        id: storeId,
        storeData: {
          store_name: storeForm.store_name.trim(),
          location: storeForm.location.trim(),
          store_email: storeForm.store_email.trim(),
        },
      },
      {
        onSuccess: () => {
          onUpdated();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Store</h3>

      <div>
        <label htmlFor="storeName">Store Name</label>
        <input
          id="storeName"
          name="store_name"
          value={storeForm.store_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          value={storeForm.location}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="storeEmail">Store Email</label>
        <input
          id="storeEmail"
          name="store_email"
          type="email"
          value={storeForm.store_email}
          onChange={handleChange}
        />
      </div>

      {updateStoreMutation.isError && (
        <p role="alert">
          {updateStoreMutation.error.message}
        </p>
      )}

      {updateStoreMutation.isSuccess && (
        <p>Store updated successfully!</p>
      )}

      <button
        type="submit"
        disabled={updateStoreMutation.isPending}
      >
        {updateStoreMutation.isPending
          ? 'Updating...'
          : 'Update Store'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={updateStoreMutation.isPending}
      >
        Cancel
      </button>
    </form>
  );
};
