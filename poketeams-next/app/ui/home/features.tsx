import Image from 'next/image'
import { type ReactElement } from 'react'

export default function FeaturesSection (): ReactElement {
  return (
    <section className="text-center p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-3">Features</h2>
      <div className="flex flex-col gap-6 my-2">
        <Feature
          title={'Pokesearch'}
          imgSrc={'/Octopus-amico.svg'}
          imgAlt={'Octopus amico by Storyset'}
          text={
            'With the Pokedex at your fingertips, travel across regions and search without the hassle of wild battles.'
          }
          attribHref={'https://storyset.com/nature'}
          attribText={'Nature illustrations by Storyset'}
        />
        <Feature
          title={'Moves'}
          imgSrc={'/Motocross-rafiki.svg'}
          imgAlt={'Motorcross rafiki by Storyset'}
          text={
            'Whether it’s a TM or HM, a move learned by leveling or through hatching an egg, it’s all here.'
          }
          attribHref={'https://storyset.com/people'}
          attribText={'People illustrations by Storyset'}
        />
        <Feature
          title={'Items'}
          imgSrc={'/Passion-fruit-pana.svg'}
          imgAlt={'Passion Fruit pana by Storyset'}
          text={
            'Search berries, potions, and all other fancy items to give you an edge in battle.'
          }
          attribHref={'https://storyset.com/nature'}
          attribText={'Nature illustrations by Storyset'}
        />
      </div>
    </section>
  )
}

interface FeatureProps {
  title: string
  imgSrc: string
  imgAlt: string
  text: string
  attribHref: string
  attribText: string
}

function Feature ({
  title,
  imgSrc,
  imgAlt,
  text,
  attribHref,
  attribText
}: FeatureProps): ReactElement {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-primary font-bold text-lg">{title}</h3>
      <Image
        priority={true}
        width={150}
        height={150}
        src={imgSrc}
        alt={imgAlt}
        className="self-center mb-3"
      />
      <a
        href={attribHref}
        target="_blank"
        rel="noreferrer noopener"
        className="text-blue-400 text-xs"
      >
        {attribText}
      </a>
      <p>{text}</p>
    </div>
  )
}
