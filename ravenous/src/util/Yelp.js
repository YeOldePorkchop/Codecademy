const apiKey = 'oBZQW0Nd85DK-RDbbisP8l6s9PZzdiF40ITe2xKBFU0gQ350ZSnyMKwmp8_xRJKmIFlp8wzpzlq8Z-VfmfkeD86XBxlqSDoI6yQvvf68m_vHBoNHy9PwaoveeOoQYHYx';

const Yelp = {
  search(term, location, sortBy) {
    return fetch(
      `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,
      {headers: {Authorization: `Bearer ${apiKey}`}}
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.businesses) {
        return jsonResponse.businesses.map(business => ({
          id: business.id,
          imageSrc: business.image_url,
          name: business.name,
          address: business.location.address1,
          city: business.location.city,
          state: business.location.state,
          zipCode: business.location.zip_code,
          category: business.categories[0].title,
          rating: business.rating,
          reviewCount: business.review_count
        }));
      }
    });
  }
}

export default Yelp;