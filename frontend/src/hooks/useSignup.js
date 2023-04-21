import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuthContext from "./useAuthContext";

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (formData) => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URI + "/user/signup", formData);
      dispatch({
        type: "login",
        payload: data,
      });
      toast.success("Account created 🎉");
    } catch (err) {
      toast.error(err.response.data.message);
    }
    setIsLoading(false);
  };

  return { signup, isLoading };
};

export default useSignup;
