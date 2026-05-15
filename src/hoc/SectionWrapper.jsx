import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../utils/motion';

import { styles } from '../styles';

const SectionWrapper = (Component, idName) => function HOC() {
    return (
        <motion.section
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            // amount: 'some' = fires the moment ANY part of the section enters
            // the viewport. Was 0.25 (25% visible), which made the entrance
            // of tall sections (notably Works with featured + grid) feel
            // delayed — the title would sit static while the user scrolled.
            viewport={{ once: true, amount: 'some' }}
            className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
        >
            <span className="hash-span" id={idName}>
                &nbsp;
            </span>
            <Component />
        </motion.section>
    );
}

export default SectionWrapper;
