"use client";
import { getMapData } from "@/utils/api";
import { IMapData, IRobotMarker } from "@/utils/interface";
import { useQuery } from "@tanstack/react-query";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Maplibre, {
    FullscreenControl,
    GeolocateControl,
    Layer,
    Marker,
    NavigationControl,
    Popup,
    ScaleControl,
    Source,
} from "react-map-gl/maplibre";
import FilterOverlay from "./FilterOverlay";
import NavigationConfig from "./NavigationConfig";
import MarkerDetail from "./MarkerDetail";

type Props = {};

const Map = (props: Props) => {
    const { data } = useQuery({
        queryKey: ["mapData"],
        queryFn: getMapData,
    });

    const [viewState, setViewState] = useState({
        longitude: 103.7740703467006,
        latitude: 1.334195996408901,
        zoom: 2,
    });
    const [filter, setFilter] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<IRobotMarker>();


    useEffect(() => {
        if (data?.viewPort) {
            setViewState({
                ...data?.viewPort,
            });
        }
    }, [data?.viewPort]);

    return (
        <Maplibre
            {...viewState}
            style={{ width: "100vw", height: "100vh" }}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle={
                `https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
            }
        >
            {/* Overlay */}
            {data?.overlays?.map((overlay: IMapData, index: number) => (
                <Source
                    id={overlay.id}
                    key={index}
                    type="image"
                    url={overlay.url}
                    coordinates={overlay.coordinates}
                >
                    <Layer id={overlay.id} type="raster" source={overlay.id} />
                    {overlay.robots?.map((robot, index) => (
                        <Marker
                            latitude={robot.latitude}
                            key={index}
                            longitude={robot.longitude}
                            rotation={robot.heading}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedMarker(robot);
                                setShowPopup(true);
                            }}
                            className="cursor-pointer"
                        >
                            <div className={filter.includes("marker") ? "border" : ""}>
                                <Image
                                    src={robot.marker}
                                    width={40}
                                    height={10}
                                    className="w-full"
                                    alt="robot"
                                    priority
                                />
                                {robot.order ? (
                                    <p className="absolute text-black text-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        {robot.order}
                                    </p>
                                ) : null}
                            </div>
                        </Marker>
                    ))}
                </Source>
            ))}

            {/* Polygon */}
            {filter.includes("overlay") && data?.polygonGeoJson && (
                <Source id="polygon" type="geojson" data={data?.polygonGeoJson}>
                    <Layer
                        id="polygon-outline-layer"
                        type="line"
                        paint={{
                            "line-width": 1,
                        }}
                    />
                </Source>
            )}

            {/* Popup Marker */}
            {showPopup && selectedMarker && (
                <Popup
                    longitude={selectedMarker.longitude}
                    latitude={selectedMarker.latitude}
                    anchor="bottom"
                    key={selectedMarker.id}
                    onClose={() => {
                        setSelectedMarker(undefined)
                        setShowPopup(false)
                    }}
                    closeButton={false}
                    className="rounded-xl"
                    style={{
                        maxWidth: "none",
                        borderRadius: ' 2.75rem'
                    }}
                >
                    <MarkerDetail data={selectedMarker} />

                </Popup>
            )}

            <GeolocateControl />
            <FullscreenControl />
            <NavigationControl />
            <ScaleControl />
            <FilterOverlay callback={setFilter} />
            <NavigationConfig />
        </Maplibre>
    );
};

export default Map;
