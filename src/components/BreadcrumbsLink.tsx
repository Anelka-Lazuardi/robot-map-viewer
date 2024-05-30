'use client'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react'
import React from 'react'
import { usePathname } from "next/navigation";

type Props = {}

const BreadcrumbsLink = (props: Props) => {
    const pathname = usePathname();
    const listPath = pathname.split('/').filter(path => path !== "");

    return (
        <Breadcrumbs isDisabled>
            <BreadcrumbItem>Setting</BreadcrumbItem>
            {
                listPath.map((path, index) => {
                    return (
                        <BreadcrumbItem key={path} className='capitalize'>{path}</BreadcrumbItem>
                    )
                })
            }
        </Breadcrumbs>
    )
}

export default BreadcrumbsLink