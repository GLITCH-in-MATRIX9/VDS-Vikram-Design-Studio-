import { createContext, useState, useContext } from "react";

const FilterContext = createContext();

// Custom hook for easy access to the context
export const useFilters = () => {
  return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
  const [categoryContext, setCategoryContext] = useState(null);
  const [subCategoryContext, setSubCategoryContext] = useState(null);

  // Function to clear all filters
  const clearFilters = () => {
    setCategoryContext(null);
    setSubCategoryContext(null);
  };

  const value = {
    categoryContext,
    setCategoryContext,
    subCategoryContext,
    setSubCategoryContext,
    clearFilters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
