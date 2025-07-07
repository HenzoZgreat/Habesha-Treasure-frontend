import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../componets/products/ProductCard";
import userProductService from "../service/userProductService";
import { setAllProducts } from "../redux/HabeshaSlice";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.trim() || "";
  const allProducts = useSelector((state) => state.habesha.allApiProducts);
  const language = useSelector((state) => state.habesha.language);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await userProductService.getProducts();
        const products = Array.isArray(response.data) ? response.data : [];
        console.debug("Fetched products:", products); // Debug log
        dispatch(setAllProducts(products));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        dispatch(setAllProducts([]));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    console.debug("Search query:", query, "Products:", allProducts); // Debug log
    if (allProducts.length > 0) {
      if (query) {
        const lowerCaseQuery = query.toLowerCase().trim();
        const results = allProducts.filter((item) =>
          [
            item.name?.toLowerCase() || "",
            item.descriptionEn?.toLowerCase() || "",
            item.descriptionAm?.toLowerCase() || "",
            item.category?.toLowerCase() || "",
          ].some((field) => field.includes(lowerCaseQuery))
        );
        setFilteredProducts(results);
        console.debug("Filtered products:", results); // Debug log
      } else {
        setFilteredProducts(allProducts); // Show all products if no query
      }
    } else {
      setFilteredProducts([]);
    }
  }, [query, allProducts]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        {query ? (
          <>
            Search Results for: <span className="text-habesha_blue font-bold">"{query}"</span>
          </>
        ) : (
          "All Products"
        )}
      </h2>
      {isLoading ? (
        <p className="text-center text-gray-600 text-lg py-10">
          Loading products...
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">
          No products found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-10">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} productItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;