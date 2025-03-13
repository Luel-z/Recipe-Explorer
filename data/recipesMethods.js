export const computedProperties = {
    totalRecipes() {
        return this.recipes.length;
    },
    totalPages() {
        return Math.ceil(this.totalRecipes / this.recipesPerPage);
    },
    paginatedRecipes() {
        const start = (this.currentPage - 1) * this.recipesPerPage;
        const end = start + this.recipesPerPage;
        return this.filteredRecipes.slice(start, end);
    },
    uniqueCreators() {
        if (this.latestRecipesResult?.recipes) {
            const uniqueUsers = new Map();
            this.latestRecipesResult.recipes.forEach(recipe => {
                if (!uniqueUsers.has(recipe.user.id)) {
                    uniqueUsers.set(recipe.user.id, {
                        id: recipe.user.id,
                        name: recipe.user.username,
                    });
                }
            });
            return Array.from(uniqueUsers.values());
        }
        return [];
    },
    filteredRecipes() {
        let recipes = this.latestRecipesResult?.recipes || [];

        const uniqueRecipes = [];
        const seenIds = new Set();
        for (const recipe of recipes) {
            if (!seenIds.has(recipe.id)) {
                seenIds.add(recipe.id);
                uniqueRecipes.push(recipe);
            }
        }
        recipes = uniqueRecipes;

        if (this.selected) {
            recipes = recipes.filter(recipe =>
                recipe.category.name.toLowerCase() === this.selected.toLowerCase()
            );
        }

        if (this.searchTitleInput) {
            recipes = recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(this.searchTitleInput.toLowerCase())
            );
        }

        if (this.searchUsernameInput) {
            recipes = recipes.filter(recipe =>
                recipe.user.username.toLowerCase().includes(this.searchUsernameInput.toLowerCase())
            );
        }

        if (this.selectedPreparationTime !== null) {
            if (this.selectedPreparationTime > 0) {
                recipes = recipes.filter(recipe =>
                    recipe.preparation_time <= this.selectedPreparationTime
                );
            } else {
                recipes = recipes.filter(recipe =>
                    recipe.preparation_time >= Math.abs(this.selectedPreparationTime)
                );
            }
        }

        return recipes.map(recipe => ({
            ...recipe,
            title: recipe.title,
            author: recipe.user.username,
            category: recipe.category.name,
            image: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=700,636',
            likes: recipe.likes_aggregate.aggregate.count,
            comments: recipe.comments_aggregate.aggregate.count,
            rating: recipe.ratings_aggregate.aggregate.avg.rating || 0,
            isBookmarked: recipe.bookmarks[0] ? recipe.bookmarks[0] : false
        }));
    },

    totalRecipes() {
        return this.filteredRecipes.length;
    },
};

export const methods = {
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    },
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    },
    goToPage(page) {
        this.currentPage = page;
    },

    checkAuthentication() {
        const tokenCookie = useCookie('jwt');

        const token = tokenCookie.value;

        if (!token) {
            this.isAuthenticated = false;
        } else {
            return token;
        }

        return null;
    },

    filterByPreparationTime(value) {
        this.selectedPreparationTime = value;
        this.showPreparationTimeFilter = false;
    },

    handleRecipeClick(recipe) {
        this.checkAuthentication();
        if (this.isAuthenticated) {
            this.$router.push({
                path: '/details',
                query: { recipe: JSON.stringify(recipe) },
            });
        } else {
            this.$router.push({
                path: '/login',
            });
            return
        }
    },

    handleLikeClick(recipe) {
        const userID = methods.getUserIdFromToken();
        if (!userID) {
            this.$router.push({
                path: '/login',
            });
            return;
        }

        this.ClickRecipeAndRefetch(userID, recipe.id, 0, "liking", recipe);
    },

    handleRateClick(recipe, rate) {
        const userID = methods.getUserIdFromToken();
        if (!userID) {
            this.$router.push({
                path: '/login',
            });
            return;
        }

        this.ClickRecipeAndRefetch(userID, recipe.id, rate, "rating", recipe);
    },

    handleCommentClick(recipe) {
        this.checkAuthentication();
        if (!this.isAuthenticated) {
            this.$router.push({
                path: '/login',
            });
            return
        } else {

        }
    },
    handleBookmarkClick(recipe) {
        const userID = methods.getUserIdFromToken();
        if (!userID) {
            this.$router.push({
                path: '/login',
            });
            return;
        }
        this.ClickRecipeAndRefetch(userID, recipe.id, 0, "bookmarking", recipe);

    },

    async ClickRecipeAndRefetch(userID, recipeID, rate, type, recipe) {
        try {
            if (type === "liking") {
                const { result, loading, error } = await this.LikeRecipe({ userID, recipeID });
            } else if (type == "rating") {
                const { result, loading, error } = await this.RateRecipe({ userID, recipeID, rate });
            } else if (type == "bookmarking") {
                const { result, loading, error } = await this.BookmarkRecipe({ userID, recipeID });
            }
            await this.refetch();
        } catch (error) {
            console.error("Error in " + type + " recipe: " + error);
        }
    },

    getUserIdFromToken() {
        const token = this.checkAuthentication();
        if (!token) {
            return null;
        }
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));

            if (payload.hasura_claims && payload.hasura_claims['x-hasura-user-id']) {
                return payload.hasura_claims['x-hasura-user-id'];
            } else {
                console.error('User ID not found in token payload');
                return null;
            }
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    },
};
