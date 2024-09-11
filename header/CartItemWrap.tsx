import HeaderCartItem from "[replace-with-framer-componentURL]";
import { useContext } from "react";
import { CartContext } from "../Helpers.tsx";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
function CartItemWrap(props) {
  // This is a React component containing an Example component
  // - Find inspiration: https://www.framer.com/developers/

  const cartContext = useContext(CartContext);

  const totalQuantity = cartContext?.cart?.totalQuantity || 0;

  return (
    <div
      style={containerStyle}
      onClick={() => {
        if (totalQuantity) {
          window.open(cartContext.cart.url, "_self");
        }
      }}
    >
      <HeaderCartItem items={` ${totalQuantity}`} />
    </div>
  );
}

export default CartItemWrap;

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};
