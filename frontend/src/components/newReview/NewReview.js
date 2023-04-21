import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import SearchValidate from "../searchValidate/SearchValidate";
import useAuthContext from "../../hooks/useAuthContext";
import RadioGroupStars from "../radioGroupStars/RadioGroupStars";
import Toggle from "../toggle/Toggle";
import useUpload from "../../hooks/useUpload";
import useError from "../../hooks/useError";

const ratingValues = [
  { name: "landlordRating", label: "Landlord" },
  { name: "conditionRating", label: "Condition" },
  { name: "neighbourRating", label: "Neighbours" },
  { name: "warmthRating", label: "Warmth" },
  { name: "parkingRating", label: "Parking" },
  { name: "areaRating", label: "Area" },
];

const toggleValues = [
  { name: "petsAllowed", label: "Pets Allowed?" },
  { name: "depositReturned", label: "Deposit Returned?" },
];

const NewReview = () => {
  const { token, dispatch } = useAuthContext();
  const { handleError } = useError();
  const [isLoading, setIsLoading] = useState(null);
  const [foundPropertyId, setFoundPropertyId] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { upload } = useUpload();

  const watchImage =
    watch("image", [null])[0] && URL.createObjectURL(watch("image", [null])[0]);

  const createReview = async ({ address, image, ...formData }) => {
    setIsLoading(true);

    const publicId = image.length !== 0 ? await upload(image[0]) : null;

    if (foundPropertyId) {
      try {
        const { data } = await axios.patch(
          process.env.REACT_APP_API_URI + `/property/${foundPropertyId}`,
          {
            review: { ...formData, image: publicId },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch({ type: "refresh", payload: data });
        toast.success("New review created 🎉");
        navigate(`/property/${data.property._id}`);
      } catch (err) {
        handleError(err);
      }
    } else {
      try {
        const { data } = await axios.post(
          process.env.REACT_APP_API_URI + "/property",
          {
            property: { address },
            review: { ...formData, image: publicId },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch({ type: "refresh", payload: data });
        toast.success("New property and review created 🎉");
        navigate(`/property/${data.property._id}`);
      } catch (err) {
        handleError(err);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Property
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Select the property that you wish to review
          </p>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: "Please select a property to review" }}
                  render={({ field: { ref, ...field } }) => (
                    <SearchValidate
                      foundPropertyId={foundPropertyId}
                      setFoundPropertyId={setFoundPropertyId}
                      {...field}
                    />
                  )}
                />

                {errors.address && (
                  <p
                    role="alert"
                    className="ml-1 mt-1 text-xs font-medium tracking-wide text-red-500"
                  >
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Review
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a review for this property
          </p>
        </div>

        <form
          onSubmit={handleSubmit(createReview)}
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Comment
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue=""
                    placeholder="The house was lovely and warm in the winter and my neighbours were..."
                    {...register("comment", {
                      required: "Please write a comment for your review",
                    })}
                  />
                </div>
                {errors.comment && (
                  <p
                    role="alert"
                    className="ml-1 mt-1 text-xs font-medium tracking-wide text-red-500"
                  >
                    {errors.comment.message}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Please write your review above, click{" "}
                  <Link className="text-orange-500" to="/about">
                    here
                  </Link>{" "}
                  for some writing tips.
                </p>
              </div>

              <div className="col-span-full">
                <Controller
                  control={control}
                  name="overallRating"
                  rules={{ required: true }}
                  defaultValue={1}
                  render={({ field: { ref, ...field } }) => (
                    <RadioGroupStars label="Overall Rating" {...field} />
                  )}
                />
              </div>

              <div className="col-span-full">
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Detailed Ratings
                </legend>
              </div>

              {ratingValues.map(({ name, label }) => (
                <div key={name} className="sm:col-span-3">
                  <Controller
                    control={control}
                    name={name}
                    rules={{ required: true }}
                    defaultValue={1}
                    render={({ field: { ref, ...field } }) => (
                      <RadioGroupStars
                        label={label}
                        labelPosition="side"
                        {...field}
                      />
                    )}
                  />
                </div>
              ))}

              {toggleValues.map(({ name, label }) => (
                <div key={name} className="sm:col-span-3">
                  <Controller
                    control={control}
                    name={name}
                    defaultValue={false}
                    render={({ field: { ref, ...field } }) => (
                      <Toggle label={label} {...field} />
                    )}
                  />
                </div>
              ))}

              <div className="col-span-full">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  Review Image
                </p>

                <div className="relative my-2 rounded-lg border border-dashed border-gray-900/25">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", {
                      required: false,
                      validate: {
                        lessThan10MB: (files) =>
                          files.length === 0 ||
                          files[0]?.size < 1000000 ||
                          "Please upload an image smaller than 1MB",
                        acceptedFormats: (files) =>
                          files.length === 0 ||
                          ["image/jpeg", "image/png"].includes(
                            files[0]?.type
                          ) ||
                          "Please upload a PNG or JPEG",
                      },
                    })}
                    className="sr-only relative z-50 m-0 h-full w-full cursor-pointer p-20 opacity-0"
                  />

                  <div className="absolute inset-y-0 h-full w-full">
                    <div className="flex h-full w-full p-2">
                      {watchImage && (
                        <div className="aspect-square h-full w-auto flex-none overflow-hidden rounded-md">
                          <img
                            alt="preview"
                            src={watchImage}
                            className="h-full w-full bg-gray-200 object-cover"
                          />
                        </div>
                      )}
                      <div className="w-full justify-center px-6 py-10">
                        <div className="text-center">
                          <PhotoIcon
                            className="mx-auto h-12 w-12 text-gray-300"
                            aria-hidden="true"
                          />

                          <p className="mt-4 pl-1 text-sm leading-6 text-gray-600">
                            <span className="font-semibold text-orange-500">
                              Upload a file{" "}
                            </span>
                            or drag and drop
                          </p>

                          <p className="text-xs leading-5 text-gray-600">
                            PNG or JPG up to 1MB
                          </p>
                          {errors.image && (
                            <p
                              role="alert"
                              className="text-xs font-medium tracking-wide text-red-500"
                            >
                              {errors.image.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {watchImage && (
                  <button
                    type="button"
                    onClick={() => reset({ image: [null] })}
                    className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 p-4 sm:px-8">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReview;
