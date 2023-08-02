import { useState, useEffect } from "react";
import axios from "axios";

export const useApiRequest = (url, method = "GET", autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (body = null) => {
    setLoading(true);
    try {
      let res;
      if (method === "GET") {
        res = await axios.get(url);
      } else if (method === "PUT") {
        res = await axios.put(url, body);
      } else if (method === "DELETE") {
        res = await axios.delete(url);
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }

      setData(res.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [url, method, autoFetch]);

  return { data, loading, error, fetchData };
};
