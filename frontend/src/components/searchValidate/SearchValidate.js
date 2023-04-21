import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Search from "../search/Search";
import useError from "../../hooks/useError";

const SearchValidate = ({
  onChange,
  value,
  foundPropertyId,
  setFoundPropertyId,
}) => {
  const [isLoading, setIsLoading] = useState(null);
  const { handleError } = useError();

  const getProperty = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URI + "/property",
        {
          params: { address: value },
        }
      );
      if (data.property) {
        setFoundPropertyId(data.property._id);
      } else {
        setFoundPropertyId(false);
      }
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (value) {
      getProperty();
    } else {
      setFoundPropertyId(null);
    }
  }, [value]);

  return (
    <Search
      onChange={onChange}
      value={value}
      foundPropertyId={foundPropertyId}
      isLoading={isLoading}
      label
    />
  );
};

SearchValidate.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  foundPropertyId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setFoundPropertyId: PropTypes.func,
};

SearchValidate.defaultProps = {
  value: null,
  onChange: null,
  foundPropertyId: null,
  setFoundPropertyId: null,
};

export default SearchValidate;
