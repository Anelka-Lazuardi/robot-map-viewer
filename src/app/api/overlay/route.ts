import { handlePrismaError, handlePrismaErrorWrapper, transformBigIntToString } from "@/utils/api";
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";

interface OverlayCreateInput {
    name: string;
    description?: string;
    dimensionWidth: number;
    dimensionHeight: number;
    topLeftLatitude: number;
    topLeftLongitude: number;
    topRightLatitude: number;
    topRightLongitude: number;
    bottomRightLatitude: number;
    bottomRightLongitude: number;
    bottomLeftLatitude: number;
    bottomLeftLongitude: number;
    image: string;
}

const prisma = new PrismaClient();;



export async function POST(request: Request) {
    try {


        // Handle Upload Image
        const formData = await request.formData();
        const file = formData.get("image") as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(`./public/upload/overlay/${file.name}`, buffer);

        // Handle Insert Data
        const payload: OverlayCreateInput = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            dimensionWidth: formData.get("dimensionWidth") ? parseInt(formData.get("dimensionWidth") as string, 10) : 0,
            dimensionHeight: formData.get("dimensionHeight") ? parseInt(formData.get("dimensionHeight") as string, 10) : 0,
            topLeftLatitude: formData.get("topLeftLatitude") ? parseFloat(formData.get("topLeftLatitude") as string) : 0,
            topLeftLongitude: formData.get("topLeftLongitude") ? parseFloat(formData.get("topLeftLongitude") as string) : 0,
            topRightLatitude: formData.get("topRightLatitude") ? parseFloat(formData.get("topRightLatitude") as string) : 0,
            topRightLongitude: formData.get("topRightLongitude") ? parseFloat(formData.get("topRightLongitude") as string) : 0,
            bottomRightLatitude: formData.get("bottomRightLatitude") ? parseFloat(formData.get("bottomRightLatitude") as string) : 0,
            bottomRightLongitude: formData.get("bottomRightLongitude") ? parseFloat(formData.get("bottomRightLongitude") as string) : 0,
            bottomLeftLatitude: formData.get("bottomLeftLatitude") ? parseFloat(formData.get("bottomLeftLatitude") as string) : 0,
            bottomLeftLongitude: formData.get("bottomLeftLongitude") ? parseFloat(formData.get("bottomLeftLongitude") as string) : 0,
            image: `/upload/overlay/${file.name}`
        }
        const newOverlay = await prisma.overlay.create({ data: payload })



        return Response.json({
            code: 200,
            data: transformBigIntToString(newOverlay),
            message: "Successfully create overlay "
        })
    } catch (error) {

        return handlePrismaErrorWrapper(error);
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get("id");



        const overlay = await prisma.overlay.findFirst({
            where: {
                id: Number(id)
            },

        })

        if (!overlay) {
            return Response.json({
                code: 404,
                message: "Overlay not found"
            })
        }

        const payload: OverlayCreateInput = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            dimensionWidth: formData.get("dimensionWidth") ? parseInt(formData.get("dimensionWidth") as string, 10) : 0,
            dimensionHeight: formData.get("dimensionHeight") ? parseInt(formData.get("dimensionHeight") as string, 10) : 0,
            topLeftLatitude: formData.get("topLeftLatitude") ? parseFloat(formData.get("topLeftLatitude") as string) : 0,
            topLeftLongitude: formData.get("topLeftLongitude") ? parseFloat(formData.get("topLeftLongitude") as string) : 0,
            topRightLatitude: formData.get("topRightLatitude") ? parseFloat(formData.get("topRightLatitude") as string) : 0,
            topRightLongitude: formData.get("topRightLongitude") ? parseFloat(formData.get("topRightLongitude") as string) : 0,
            bottomRightLatitude: formData.get("bottomRightLatitude") ? parseFloat(formData.get("bottomRightLatitude") as string) : 0,
            bottomRightLongitude: formData.get("bottomRightLongitude") ? parseFloat(formData.get("bottomRightLongitude") as string) : 0,
            bottomLeftLatitude: formData.get("bottomLeftLatitude") ? parseFloat(formData.get("bottomLeftLatitude") as string) : 0,
            bottomLeftLongitude: formData.get("bottomLeftLongitude") ? parseFloat(formData.get("bottomLeftLongitude") as string) : 0,
            image: overlay.image
        }

        // check image file
        if (overlay.image !== formData.get("fileName")) {
            // delete old image
            await fs.unlink(`./public/upload/overlay/${overlay.name}`)

            // add new image
            if (formData.get("image")) {
                const file = formData.get("image") as File;
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                await fs.writeFile(`./public/upload/overlay/${file.name}`, buffer);
                payload.image = `/upload/overlay/${file.name}`
            }

        }

        const newOverlay = await prisma.overlay.update({ where: { id: Number(id) }, data: payload })

        return Response.json({
            code: 200,
            data: transformBigIntToString(newOverlay),
            message: "Successfully update overlay "
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
            const overlays = await prisma.overlay.findFirst({
                where: {
                    id: Number(query)
                }
            })
            result = transformBigIntToString(overlays)
        }
        else {
            const overlays = await prisma.overlay.findMany();
            result = overlays.map(overlay => transformBigIntToString(overlay));
        }


        return Response.json({
            code: 200,
            data: result,
            message: "Successfully retrieved overlays "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.overlay.delete({
            where: { id: Number(id) }
        })
        return Response.json({
            code: 200,
            message: "Successfully delete overlays "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

