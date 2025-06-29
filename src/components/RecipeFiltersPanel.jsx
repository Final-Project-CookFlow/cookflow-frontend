/**
 * @file RecipeFiltersPanel.jsx
 * @description Componente visual para seleccionar filtros de recetas: categoría general, tipo de cocina y origen.
 * Muestra badges interactivos reutilizando el componente <Badge />, permitiendo seleccionar múltiples opciones por grupo.
 * Estilizado con bordes grises cuando no están seleccionados.
 *
 * @author Ana Castro basado en el código de Saray en Search.jsx.
 */

import React from "react";
import Badge from "./Badge";

const RecipeFiltersPanel = ({ general = [], type = [], origin = [], selected, setSelected }) => (
    <div className="flex flex-col gap-6">
        {/* Categorías generales */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Categorías</h5>
            <div className="flex flex-wrap gap-2">
                {general.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    general.map((cat) => {
                        const isSelected = selected.selectedCategory.includes(cat.id);
                        return (
                            <span
                                key={cat.id}
                                className={`inline-block rounded-full ${isSelected ? "" : "border border-gray-300"}`}
                            >
                                <Badge
                                    checked={isSelected}
                                    onChange={() => {
                                        if (isSelected) {
                                            setSelected.setSelectedCategory(
                                                selected.selectedCategory.filter((id) => id !== cat.id)
                                            );
                                        } else {
                                            setSelected.setSelectedCategory([...selected.selectedCategory, cat.id]);
                                        }
                                    }}
                                >
                                    {cat.name}
                                </Badge>
                            </span>
                        );
                    })
                )}
            </div>
        </div>

        {/* Tipos de cocina */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Tipo de cocina</h5>
            <div className="flex flex-wrap gap-2">
                {type.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    type.map((cat) => {
                        const isSelected = selected.selectedType.includes(cat.id);
                        return (
                            <span
                                key={cat.id}
                                className={`inline-block rounded-full ${isSelected ? "" : "border border-gray-300"}`}
                            >
                                <Badge
                                    checked={isSelected}
                                    onChange={() => {
                                        if (isSelected) {
                                            setSelected.setSelectedType(
                                                selected.selectedType.filter((id) => id !== cat.id)
                                            );
                                        } else {
                                            setSelected.setSelectedType([...selected.selectedType, cat.id]);
                                        }
                                    }}
                                >
                                    {cat.name}
                                </Badge>
                            </span>
                        );
                    })
                )}
            </div>
        </div>

        {/* Origen */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Origen</h5>
            <div className="flex flex-wrap gap-2">
                {origin.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    origin.map((cat) => {
                        const isSelected = selected.selectedOrigin.includes(cat.id);
                        return (
                            <span
                                key={cat.id}
                                className={`inline-block rounded-full ${isSelected ? "" : "border border-gray-300"}`}
                            >
                                <Badge
                                    checked={isSelected}
                                    onChange={() => {
                                        if (isSelected) {
                                            setSelected.setSelectedOrigin(
                                                selected.selectedOrigin.filter((id) => id !== cat.id)
                                            );
                                        } else {
                                            setSelected.setSelectedOrigin([...selected.selectedOrigin, cat.id]);
                                        }
                                    }}
                                >
                                    {cat.name}
                                </Badge>
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    </div>
);

export default RecipeFiltersPanel;
