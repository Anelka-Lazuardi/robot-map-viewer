import { IRobotMarker } from '@/utils/interface';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { GoNumber } from "react-icons/go";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Md3dRotation, MdOutlineTextFields } from "react-icons/md";
import { PiTextHOneBold } from "react-icons/pi";

type Props = {
    data: IRobotMarker
}


const MarkerDetail = ({ data }: Props) => {
    return (
        <div className=" w-[250px]  px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            <Listbox variant="light" aria-label="Listbox menu with sections" >
                <ListboxSection title="Detail" showDivider >
                    <ListboxItem
                        key="name"
                        description={data.name}
                        startContent={<PiTextHOneBold className='text-xl text-primary' />}
                    >
                        Name
                    </ListboxItem>
                    <ListboxItem
                        key="additionalData"
                        description={data.additionalData}
                        startContent={<MdOutlineTextFields className='text-xl text-primary' />}
                    >
                        Additional Data
                    </ListboxItem>
                    <ListboxItem
                        key="order"
                        description={data.order ? data.order.toString() : 'N/A'}
                        startContent={<GoNumber className='text-xl text-primary' />}
                    >
                        Order
                    </ListboxItem>
                </ListboxSection>

                <ListboxSection title="Position">
                    <ListboxItem
                        key="latitude"
                        description={data.latitude?.toString()}
                        startContent={<HiOutlineLocationMarker className='text-xl text-primary' />}
                    >
                        Latitude
                    </ListboxItem>
                    <ListboxItem
                        key="longitude"
                        description={data.longitude?.toString()}
                        startContent={<HiOutlineLocationMarker className='text-xl text-primary' />}
                    >
                        Longitude
                    </ListboxItem>
                    <ListboxItem
                        key="heading"
                        description={data.heading?.toString()}
                        startContent={<Md3dRotation className='text-xl text-primary' />}
                    >
                        Heading
                    </ListboxItem>
                </ListboxSection>
            </Listbox >
        </div >
    )
}

export default MarkerDetail