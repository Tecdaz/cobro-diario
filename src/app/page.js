"use client"
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getTodayCobros, getTodayPayments } from "@/lib/db";
import Link from "next/link";

export default function Home() {
  const { handleTitleChange } = useLayout();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vrfActive, setVrfActive] = useState(false);

  const handleVrfChange = () => {
    setVrfActive(!vrfActive);
    console.log("Vrf", !vrfActive);
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }

    const searchTermLower = term.toLowerCase();
    const filtered = data.filter(venta =>
      venta.nombre?.toLowerCase().includes(searchTermLower) ||
      venta.direccion?.toLowerCase().includes(searchTermLower)
    );
    setFilteredData(filtered);
  }

  useEffect(() => {
    handleTitleChange("Clientes")
  }, [handleTitleChange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (vrfActive) {
          const dataFetch = await getTodayPayments();
          console.log("Data", dataFetch);
          setData(dataFetch);
          setFilteredData(dataFetch);
        }
        else {
          const dataFetch = await getTodayCobros();
          console.log("Data", dataFetch);
          setData(dataFetch);
          setFilteredData(dataFetch);
        }
      }
      catch (error) {
        console.log("Error", error);
      }
    }
    fetchData();
  }, [vrfActive]);

  return (
    <div className="flex flex-col">
      <div className="h-16 p-4 flex items-center gap-4 justify-between w-full">
        <div className='flex gap-2 items-center'>
          <input onClick={handleVrfChange} type="checkbox" />
          <label>Vrf</label>
        </div>
        <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Buscar por nombre o dirección..." />
      </div>
      {filteredData.length === 0 ? (
        <div className="flex justify-center items-center p-4 text-gray-500">
          No se encontraron resultados
        </div>
      ) : (
        filteredData.map((venta, index) => (
          <CardCliente
            href={`/ingresar_cuota/${venta.id}`}
            key={venta.id}
            className={index % 2 === 0 && "bg-gray-50"}
            data={venta}
          />
        ))
      )}
    </div>
  );
}
