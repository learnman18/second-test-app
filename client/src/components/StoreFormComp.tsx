import { useState } from "react";
import { createStore } from '../api/storeApi'
import { useAuth } from '../context/useAuth'

interface StoreFormCompProps {
  onStoreCreated: () => void;
}

interface StoreFormData {
  storeName: string;
  location: string;
  storeEmail: string;
}

const emptyForm: StoreFormData = {
  storeName: "",
  location: "",
  storeEmail: "",
};

const validateField = (name: keyof StoreFormData, value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return name === "storeEmail" ? "Email is required." : `${name === "storeName" ? "Store name" : "Location"} is required.`;
  }

  if (name === "storeEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return "Enter a valid email address.";
  }

  return "";
};

const StoreFormComp = ({ onStoreCreated }: StoreFormCompProps) => {
  const { token } = useAuth();
  const [storeForm, setStoreForm] = useState<StoreFormData>(emptyForm);
  const [storeFormError, setStoreFormError] = useState<StoreFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name !== "storeName" && name !== "location" && name !== "storeEmail") {
      return;
    }

    setStoreForm((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setStoreFormError((previousErrors) => ({
      ...previousErrors,
      [name]: previousErrors[name] ? validateField(name, value) : "",
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError('');

    const errors: StoreFormData = {
      storeName: validateField("storeName", storeForm.storeName),
      location: validateField("location", storeForm.location),
      storeEmail: validateField("storeEmail", storeForm.storeEmail),
    };
    setStoreFormError(errors);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    console.log(storeForm);

    try {
      setIsLoading(true);

      const response = await createStore(storeForm, token);

      console.log('Store created:', response.store);

      setStoreForm(emptyForm);
      setStoreFormError(emptyForm);
      onStoreCreated();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }


  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {apiError && <p role="alert">{apiError}</p>}
        <label htmlFor="storeName">Store name</label>
        <input id='storeName' type="text" name="storeName" value={storeForm.storeName} placeholder="Enter store name" onChange={handleChange} />
        {storeFormError.storeName && <p role="alert">{storeFormError.storeName}</p>}
        <label htmlFor="location">Location</label>
        <input id="location" type="text" name="location" value={storeForm.location} placeholder="Enter store location" onChange={handleChange} />
        {storeFormError.location && <p role="alert">{storeFormError.location}</p>}
        <label htmlFor="storeEmail">Email</label>
        <input id="storeEmail" type="email" name="storeEmail" value={storeForm.storeEmail} placeholder="Enter store email" onChange={handleChange} />
        {storeFormError.storeEmail && <p role="alert">{storeFormError.storeEmail}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Add store'}
        </button>
      </form>
    </div>
  );
};

export default StoreFormComp;