import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

// useResources("learners", "courses") -> { data: {learners, courses}, loading, error, reload }
export default function useResources(...names) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = names.join(",");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all(key.split(",").map((n) => api.get("/" + n)))
      .then((res) => {
        const obj = {};
        key.split(",").forEach((n, i) => (obj[n] = res[i]));
        setData(obj);
        setError(null);
      })
      .catch(() => setError("Impossible de joindre json-server (port 3001)."))
      .finally(() => setLoading(false));
  }, [key]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}