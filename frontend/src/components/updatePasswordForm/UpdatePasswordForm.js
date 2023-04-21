import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import useAuthContext from "../../hooks/useAuthContext";
import useError from "../../hooks/useError";

const fields = [
  {
    name: "currentPassword",
    label: "Current Password",
    style: "sm:col-span-4",
  },
  {
    name: "newPassword",
    label: "New Password",
    style: "sm:col-span-3",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    style: "sm:col-span-3",
  },
];

const UpdatePasswordForm = () => {
  const { token, dispatch } = useAuthContext();
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { handleError } = useError();
  const [isLoading, setIsLoading] = useState(null);

  const updatePassword = async ({ confirmPassword, ...formData }) => {
    setIsLoading(true);

    try {
      const { data } = await axios.patch(
        process.env.REACT_APP_API_URI + "/user/password",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: "login",
        payload: data,
      });
      toast.success("Password updated");
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Password
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Update your password
        </p>
      </div>

      <form
        onSubmit={handleSubmit(updatePassword)}
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {fields.map(({ name, label, style }) => (
              <div key={name} className={style}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {label}
                </label>
                <div className="mt-2">
                  <input
                    id={name}
                    type="password"
                    className={clsx(
                      errors[name]
                        ? "ring-red-500 focus:ring-red-500"
                        : "ring-gray-300 focus:ring-orange-500",
                      "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                    )}
                    {...register(name, {
                      required: `${label} is required`,
                      ...(name === "newPassword" && {
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                          message:
                            "Password must contain at least eight characters, at least one uppercase letter, one lowercase letter and one number",
                        },
                      }),
                      ...(name === "confirmPassword" && {
                        validate: (value) => {
                          if (watch("newPassword") !== value)
                            return "Passwords do not match";
                        },
                      }),
                    })}
                    data-cy={name}
                  />
                </div>
                {errors[name] && (
                  <p
                    role="alert"
                    className="ml-1 mt-1 text-xs font-medium tracking-wide text-red-500"
                  >
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 p-4 sm:px-8">
          <button
            type="button"
            onClick={() => reset()}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
