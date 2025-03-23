import { gql } from '@apollo/client/core';

export const GET_LATEST_RECIPES = gql`
    query GetLatestRecipes(
    $userID: uuid!
    $category: String = "%"
    $title: String = "%"
    $username: String = "%"
    $preparationTime: Int
    ){
      recipes(
        order_by: {created_at: desc}
        where: {
          category: { name: { _ilike: $category } }
          title: { _ilike: $title }
          user: { username: { _ilike: $username } }
          preparation_time: { _lte: $preparationTime }
        }
      ) {
        id
        title
        description
        preparation_time
        category_id
        images
        user {
          id
          username
        }
        likes_aggregate {
          aggregate {
            count(columns: recipe_id)
          }
        }
        comments_aggregate {
          aggregate {
            count(columns: recipe_id)
          }
        }
        category {
          name
        }
        bookmarks(where: {user_id: {_eq: $userID}}) {
          user_id
        }
    }
  }
`;

export const GET_RECIPES_INGREDIENT = gql`
  query GetRecipesIngredient($recipe_id: uuid!) {
    ingredients(where: { recipe_id: { _eq: $recipe_id } }) {
      ingredient_name
    }
  }
`;

export const GET_RECIPES_STEPS = gql`
  query GetRecipesSteps($recipe_id: uuid!) {
    recipe_steps(where: { recipe_id: { _eq: $recipe_id } },order_by: { step_number: asc }) {
      description
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories{
    categories {
      id
      name
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes($recipe_id: uuid!) {
    recipes(where: {id: { _eq: $recipe_id }}) {
      id
      title
      description
      preparation_time
      images
      user {
        id
        username
      }
      category {
        id,
        name
      }
      ingredients {
        ingredient_name
      }
      steps(order_by: {step_number: asc}) {
        description
        step_number
      }
    }
  }
`;

export const GET_AGGREGATE_RATING = gql`
  query GetAggregateRating($recipeId: uuid!) {
    ratings_aggregate(where: {recipe_id: {_eq: $recipeId}}) {
      aggregate {
        avg {
          rating
        }
      }
    }
  }
`;

export const GET_AGGREGATE = gql`
  query GetAggregateData($userId: uuid!){
    users(where: {id: {_eq: $userId}}) {
        username
        bio
        profile
        bookmarks_aggregate(where: {user_id: {_eq: $userId}}) {
          aggregate {
            count(columns: user_id)
          }
        }
        likes_aggregate(where: {user_id: {_eq: $userId}}) {
          aggregate {
            count(columns: user_id)
          }
        }
        comments_aggregate(where: {user_id: {_eq: $userId}}) {
          aggregate {
            count(columns: user_id)
          }
        }
        userRecipes_aggregate(where: {user_id: {_eq: $userId}}) {
          aggregate {
            count(columns: user_id)
          }
        }
      }
    }
`;

export const GET_RECIPES_TITLE = gql`
  query GetRecipesTitle($userId: uuid!) {
    recipes(where: {user_id: {_eq: $userId}}) {
      id,  
      title,
      images
    }
  }
`;

export const GET_USER_LIKED_RECIPES = gql`
  query GetLikedRecipes($userId: uuid!) {
    likes(where: {user_id: {_eq: $userId}}) {
      recipe {
        id
        title
        images
      }
    }
  }
`;

export const GET_USER_BOOKMARKED_RECIPES = gql`
  query GetBookmarkedRecipes($userId: uuid!) {
    bookmarks(where: {user_id: {_eq: $userId}}) {
      recipe {
        id
        title
        images
      }
    }
  }
`;

export const GET_USER_COMMENTED_RECIPES = gql`
  query GetCommentedRecipes($userId: uuid!) {
    comments(where: {user_id: {_eq: $userId}}) {
      recipe {
        id
        title
        images
      }
    }
  }
`;

export const GET_RATING_AND_COMMENT = gql`
  query GetUserRateCommentRecipes($recipeId: uuid!) {
    ratings(where: {recipe_id: {_eq: $recipeId}}) {
      rating
      id
      recipe_id
      user {
        username
      }
      created_at
    }
    comments(where: {recipe_id: {_eq: $recipeId}}) {
      id
      message
      recipe_id
      created_at
      user {
        username
      }
    }
  }
`;


