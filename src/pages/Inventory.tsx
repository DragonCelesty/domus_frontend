import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventories,
  createInventory,
  deleteInventory,
  updateInventory,
  getInventoryMovements,
  createInventoryMovement,
} from "../services/inventoryService";
import { useState } from "react";
import { TextInput } from "../components/ui/TextInput";

interface InventoryItem {
  id?: string;
  name: string;
  stock: number;
  totalValue: number;
}

interface InventoryMovement {
  id?: string;
  type: "ENTRY" | "EXIT" | "EXPIRATION" | "SALE";
  quantity: number;
  unitCost: number;
  date: string | Date;
  itemId: number; // ID del ítem al que pertenece el movimiento
}

const Inventory = () => {
  const queryClient = useQueryClient();

  const [newItem, setNewItem] = useState<InventoryItem>({
    name: "",
    stock: 0,
    totalValue: 0,
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Carga de inventario
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventories"],
    queryFn: getInventories,
  });

  // Creación
  const createMutation = useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      setNewItem({ name: "", stock: 0, totalValue: 0 });
    },
  });

  // Actualización
  const updateMutation = useMutation({
    mutationFn: updateInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      setSelectedItem(null);
      setIsEditMode(false);
    },
  });

  // Eliminación
  const deleteMutation = useMutation({
    mutationFn: deleteInventory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventories"] }),
  });

  const handleViewDetails = async (item: InventoryItem) => {
    try {
      setSelectedItem(item); // Establecer el ítem seleccionado
      const fetchedMovements = await getInventoryMovements(item.id!); // Obtener movimientos del inventario
      console.log("Movimientos obtenidos:", fetchedMovements);  
        setMovements(fetchedMovements.data || []); // Establecer movimientos en el estado
      setIsModalOpen(true); // Abrir el modal
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setMovements([]);
  };

  const handleCreate = () => {
    createMutation.mutate(newItem);
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateMutation.mutate(selectedItem);
    }
  };

  return (
    <div className="page-container flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6">Inventario</h2>

      {isLoading && <p className="mb-4">Cargando inventario...</p>}
      {isError && (
        <p className="text-red-500 mb-4">Error al cargar inventario.</p>
      )}

      {/* Formulario de creación */}
      <div className="mb-8 w-full max-w-xl bg-white shadow-md rounded-xl p-6  border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Nuevo Ítem
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="flex flex-wrap items-end gap-6"
        >
          <TextInput
            label="Nombre"
            value={newItem.name}
            type="text"
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextInput
            label="Cantidad"
            type="number"
            value={newItem.stock}
            onChange={(e) =>
              setNewItem({ ...newItem, stock: Number(e.target.value) })
            }
          />
          <TextInput
            label="Valor Total"
            type="number"
            value={newItem.totalValue}
            onChange={(e) =>
              setNewItem({ ...newItem, totalValue: Number(e.target.value) })
            }
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Crear
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition"
            onClick={() => setNewItem({ name: "", stock: 0, totalValue: 0 })}
          >
            Limpiar
          </button>
        </form>
      </div>
      {/* Tabla */}
      <div className="w-full overflow-x-auto tmt-2">
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-6 py-3">Nombre</th>
              <th className="border border-gray-300 px-6 py-3">Cantidad</th>
              <th className="border border-gray-300 px-6 py-3">Valor Total</th>
              <th className="border border-gray-300 px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((item: InventoryItem) => (
              <tr key={item.id} className="border-b">
                <td className="border px-6 py-3">{item.name}</td>
                <td className="border px-6 py-3">{item.stock}</td>
                <td className="border px-6 py-3">
                  {typeof item.totalValue === "number"
                    ? item.totalValue
                    : "0.00"}
                </td>
                <td className="border px-6 py-3 flex justify-center gap-4">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="text-green-500 hover:underline"
                    title="Ver movimientos"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {/* <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditMode(true);
                    }}
                    className="text-yellow-500 hover:underline"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button> */}
                  <button
                    onClick={() => deleteMutation.mutate(item.id ?? "")}
                    className="text-red-500 hover:underline"
                    title="Eliminar"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center modal-details">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Detalles del Ítem</h3>
            <p>
              <strong>Nombre:</strong> {selectedItem.name}
            </p>
            <p>
              <strong>Cantidad en stock:</strong> {selectedItem.stock}
            </p>
            <p>
              <strong>Valor total:</strong> ${selectedItem.totalValue}
            </p>

            <h4 className="text-lg font-semibold mt-6 mb-2">Movimientos</h4>
            {/* Agregar movimientos de inventario despliega un formulario que tambien se puede contraer */}
            <div className="flex justify-between items-center mt-6 mb-2">
              <h4 className="text-lg font-semibold">Movimientos</h4>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {showForm ? "Cancelar" : "+ Agregar Movimiento"}
              </button>
            </div>
            {showForm && (
              <form
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded bg-gray-50"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const type = formData.get("type") as string;
                  const quantity = Number(formData.get("quantity"));
                  const unitCost = Number(formData.get("unitCost"));
                  const itemId = Number(formData.get("itemId"));

                  // Validar campos
                  if (!type || !quantity || !unitCost || isNaN(itemId)) {
                    alert(
                      "Por favor, complete todos los campos correctamente."
                    );
                    return;
                  }
                  // Crear movimiento
                  const movement: InventoryMovement = {
                    itemId,
                    type: type as "ENTRY" | "EXIT" | "EXPIRATION" | "SALE",
                    quantity,
                    unitCost,
                    date: new Date().toISOString(), // Fecha actual
                  };
                  try {
                    // Enviar movimiento al servidor
                    await createInventoryMovement(itemId.toString(), movement);
                    // Actualizar movimientos en el estado
                    setMovements((prev) => [
                      ...prev,
                      { ...movement, date: new Date().toISOString() },
                    ]);
                  } catch (error) {
                    console.error("Error al crear movimiento:", error);
                    alert("Ocurrió un error al crear el movimiento.");
                  }
                }}
              >
                {/* ID del item oculto itemId */}
                <div className="hidden"></div>
                <input type="hidden" name="itemId" value={selectedItem.id} />
                <div>
                  <label className="block mb-1">Tipo</label>
                  <select
                    name="type"
                    required
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Seleccione</option>
                    <option value="ENTRY">Entrada</option>
                    <option value="EXIT">Salida</option>
                    <option value="EXPIRATION">Vencimiento</option>
                    <option value="SALE">Venta</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Cantidad</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Costo Unitario</label>
                  <input
                    type="number"
                    name="unitCost"
                    step="0.01"
                    required
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="col-span-3 flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Guardar Movimiento
                  </button>
                </div>
              </form>
            )}
            <table className="table-auto w-full text-left border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Tipo</th>
                  <th className="border px-4 py-2">Cantidad</th>
                  <th className="border px-4 py-2">Costo Unitario</th>
                  <th className="border px-4 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{movement.type}</td>
                    <td className="border px-4 py-2">{movement.quantity}</td>
                    <td className="border px-4 py-2">{movement.unitCost}</td>
                    <td className="border px-4 py-2">
                      {new Date(movement.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de edición */}
      {isEditMode && selectedItem && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto modal-edit modal-details">
          <div className="max-w-3xl mx-auto py-10 px-6">
            <h3 className="text-2xl font-bold mb-6">Editar Ítem</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    name: e.target.value,
                  })
                }
                className="border px-4 py-2"
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={selectedItem.stock}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    stock: Number(e.target.value),
                  })
                }
                className="border px-4 py-2"
              />
              <input
                type="number"
                placeholder="Valor Total"
                value={selectedItem.totalValue}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    totalValue: Number(e.target.value),
                  })
                }
                className="border px-4 py-2"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
              >
                Actualizar
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
