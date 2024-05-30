import { handlePrismaErrorWrapper, transformBigIntToString } from "@/utils/api";
import { PrismaClient } from '@prisma/client';
import { NextRequest } from "next/server";
import fs from "node:fs/promises";

interface RobotCreateInput {
    name: string;
    additionalData?: string;
    marker: string;
    positionX: number;
    positionY: number;
    heading: number;
    order?: number;
    overlayId: number;
}

const prisma = new PrismaClient();;



export async function POST(request: Request) {
    try {


        // Handle Upload Image
        const formData = await request.formData();
        const file = formData.get("marker") as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(`./public/upload/marker/${file.name}`, buffer);

        // Handle Insert Data
        const payload: RobotCreateInput = {
            name: formData.get("name") as string,
            additionalData: formData.get("additionalData") as string,
            positionX: formData.get("positionX") ? parseInt(formData.get("positionX") as string, 10) : 0,
            positionY: formData.get("positionY") ? parseInt(formData.get("positionY") as string, 10) : 0,
            heading: formData.get("heading") ? parseInt(formData.get("heading") as string, 10) : 0,
            order: formData.get("order") ? parseInt(formData.get("order") as string, 10) : 0,
            overlayId: formData.get("overlayId") ? parseInt(formData.get("overlayId") as string, 10) : 0,
            marker: `/upload/marker/${file.name}`
        }
        const newRobot = await prisma.robot.create({ data: payload })



        return Response.json({
            code: 200,
            data: transformBigIntToString(newRobot),
            message: "Successfully update robot "
        })
    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get("id");



        const robot = await prisma.robot.findFirst({
            where: {
                id: Number(id)
            },

        })

        if (!robot) {
            return Response.json({
                code: 404,
                message: "Robot not found"
            })
        }

        const payload: RobotCreateInput = {
            name: formData.get("name") as string,
            additionalData: formData.get("additionalData") as string,
            positionX: formData.get("positionX") ? parseInt(formData.get("positionX") as string, 10) : 0,
            positionY: formData.get("positionY") ? parseInt(formData.get("positionY") as string, 10) : 0,
            heading: formData.get("heading") ? parseInt(formData.get("heading") as string, 10) : 0,
            order: formData.get("order") ? parseInt(formData.get("order") as string, 10) : 0,
            overlayId: formData.get("overlayId") ? parseInt(formData.get("overlayId") as string, 10) : 0,
            marker: robot.marker
        }

        if (robot.marker !== formData.get("fileName")) {
            // delete old image
            await fs.unlink(`./public/upload/marker/${robot.name}`)

            // add new image
            if (formData.get("marker")) {
                const file = formData.get("image") as File;
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                await fs.writeFile(`./public/upload/marker/${file.name}`, buffer);
                payload.marker = `/upload/marker/${file.name}`
            }

        }

        const newRobot = await prisma.robot.update({ where: { id: Number(id) }, data: payload })

        return Response.json({
            code: 200,
            data: transformBigIntToString(newRobot),
            message: "Successfully create robot"
        })
    } catch (error) {

        return handlePrismaErrorWrapper(error);
    }
}

export async function GET(request: NextRequest) {
    try {

        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('id')

        let result = null;
        if (query) {
            const robots = await prisma.robot.findFirst({
                where: {
                    id: Number(query)
                },
                include: {
                    overlay: true

                },
            })
            result = transformBigIntToString(robots)
        }
        else {
            const robots = await prisma.robot.findMany({
                include: {
                    overlay: true

                },
            });
            result = robots.map(robot => transformBigIntToString(robot));
        }


        return Response.json({
            code: 200,
            data: result,
            message: "Successfully retrieved robots "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.robot.delete({
            where: { id: Number(id) }
        })
        return Response.json({
            code: 200,
            message: "Successfully delete robots "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

