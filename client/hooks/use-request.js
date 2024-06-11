import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(err.response ? err.response.data.errors : [{ message: 'Something went wrong' }]);
      console.error('Error in doRequest:', err);
    }
  };

  return { doRequest, errors };
};

export default useRequest;
