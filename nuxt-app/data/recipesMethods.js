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
    filteredRecipes() {
        let recipes = this.latestRecipesResult?.recipes || [];

        return recipes.map(recipe => ({
            ...recipe,
            title: recipe.title,
            author: recipe.user.username,
            category: recipe.category.name,
            image: recipe.images,
            likes: recipe.likes_aggregate.aggregate.count,
            comments: recipe.comments_aggregate.aggregate.count,
            isBookmarked: recipe.bookmarks[0] ? recipe.bookmarks[0] : false,
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
        this.applyFilters();
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

        this.ClickRecipeAndRefetch(recipe.id, "liking");
    },

    handleBookmarkClick(recipe) {
        const userID = methods.getUserIdFromToken();
        if (!userID) {
            this.$router.push({
                path: '/login',
            });
            return;
        }
        this.ClickRecipeAndRefetch(recipe.id, "bookmarking");

    },

    async ClickRecipeAndRefetch(recipeID, type) {
        try {
            if (type === "liking") {
                const { result, loading, error } = await this.LikeRecipe({ recipeID });
            } else if (type == "bookmarking") {
                const { result, loading, error } = await this.BookmarkRecipe({ recipeID });
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
