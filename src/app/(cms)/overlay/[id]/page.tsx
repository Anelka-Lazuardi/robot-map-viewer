'use client'
import { createOverlay, getOverlay, updateOverlay } from "@/utils/api";
import { LATITUDE_REGEX, LONGITUDE_REGEX } from "@/utils/form";
import { Button, Card, CardBody, CardHeader, Divider, Image as ImageUi, Input, Textarea } from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';
import toast from "react-hot-toast";
import { z } from 'zod';
import { useRouter } from 'next/navigation'


export default function Page() {

    const router = useRouter()

    const { id } = useParams()

    const [imageUrl, setImageUrl] = useState<string>('/image/image-upload.png');

    const { isPending, mutate } = useMutation({
        mutationFn: updateOverlay,
        onSuccess: (data) => {
            // toast.success(data.message);
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

        mutationKey: ['overlayCreate'],
    })

    const { data: dataOverlay } = useQuery({
        queryKey: ['overlay-get', id],
        queryFn: () => getOverlay(id as string),


    })


    const form = useForm({
        validatorAdapter: zodValidator,


        defaultValues: {
            id: dataOverlay?.id ?? '',
            image: {},
            name: dataOverlay?.name ?? '',
            description: dataOverlay?.description ?? '',
            fileName: dataOverlay?.image ?? '',
            dimensionWidth: dataOverlay?.dimensionWidth?.toString() ?? '',
            dimensionHeight: dataOverlay?.dimensionHeight.toString() ?? '',
            topLeftLatitude: dataOverlay?.topLeftLatitude.toString() ?? '',
            topLeftLongitude: dataOverlay?.topLeftLongitude.toString() ?? '',
            topRightLatitude: dataOverlay?.topRightLatitude.toString() ?? '',
            topRightLongitude: dataOverlay?.topRightLongitude.toString() ?? '',
            bottomRightLatitude: dataOverlay?.bottomRightLatitude.toString() ?? '',
            bottomRightLongitude: dataOverlay?.bottomRightLongitude.toString() ?? '',
            bottomLeftLatitude: dataOverlay?.bottomLeftLatitude.toString() ?? '',
            bottomLeftLongitude: dataOverlay?.bottomLeftLongitude.toString() ?? '',

        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            mutate(value)

        },
    })

    useEffect(() => {
        if (dataOverlay) {
            setImageUrl(dataOverlay.image)
        }

        return () => {
            setImageUrl('/image/image-upload.png');
        };
    }, [dataOverlay]);


    return (
        <Card className="w-full ">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <CardHeader className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Overlay</h1>
                    <Button color="primary" variant="shadow" type="submit">Save</Button>
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
                                name="description"
                            >
                                {(field) => (
                                    <Textarea

                                        name={field.name}
                                        value={field.state.value}
                                        label="Description"
                                        type="text"
                                        labelPlacement={"outside"}
                                        placeholder="Enter description"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>
                    <div className="space-y-5 p-5" >
                        <h3 className="text-md font-bold">Image Overlay</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <Dropzone onDrop={acceptedFiles => {
                                if (acceptedFiles.length > 0) {
                                    setImageUrl(URL.createObjectURL(acceptedFiles[0]));

                                    form.setFieldValue('image', acceptedFiles[0], { touch: true });
                                    form.setFieldValue('fileName', acceptedFiles[0].name, { touch: true });

                                    const image: HTMLImageElement = new Image();
                                    image.onload = function () {
                                        // Set the height and width values
                                        form.setFieldValue('dimensionHeight', image.height.toString(), { touch: true });
                                        form.setFieldValue('dimensionWidth', image.width.toString(), { touch: true });
                                    };
                                    image.src = URL.createObjectURL(acceptedFiles[0]);

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
                                                <ImageUi

                                                    alt="Image Preview"
                                                    // removeWrapper
                                                    src={imageUrl}
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
                            <div >

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
                                    name="dimensionWidth"
                                    validators={{
                                        onChange: z.string().min(1, 'Dimension Width is required'),
                                    }}

                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="Dimension Width"
                                            labelPlacement={"outside"}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                            disabled
                                            description="For simplicity, we will assume that width image is the same with map pixel coordinate "
                                        />
                                    )}
                                </form.Field>

                                <form.Field
                                    name="dimensionHeight"
                                    validators={{
                                        onChange: z.string().min(1, 'Dimension Height is required'),
                                    }}

                                >
                                    {(field) => (
                                        <Input
                                            isRequired
                                            name={field.name}
                                            value={field.state.value}
                                            label="Dimension Height"
                                            labelPlacement={"outside"}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            isInvalid={field.state.meta.errors.length > 0 && true}
                                            errorMessage={field.state.meta.errors}
                                            disabled
                                            description="For simplicity, we will assume that height image is the same with map pixel coordinate "
                                        />
                                    )}
                                </form.Field>
                            </div>


                        </div>

                    </div>

                    <div className="space-y-5 py-5">
                        <h3 className="text-md font-bold">Top Left Coordinates</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <form.Field
                                name="topLeftLatitude"
                                validators={{
                                    onChange: z.string().regex(LATITUDE_REGEX, 'Top Left Latitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Latitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                            <form.Field
                                name="topLeftLongitude"
                                validators={{
                                    onChange: z.string().regex(LONGITUDE_REGEX, 'Top Left Longitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Longitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>

                    <div className="space-y-5 py-5">
                        <h3 className="text-md font-bold">Top Right Coordinates</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <form.Field
                                name="topRightLatitude"
                                validators={{
                                    onChange: z.string().regex(LATITUDE_REGEX, 'Top right Latitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Latitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                            <form.Field
                                name="topRightLongitude"
                                validators={{
                                    onChange: z.string().regex(LONGITUDE_REGEX, 'Top right Longitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Longitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>

                    <div className="space-y-5 py-5">
                        <h3 className="text-md font-bold">Bottom Right Coordinates</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <form.Field
                                name="bottomRightLatitude"
                                validators={{
                                    onChange: z.string().regex(LATITUDE_REGEX, 'Bottom Right Latitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Latitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                            <form.Field
                                name="bottomRightLongitude"
                                validators={{
                                    onChange: z.string().regex(LONGITUDE_REGEX, 'Bottom Right Longitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Longitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>


                    <div className="space-y-5 py-5">
                        <h3 className="text-md font-bold">Bottom Left Coordinates</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <form.Field
                                name="bottomLeftLatitude"
                                validators={{
                                    onChange: z.string().regex(LATITUDE_REGEX, 'Bottom Left Latitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Latitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                            <form.Field
                                name="bottomLeftLongitude"
                                validators={{
                                    onChange: z.string().regex(LONGITUDE_REGEX, 'Bottom Left Longitude is required'),
                                }}

                            >
                                {(field) => (
                                    <Input
                                        isRequired
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        label="Longitude"
                                        labelPlacement={"outside"}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        isInvalid={field.state.meta.errors.length > 0 && true}
                                        errorMessage={field.state.meta.errors}

                                    />
                                )}
                            </form.Field>
                        </div>

                    </div>
                </CardBody>
            </form>
        </Card>

    );
}
