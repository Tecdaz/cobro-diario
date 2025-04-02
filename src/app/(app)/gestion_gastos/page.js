"use client"
import InputField from "@/components/InputField";
import InputRadio from "@/components/InputRadio";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createGasto } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function GestionGastos() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        handleTitleChange("Gestion de caja")
    }, [handleTitleChange])

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
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
        setIsSubmitting(true);
        setError(null);
        setMensaje("Registrando gasto...");

        try {
            if (user && cartera.id_cartera) {
                data = {
                    ...data,
                    cobrador: user.id,
                    id_cartera: cartera.id_cartera
                }
                if (!data.valor || !data.descripcion) {
                    setError("Por favor complete todos los campos requeridos");
                    setIsSubmitting(false);
                    return;
                }
                await createGasto(data);
                setMensaje("¡Gasto registrado correctamente! Redirigiendo...");
                router.push('/');
            }
        }
        catch (error) {
            console.error("Error al crear gasto:", error);
            setError("Error al registrar el gasto. Por favor intente nuevamente.");
            setMensaje(null);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex flex-col gap-4 p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {mensaje && !error && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {mensaje}
                </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4 w-full justify-between">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Procesando...
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </Button>
                </div>
                <div className="flex gap-4">
                    <InputRadio register={register} name="tipo" value="gasto" label="Gasto" />
                    <InputRadio register={register} name="tipo" value="ingreso" label="Ingreso" />
                </div>
                <InputField register={register} label="Valor" name="valor" type="number" errors={errors} required="El valor es obligatorio" />

                <div className="flex flex-col gap-1">
                    <label className="text-sm">Concepto</label>
                    <Controller
                        name="descripcion"
                        control={control}
                        rules={{ required: "El concepto es obligatorio" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione un concepto" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="Otros">Otros</SelectItem>
                                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                                    <SelectItem value="Recargas">Recargas</SelectItem>
                                    <SelectItem value="Administracion">Administracion</SelectItem>
                                    <SelectItem value="Arreglo Transporte">Arreglo Transporte</SelectItem>
                                    <SelectItem value="Sueldo">Sueldo</SelectItem>
                                    <SelectItem value="Viaticos">Viaticos</SelectItem>
                                    <SelectItem value="Ajuste Caja">Ajuste Caja</SelectItem>
                                    <SelectItem value="Celular">Celular</SelectItem>
                                    <SelectItem value="Cadena">Cadena</SelectItem>
                                    <SelectItem value="Multas">Multas</SelectItem>
                                    <SelectItem value="Retiros de caja">Retiros de caja</SelectItem>
                                    <SelectItem value="Prestamo">Prestamo</SelectItem>
                                    <SelectItem value="Intereses">Intereses</SelectItem>
                                    <SelectItem value="Comisiones">Comisiones</SelectItem>
                                    <SelectItem value="Mensualidad Sistema">Mensualidad Sistema</SelectItem>
                                    <SelectItem value="Alimentacion">Alimentacion</SelectItem>
                                    <SelectItem value="Transporte">Transporte</SelectItem>
                                    <SelectItem value="Arrendo">Arrendo</SelectItem>
                                    <SelectItem value="Perdidas">Perdidas</SelectItem>
                                    <SelectItem value="Para otro cobro">Para otro cobro</SelectItem>
                                    <SelectItem value="Transferencia Caja General">Transferencia Caja General</SelectItem>
                                    <SelectItem value="Anticipo de Nomina">Anticipo de Nomina</SelectItem>
                                    <SelectItem value="Ahorro">Ahorro</SelectItem>
                                    <SelectItem value="Cambio de Aceite">Cambio de Aceite</SelectItem>
                                    <SelectItem value="Pago Supervisor">Pago Supervisor</SelectItem>
                                    <SelectItem value="Tarjetas">Tarjetas</SelectItem>
                                    <SelectItem value="Seguridad Social">Seguridad Social</SelectItem>
                                    <SelectItem value="Tributos">Tributos</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.descripcion && <span className="text-red-600">{errors.descripcion.message || "Este campo es requerido"}</span>}
                </div>

                <InputField register={register} label="Observación (opcional)" name="observacion" errors={errors} />
            </form>
        </div>
    )
}