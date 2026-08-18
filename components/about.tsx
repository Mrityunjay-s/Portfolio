"use client";

import React from 'react'
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from '@/lib/hooks';


export default function About() {
    const { ref } = useSectionInView("About");

    return (

        <motion.section
            ref={ref}
            className="mb-28 max-w-180 text-center leading-8 sm:mb-40 scroll-mt-28"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id="about"
        >
            <SectionHeading>About me</SectionHeading>
            <p className="mb-3">
                I am a software developer with one year of experience developing mobile apps, specializing in
                <span className="font-medium"> React Native</span> and <span className="font-medium">Android Native </span>
                utilizing <span className="font-medium">Kotlin and Jetpack Compose</span>, as well as backend skills in
                <span className="font-medium">Java Spring Boot</span>. I'm great at creating scalable backend systems
                and user-friendly mobile interfaces that guarantee flawless operation and outstanding user experiences.
                I'm passionate about creating cutting-edge software solutions, I work well with cross-functional teams,
                and I enjoy collaborative settings. I am dedicated to producing high-performance applications that go above
                and beyond expectations, with a particular emphasis on quality, scalability, and user pleasure.
            </p>

            <p>
                <span className="italic">When I'm not coding,</span> I enjoy immersing myself in the world of
                <span className="font-medium">video games</span>, watching thought-provoking movies, and spending quality time with my family & friends.
                I have a curious mind and a passion for <span className="font-medium">learning new things,</span> which drives me to explore various fields.
            </p>
            <p className="mt-3">
                I am always eager to learn and grow, and I am excited about the opportunity to contribute my skills and
                knowledge to a dynamic team. Let's connect and explore how we can work together to create amazing software!</p>
        </motion.section>
    );
}
