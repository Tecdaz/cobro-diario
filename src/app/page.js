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
  const [vrfActive, setVrfActive] = useState(false);

  const handleVrfChange = () => {
    setVrfActive(!vrfActive);
    console.log("Vrf", !vrfActive);
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
        }
        else {
          const dataFetch = await getTodayCobros();
          console.log("Data", dataFetch);
          setData(dataFetch);
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
        <SearchBar />
      </div>
      {data.map((venta, index) => (
        <Link href={`/ingresar_cuota/${venta.id}`} key={index}>
          <CardCliente
            key={index}
            className={index % 2 === 0 && "bg-gray-300"}
            nombre={venta.nombre}
            cuota={venta.valor_cuota}
            saldo={venta.saldo} />
        </Link>))}
    </div>
  );
}
