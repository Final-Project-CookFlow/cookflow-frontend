/**
 * @file Landing.jsx
 * @description Página de bienvenida (Landing Page) para usuarios no registrados.
 * Presenta la propuesta de valor de CookFlow con una introducción visual, problemas comunes
 * relacionados con la cocina y una sección de recetas destacadas.
 *
 * Esta página actúa como punto de entrada para que los usuarios nuevos entiendan el objetivo
 * de la plataforma y se registren para empezar a usarla.
 *
 * Componentes utilizados:
 * - Button: Botón reutilizable
 * - Card: Vista individual de receta
 * - useRecipe: Hook personalizado para obtener datos de receta (mock en este caso)
 *
 * Navegación:
 * - Los botones redirigen a la ruta `/signup` para incentivar el registro.
 *
 * @module pages/Landing
 */

import React from "react";
import { Button, Card } from "../components";
import { Link, useNavigate } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";

// IDs simulados de recetas destacadas (vendrán del backend en futuro)
const recipeIds = [1, 2, 3];

/**
 * Renderiza una receta individual dentro del carrusel de recetas destacadas.
 * Si el usuario hace clic en el icono de favorito, se le redirige al registro.
 *
 * @param {Object} props
 * @param {number} props.id - ID de la receta
 */
const RecipeCard = ({ id }) => {
  const { recipe, loading } = useRecipe(id);
  const navigate = useNavigate();

  const handleToggleFavorite = () => {
    navigate("/signup");
  };

  if (loading)
    return (
      <p className="text-center" data-testid={`loading-recipe-${id}`}>
        Loading recipe {id}…
      </p>
    );
  if (!recipe)
    return (
      <p className="text-center" data-testid={`notfound-recipe-${id}`}>
        Recipe {id} not found 😢
      </p>
    );

  return (
    <Card
      {...recipe}
      isFavorite={false}
      onToggleFavorite={handleToggleFavorite}
      data-testid={`recipe-card-${id}`}
      id={`recipe-card-${id}`}
    />
  );
};

/**
 * Página principal de entrada para nuevos usuarios.
 * Contiene:
 * - Sección Hero con llamada a la acción
 * - Descripción de problemas comunes al cocinar
 * - Propuesta de solución con recetas destacadas
 *
 * @returns {JSX.Element}
 */
const Landing = () => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full font-sans"
      data-testid="landing-page"
      id="landing-page-container"
    >
      {/* Hero Section */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/landing.png')" }}
        data-testid="hero-section"
        id="hero-section"
      >
        <h1
          className="text-5xl font-serif font-bold text-black mb-4"
          data-testid="hero-title"
          id="hero-title"
        >
          CookFlow
        </h1>
        <p
          className="text-lg text-black mb-6"
          data-testid="hero-subtitle"
          id="hero-subtitle"
        >
          Rediscover the pleasure of cooking
        </p>
        <Link to="/signup" data-testid="hero-signup-link" id="hero-signup-link">
          <Button>Empezar →</Button>
        </Link>
      </div>

      {/* Problem Section */}
      <div
        className="bg-[#e9e6d7] w-full py-16 text-center"
        data-testid="problem-section"
        id="problem-section"
      >
        <h2
          className="text-2xl font-semibold mb-12"
          data-testid="problem-title"
          id="problem-title"
        >
          From frustration to enjoyment
        </h2>
        <div
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-4 px-4"
          data-testid="problem-cards-container"
          id="problem-cards-container"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-1"
            id="problem-card-1"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">What to cook today?</h3>
            <p className="text-gray-600 text-sm">
              The daily decision fatigue that creates stress and frustration
              when planning your meals
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-2"
            id="problem-card-2"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">No time or organization</h3>
            <p className="text-gray-600 text-sm">
              Lost recipes, improvised shopping, and the stress of cooking
              without a clear plan
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div
        className="bg-[#fdf2f2] w-full py-16 px-4 text-center"
        data-testid="solution-section"
        id="solution-section"
      >
        <h2
          className="text-2xl font-semibold mb-4"
          data-testid="solution-title"
          id="solution-title"
        >
          The CookFlow solution
        </h2>
        <p
          className="max-w-2xl mx-auto text-gray-700 mb-8 text-sm"
          data-testid="solution-description"
          id="solution-description"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-12"
          data-testid="recipe-cards-grid"
          id="recipe-cards-grid"
        >
          {recipeIds.map((id) => (
            <RecipeCard key={id} id={id} />
          ))}
        </div>
        <div className="pb-20" data-testid="signup-button-container" id="signup-button-container">
          <Link to="/signup" data-testid="signup-link" id="signup-link">
            <Button>A cocinar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
