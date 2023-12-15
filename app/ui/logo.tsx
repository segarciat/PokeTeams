'use client'
import Image from 'next/image'
import React, { type ComponentProps, type ReactElement } from 'react'

const NextImage = Image

export default function Logo (props: Omit<ComponentProps<typeof NextImage>, 'src' | 'alt'>): ReactElement {
  return (
    <NextImage {...props} src='/poketeams-logo.png' alt="Temporary PokeTeams logo, by Sweet Farm."
    />
  )
}
