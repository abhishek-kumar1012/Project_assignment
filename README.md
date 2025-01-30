IN this user can easily do crud operations in order to push the information of diiferent cars
//https://spyneassignment.vercel.app/
Assignment for SDE Intern

Objective
Build a Car Management Application where users can create, view, edit, and delete cars. Each car can
contain up to 10 images (specifically of a car), a title, a description and tags - car_type, company,
dealer...etc . The application should include user authentication, allow users to manage only their
products, and provide search functionality across products.
Required Functionalities
1. User can login/signup
2. Users can add a car with upto 10 images, title, description and tags
3. Users can view a list of all their cars.
4. Users can global search through all their cars ii.e the keyword searched will list all cars whose
title, description, tags match the keyword.
5. Users can click on a car to view particular car’s detail
6. Users can update a car’s title, description, tags, or image.
7. Users can delete a car.
Frontend Requirements:
1. Sign Up / Login Page: Allow users to register and log in to access their products.
2. Product List Page: Display all cars created by the logged-in user, with a search bar.
3. Product Creation Page: Form for uploading an image, setting a title, and writing a description
for a new product.
4. Product Detail Page: Display a product’s details with options to edit or delete it.
Expose APIs:
1. Create User
2. Create Product
3. List Products
4. List particular product
5. Update Product
6. Delete Product
Submission Guidelines:
1. Use a frontend framework of choice calling apis to backend service serving required data.
2. Expose a route (e.g., /api/docs) that provides documentation for all APIs, with details on
request parameters, authentication requirements, and response structure. Tools like Swagger
or Postman documentation can be used.
3. Deploy the application on a cloud provider like Heroku or Vercel. Provide the deployment link
