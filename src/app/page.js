import CardCliente from "@/components/card_cliente/CardCliente";
import Image from "next/image";

export default function Home() {
  const clientes = Array(30).fill({ nombre: "Juan Perez", cuota: 1232, saldo: 1234, id: 1, status: "ok" });
  return (
    <div className="flex flex-col">
      {clientes.map((cliente, index) => (
        <CardCliente key={index} {...cliente} className={index % 2 === 0 && "bg-gray-300"} />
      ))}

    </div>
  );
}
