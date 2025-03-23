import { gql } from "@apollo/client/core";

export const UPLOAD_MUTATION = gql`
mutation UploadImage($file: String!) {
  uploadImage(file: $file) {
    success
    message
    url
  }
}
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email:$email, password:$password) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!, $bio: String!, $profile: String) {
    register(username: $name, email: $email, password: $password, bio: $bio, profile: $profile) {
      token
      user_id
      role
      message
    }
  }
`;

export const CREATE_RECIPE_MUTATION = gql`
    mutation createRecipe(
        $title: String!
        $description: String!
        $preparation_time: Int
        $categories: uuid!
        $images: [String!]!
        $ingredients: [ingredients_insert_input!]!
        $steps: [recipe_steps_insert_input!]!
    ) {
  insert_recipes(
    objects: {
      title: $title
      description: $description
      preparation_time: $preparation_time
      category_id: $categories
      images: $images
      ingredients: { data: $ingredients }
      steps: { data: $steps }
    }
  ) {
    returning{
        id
        title
        description
    }
    }
}
`;

export const DELETE_RECIPE_MUTATION = gql`
  mutation DeleteRecipe($recipe_id: uuid!, $user_id: uuid!) {
    delete_recipes(
      where: {
        id: { _eq: $recipe_id }
        _and: { user_id: { _eq: $user_id } }
      }
    ) {
      returning {
        title
        id
      }
    }
  }
`;

export const UPDATE_RECIPE_MUTATION = gql`
  mutation updateRecipe(
    $id: uuid!
    $title: String
    $description: String
    $preparation_time: Int
    $categories: uuid
    $images: [String!]!
    $user_id: uuid
    $ingredients: [ingredients_insert_input!]!
    $steps: [recipe_steps_insert_input!]!
  ) {
    update_recipes(
      where: { id: { _eq: $id },user_id: {_eq: $user_id } }
      _set: {
        title: $title
        description: $description
        preparation_time: $preparation_time
        category_id: $categories
        images: $images
      }
    ) {
      returning {
        id
        title
      }
    }
      delete_ingredients(where: { recipe_id: { _eq: $id } }) {
        affected_rows
      }

      insert_ingredients(objects: $ingredients) {
        affected_rows
      }

      delete_recipe_steps(where: { recipe_id: { _eq: $id } }) {
        affected_rows
      }

      insert_recipe_steps(objects: $steps) {
        affected_rows
      }
  }
`;

export const LIKE_RECIPE_MUTATION = gql`
  mutation LikeRecipe($recipeID: uuid!) {
    insert_likes_one(object: {recipe_id: $recipeID}) {
      recipe_id
      user_id
    }
  }
`;

export const RATING_RECIPE_MUTATION = gql`
  mutation RateRecipe($recipeID: uuid!, $rate: Int!) {
    insert_ratings_one(object: {recipe_id: $recipeID, rating: $rate}) {
      recipe_id
      user_id
      rating
    }
  }
`;

export const BOOKMARK_RECIPE_MUTATION = gql`
  mutation BookMarkRecipe($recipeID: uuid!) {
    insert_bookmarks_one(object: {recipe_id: $recipeID}) {
      recipe_id
      user_id
    }
  }
`;
