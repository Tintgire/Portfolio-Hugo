import React from 'react'
import { motion } from 'framer-motion'

import { SectionWrapper } from '../hoc'
import { fadeIn, textVariant } from '../utils/motion'

import { testimonials } from '../constans'
import { styles } from '../styles'

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {
  return (
    // h-full + flex flex-col chain so all cards in the row share height
    // (grid intrinsic row sizing — see parent), and mt-auto on the footer
    // (name + role + photo) pins it to the bottom so footers align across
    // cards regardless of testimonial text length.
    <motion.div
      variants={fadeIn('', 'spring', index * 0.5, 0.75)}
      className="bg-black-200 p-10 rounded-3xl w-full h-full flex flex-col"
    >
      <p className="text-white font-black text-[48px] leading-none">"</p>

      <p className="mt-1 text-white tracking-wider text-[18px]">{testimonial}</p>

      <div className="mt-auto pt-7 flex justify-between items-center gap-3">
        <div className="flex-1 flex flex-col min-w-0">
          <p className="text-white font-medium text-[16px] truncate">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-secondary text-[12px] truncate">
            {company ? `${designation} chez ${company}` : designation}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback-by-${name}`}
          className="shrink-0 w-10 h-10 rounded-full object-cover"
        />
      </div>
    </motion.div>
  )
}

const Feedbacks = () => {
  return (
    <div className="mt-12 bg-black-100 rounded-[20px]">
      <div
        className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>
            Ce que disent les autres
          </p>
          <h2 className={styles.sectionHeadText}>Témoignages.</h2>
        </motion.div>
      </div>
      {/* Grid (not flex-wrap) so cards in the same row are guaranteed equal
          height — same fix as Works.jsx project grid. Footer (name + photo)
          inside each card is pinned to the bottom via mt-auto so footers
          align horizontally across all cards. */}
      <div className={`${styles.paddingX} -mt-20 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  )
}

export default SectionWrapper(Feedbacks, '')
