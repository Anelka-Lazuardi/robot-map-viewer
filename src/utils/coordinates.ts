
import { getDistance } from 'geolib';

type Coordinate = [number, number];
type CoordinatesArray = Coordinate[];

export const convertLocalPositionToMapPosition = (overlayCoordinates: CoordinatesArray,
    robotX: number, robotY: number, width: number, height: number) => {


    // Calculate the percentage of the map width and height that the robot's position represents
    const percentageX = robotX / width;
    const percentageY = robotY / height;

    // Interpolate between the overlay coordinates to find the corresponding latitude and longitude coordinates of the robot
    const robotLatitude = overlayCoordinates[0][1] + percentageY * (overlayCoordinates[2][1] - overlayCoordinates[0][1]);
    const robotLongitude = overlayCoordinates[0][0] + percentageX * (overlayCoordinates[1][0] - overlayCoordinates[0][0]);


    return [robotLongitude, robotLatitude];



}