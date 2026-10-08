import type { Data, Scale } from './types'

const GENERIC = ['Very low', 'Low', 'Medium', 'High', 'Very high']

const scale = (id: string, name: string, labels = GENERIC): Scale => ({ id, name, labels: [...labels] })

export function defaultData(): Data {
  return {
    version: 1,
    signals: [
      scale('anxiety', 'Anxiety'),
      scale('confidence', 'Confidence'),
      scale('energy', 'Energy'),
      scale('focus', 'Focus'),
    ],
    drivers: [
      scale('importance', 'Importance', ['Trivial', 'Low', 'Medium', 'High', 'Everything']),
      scale('curiosity', 'Curiosity'),
      scale('assertiveness', 'Assertiveness'),
      scale('frame', 'Frame', ['Threat', 'Risk', 'Neutral', 'Challenge', 'Opportunity']),
      scale('attention', 'Attention', ['All on me', 'Inward', 'Balanced', 'Outward', 'All on them']),
      scale('pace', 'Pace', ['Very slow', 'Slow', 'Steady', 'Quick', 'Rushed']),
      scale('playfulness', 'Playfulness'),
      scale('patience', 'Patience'),
    ],
    modes: [
      {
        id: 'interview',
        name: 'Interview',
        minutes: 60,
        drivers: [
          { driverId: 'importance', level: 3, note: "This matters, but it doesn't define anything." },
          { driverId: 'curiosity', level: 5, note: 'My job is to understand them.' },
          { driverId: 'assertiveness', level: 4, note: 'I say what I actually think.' },
        ],
        rules: [
          { cue: "I don't know an answer", action: 'Say what I do know and reason through it aloud.' },
          { cue: 'I feel myself rushing', action: 'Stop for two seconds before answering.' },
        ],
      },
      {
        id: 'networking',
        name: 'Networking',
        minutes: 120,
        drivers: [
          { driverId: 'curiosity', level: 5, note: "Find out what they're excited about." },
          { driverId: 'attention', level: 4, note: "On them, not on how I'm coming across." },
          { driverId: 'playfulness', level: 4, note: "If it's funny, say it." },
        ],
        rules: [
          { cue: 'the conversation stalls', action: "Ask what they're working on right now." },
          { cue: 'I want to move on', action: 'Say so warmly and go.' },
        ],
      },
      {
        id: 'deep-work',
        name: 'Deep work',
        minutes: 120,
        drivers: [
          { driverId: 'importance', level: 2, note: 'A rough version beats a perfect plan.' },
          { driverId: 'pace', level: 2, note: 'One thing at a time.' },
          { driverId: 'patience', level: 4, note: 'Being stuck is part of the work.' },
        ],
        rules: [
          { cue: 'I reach for my phone', action: 'Put it in another room.' },
          { cue: 'I get stuck', action: 'Write the question down and keep going for ten minutes.' },
        ],
      },
      {
        id: 'conflict',
        name: 'Conflict',
        minutes: 30,
        drivers: [
          { driverId: 'frame', level: 4, note: 'A problem to solve, not a fight to win.' },
          { driverId: 'curiosity', level: 4, note: 'Understand what they need before defending.' },
          { driverId: 'assertiveness', level: 4, note: 'State my position once, plainly.' },
        ],
        rules: [
          { cue: "I'm about to apologise for my position", action: 'State it plainly instead.' },
          { cue: 'they interrupt', action: 'Let them finish, then restate my point once.' },
        ],
      },
    ],
    sessions: [],
  }
}
