// src/services/plotService.js
import apiClient from './api';

// Obtener todas las parcelas vigentes
const getActivePlots = async () => {
  try {
    const response = await apiClient.get('/plots');
    return response.data;
  } catch (error) {
    console.error("Error al obtener parcelas:", error.response?.data || error.message);
    throw error;
  }
};

// Crear una nueva parcela
const createPlot = async (plotData) => {
  try {
    const response = await apiClient.post('/plots', plotData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la parcela:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una parcela existente
const updatePlot = async (id, plotData) => {
  try {
    const response = await apiClient.put(`/plots/${id}`, plotData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la parcela ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una parcela (soft delete)
const deletePlot = async (id) => {
  try {
    const response = await apiClient.delete(`/plots/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la parcela ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Obtener el listado de parcelas eliminadas
const getDeletedPlots = async () => {
    try {
        const response = await apiClient.get('/plots/deleted');
        return response.data;
    } catch (error) {
        console.error("Error al obtener parcelas eliminadas:", error.response?.data || error.message);
        throw error;
    }
}

export const plotService = {
  getActivePlots,
  createPlot,
  updatePlot,
  deletePlot,
  getDeletedPlots,
};