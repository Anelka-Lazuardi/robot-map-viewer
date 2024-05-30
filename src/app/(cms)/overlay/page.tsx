'use client'
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { Button, Card, CardBody, CardHeader, Chip, ChipProps, Divider, Image, Input, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import React from "react";
import Link from 'next/link'
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteOverlay, getOverlays } from "@/utils/api";
import toast, { Toaster } from 'react-hot-toast';


export default function Overlay() {

    const { data, isPending, refetch } = useQuery({
        queryKey: ['overlay'],
        queryFn: getOverlays
    })

    const { mutate: mutateDeleteOverlay, isPending: loadingDelete } = useMutation({
        mutationFn: deleteOverlay,
        mutationKey: ['overlay'],
        onSuccess: (data) => {

            const { code, message } = data
            if (code === 200) {
                toast.success(message);
                refetch()
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
    })
    type OverlayList = {
        name: string
        id: string,
        description: string
        dimensionWidth: number
        dimensionHeight: number
        image: string
    }


    return (
        <Card className=" w-full ">
            <CardHeader className="flex items-center justify-between p-5">
                <h1 className="text-2xl font-bold">List Overlay</h1>
                <Button color="primary" variant="shadow" type="submit" >
                    <Link href={'/overlay/new'}>New Overlay</Link>
                </Button>
            </CardHeader>
            {
                (isPending || loadingDelete) && (<Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."

                />
                )
            }

            <CardBody className="container w-full">
                <Table aria-label="Example table with custom cells">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Image</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {
                            data?.map((overlay: OverlayList) => (
                                <TableRow key={overlay.id}>
                                    <TableCell>{overlay.name}</TableCell>
                                    <TableCell>{overlay.description}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-start items-center gap-3">
                                            <Image
                                                src={overlay.image}
                                                alt="image"
                                                className="w-32 h-auto object-contain"
                                            />
                                            <div className="flex flex-col text-sm">
                                                <h2>Width : {overlay.dimensionWidth} px</h2>
                                                <h2>Height : {overlay.dimensionHeight} px</h2>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="Edit overlay">
                                                <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={`/overlay/${overlay.id}`}>
                                                    <EditIcon />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Delete overlay" >
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => mutateDeleteOverlay(overlay.id)}>
                                                    <DeleteIcon />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>

                            ))

                        }

                    </TableBody>
                </Table>
            </CardBody>
        </Card>

    );
}

