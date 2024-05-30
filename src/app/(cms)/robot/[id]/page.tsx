'use client'
import { createRobot, getOverlays, getRobot, updateRobot } from "@/utils/api";
import { Button, Card, CardBody, CardHeader, CircularProgress, Divider, Image, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';
import toast from "react-hot-toast";
import { z } from "zod";


interface IPreviewData {
    imageUrl: string
    markerUrl: string
    maxWidth: number
    maxHeight: number
}
export default function Page() {
    const { id } = useParams()

    const [previewData, setPreviewData] = useState<IPreviewData>({
        imageUrl: '/image/image-upload.png',
        markerUrl: '/image/image-upload.png',
        maxWidth: 0,
        maxHeight: 0
    });

    const { data: overlays } = useQuery({
        queryKey: ['overlay'],
        queryFn: getOverlays
    })

    const { isPending, mutate } = useMutation({
        mutationFn: updateRobot,
        onSuccess: (data) => {
            const { code, message, data: newData } = data
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

        mutationKey: ['robotCreate'],
    })

    const { data: dataRobot } = useQuery({
        queryKey: ['robot-get', id],
        queryFn: () => getRobot(id as string),


    })

    const form = useForm({
        validatorAdapter: zodValidator,


        defaultValues: {
            id: dataRobot?.id,
            marker: {},
            name: dataRobot?.name ?? "",
            additionalData: dataRobot?.additionalData ?? "",
            fileName: dataRobot?.marker ?? "",
            positionX: dataRobot?.positionX.toString() ?? "",
            positionY: dataRobot?.positionY.toString() ?? "",
            heading: dataRobot?.heading.toString() ?? "",
            order: dataRobot?.order.toString() ?? "",
            overlayId: dataRobot?.overlayId.toString() ?? "",

        },
        onSubmit: async ({ value }) => {
            mutate(value)

        },
    })

    useEffect(() => {
        if (dataRobot?.overlay) {
            setPreviewData({
                imageUrl: dataRobot.overlay.image,
                markerUrl: dataRobot.marker,
                maxWidth: dataRobot.overlay.dimensionWidth,
                maxHeight: dataRobot.overlay.dimensionHeight
            })
        }

        return () => {
            setPreviewData({
                imageUrl: '/image/image-upload.png',
                markerUrl: '/image/image-upload.png',
                maxWidth: 0,
                maxHeight: 0
            })
        };
    }, [dataRobot]);


    return (
        <Card className="w-full p-3">
            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}>
                <CardHeader className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">New Robot</h1>
                    {
                        isPending ? <CircularProgress aria-label="Loading..." />
                            : <Button disabled={isPending} color="primary" variant="shadow" type="submit">Save</Button>
                    }
                </CardHeader>
                <Divider />
                <CardBody className="space-y-5 divide-y-1" >
                    <div className="space-y-5">
                        <h3 className="text-md font-bold">Detail Information</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <form.Field
                                name="name"
                                validators={{
                                    onChange: z.string().min(1, 'Name is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        value={field.state.value}
                                        label="Name"
                                        type="text"
                                        labelPlacement={"outside"}
                                        placeholder="Enter name"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="additionalData"
                            >
                                {(field) => (
                                    <Textarea
                                        name={field.name}
                                        value={field.state.value}
                                        label="Additional Data"
                                        type="text"
                                        labelPlacement={"outside"}
                                        placeholder="Enter additional data"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>
                    <div className="space-y-5 p-5" >
                        <h3 className="text-md font-bold">Overlay Data</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-10" >
                                <form.Field
                                    name="overlayId"
                                    validators={{
                                        onChange: z.string().min(1, 'Overlay is required'),
                                    }}
                                >
                                    {(field) => (
                                        <Select
                                            name={field.name}
                                            selectedKeys={[field.state.value]}
                                            label="Overlay"
                                            labelPlacement={"outside"}
                                            placeholder="Select a overlay"
                                            onChange={(e) => {
                                                field.handleChange(e.target.value)
                                                const overlay = overlays?.find((overlay: { id: string, name: string }) => overlay.id === e.target.value)
                                                setPreviewData({
                                                    ...previewData,
                                                    imageUrl: overlay.image,
                                                    maxWidth: overlay.dimensionWidth,
                                                    maxHeight: overlay.dimensionHeight
                                                });

                                            }}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                        >
                                            {
                                                overlays?.map((overlay: { id: string, name: string }) => (
                                                    <SelectItem key={overlay.id} value={overlay.id}>{overlay.name}</SelectItem>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </form.Field>

                                <Input value={previewData.maxWidth?.toString()} label="Max Width" type="number" labelPlacement={"outside"} disabled />
                                <Input value={previewData.maxHeight?.toString()} label="Max Height" type="number" labelPlacement={"outside"} disabled />


                            </div>

                            <div className="w-full  flex items-center justify-center">
                                <Image

                                    alt="Image Preview"
                                    removeWrapper
                                    src={previewData.imageUrl}
                                    className="w-full h-[200px] object-contain"
                                />
                            </div>



                        </div>

                    </div>

                    <div className="space-y-5 p-5" >
                        <h3 className="text-md font-bold">Image Marker</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <Dropzone onDrop={acceptedFiles => {
                                if (acceptedFiles.length > 0) {
                                    setPreviewData({ ...previewData, markerUrl: URL.createObjectURL(acceptedFiles[0]) });
                                    form.setFieldValue('marker', acceptedFiles[0], { touch: true });
                                    form.setFieldValue('fileName', acceptedFiles[0].name, { touch: true });

                                }
                            }}
                                accept={{
                                    'image/*': ['.png', '.jpeg', '.jpg'],
                                }}
                                maxFiles={1}
                                maxSize={5 * 1024 ** 2}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="space-y-2 ">
                                        <div {...getRootProps()} className="dropzone w-full h-full border-2 item-center justify-center rounded-xl border-dashed  flex p-3">
                                            <input {...getInputProps()} />
                                            <div className="w-full flex items-center justify-center flex-col gap-5">
                                                <Image

                                                    alt="Image Preview"
                                                    // removeWrapper
                                                    src={previewData.markerUrl}
                                                    className="w-full h-[200px] object-cover"
                                                />
                                                <p className="text-lg ">Drag and Drop image here or <span className="underline font-bold cursor-pointer">Choose image</span></p>
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-between text-sm font-light">
                                            <p>Supported formats: PNG, JPG, JPEG</p>
                                            <p>Maximum size: 5MB</p>
                                        </div>
                                    </div>

                                )}
                            </Dropzone>
                            <div className="space-y-10">
                                <form.Field
                                    name="fileName"
                                    validators={{
                                        onChange: z.string().min(1, 'File Name is required'),
                                    }}

                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="File Name"
                                            labelPlacement={"outside"}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                            disabled
                                        />
                                    )}
                                </form.Field>
                                <form.Field
                                    name="positionX"
                                    validators={
                                        {
                                            onChange: z.string().min(1, 'Position X is required').refine(value => {
                                                const number = Number(value);
                                                return !isNaN(number) && number >= 0 && number <= previewData.maxWidth;
                                            }, {
                                                message: `Value must be a number between 0 and ${previewData.maxWidth}`,
                                            }),
                                        }
                                    }
                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="Position X"
                                            type="number"
                                            labelPlacement={"outside"}
                                            placeholder="Enter Position X"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                            description="For simplicity, we will assume that local coordinate is the same with pixel coordinate "
                                        />
                                    )}
                                </form.Field>
                                <form.Field
                                    name="positionY"
                                    validators={{
                                        onChange: z.string().min(1, 'Position Y is required').refine(value => {
                                            const number = Number(value);
                                            return !isNaN(number) && number >= 0 && number <= previewData.maxHeight;
                                        }, {
                                            message: `Value must be a number between 0 and ${previewData.maxHeight}`,
                                        }),
                                    }}
                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="Position Y"
                                            type="number"
                                            labelPlacement={"outside"}
                                            placeholder="Enter Position Y"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                            description="For simplicity, we will assume that local coordinate is the same with pixel coordinate "
                                        />
                                    )}
                                </form.Field>


                                <form.Field
                                    name="heading"
                                    validators={{
                                        onChange: z.string().min(1, 'Heading is required').refine(value => {
                                            const number = Number(value);
                                            return !isNaN(number) && number >= 0 && number <= 360;
                                        }, {
                                            message: 'Value must be a number between 0 and 360',
                                        })
                                    }}
                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="Heading"
                                            type="number"
                                            labelPlacement={"outside"}
                                            placeholder="Enter Heading"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                        />
                                    )}
                                </form.Field>

                                <form.Field
                                    name="order"
                                >
                                    {(field) => (
                                        <Input
                                            name={field.name}
                                            value={field.state.value}
                                            label="Order"
                                            type="number"
                                            labelPlacement={"outside"}
                                            placeholder="Enter order"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                        />
                                    )}
                                </form.Field>


                            </div>


                        </div>

                    </div>

                </CardBody>
            </form>
        </Card>

    );
}
