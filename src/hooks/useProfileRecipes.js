/**
 * @file useProfileRecipes.js
 * @description Hook personalizado para gestionar las recetas en el perfil del usuario.
 * Maneja la alternancia entre recetas guardadas y creadas, la paginación y el estado de favoritos.
 *
 * @function useProfileRecipes
 * @returns {Object} Objeto con:
 *  - `activeTab` {string}: Pestaña activa actual ("saved" o "created").
 *  - `setActiveTab` {Function}: Cambia la pestaña activa.
 *  - `currentPage` {number}: Página actual en la paginación.
 *  - `setCurrentPage` {Function}: Cambia la página actual.
 *  - `favorites` {Array<string>}: IDs de recetas favoritas del usuario.
 *  - `toggleFavorite` {Function}: Marca o desmarca una receta como favorita.
 *  - `createdRecipesCount` {number}: Total de recetas creadas por el usuario.
 *  - `totalPages` {number}: Total de páginas para la paginación.
 *  - `filteredRecipes` {Array<object>}: Recetas filtradas por la pestaña activa.
 *  - `paginatedRecipes` {Array<object>}: Recetas mostradas en la página actual. *
 * 
 * @author Ana Castro basado en el código de Yuliia Martynovych en Profile.jsx.
 */
import { useState, useEffect, useMemo } from "react";
import { recipeService } from "../services/recipeService";
import useFavorites from "./useFavorites";

export default function useProfileRecipes() {
    const [activeTab, setActiveTab] = useState("saved");
    const [currentPage, setCurrentPage] = useState(1);
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const { favorites, toggleFavorite } = useFavorites();
    const recipesPerPage = 8;

    // Cargar recetas creadas por el usuario desde la base de datos
    useEffect(() => {
        const fetchCreatedRecipes = async () => {
            try {
                const recipes = await recipeService.getRecipeByUserId();
                setCreatedRecipes(recipes);
            } catch (error) {
                setCreatedRecipes([]);
            }
        };
        fetchCreatedRecipes();
    }, []);

    const filteredRecipes = useMemo(() => {
        if (activeTab === "saved") {
            return []; // Las favoritas se gestionan en el otro hook
        }
        return createdRecipes;
    }, [activeTab, createdRecipes]);

    const paginatedRecipes = useMemo(() => {
        const start = (currentPage - 1) * recipesPerPage;
        return filteredRecipes.slice(start, start + recipesPerPage);
    }, [filteredRecipes, currentPage]);

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    return {
        activeTab,
        setActiveTab,
        currentPage,
        setCurrentPage,
        favorites,
        toggleFavorite,
        totalPages,
        filteredRecipes,
        paginatedRecipes,
        createdRecipesCount: createdRecipes.length,

    };
}