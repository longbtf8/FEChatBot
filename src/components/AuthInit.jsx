import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/store/api/authApi";
import { setChecked, clearUser, setUser } from "@/store/authSlice";

function AuthInit({ children }) {
  const dispatch = useDispatch();
  const { data, error, isSuccess, isError, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.data));
    }
    if (isError) {
      dispatch(clearUser());
      dispatch(setChecked());
    }
  }, [dispatch]);

  return children;
}

export default AuthInit;
