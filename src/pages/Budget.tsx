import { useState } from "react";
import {
  getBudgets,
  createBudget,
  convertBudgetToOrder,
} from "../services/budgetService";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInterface";


interface InventoryItem {
    id?: string;
    name: string;
    stock: number;
    totalValue: number;
  }

interface Budget {
  id: number;
  clientId: string;
  total: number;
  createdAt: string;
  isOrder: boolean;
  items: BudgetItem[];
}

interface BudgetItem {
    id: number;
    budget?: any; // Use a specific type if available for `budget`
    product: InventoryItem; // Define the `InventoryItem` interface separately
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }

const BudgetsPage = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({ clientId: "", items: [] });
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventoryItems"],
    queryFn: async () => {  
        const response = await axiosInstance.get("/inventory");
        return response.data;
    },
  });

  const handleAddItem = () => {
    if (!selectedItemId || selectedQuantity <= 0 ) return;
    const newItem = {
      itemId: selectedItemId,
      quantity: selectedQuantity,
      unitCost: inventoryItems.find((item: any) => item.id === selectedItemId)?.unitCost || 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSelectedItemId(null);
    setSelectedQuantity(1);
  };
  
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const { data } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(["budgets"]);
      setShowCreateModal(false);
      setFormData({ clientId: "" , items: [] });
    },
  });

  const convertToOrderMutation = useMutation({
    mutationFn: convertBudgetToOrder,
    onSuccess: () => queryClient.invalidateQueries(["budgets"]),
  });

  const handleCreate = () => {
    createBudgetMutation.mutate({ ...formData });
  };

  const handleShowDetail = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 page-container">
      <h1 className="text-xl font-bold mb-4">Presupuestos</h1>

      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Crear Presupuesto
      </button>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((budget: Budget) => (
            <tr key={budget.id} className="hover:bg-gray-50">
              <td className="border p-2">{budget.id}</td>
              <td className="border p-2">{budget.clientId}</td>
              <td className="border p-2">${budget.total}</td>
              <td className="border p-2">
                {format(new Date(budget.createdAt), "dd/MM/yyyy")}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleShowDetail(budget)}
                  className="text-blue-600 underline"
                >
                  Ver Detalle
                </button>
                {!budget.isOrder && (
                  <button
                    onClick={() => convertToOrderMutation.mutate(budget.id)}
                    className="text-green-600 underline"
                  >
                    Convertir a Orden
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center modal-details">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
      <h2 className="text-lg font-bold mb-4">Nuevo Presupuesto</h2>

      <label className="block mb-2">
        Cliente:
        <input
          type="text"
          className="w-full border p-2 mt-1"
          value={formData.clientId}
          onChange={(e) =>
            setFormData({ ...formData, clientId: e.target.value })
          }
        />
      </label>

      {/* Selección de ítems */}
      <div className="border-t mt-4 pt-4">
        <h3 className="font-semibold mb-2">Agregar ítem</h3>

        <label className="block mb-2">
          Producto:
          <select
            className="w-full border p-2 mt-1"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
          >
            <option value="">Seleccione un producto</option>
            {inventoryItems.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.stock} disponibles)
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Cantidad:
          <input
            type="number"
            min={1}
            className="w-full border p-2 mt-1"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
          />
        </label>

        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleAddItem}
        >
          Agregar ítem
        </button>
      </div>

      {/* Lista de ítems agregados */}
      {formData.items.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Ítems seleccionados</h3>
          <ul className="space-y-2">
            {formData.items.map((item: any, index: number) => {
              const itemData = inventoryItems.find((i: any) => i.id === item.itemId);
              return (
                <li
                  key={index}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>
                    {itemData?.name || 'Ítem desconocido'} – {item.quantity} × ${item.unitCost}
                  </span>
                  <button
                    className="text-red-600"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={() => setShowCreateModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal de Detalle de Presupuesto */}
      {showDetailModal && selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-10 z-50 overflow-auto">
          <div className="bg-white p-6 w-full max-w-3xl rounded shadow">
            <h2 className="text-lg font-bold mb-4">
              Presupuesto #{selectedBudget.id} - Cliente: {selectedBudget.clientId}
            </h2>
            <table className="w-full border text-sm mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Producto</th>
                  <th className="border p-2">Cantidad</th>
                  <th className="border p-2">Precio Unitario</th>
                  <th className="border p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedBudget.items.map((item: BudgetItem, index: number) => (
                  <tr key={index}>
                    <td className="border p-2">{item.product.name}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min={1}
                        className="border w-16 text-center"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            const updated = [...selectedBudget.items];
                            updated[index].quantity = value;
                            setSelectedBudget({ ...selectedBudget, items: updated });
                          }
                        }}
                      />
                    </td>
                    <td className="border p-2">${item.unitPrice}</td>
                    <td className="border p-2">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-lg font-semibold">
              Total: $
              {selectedBudget.items
                .reduce(
                  (acc: number, item: BudgetItem) =>
                    acc + item.quantity * item.unitPrice,
                  0
                )
                .toFixed(2)}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;