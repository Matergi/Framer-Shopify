import { createContext } from "react";

/**
 * ENV
 */
export const SHOPIFY_URL = "insert-value";
export const SHOPIFY_ACCESS_TOKEN = "insert-value";
export const FRAMER_BASE_URL = "https://heavy-operator-******.framer.app";

/**
 * HELPERS
 */
export const getProductURL = (productSlug: string) =>
  `${FRAMER_BASE_URL}/product/${productSlug}`;

export const CAN_USE_DOM: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

export const shopifyAPI = async ({ graphql }: { graphql: string }) => {
  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Storefront-Access-Token", SHOPIFY_ACCESS_TOKEN);
  myHeaders.append("Content-Type", "application/graphql");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
  };

  const response = await fetch(
    `https://${SHOPIFY_URL}/api/2023-07/graphql.json`,
    requestOptions
  );
  const json = response.json();

  return json;
};

/**
 * CONTEXT
 */
export const CartContext = createContext<{
  cart: Cart;
  updateLocalCart: (cart: Cart) => void;
}>({
  cart: undefined,
  updateLocalCart: (cart: Cart) => {},
});

export const ProductContext = createContext<{
  product?: Product;
}>({
  product: undefined,
});

/**
 * PRODUCT
 */
export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: number;
    currencyCode: string;
  };

  sku: string;
};

export type Image = {
  id: string;
  originalSrc: string;
  altText: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  variants: Variant[];
  images: Image[];
};

/**
 * CART
 */
type CartLines = {
  id: string;
  quantity: number;
  totalAmount: number;
  imageUrl: string;
  title: string;
};

export type Cart = {
  id: string;
  url: string;
  totalQuantity: number;
  lines: CartLines[];
  totalAmount: number;
};

export const QUERY_CART_RESPONSE_PARAMS = `
    id
    checkoutUrl
    totalQuantity
    lines(first: 10) {
        edges {
            node {
                id
                quantity
                cost {
                    totalAmount {
                        amount
                        currencyCode
                    }
                }
                merchandise {
                    ... on ProductVariant {
                        id
                        title
                        image {
                            url
                        }
                    }
                }
            }
        }
    }
    cost {
        totalAmount {
            amount
            currencyCode
        }
        subtotalAmount {
            amount
            currencyCode
        }
        totalTaxAmount {
            amount
            currencyCode
        }
        totalDutyAmount {
            amount
            currencyCode
        }
    }
`;

/**
 * ADAPTERS
 */
export const fromResponseToCart = (cartResponse: any): Cart => {
  console.log("response", cartResponse);
  return {
    id: cartResponse.id,
    url: cartResponse.checkoutUrl,
    totalQuantity: cartResponse.totalQuantity,
    totalAmount: cartResponse.cost.totalAmount.amount,
    lines: cartResponse.lines.edges.map((productApi): CartLines => {
      const cartLine = productApi.node;
      return {
        id: cartLine.id,
        quantity: cartLine.quantity,
        totalAmount: cartLine.cost.totalAmount.amount,
        imageUrl: cartLine.merchandise.image.url,
        title: cartLine.merchandise.title,
      };
    }),
  };
  // const products: Product[] = response.data.products.edges.map(
  //     (productApi): Product => {
  //         const productNode = productApi.node
  //         console.log("productNode", productNode)
  //         return {
  //             id: productNode.id,
  //             title: productNode.title,
  //             description: productNode.description,
  //             handle: productNode.handle,
  //             productType: productNode.productType,
  //             vendor: productNode.vendor,
  //             tags: productNode.tags,
  //             url: `https://${SHOPIFY_URL}/products/${productNode.handle}`,
  //             collections: productNode.collections.edges.map(
  //                 (collectionApi): Collection => {
  //                     const collectionNode = collectionApi.node
  //                     return {
  //                         handle: collectionNode.handle,
  //                     }
  //                 }
  //             ),
  //             variants: productNode.variants.edges.map(
  //                 (variantApi): Variant => {
  //                     const variantNode = variantApi.node
  //                     return {
  //                         id: variantNode.id,
  //                         title: variantNode.title,
  //                         sku: variantNode.sku,
  //                         price: {
  //                             amount: variantNode.price.amount,
  //                             currencyCode: variantNode.price.currencyCode,
  //                         },
  //                     }
  //                 }
  //             ),
  //             images: productNode.images.edges.map((imageApi): Image => {
  //                 const imageNode = imageApi.node
  //                 return {
  //                     id: imageNode.id,
  //                     originalSrc: imageNode.originalSrc,
  //                     altText: imageNode.altText,
  //                 }
  //             }),
  //         }
  //     }
  // )
};
