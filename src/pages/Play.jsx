import { useState } from 'react'
import { motion } from 'framer-motion'
import { Words, Reveal } from '../ui'
import { HandCricket, BugSquash } from '../games'
import { sfx } from '../sound'

const GAMES = [
  { id: 'hc', t: 'Hand Cricket', d: 'The classic school game, against an AI.', c: 'g' },
  { id: 'bs', t: 'Bug Squash', d: '30 seconds. Squash bugs, spare features.', c: 'y' },
]

export default function Play() {
  const [g, setG] = useState('hc')
  return (
    <section className="sec page-head play">
      <Words as="h1" className="page-title" text="Play" />
      <Reveal><p className="lead">A little break from work. Two quick games, both built by me. Turn your sound on!</p></Reveal>
      <div className="g-pick">
        {GAMES.map(x => (
          <motion.button key={x.id} className={'g-card ' + x.c + (g === x.id ? ' on' : '')} onClick={() => { sfx('tap'); setG(x.id) }} whileHover={{ y: -4 }} whileTap={{ scale: .97 }}>
            <b>{x.t}</b><span>{x.d}</span>
          </motion.button>
        ))}
      </div>
      {g === 'hc' ? <HandCricket key="hc" /> : <BugSquash key="bs" />}
    </section>
  )
}
