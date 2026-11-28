
interface StoreCardProps {
  storeId: number;
  storeName: string;
  location: string;
  totalProducts: number;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  deleteDisabled: boolean;
}

const StoreCard = ({
  storeId,
  storeName,
  location,
  totalProducts,
  onDelete,
  isDeleting,
  deleteDisabled,
}: StoreCardProps) => {
  return (
    <article className="store-card">
      <h3>{storeName} Store</h3>

      <p>Location: {location}</p>

      {totalProducts > 0 ? (
        <p>Products available</p>
      ) : (
        <p>No products available</p>
      )}

      {totalProducts > 100 && <p>High inventory</p>}

      <button
        type="button"
        onClick={() => onDelete(storeId)}
        disabled={deleteDisabled}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </article>
  );
};

export default StoreCard;
