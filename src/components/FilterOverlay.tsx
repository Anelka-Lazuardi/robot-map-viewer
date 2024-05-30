import { Checkbox, CheckboxGroup, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { IoFilterSharp } from "react-icons/io5";

type Props = {
    callback: (value: string[]) => void
}

const FilterOverlay = ({ callback }: Props) => {
    return (

        <Popover placement="right" showArrow backdrop='blur'>
            <PopoverTrigger>
                <div className="absolute top-5 left-5">
                    <div className="border bg-white p-2 rounded-md">
                        <IoFilterSharp className='text-lg font-bold' color='black' />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2 space-y-3">
                    <div className="text-small font-bold">Filtering Polygon</div>
                    <CheckboxGroup
                        defaultValue={[]}
                        orientation="horizontal"
                        onValueChange={(value) => {
                            callback(value)

                        }}

                    >
                        <Checkbox value="marker">Marker</Checkbox>
                        <Checkbox value="overlay">Overlay</Checkbox>

                    </CheckboxGroup>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default FilterOverlay