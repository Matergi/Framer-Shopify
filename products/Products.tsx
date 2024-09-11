import Card from "[replace-with-framer-componentURL]";

import { useEffect, useState } from "react";
import { addPropertyControls, ControlType } from "framer";
import { SHOPIFY_URL, getProductURL, shopifyAPI } from "../Helpers.tsx";

type Variant = {
  id: string;
  title: string;
  sku: string;
  price: {
    amount: string;
    currencyCode: string;
  };
};

type Collection = {
  handle: string;
};

type Image = {
  id: string;
  originalSrc: string;
  altText: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  tags: string[];
  url: string;
  variants: Variant[];
  images: Image[];
  collections: Collection[];
};

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Products(props) {
  // This is a React component containing an Example component
  // - Find inspiration: https://www.framer.com/developers/

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    shopifyAPI({
      graphql: graphql_allProducts(props.numbersOfProducts),
    }).then((response) => {
      const products: Product[] = response.data.products.edges.map(
        (productApi): Product => {
          const productNode = productApi.node;
          console.log("productNode", productNode);
          return {
            id: productNode.id,
            title: productNode.title,
            description: productNode.description,
            handle: productNode.handle,
            productType: productNode.productType,
            vendor: productNode.vendor,
            tags: productNode.tags,
            url: `https://${SHOPIFY_URL}/products/${productNode.handle}`,
            collections: productNode.collections.edges.map(
              (collectionApi): Collection => {
                const collectionNode = collectionApi.node;
                return {
                  handle: collectionNode.handle,
                };
              }
            ),
            variants: productNode.variants.edges.map((variantApi): Variant => {
              const variantNode = variantApi.node;
              return {
                id: variantNode.id,
                title: variantNode.title,
                sku: variantNode.sku,
                price: {
                  amount: variantNode.price.amount.split(".")[0],
                  currencyCode: variantNode.price.currencyCode,
                },
              };
            }),
            images: productNode.images.edges.map((imageApi): Image => {
              const imageNode = imageApi.node;
              return {
                id: imageNode.id,
                originalSrc: imageNode.originalSrc,
                altText: imageNode.altText,
              };
            }),
          };
        }
      );

      setProducts(
        products.filter((product) => {
          if (props.collection === "_all_") {
            return true;
          }

          console.log(
            "product.collections",
            product.collections,
            props.collection
          );
          if (
            product.collections.find(
              (collection) =>
                collection.handle.toLowerCase() ===
                props.collection.toLowerCase()
            )
          ) {
            return true;
          }

          return false;
        })
      );
    });
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridGap: "10px",
      }}
    >
      {products.map((product) => (
        <Card
          key={product.id}
          style={{
            width: "100%",
            height: props.customHeight,
            cursor: "pointer",
          }}
          title={product.title}
          price={`${product.variants[0].price.amount}€`}
          image={product.images[0].originalSrc}
          onClick={() => {
            window.open(getProductURL(product.handle), "_self");
          }}
        />
      ))}
    </div>
  );
}

const graphql_allProducts = (numbersOfProducts: number) => `{
                    products(first: ${numbersOfProducts}) {
                        edges {
                            node {
                                id
                                title
                                description
                                handle
                                productType
                                vendor
                                tags
                                collections(first: 5) {
                                    edges {
                                        node {
                                            handle
                                        }
                                    }
                                }
                                variants(first: 5) {
                                    edges {
                                        node {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            sku
                                        }
                                    }
                                }
                                images(first: 3) {
                                    edges {
                                        node {
                                            id
                                            originalSrc
                                            altText
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`;

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};

addPropertyControls(Products, {
  columns: {
    type: ControlType.Number,
    defaultValue: 3,
    min: 1,
    max: 5,
  },
  customHeight: {
    type: ControlType.Enum,
    defaultValue: "440px",
    options: ["440px", "350px", "250px"],
    optionTitles: ["Desktop", "Tablet", "Mobile"],
  },
  numbersOfProducts: {
    type: ControlType.Number,
    defaultValue: 20,
    min: 1,
    max: 100,
  },
  collection: {
    type: ControlType.String,
    defaultValue: "_all_",
  },
});
