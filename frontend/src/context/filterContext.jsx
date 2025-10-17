import React, { createContext, useContext, useState, useCallback } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [categoryContext, setCategoryContext] = useState(null);
  const [subCategoryContext, setSubCategoryContext] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setCategoryContext(null);
    setSubCategoryContext(null);
    setSearchQuery("");
  };

  return (
    <FilterContext.Provider
      value={{
        categoryContext,
        setCategoryContext,
        subCategoryContext,
        setSubCategoryContext,
        searchQuery,
        setSearchQuery,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
