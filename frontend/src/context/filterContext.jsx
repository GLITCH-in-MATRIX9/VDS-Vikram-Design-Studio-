import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [categoryContext, setCategoryContext] = useState(null);
  const [subCategoryContext, setSubCategoryContext] = useState(null);

  const clearFilters = () => {
    setCategoryContext(null);
    setSubCategoryContext(null);
  };

  return (
    <FilterContext.Provider
      value={{
        categoryContext,
        setCategoryContext,
        subCategoryContext,
        setSubCategoryContext,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
