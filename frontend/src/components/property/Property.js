import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import useAuthContext from "../../hooks/useAuthContext";
import ReviewCard from "../reviewCard/ReviewCard";
import Stars from "../stars/Stars";

const ratings = [
  { name: "landlordRating", label: "Landlord" },
  { name: "conditionRating", label: "Condition" },
  { name: "neighbourRating", label: "Neighbours" },
  { name: "warmthRating", label: "Warmth" },
  { name: "parkingRating", label: "Parking" },
  { name: "areaRating", label: "Area" },
];

const Property = () => {
  const { id } = useParams();
  const { token } = useAuthContext();
  const [{ loading, data, error }, refetch] = useAxios({
    url: process.env.REACT_APP_API_URI + `/property/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return null; // change this dependent on if we need to return. Should page
  // be accessible if we haven't hit a property value in the previous path.

  const getAverage = (name, reviews) =>
    Math.round(
      reviews.reduce((total, review) => total + review[name], 0) /
        reviews.length
    );

  const { address, reviews } = data.property;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {address}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {`Reviews: ${reviews.length}`}
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <Stars
          value={getAverage("overallRating", reviews)}
          label="Overall Rating"
        />

        <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ratings.map(({ name, label }) => (
            <div key={name} className="sm:col-span-1">
              <Stars
                value={getAverage(name, reviews)}
                label={label}
                labelPosition="side"
              />
            </div>
          ))}
        </dl>
      </div>

      <h3 className="mt-4 block px-4 font-medium leading-6 text-gray-900 sm:px-6">
        Reviews
      </h3>
      <div className="mt-2">
        {reviews.reverse().map((review, index) => (
          <ReviewCard key={review._id} review={review} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Property;
