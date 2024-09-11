import { useEffect, useState, type ComponentType } from "react";
import {
  Product,
  ProductContext,
  Variant,
  Image,
  shopifyAPI,
} from "./Helpers.tsx";

export function withProduct(Component): ComponentType {
  return (props) => {
    const [product, setProduct] = useState<Product | undefined>();

    useEffect(() => {
      const pathSplitted = document.location.pathname.split("/");
      const handle = pathSplitted[pathSplitted.length - 1];

      shopifyAPI({
        graphql: graphql_getProductByHandle(handle),
      }).then((result) => {
        const productNode = result.data.productByHandle;

        const product: Product = {
          id: productNode.id,
          title: productNode.title,
          description: productNode.description,
          variants: productNode.variants.edges.map((variantApi): Variant => {
            const variantNode = variantApi.node;
            return {
              id: variantNode.id,
              title: variantNode.title,
              sku: variantNode.sku,
              availableForSale: variantNode.availableForSale,
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

        setProduct(product);
      });
    }, []);

    return (
      <ProductContext.Provider
        value={{
          product,
        }}
      >
        <Component {...props} />
      </ProductContext.Provider>
    );
  };
}

const graphql_getProductByHandle = (product_handle: string) => `{
        productByHandle(handle: "${product_handle}") {
            id
            title
            description
            variants(first: 5) {
                edges {
                    node {
                        id
                        title
                        availableForSale
                            price {
                                amount
                                currencyCode
                            }
                        sku
                    }
                }
            }
            images(first: 10) {
                edges {
                    node {
                        id
                        originalSrc
                        altText
                    }
                }
            }
        }
    }`;
