export class Product {
  constructor(
    id,
    name,
    price,
    image,
    category,
    description,
    rating,
    reviewCount,
    discount,
    featured,
    brand,
    createdAt,
    images,
    shortDescription
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.images = images;
    this.category = category;
    this.description = description;
    this.shortDescription = shortDescription;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.discount = discount;
    this.featured = featured;
    this.brand = brand;
    this.createdAt = createdAt;
  }
}