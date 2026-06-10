import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CarritoItem, Producto } from './types';

interface CarritoState {
  items: CarritoItem[];
}

type CarritoAction =
  | { type: 'AGREGAR'; payload: { producto: Producto; talla: string; color: string; cantidad: number } }
  | { type: 'ELIMINAR'; payload: { index: number } }
  | { type: 'ACTUALIZAR_CANTIDAD'; payload: { index: number; cantidad: number } }
  | { type: 'VACIAR' };

function carritoReducer(state: CarritoState, action: CarritoAction): CarritoState {
  switch (action.type) {
    case 'AGREGAR': {
      const { producto, talla, color, cantidad } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.producto.id === producto.id && item.talla === talla && item.color === color
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: newItems[existingIndex].cantidad + cantidad,
        };
        return { items: newItems };
      }
      return { items: [...state.items, { producto, talla, color, cantidad }] };
    }
    case 'ELIMINAR':
      return { items: state.items.filter((_, i) => i !== action.payload.index) };
    case 'ACTUALIZAR_CANTIDAD': {
      const { index, cantidad } = action.payload;
      if (cantidad <= 0) return { items: state.items.filter((_, i) => i !== index) };
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], cantidad };
      return { items: newItems };
    }
    case 'VACIAR':
      return { items: [] };
    default:
      return state;
  }
}

const CarritoContext = createContext<{
  state: CarritoState;
  dispatch: React.Dispatch<CarritoAction>;
  itemCount: number;
} | null>(null);

const STORAGE_KEY = 'tiendaropita_carrito';

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(carritoReducer, { items: [] }, () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { items: JSON.parse(stored) };
        } catch { /* ignore */ }
      }
    }
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-update'));
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ state, dispatch, itemCount }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito must be used within CarritoProvider');
  return ctx;
}
