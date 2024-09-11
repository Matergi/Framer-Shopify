import ProductsAddToCart from "[replace-with-framer-componentURL]";
import ProductsVariant from "[replace-with-framer-componentURL]";
import { ControlType, addPropertyControls } from "framer";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  CartContext,
  QUERY_CART_RESPONSE_PARAMS,
  fromResponseToCart,
  shopifyAPI,
  ProductContext,
} from "../Helpers.tsx";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function AddToCartWrap(props) {
  // This is a React component containing an Example component
  // - Find inspiration: https://www.framer.com/developers/

  const cartContext = useContext(CartContext);
  const { product } = useContext(ProductContext);
  const [variantSelected, selectVariant] = useState<string>(undefined);

  useEffect(() => {
    if (product) {
      selectVariant(product.variants[0].id);
    }
  }, [product]);

  const [isDebug, setDebugMode] = useState(false);

  useEffect(() => {
    const debugMode = document.location.host.includes("framercanvas");
    if (debugMode) {
      setDebugMode(debugMode);
      selectVariant("0");
    }
  }, []);

  const addToCart = useCallback((productId: string) => {
    shopifyAPI({
      graphql: graphql_addToCart(productId),
    }).then((result) => {
      const cart = fromResponseToCart(result.data.cartLinesAdd.cart);
      cartContext.updateLocalCart(cart);
    });
  }, []);

  console.log("product", product);

  let variants = product?.variants || [];

  if (isDebug) {
    variants = [
      {
        id: "0",
        availableForSale: true,
        price: {
          amount: 30,
          currencyCode: "eur",
        },
        sku: "SKU",
        title: "S",
      },
      {
        id: "1",
        availableForSale: true,
        price: {
          amount: 30,
          currencyCode: "eur",
        },
        sku: "SKU",
        title: "M",
      },
      {
        id: "2",
        availableForSale: true,
        price: {
          amount: 30,
          currencyCode: "eur",
        },
        sku: "SKU",
        title: "L",
      },
    ];
  }

  return (
    <div style={containerStyle}>
      <h2
        style={{
          color: "#26358a",
          fontSize: "25px",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {product?.variants[0].price.amount || props.defaultPrice}€
      </h2>
      {variants.length > 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {variants.map((variant, index) => (
            <ProductsVariant
              onClick={() => {
                selectVariant(variant.id);
              }}
              text={variant.title}
              variant={variantSelected === variant.id ? "selected" : "default"}
            />
          ))}
        </div>
      )}

      <ProductsAddToCart
        style={{ width: "100%", marginTop: 30 }}
        onClick={() => {
          addToCart(variantSelected);
        }}
      />
    </div>
  );
}

const graphql_addToCart = (variantId: string) => `
    mutation {
        cartLinesAdd(
            cartId: "${sessionStorage.getItem("cart_id")}"
            lines: {
                merchandiseId: "${variantId}"
                quantity: 1
            }
        ) {
            cart {
                ${QUERY_CART_RESPONSE_PARAMS}
            }
        }
    }
`;

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "start",
  overflow: "visible",
  flexDirection: "column",
};

addPropertyControls(AddToCartWrap, {
  defaultPrice: {
    type: ControlType.Number,
  },
});
