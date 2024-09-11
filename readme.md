# Shopify for Framer

Welcome to the **Shopify for Framer** repository!  
This project aims to provide a simple integration between **Shopify** and **Framer**, allowing you to integrate Shopify products and carts directly into Framer projects. Below you will find instructions on how to set up the integration, insert the necessary components, and prepare your project.

## Project Setup

In this repository, you will find the code needed to make the Shopify-Framer integration work. Once the project is completed, a link will be available to copy the full project with all features.

### How does it work?

To make the integration work properly, follow these steps:

1. **Framer Components**: In all the files where you find the string `"[replace-with-framer-componentURL]"`, you need to create a custom component via Framer.

   - To import a Framer component into the code, follow these steps:
     1. Create the desired component in Framer.
     2. Click the three dots next to the component's name.
     3. Select "Copy import."
     4. Replace `"[replace-with-framer-componentURL]"` with the copied import URL.

2. **Helpers.tsx File**:
   - In this file, you need to insert the **environment variables** required to connect Shopify with Framer. Make sure to configure your tokens and environment variables correctly.

## How to Use the Components

### 1. Cart Override in Pages

- On the pages where you want to implement the cart, select the **Desktop** element.
- Under the **Code Overrides** section, set the following:
  - **File**: `withCart`
  - **Override**: `withCart`

### 2. Product Page

- The product page should be named `/product/{slug}`.
- Select the first element in the **Layers** section on the left.
- Under the **Code Overrides** section, set the following:

  - **File**: `WithCart`
  - **Override**: `withCart`

- Next, create a **stack** on the page and under **Code Overrides** set:
  - **File**: `WithProduct`
  - **Override**: `withProduct`

## Full Project

Once the project is completed, a link will be provided to copy the entire project, already set up for Shopify integration.

---

Thank you for choosing **Shopify for Framer**!
