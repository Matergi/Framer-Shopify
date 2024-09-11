import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Helpers.tsx";
import { ControlType, addPropertyControls } from "framer";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Images(props) {
  // This is a React component containing an Example component
  // - Find inspiration: https://www.framer.com/developers/

  const { product } = useContext(ProductContext);

  const [imageIndex, setImageIndex] = useState(0);
  const [isDebug, setDebugMode] = useState(false);

  useEffect(() => {
    setDebugMode(document.location.host.includes("framercanvas"));
  }, []);

  console.log("props", props);

  let images = product?.images || [];

  if (isDebug) {
    images = [
      {
        id: "1",
        altText: "test",
        originalSrc:
          "https://matergi.myshopify.com/cdn/shop/files/print1_14a22561-a2d9-47eb-ab41-05476cf9b946.png?v=1719411351&width=823",
      },
      {
        id: "1",
        altText: "test",
        originalSrc:
          "https://matergi.myshopify.com/cdn/shop/files/print1_14a22561-a2d9-47eb-ab41-05476cf9b946.png?v=1719411351&width=823",
      },
      {
        id: "1",
        altText: "test",
        originalSrc:
          "https://matergi.myshopify.com/cdn/shop/files/print1_14a22561-a2d9-47eb-ab41-05476cf9b946.png?v=1719411351&width=823",
      },
      {
        id: "1",
        altText: "test",
        originalSrc:
          "https://matergi.myshopify.com/cdn/shop/files/print1_14a22561-a2d9-47eb-ab41-05476cf9b946.png?v=1719411351&width=823",
      },
      {
        id: "1",
        altText: "test",
        originalSrc:
          "https://matergi.myshopify.com/cdn/shop/files/print1_14a22561-a2d9-47eb-ab41-05476cf9b946.png?v=1719411351&width=823",
      },
    ];
  }

  if (!images.length) {
    return <div />;
  }

  if (props.isMobile) {
    const items = 2;
    return (
      <div style={containerStyle}>
        <img
          src={images[imageIndex].originalSrc}
          style={{
            height: "auto",
            borderRadius: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {images.slice(1).map((image, index) => (
            <img
              onClick={() => {
                setImageIndex(index);
              }}
              src={image.originalSrc}
              style={{
                width: `calc((100% / ${items}) - (((${items} - 1) / ${items}) * 10px))`,
                height: "auto",
                borderRadius: "10px",
              }}
            />
          ))}
        </div>
      </div>
    );
  } else {
    const items = 4;
    return (
      <div style={containerStyle}>
        <img
          src={images[imageIndex].originalSrc}
          style={{
            height: "auto",
            borderRadius: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {images.map((image, index) => (
            <img
              onClick={() => {
                setImageIndex(index);
              }}
              src={image.originalSrc}
              style={{
                width: `calc((100% / ${items}) - (((${items} - 1) / ${items}) * 10px))`,
                height: "auto",
                borderRadius: "10px",
                border: `${imageIndex === index ? "3" : "0"}px solid #26358A`,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

addPropertyControls(Images, {
  isMobile: {
    type: ControlType.Boolean,
    defaultValue: false,
  },
});
