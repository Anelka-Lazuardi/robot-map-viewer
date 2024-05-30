'use client'
import React, { useEffect } from 'react'
import { motion, useAnimationControls, useScroll, Variants } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa';
type Props = {}

const ScrollToTopContainerVariants: Variants = {
    hide: { opacity: 0, y: 100 },
    show: { opacity: 1, y: 0 },
};

const ScrollToTop = (props: Props) => {
    const { scrollYProgress } = useScroll();
    const controls = useAnimationControls();

    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

    function scrollToTop() {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        return scrollYProgress.on('change', (latestValue) => {
            if (latestValue > 0.05) {
                controls.start('show');
            } else {
                controls.start('hide');
            }
        });
    });

    return (
        <motion.button
            className="fixed bottom-0 right-0 p-10"
            variants={ScrollToTopContainerVariants}
            initial="hide"
            animate={controls}
            onClick={scrollToTop}>
            <FaArrowUp className='bg-primary p-2 rounded-full text-white
            duration-300  ease-in-out' size={30} />
        </motion.button>
    )
}

export default ScrollToTop