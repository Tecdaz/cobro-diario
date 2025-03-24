"use client"
import InputField from "@/components/InputField";
import InputRadio from "@/components/InputRadio";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createGasto } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import SelectField from "@/components/SelectField";

export default function GestionGastos() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    useEffect(() => {
        handleTitleChange("Gestion de Gastos")
    }, [handleTitleChange])

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            tipo: 'gasto'
        }
    }
    );

    const router = useRouter();

    const handleCancel = () => {
        router.push('/');
    }

    const onSubmit = async (data) => {
        try {
            if (user && cartera.id_cartera) {
                data = {
                    ...data,
                    cobrador: user.id,
                    id_cartera: cartera.id_cartera
                }
                await createGasto(data);
                router.push('/');
            }
        }
        catch (error) {
            console.error("Error al crear gasto:", error);
            toast.error("Error al crear gasto");
        }
    }
    return (
        <div className="flex flex-col gap-4 p-4">

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4 w-full justify-between">
                    <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
                <div className="flex gap-4">
                    <InputRadio register={register} name="tipo" value="gasto" label="Gasto" />
                    <InputRadio register={register} name="tipo" value="ingreso" label="Ingreso" />
                </div>
                <InputField register={register} label="Valor" name="valor" type="number" errors={errors} />
                <SelectField
                    label="Descripción"
                    name="descripcion"
                    register={register}
                    required={true}
                    errors={errors}
                    options={[
                        { value: "gasolina", label: "Gasolina" },
                        { value: "comida", label: "Comida" },
                        { value: "transporte", label: "Transporte" },
                        { value: "papeleria", label: "Papelería" },
                        { value: "mantenimiento", label: "Mantenimiento vehículo" },
                        { value: "comunicacion", label: "Recargas/Plan de datos" },
                        { value: "parqueadero", label: "Parqueadero" },
                        { value: "otro", label: "Otro" }
                    ]}
                />
                <InputField register={register} label="Observación (opcional)" name="observacion" errors={errors} />
            </form>
        </div>
    )
}