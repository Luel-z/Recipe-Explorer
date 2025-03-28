import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { setContext } from "@apollo/client/link/context";
import { defineNuxtPlugin } from "#app";
import { parse } from "cookie";

export default defineNuxtPlugin((nuxtApp) => {
    const httpLink = createHttpLink({
        uri: useRuntimeConfig().public.graphqlEndpoint,
        credentials: "include",
    });

    const authLink = setContext((operation, context) => {
        let token;
        const headers = context?.headers || {};

        if (import.meta.server) {
            const cookieString = nuxtApp.ssrContext?.event?.node.req.headers.cookie || "";
            const cookies = parse(cookieString);
            token = cookies.jwt;
        } else if (import.meta.client) {
            const cookieString = document.cookie;
            token = cookieString
                .split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
        }

        if (operation.operationName === "Login") {
            return { headers };
        }

        return {
            headers: {
                ...headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };
    });

    const apolloClient = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);
});
