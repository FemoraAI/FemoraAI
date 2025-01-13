import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';

export const fetchProducts = async (category) => {
  try {
    // Initialize the database reference
    const db = getDatabase();

    // Create a query to fetch products by category
    const productsQuery = query(
      ref(db, 'products'), // Reference the 'products' node
      orderByChild('category'), // Order by the 'category' field
      equalTo(category) // Filter by the specified category
    );

    // Execute the query
    const snapshot = await get(productsQuery);

    if (snapshot.exists()) {
      // Convert the snapshot to an array of products
      const productsData = [];
      snapshot.forEach((childSnapshot) => {
        productsData.push({
          id: childSnapshot.key, // Use the key as the ID
          ...childSnapshot.val(), // Include all other fields
        });
      });
      return productsData;
    } else {
      console.log('No products found for this category.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error; // Re-throw the error for handling in the component
  }
};