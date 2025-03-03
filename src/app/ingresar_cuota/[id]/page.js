"use client"
import InputField from "@/components/InputField";
import InputRadio from "@/components/InputRadio";
import { Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { getDataCuotas } from "@/lib/db";
import { useParams } from "next/navigation";
import SelectField from "@/components/SelectField";

export default function Page() {
    const { handleTitleChange } = useLayout();

    const [data, setData] = useState([
        {
            cliente: {
                nombre: "",
                telefono: "",
                direccion: ""
            },
            valor_cuota: 0,
            cuotas: 0,
            cuota: [],
            abono: []
        }
    ]);
    const [nuevoSaldo, setNuevoSaldo] = useState(0);
    const [saldoActual, setSaldoActual] = useState(0);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            pago: "cuota",
            cuotas: '',
            abono: '',
        }
    }
    );

    const validateNuevoSaldo = (value) => {
        if (value < 0) {
            return "El nuevo saldo no puede ser negativo. Por favor, ingresa un valor válido de cuotas o abono.";
        }
        return true; // Si el valor es válido
    };

    const watchedValues = watch(["cuotas", "abono", "pago"]);


    const calculateSaldo = (valorCuota, numeroCuotas, abonos, cuotas) => {
        const abonosTotal = abonos.reduce((acc, abono) => acc + abono.valor, 0);
        const cuotasTotal = cuotas.reduce((acc, cuota) => acc + cuota.cantidad, 0);

        return (valorCuota * numeroCuotas) - abonosTotal - (valorCuota * cuotasTotal);
    }

    const params = useParams();
    const { id } = params;
    // console.log("Id", id);
    useEffect(() => {
        handleTitleChange("Ingresar cuota")
        // console.log("Id", id);
        if (id) {
            const fetchData = async () => {
                try {

                    const dataFetched = await getDataCuotas(id);
                    console.log({ dataFetched });
                    setData(dataFetched);
                    setValue("totalVenta", dataFetched[0]['cuotas'] * dataFetched[0]['valor_cuota']);
                    setValue("saldoActual", calculateSaldo(
                        dataFetched[0]['valor_cuota'],
                        dataFetched[0]['cuotas'],
                        dataFetched[0]['abono'],
                        dataFetched[0]['cuota']
                    ));
                }
                catch (error) {
                    console.log("Error", error);
                }
            }
            fetchData();
        }

    }, [id, handleTitleChange, setValue]);

    useEffect(() => {
        const pagoActual = watchedValues[2]; // valor de pago

        if (pagoActual === "cuota" && watchedValues[1] !== '') {
            setValue("abono", ''); // Reinicia el valor de abono solo si no es 0
        } else if (pagoActual === "abono" && watchedValues[0] !== '') {
            setValue("cuotas", ''); // Reinicia el valor de cuotas solo si no es 0
        }

        const saldoActual = data.length > 0 ? calculateSaldo(
            data[0]['valor_cuota'],
            data[0]['cuotas'],
            data[0]['abono'],
            data[0]['cuota']
        ) : 0;
        setSaldoActual(saldoActual);

        if (pagoActual === "cuota") {
            const numCuotas = parseInt(watchedValues[0] || 0);
            const valorCuota = data.length > 0 ? data[0]['valor_cuota'] : 0;
            setNuevoSaldo(saldoActual - (numCuotas * valorCuota));
            setValue("nuevoSaldo", saldoActual - (numCuotas * valorCuota));
        } else if (pagoActual === "abono") {
            const valorAbono = parseInt(watchedValues[1] || 0);
            setNuevoSaldo(saldoActual - valorAbono);
            setValue("nuevoSaldo", saldoActual - valorAbono);
        } else {
            setNuevoSaldo(saldoActual);
            setValue("nuevoSaldo", saldoActual);
        }
    }, [watchedValues, data, setValue]);

    const onSubmit = (data) => {
        const datosParseados = {
            ...data,
            cuotas: data.cuotas ? parseInt(data.cuotas) : 0,
            abono: data.abono ? parseInt(data.abono) : 0,
            totalVenta: parseInt(data.totalVenta),
            saldoActual: parseInt(data.saldoActual),
            nuevoSaldo: parseInt(data.nuevoSaldo),
        }

        if (datosParseados.nuevoSaldo < 0) {
            console.log("El nuevo saldo no puede ser negativo. Por favor, ingresa un valor válido de cuotas o abono.");
            return;
        }
        console.log("Datos enviados:", datosParseados);
    }

    const pagoSeleccionado = watch("pago");
    return (
        <div className="flex flex-col gap-2 p-4 min-h-full h-fit justify-between">
            <h2>{data[0]['cliente']['nombre']}</h2>
            <p>Valor cuota: {data[0]['valor_cuota']}</p>
            <p>Cuotas pagadas: {data[0]['cuota'].length}</p>
            <p>Cuotas pendientes: {data[0]['cuotas'] - data[0]['cuota'].length}</p>
            <p>Cuotas atrasadas: </p>

            <p>Telefono: {data[0]['cliente']['telefono']}</p>
            <p>Direccion: {data[0]['cliente']['direccion']}</p>

            <hr />
            <form className="flex flex-col gap-2 flex-1 justify-between" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-1">
                    <InputRadio register={register} label="Cuota" name="pago" value="cuota" />
                    <InputRadio register={register} label="Abono" name="pago" value="abono" />
                    <InputRadio register={register} label="No pago" name="pago" value="no pago" />
                    <InputRadio register={register} label="Siguiente dia" name="pago" value="siguiente dia" />
                </div>
                <InputField label="Producto" register={register} name="producto" required={true} errors={errors} isDisabled={true} value="Credito" />
                <div>
                    <InputField label="Total venta" register={register} name="totalVenta" required={true} errors={errors} isDisabled={true} value={data[0]['cuotas'] * data[0]['valor_cuota']} type='number' />
                    <InputField label="Saldo actual" register={register} name="saldoActual" required={true} errors={errors} isDisabled={true} value={saldoActual} type={'number'} />
                </div>

                {pagoSeleccionado !== 'no pago' && pagoSeleccionado !== 'siguiente dia' && (
                    <>
                        {pagoSeleccionado === 'cuota' ?
                            (<InputField label="Numero de cuotas" name="cuotas" register={register} required={true}
                                type='number'
                                errors={errors} handleOnChange={(e) => setValue('cuotas', e.target.value)} />)
                            :
                            (<InputField label="Valor abono" name="abono" register={register} required={true}
                                type={'number'}
                                errors={errors} handleOnChange={(e) => setValue('abono', e.target.value)} />)}
                        < InputField label="Nuevo saldo" register={register} name="nuevoSaldo" required={true} errors={errors} isDisabled={true} value={nuevoSaldo} type={'number'}
                            validate={validateNuevoSaldo} />
                        <SelectField
                            label="Metodo de pago"
                            register={register}
                            name="metodoPago"
                            options={
                                [{ value: "efectivo", label: "Efectivo" }, { value: "transferencia", label: "Transferencia" }]
                            }
                            required={true}
                            errors={errors}
                        />
                    </>


                )}


                <div className="flex-1 flex flex-col  justify-end">
                    <div className="flex gap-4 items-center">
                        <button className="border-gray-500 border-2 p-2 rounded-md mt-2 w-full">Cancelar</button>
                        <button className="bg-blue-500 text-white p-2 rounded-md mt-2 w-full" onClick={handleSubmit(onSubmit)}>Registrar cuota</button>
                    </div>

                </div>

            </form>
        </div>
    )
}
