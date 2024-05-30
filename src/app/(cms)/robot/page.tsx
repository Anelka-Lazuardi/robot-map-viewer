'use client'
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { deleteRobot, getRobots } from "@/utils/api";
import { Button, Card, CardBody, CardHeader, Image, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from 'next/link';
import toast from 'react-hot-toast';


export default function Overlay() {

    const { data, isPending, refetch } = useQuery({
        queryKey: ['robot'],
        queryFn: getRobots
    })

    const { mutate: mutateDeleteOverlay, isPending: loadingDelete } = useMutation({
        mutationFn: deleteRobot,
        mutationKey: ['robot'],
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
    type RobotList = {
        name: string
        id: string,
        overlay: {
            name: string
        }
        positionX: number
        positionY: number
        heading: number
        marker: string
    }


    return (
        <Card className=" w-full ">
            <CardHeader className="flex items-center justify-between p-5">
                <h1 className="text-2xl font-bold">List Robot</h1>
                <Button color="primary" variant="shadow" type="submit" >
                    <Link href={'/robot/new'}>New Robot</Link>
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
                        <TableColumn>Overlay</TableColumn>
                        <TableColumn className="text-center">Position</TableColumn>
                        <TableColumn>Marker</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {
                            data?.map((robot: RobotList) => (
                                <TableRow key={robot.id}>
                                    <TableCell>{robot.name}</TableCell>
                                    <TableCell>{robot.overlay?.name}</TableCell>
                                    <TableCell>
                                        <div className="grid grid-cols-3 divide-x-2 text-center">
                                            <h3>X : {robot.positionX}</h3>
                                            <h3> Y : {robot.positionY}</h3>
                                            <h3>Heading : {robot.heading}</h3>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-start items-center gap-3">
                                            <Image
                                                src={robot.marker}
                                                alt="image"
                                                className="w-10 h-auto object-cover"
                                            />

                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="Edit robot">
                                                <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={`/robot/${robot.id}`}>
                                                    <EditIcon />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Delete robot" >
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => mutateDeleteOverlay(robot.id)}>
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

