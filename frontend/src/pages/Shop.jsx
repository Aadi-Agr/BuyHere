import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        return product.price >= minPrice && product.price <= maxPrice;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    minPrice,
    maxPrice,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row ml-8">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div className="flex items-center mr-4 mb-5" key={brand}>
                  <input
                    type="radio"
                    id={`brand-${brand}`}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="ml-2 text-sm font-medium text-white"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem] text-white">
              <div className="flex justify-between text-sm mb-2">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={minPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= maxPrice) setMinPrice(value);
                }}
                className="w-full mb-2"
              />
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minPrice) setMaxPrice(value);
                }}
                className="w-full"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4 bg-pink-600 text-white rounded py-2 hover:bg-pink-700"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3 ml-4 flex-1">
            <h2 className="h4 text-center mb-4">{products?.length} Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
