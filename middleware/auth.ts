import { methods } from '../data/recipesMethods.js';
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(() => {
  const token = methods.checkAuthentication();

  if (!token) {
    return navigateTo('/')
  }
})
