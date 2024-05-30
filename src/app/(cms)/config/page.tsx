'use client'
import { getDataMapConfig, updateMapConfig } from "@/utils/api";
import { LATITUDE_REGEX, LONGITUDE_REGEX, OPTION_ZOOM } from "@/utils/form";
import { Button, Card, CardBody, CardHeader, Chip, ChipProps, CircularProgress, Divider, Input, Select, SelectItem, Tooltip, User } from "@nextui-org/react";
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodValidator } from '@tanstack/zod-form-adapter';
import React from "react";
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';




export default function Page() {



    const { data: dataConfig } = useQuery({
        queryKey: ['config'],
        queryFn: getDataMapConfig
    })

    const { isPending, mutate } = useMutation({
        mutationFn: updateMapConfig,
        onSuccess: (data) => {
            const { code, message } = data
            if (code === 200) {
                toast.success(message);
            }
            else {
                toast.error(message);
            }
        }
        ,
        onError: (err) => {
            toast.error(err.message);
        }
        ,

        mutationKey: ['config'],
    })

    const form = useForm({
        validatorAdapter: zodValidator,
        defaultValues: {
            latitude: dataConfig?.latitude ?? '',
            longitude: dataConfig?.longitude ?? '',
            zoom: dataConfig?.zoom ?? '',
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            mutate(value)

        },
    })

    return (
        <Card className="w-full ">
            <CardBody>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="p-3"
                >
                    <CardHeader className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Map Viewport</h1>
                        {
                            isPending ? <CircularProgress aria-label="Loading..." />
                                : <Button disabled={isPending} color="primary" variant="shadow" type="submit">Save</Button>
                        }

                    </CardHeader>
                    <Divider />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
                        <form.Field
                            name="latitude"
                            validators={{
                                onChange: z.string().min(1, 'Latitude is required').regex(LATITUDE_REGEX, 'Latitude is invalid'),
                            }}

                        >
                            {(field) => (
                                <Input
                                    isRequired
                                    name={field.name}
                                    value={field.state.value}
                                    label="Latitude"
                                    type="number"
                                    labelPlacement={"outside"}
                                    placeholder="Enter latitude"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    isInvalid={field.state.meta.errors.length > 0 && true}
                                    errorMessage={field.state.meta.errors}
                                />
                            )}
                        </form.Field>
                        <form.Field
                            name="longitude"
                            validators={{
                                onChange: z.string().min(1, 'Longitude is required').regex(LONGITUDE_REGEX, 'Longitude is invalid'),
                            }}

                        >
                            {(field) => (
                                <Input
                                    isRequired
                                    name={field.name}
                                    value={field.state.value}
                                    label="Longitude"
                                    type="number"
                                    labelPlacement={"outside"}
                                    placeholder="Enter longitude"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    isInvalid={field.state.meta.errors.length > 0 && true}
                                    errorMessage={field.state.meta.errors}
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="zoom"
                            validators={{
                                onChange: z.string().min(1, 'Zoom is required'),
                            }}

                        >
                            {(field) => (
                                <Select
                                    isRequired
                                    name={field.name}
                                    selectedKeys={[field.state.value]}
                                    items={OPTION_ZOOM}
                                    label="Zoom"
                                    labelPlacement={"outside"}
                                    placeholder="Select a zoom level"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    isInvalid={field.state.meta.errors.length > 0 && true}
                                    errorMessage={field.state.meta.errors}

                                >
                                    {OPTION_ZOOM.map((animal) => (
                                        <SelectItem key={animal.key}>
                                            {animal.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        </form.Field>


                    </div>

                </form>

            </CardBody>
        </Card>)
}
