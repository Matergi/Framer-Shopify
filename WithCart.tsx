import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  CAN_USE_DOM,
  Cart,
  CartContext,
  QUERY_CART_RESPONSE_PARAMS,
  fromResponseToCart,
  shopifyAPI,
} from "./Helpers.tsx";

export function withCart(Component): ComponentType {
  return (props) => {
    const [cart, setCart] = useState<Cart | undefined>();

    const updateLocalCart = useCallback((newCart: Cart) => {
      setCart(newCart);
    }, []);

    useEffect(() => {
      const cartID = sessionStorage.getItem("cart_id");

      if (
        !CAN_USE_DOM ||
        (sessionStorage.getItem("cart_id") &&
          sessionStorage.getItem("cart_url"))
      ) {
        shopifyAPI({
          graphql: `{
                        cart(id: "${cartID.split("?")[0]}") {
                            ${QUERY_CART_RESPONSE_PARAMS}
                        }
                    }`,
        }).then((result) => {
          setCart(fromResponseToCart(result.data.cart));
        });

        return;
      }

      shopifyAPI({
        graphql: `
                    mutation {
                        cartCreate(
                            input: {
                                lines: [],
                            }
                        ) {
                            cart {
                                ${QUERY_CART_RESPONSE_PARAMS}
                            }
                        }
                    }
                `,
      }).then((result) => {
        sessionStorage.setItem("cart_id", result.data.cartCreate.cart.id);
        sessionStorage.setItem(
          "cart_url",
          result.data.cartCreate.cart.checkoutUrl
        );
      });
    }, []);

    return (
      <CartContext.Provider
        value={{
          cart,
          updateLocalCart,
        }}
      >
        <Component {...props} />
      </CartContext.Provider>
    );
  };
}
