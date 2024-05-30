import { CardHeader, Image } from '@nextui-org/react'
import React from 'react'

type Props = {}

const Header = (props: Props) => {
    return (
        <CardHeader className="w-full flex gap-3  container ">
            <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                width={40}
            />
            <div className="flex flex-col">
                <p className="text-md">NextUI</p>
                <p className="text-small text-default-500">nextui.org</p>
            </div>
        </CardHeader>
    )
}

export default Header