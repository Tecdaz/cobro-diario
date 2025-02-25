"use client"
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getTodayCobros } from "@/lib/db";

export default function Home() {
  const { handleTitleChange } = useLayout();
  const [data, setData] = useState([]);
  useEffect(() => {
    handleTitleChange("Clientes")
    const fetchData = async () => {
      try {
        const dataFetch = await getTodayCobros();
        console.log("Data", dataFetch);
        setData(dataFetch);
      }
      catch (error) {
        console.log("Error", error);
      }

    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <SearchBar />
      {data.map((venta, index) => (
        <CardCliente
          key={index}
          className={index % 2 === 0 && "bg-gray-300"}
          nombre={venta.nombre}
          cuota={venta.valor_cuota}
          saldo={10000} />
      ))}

    </div>
  );
}
