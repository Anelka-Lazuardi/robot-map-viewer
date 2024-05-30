import Link from 'next/link';
import React from 'react'
import { IoMdSettings } from "react-icons/io";

type Props = {}

const NavigationConfig = (props: Props) => {
    return (
        <div className="absolute top-20 left-5">
            <div className=" border bg-white p-2 rounded-md" >
                <Link href="/config" target='_blank'>
                    <IoMdSettings className='text-lg font-bold' color='black' />
                </Link>
            </div>

        </div>
    )
}

export default NavigationConfig