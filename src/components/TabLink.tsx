'use client'
import { Tab, Tabs } from '@nextui-org/tabs'
import React from 'react'
import { usePathname } from "next/navigation";


type Props = {}

const TabLink = (props: Props) => {
    const pathname = usePathname();
    return (
        <Tabs aria-label="Options" selectedKey={pathname}>
            <Tab key="/config" title="Config" href='/config' />
            <Tab key="/overlay" title="Overlay" href='/overlay' />
            <Tab key="/robot" title="Robot" href='/robot' />

        </Tabs>
    )
}

export default TabLink