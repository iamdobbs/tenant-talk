import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuthContext from "./useAuthContext";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (formData) => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URI + "/user/login", formData);
      dispatch({
        type: "login",
        payload: data,
      });
      toast.success("Login successful 🎉");
    } catch (err) {
      toast.error(err.response.data.message);
    }
    setIsLoading(false);
  };

  return { login, isLoading };
};

export default useLogin;
