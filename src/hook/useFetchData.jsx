/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import requestApi from "@/axios/axiosInstance.js";
import env from "@/Env";
import useQueryParams from "@/hook/useQueryParams.jsx";

const useFetchData = (url) => {
  const [state, setState] = useState({ loading: true, data: [], total: 0 });
  const queryParams = useQueryParams();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, loading: true });
      try {
        const params = {
          limit: env.countOfPage,
          offset: env.countOfPage * queryParams.page,
          name: queryParams.name,
          category: queryParams.category,
        };
        const response = await requestApi(url, "get", null, params);
        setState({
          loading: false,
          data: response.data.results,
          total: response.data.count,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [queryParams, url]);

  return { state };
};

export default useFetchData;
