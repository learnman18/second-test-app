interface StoreCardProps {
  storeName: string,
  location: string,
  totalProducts: number
}

const StoreCard = ({ storeName, location, totalProducts }: StoreCardProps) => {
  return (
    <article className="store-card">
      <h3>{storeName} Store</h3>
      <p>Location: {location} </p>
      {totalProducts > 0 ? (
        <p>Products available</p>
      ) : (
        <p>No products available</p>
      )}

      {totalProducts > 100 && <p>High inventory</p>}
    </article>
  )
}


export default StoreCard;