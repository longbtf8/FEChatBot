import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetMeQuery } from "@/store/api/authApi";
import { setChecked, clearUser } from "@/store/authSlice";

function AuthInit({ children }) {
    const dispatch = useDispatch();
    const [getMe] = useLazyGetMeQuery();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            getMe().unwrap().catch(() => dispatch(clearUser()));
        } else {
            dispatch(setChecked());
        }
    }, [dispatch, getMe]);

    return children;
}

export default AuthInit;
