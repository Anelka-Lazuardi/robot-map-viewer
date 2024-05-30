import { handlePrismaErrorWrapper } from "@/utils/api";
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();;

async function updateOrCreateConfig(name: string, value: string) {
    const config = await prisma.mapConfig.findUnique({ where: { name } });
    if (config) {
        return (await prisma.mapConfig.update({ where: { name }, data: { value } })).value;
    } else {
        return (await prisma.mapConfig.create({ data: { name, value } })).value;
    }
}


export async function POST(request: Request) {
    try {

        const { latitude, longitude, zoom } = await request.json()
        const [latitudeConfig, longitudeConfig, zoomConfig] = await Promise.all([
            updateOrCreateConfig('latitude', latitude),
            updateOrCreateConfig('longitude', longitude),
            updateOrCreateConfig('zoom', zoom)
        ]);


        return Response.json({
            code: 200,
            data: { latitude: latitudeConfig, longitude: longitudeConfig, zoom: zoomConfig },
            message: "Successfully update config "
        })
    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

export async function GET() {
    try {
        const [latitudeConfig, longitudeConfig, zoomConfig] = await Promise.all([
            prisma.mapConfig.findUnique({ where: { name: 'latitude' } }),
            prisma.mapConfig.findUnique({ where: { name: 'longitude' } }),
            prisma.mapConfig.findUnique({ where: { name: 'zoom' } })
        ]);

        const data = {
            latitude: latitudeConfig?.value || '',
            longitude: longitudeConfig?.value || '',
            zoom: zoomConfig?.value || ''
        };
        return Response.json({
            code: 200,
            data,
            message: "Successfully retrieved config "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

