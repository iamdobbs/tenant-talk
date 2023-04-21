import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import useAxios from "axios-hooks";
import { format } from "date-fns";
import { AdvancedImage } from "@cloudinary/react";
import clsx from "clsx";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { HomeIcon } from "@heroicons/react/24/solid";
import useAuthContext from "../../hooks/useAuthContext";
import { CloudinaryContext } from "../../contexts/CloudinaryContext";
import Stars from "../stars/Stars";

const detailedRatings = [
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

const Review = () => {
  const { id } = useParams();
  const cld = useContext(CloudinaryContext);
  const { token } = useAuthContext();
  const [{ loading, data, error }, refetch] = useAxios({
    url: process.env.REACT_APP_API_URI + `/review/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return null; // change this dependent on if we need to return. Should page
  // be accessible if we haven't hit a property value in the previous path.

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="py-8">
        <nav
          aria-label="Backlink"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div role="list" className="flex items-center space-x-4">
            <div className="text-sm">
              <Link
                to={`/property/${data.review.property._id}`}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                <span aria-hidden="true">&larr; Back to </span>
                {data.review.property.address}
              </Link>
            </div>
          </div>
        </nav>

        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div>
                <p className="text-gray-500">
                  {format(new Date(data.review.createdAt), "dd MMMM yyyy")}
                </p>
              </div>

              <div className="mt-4">
                <Stars
                  value={data.review.overallRating}
                  label="Overall Rating"
                />
                <p className="sr-only">
                  {data.review.overallRating} out of 5 stars
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="my-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                {data.review.image ? (
                  <AdvancedImage
                    className="h-full w-full object-cover"
                    cldImg={cld
                      .image(data.review.image)
                      .resize(
                        fill().width(800).height(800).gravity(autoGravity())
                      )}
                  />
                ) : (
                  <HomeIcon className="h-36 w-36 text-white" />
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">
                  {`${data.review.author.firstName} says:`}
                </h2>

                <div className="prose prose-sm mt-4 text-gray-500">
                  {data.review.comment}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-gray-900">
                  Detailed Ratings
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-6">
                  {detailedRatings.map(({ name, label }) => (
                    <div key={name}>
                      <Stars
                        value={data.review[name]}
                        label={label}
                        labelPosition="side"
                      />
                    </div>
                  ))}

                  {toggleValues.map(({ name, label }) => (
                    <div key={name} className="flex justify-between">
                      <label
                        className="block text-sm font-medium leading-6 text-gray-900"
                        htmlFor={name}
                      >
                        {label}
                      </label>
                      <span
                        id={name}
                        className={clsx(
                          data.review[name]
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800",
                          "inline-flex h-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        )}
                      >
                        {data.review[name] ? "Yes" : "No"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
