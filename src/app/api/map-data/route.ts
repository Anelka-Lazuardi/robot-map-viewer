import { handlePrismaErrorWrapper, transformBigIntToString } from "@/utils/api";
import { convertLocalPositionToMapPosition } from "@/utils/coordinates";
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();;

type Coordinate = [number, number];
type CoordinatesArray = Coordinate[];
interface GeoJson {
    type: string;
    geometry: {
        type: string;
        coordinates: CoordinatesArray[];
    };
}

export async function GET() {
    try {
        const [latitudeConfig, longitudeConfig, zoomConfig] = await Promise.all([
            prisma.mapConfig.findUnique({ where: { name: 'latitude' } }),
            prisma.mapConfig.findUnique({ where: { name: 'longitude' } }),
            prisma.mapConfig.findUnique({ where: { name: 'zoom' } })
        ]);

        const viewPort = {
            latitude: latitudeConfig?.value || 1,
            longitude: longitudeConfig?.value || 1,
            zoom: Number(zoomConfig?.value) || 0
        };
        const overlayData = await prisma.overlay.findMany({
            include: {
                robot: true
            }
        })
        const polygonGeoJson: GeoJson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [],
            },
        };
        const overlays = overlayData.map(overlay => {
            const coordinates: CoordinatesArray = [
                [overlay.topLeftLongitude, overlay.topLeftLatitude],
                [overlay.topRightLongitude, overlay.topRightLatitude],
                [overlay.bottomRightLongitude, overlay.bottomRightLatitude],
                [overlay.bottomLeftLongitude, overlay.bottomLeftLatitude],
            ]
            polygonGeoJson.geometry.coordinates.push(coordinates);

            const data = {
                id: `overlay-${overlay.id}`,
                url: overlay.image,
                coordinates,
                robots: overlay.robot.map(robot => {
                    const [robotLongitude, robotLatitude] = convertLocalPositionToMapPosition(coordinates, robot.positionX, robot.positionY, overlay.dimensionWidth, overlay.dimensionHeight)
                    const tempRobot = {
                        id: transformBigIntToString(robot.id),
                        additionalData: robot.additionalData,
                        marker: robot.marker,
                        name: robot.name,
                        order: robot.order,
                        heading: robot.heading,
                        longitude: robotLongitude,
                        latitude: robotLatitude

                    }

                    return tempRobot
                })
            }

            return data
        })
        return Response.json({
            code: 200,
            data: {
                viewPort,
                overlays,
                polygonGeoJson
            },
            message: "Successfully retrieved Map Data "
        })

    } catch (error) {
        return handlePrismaErrorWrapper(error);
    }
}

