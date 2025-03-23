export const data = () => ({
    currentPage: 1,
    recipesPerPage: 8,
    showPreparationTimeFilter: false,

    preparationTimeOptions: [
        { label: '<= 5 mins', value: 5 },
        { label: '<= 10 mins', value: 10 },
        { label: '<= 20 mins', value: 20 },
        { label: '<= 30 mins', value: 30 },
        { label: 'Clear', value: 200 },
    ],
    isAuthenticated: true,
});
