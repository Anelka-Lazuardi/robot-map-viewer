import { Prisma } from "@prisma/client";
import axios from "axios";
import { IMapConfig, IOverlay, IRobot } from "./interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export const transformBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}
export const handlePrismaError = (
    err: Prisma.PrismaClientKnownRequestError
): { msg: string; code: number } => {
    switch (err.code) {
        case "P2002":
            // handling duplicate key errors
            return {
                msg: `Duplicate field value: ${err.meta?.target ?? "unknown"}`,
                code: 400,
            };
        case "P2014":
            // handling invalid id errors
            return { msg: `Invalid ID: ${err.meta?.target ?? "unknown"}`, code: 400 };
        case "P2003":
            // handling invalid data errors
            return {
                msg: `Invalid input data: ${err.meta?.target ?? "unknown"}`,
                code: 400,
            };
        default:
            // handling all other errors
            return { msg: `Something went wrong: ${err.message}`, code: 500 };
    }
};

export const handlePrismaErrorWrapper = async (error: any): Promise<Response> => {
    const prismaError = error as PrismaClientKnownRequestError;
    const { code, msg } = handlePrismaError(prismaError);
    return Response.json({ code, data: error, message: msg });
}






// Map Config
export const getDataMapConfig = async () => {
    try {
        const response = await axios.get("/api/config");
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};

export const updateMapConfig = async (data: IMapConfig) => {
    try {
        const response = await axios.post("/api/config", data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


// Overlay
export const createOverlay = async (data: IOverlay) => {
    try {
        const response = await axios.post(
            "/api/overlay",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const updateOverlay = async (data: IOverlay) => {
    try {
        const response = await axios.put(
            "/api/overlay",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const getOverlays = async () => {
    try {
        const response = await axios.get("/api/overlay");
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};


export const getOverlay = async (id: string) => {
    try {
        const response = await axios.get(`/api/overlay?id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};



export const deleteOverlay = async (id: string) => {
    try {
        const response = await axios.delete(`/api/overlay/`, {
            data: { id },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Robot
export const getRobots = async () => {
    try {
        const response = await axios.get("/api/robot");
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};


export const getRobot = async (id: string) => {
    try {
        const response = await axios.get(`/api/robot?id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};


export const deleteRobot = async (id: string) => {
    try {
        const response = await axios.delete(`/api/robot/`, {
            data: { id },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createRobot = async (data: IRobot) => {
    try {
        const response = await axios.post(
            "/api/robot",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const updateRobot = async (data: IRobot) => {
    try {
        const response = await axios.put(
            "/api/robot",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Map Data
export const getMapData = async () => {
    try {
        const response = await axios.get(`/api/map-data`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};
