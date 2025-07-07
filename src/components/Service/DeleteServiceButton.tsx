"use client";

export default function DeleteServiceButton() {
  return (
    <button
      type="submit"
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer transition duration-200"
      onClick={(e) => {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) {
          e.preventDefault();
        }
      }}
    >
      Excluir Serviço
    </button>
  );
}
