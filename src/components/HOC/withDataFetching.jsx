import { useEffect, useState } from "react";
import requestApi from "@/axios/axiosInstance";
import { useNavigate } from "react-router-dom";

const withDataFetching = (WrappedComponent, urls) => {
  return function WithDataFetchingComponent(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
      data: {},
      loading: true,
      error: null,
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          setState((prevState) => ({ ...prevState, loading: true }));

          // Fetch the count first with limit=1
          const countResponses = await Promise.all(
            urls.map((url) => requestApi(url, "get", null, { limit: 1 }))
          );

          // Extract count from the first API call
          const counts = countResponses.map((response) => response.data.count);

          // Now fetch all data with limit=count
          const fetchedData = await Promise.all(
            urls.map((url, index) =>
              requestApi(url, "get", null, { limit: counts[index] })
            )
          );

          const dataMap = urls.reduce((acc, url, index) => {
            acc[url] = fetchedData[index].data.results;
            return acc;
          }, {});

          setState({ data: dataMap, loading: false, error: null });
        } catch (e) {
          console.error(e);
          setState({ data: {}, loading: false, error: e });
          navigate("/login");
        }
      };

      fetchData();
    }, [navigate]);

    return <WrappedComponent state={state} {...props} />;
  };
};

export default withDataFetching;
